import React, { useRef, useEffect, useState, useCallback } from "react";
import * as posedetection from "@tensorflow-models/pose-detection";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl";

import { LuCamera, LuRotateCcw, LuInfo, LuActivity } from "react-icons/lu";

export default function PoseDetectionPage() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const detectorRef = useRef(null);

  const counterRef = useRef(0);
  const stateRef = useRef("idle");

  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  const [exercise, setExercise] = useState("bicep_curl");
  const [counter, setCounter] = useState(0);
  const [feedback, setFeedback] = useState("Ready to track");
  const [time, setTime] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);

  // Refs to break React state closures within requestAnimationFrame
  const timerRunningRef = useRef(false);
  const exerciseRef = useRef("bicep_curl");
  const rafIdRef = useRef(null);

  useEffect(() => {
    timerRunningRef.current = timerRunning;
    exerciseRef.current = exercise;
  }, [timerRunning, exercise]);

  const calculateAngle = (a, b, c) => {
    const radians =
      Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);

    let angle = Math.abs((radians * 180) / Math.PI);
    if (angle > 180) angle = 360 - angle;
    return angle;
  };

  const startTimer = () => {
    if (timerRunning) return;

    stateRef.current = "idle";
    counterRef.current = 0;
    setCounter(0);
    smoothedAngleRef.current = null;

    startTimeRef.current = Date.now();

    timerRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      setTime(elapsed);
    }, 1000);

    setTimerRunning(true);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setTimerRunning(false);
    setFeedback("Ready to track");
    smoothedAngleRef.current = null;
  };

  const resetWorkout = () => {
    counterRef.current = 0;
    setCounter(0);

    stateRef.current = "idle";

    stopTimer();

    setTime(0);
    startTimeRef.current = null;
  };

  const drawSkeleton = (ctx, keypoints) => {
    ctx.strokeStyle = "#3b82f6"; // blue-500
    ctx.lineWidth = 3;

    keypoints.forEach((kp) => {
      if (kp.score > 0.4) {
        ctx.beginPath();
        ctx.arc(kp.x, kp.y, 4, 0, 2 * Math.PI);
        ctx.fillStyle = "#ffffff";
        ctx.fill();
        ctx.stroke();
      }
    });
  };

  // Min keypoint confidence required for a landmark to be trusted
  const MIN_SCORE = 0.4;

  // EMA smoother ref for the primary joint angle — filters single-frame noise
  const smoothedAngleRef = useRef(null);
  const ALPHA = 0.35; // smoothing factor: lower = smoother but laggier

  // Prevents hammering setFeedback on every frame when message hasn't changed
  const lastFeedbackRef = useRef("");
  const giveFeedback = (msg) => {
    if (msg !== lastFeedbackRef.current) {
      lastFeedbackRef.current = msg;
      setFeedback(msg);
    }
  };

  /**
   * Returns the better side's keypoints map (left vs right) based on average score,
   * then filters out any keypoint below MIN_SCORE so bad landmarks are never used.
   */
  const getBestSideKP = (keypoints) => {
    const kp = {};
    keypoints.forEach((k) => (kp[k.name] = k));

    const sides = ["left", "right"];
    let bestSide = "left";
    let bestAvg = -1;

    for (const side of sides) {
      const joints = [
        kp[`${side}_shoulder`],
        kp[`${side}_elbow`],
        kp[`${side}_wrist`],
      ].filter(Boolean);
      if (joints.length === 0) continue;
      const avg = joints.reduce((s, j) => s + (j.score || 0), 0) / joints.length;
      if (avg > bestAvg) {
        bestAvg = avg;
        bestSide = side;
      }
    }

    // Build a flattened "best" map with confidence-filtered entries
    const out = {};
    for (const [name, point] of Object.entries(kp)) {
      if ((point.score || 0) >= MIN_SCORE) {
        // Strip left/right prefix and remap to the chosen side
        const generic = name.replace(/^left_|^right_/, "");
        const canonical = `${bestSide}_${generic}`;
        if (!out[canonical]) out[canonical] = point; // prefer chosen side
        out[name] = point; // keep originals for cross-side checks
      }
    }
    // Expose the chosen-side joints without prefix for clean access
    for (const joint of ["shoulder", "elbow", "wrist", "hip", "knee", "ankle"]) {
      const candidate = kp[`${bestSide}_${joint}`];
      if (candidate && (candidate.score || 0) >= MIN_SCORE) {
        out[joint] = candidate;
      }
    }
    return { kp: out, side: bestSide };
  };

  const processExercise = (keypoints) => {
    if (!timerRunningRef.current) {
      giveFeedback("Start the timer to begin counting reps");
      return;
    }

    const { kp, side } = getBestSideKP(keypoints);
    const currentExercise = exerciseRef.current;

    // ── BICEP CURL ──────────────────────────────────────────────────────────
    if (currentExercise === "bicep_curl") {
      if (!kp.shoulder || !kp.elbow || !kp.wrist) {
        giveFeedback("Position arm in view");
        return;
      }
      const rawAngle = calculateAngle(kp.shoulder, kp.elbow, kp.wrist);
      smoothedAngleRef.current = smoothedAngleRef.current === null
        ? rawAngle
        : ALPHA * rawAngle + (1 - ALPHA) * smoothedAngleRef.current;
      const angle = smoothedAngleRef.current;

      // Only check elbow flare if hip is visible and trusted
      if (kp.hip) {
        const elbowFlare = Math.abs(kp.elbow.x - kp.hip.x);
        if (elbowFlare > 90) {
          giveFeedback("Keep elbow close to body");
          return;
        }
      }

      if (angle > 155) {
        stateRef.current = "down";
        giveFeedback("Curl up ↑");
      } else if (stateRef.current === "down" && angle < 50) {
        stateRef.current = "up";
        counterRef.current += 1;
        setCounter(counterRef.current);
        giveFeedback("✓ Good rep!");
      } else if (stateRef.current === "up" && angle > 80) {
        giveFeedback("Lower slowly ↓");
      }
    }

    // ── PUSH-UP ─────────────────────────────────────────────────────────────
    if (currentExercise === "pushup") {
      if (!kp.shoulder || !kp.elbow || !kp.wrist) {
        giveFeedback("Position arm in view");
        return;
      }
      // Elbows must be visible — push-ups use arm angle primarily
      const rawAngle = calculateAngle(kp.shoulder, kp.elbow, kp.wrist);
      smoothedAngleRef.current = smoothedAngleRef.current === null
        ? rawAngle
        : ALPHA * rawAngle + (1 - ALPHA) * smoothedAngleRef.current;
      const angle = smoothedAngleRef.current;

      if (kp.hip && kp.ankle) {
        const backAngle = calculateAngle(kp.shoulder, kp.hip, kp.ankle);
        if (backAngle < 145) {
          giveFeedback("Keep back straight!");
          return;
        }
      }

      if (angle > 160) {
        stateRef.current = "up";
        giveFeedback("Lower chest ↓");
      } else if (stateRef.current === "up" && angle < 90) {
        stateRef.current = "down";
        giveFeedback("Push up ↑");
      } else if (stateRef.current === "down" && angle > 160) {
        stateRef.current = "up";
        counterRef.current += 1;
        setCounter(counterRef.current);
        giveFeedback("✓ Good push-up!");
      }
    }

    // ── SHOULDER PRESS ──────────────────────────────────────────────────────
    if (currentExercise === "shoulder_press") {
      if (!kp.shoulder || !kp.elbow || !kp.wrist) {
        giveFeedback("Position arm in view");
        return;
      }
      const rawAngle = calculateAngle(kp.shoulder, kp.elbow, kp.wrist);
      smoothedAngleRef.current = smoothedAngleRef.current === null
        ? rawAngle
        : ALPHA * rawAngle + (1 - ALPHA) * smoothedAngleRef.current;
      const angle = smoothedAngleRef.current;

      if (angle < 85) {
        stateRef.current = "down";
        giveFeedback("Press up ↑");
      } else if (stateRef.current === "down" && angle > 160) {
        stateRef.current = "up";
        counterRef.current += 1;
        setCounter(counterRef.current);
        giveFeedback("✓ Full extension!");
      } else if (stateRef.current === "up") {
        giveFeedback("Lower to ears ↓");
      }
    }

    // ── TRICEP EXTENSION ────────────────────────────────────────────────────
    if (currentExercise === "tricep_extension") {
      if (!kp.shoulder || !kp.elbow || !kp.wrist) {
        giveFeedback("Position arm in view");
        return;
      }
      const rawAngle = calculateAngle(kp.shoulder, kp.elbow, kp.wrist);
      smoothedAngleRef.current = smoothedAngleRef.current === null
        ? rawAngle
        : ALPHA * rawAngle + (1 - ALPHA) * smoothedAngleRef.current;
      const angle = smoothedAngleRef.current;

      if (angle < 65) {
        stateRef.current = "down";
        giveFeedback("Extend arms ↑");
      } else if (stateRef.current === "down" && angle > 155) {
        stateRef.current = "up";
        counterRef.current += 1;
        setCounter(counterRef.current);
        giveFeedback("✓ Good extension!");
      }
    }

    // ── SQUAT ───────────────────────────────────────────────────────────────
    if (currentExercise === "squat") {
      if (!kp.hip || !kp.knee || !kp.ankle) {
        giveFeedback("Full legs must be in frame");
        return;
      }
      const rawAngle = calculateAngle(kp.hip, kp.knee, kp.ankle);
      smoothedAngleRef.current = smoothedAngleRef.current === null
        ? rawAngle
        : ALPHA * rawAngle + (1 - ALPHA) * smoothedAngleRef.current;
      const angle = smoothedAngleRef.current;

      if (angle > 165) {
        stateRef.current = "up";
        giveFeedback("Lower hips ↓");
      } else if (stateRef.current === "up" && angle < 100) {
        stateRef.current = "down";
        giveFeedback("Drive up ↑");
      } else if (stateRef.current === "down" && angle > 165) {
        stateRef.current = "up";
        counterRef.current += 1;
        setCounter(counterRef.current);
        giveFeedback("✓ Good squat!");
      }
    }

    // ── LUNGE ───────────────────────────────────────────────────────────────
    if (currentExercise === "lunge") {
      if (!kp.hip || !kp.knee || !kp.ankle) {
        giveFeedback("Full legs must be in frame");
        return;
      }
      const rawAngle = calculateAngle(kp.hip, kp.knee, kp.ankle);
      smoothedAngleRef.current = smoothedAngleRef.current === null
        ? rawAngle
        : ALPHA * rawAngle + (1 - ALPHA) * smoothedAngleRef.current;
      const angle = smoothedAngleRef.current;

      if (angle > 160) {
        stateRef.current = "up";
        giveFeedback("Step forward ↓");
      } else if (stateRef.current === "up" && angle < 95) {
        stateRef.current = "down";
        giveFeedback("Push back up ↑");
      } else if (stateRef.current === "down" && angle > 160) {
        stateRef.current = "up";
        counterRef.current += 1;
        setCounter(counterRef.current);
        giveFeedback("✓ Good lunge!");
      }
    }
  };

  const detectPose = useCallback(async () => {
    if (!detectorRef.current || !videoRef.current) return;
    
    if (videoRef.current.videoWidth === 0 || videoRef.current.videoHeight === 0) {
      requestAnimationFrame(detectPose);
      return;
    }

    try {
      const poses = await detectorRef.current.estimatePoses(videoRef.current);
      const ctx = canvasRef.current.getContext("2d");

      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;

      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

      ctx.drawImage(
        videoRef.current,
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height,
      );

      if (poses.length > 0) {
        const keypoints = poses[0].keypoints;
        drawSkeleton(ctx, keypoints);
        if (timerRunningRef.current) {
          processExercise(keypoints);
        }
      }
    } catch (e) {
      console.warn("TFJS Pose Estimation Warning:", e);
    }

    rafIdRef.current = requestAnimationFrame(detectPose);
  }, []);

  useEffect(() => {
    const init = async () => {
      await tf.ready();
      await tf.setBackend("webgl");

      detectorRef.current = await posedetection.createDetector(
        posedetection.SupportedModels.MoveNet,
        {
          modelType: posedetection.movenet.modelType.SINGLEPOSE_THUNDER,
        },
      );

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadeddata = () => {
          detectPose();
        };
      }
    };

    init();

    return () => {
      stopTimer();
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      }
      if (detectorRef.current) {
        detectorRef.current.dispose();
        detectorRef.current = null;
      }
    };
  }, [detectPose]);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 h-full flex flex-col space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-5">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <LuCamera />
            </div>
            AI Trainer
          </h1>
          <p className="text-sm font-medium text-gray-500 mt-2">
            Perfect your form with real-time pose detection.
          </p>
        </div>

        <div className="flex gap-3 items-center">
          <select
            value={exercise}
            onChange={(e) => {
              setExercise(e.target.value);
              smoothedAngleRef.current = null;
              resetWorkout();
            }}
            className="bg-gray-50 border border-gray-200 text-gray-700 p-3 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-semibold cursor-pointer"
          >
            <option value="bicep_curl">Bicep Curl</option>
            <option value="pushup">Push-up</option>
            <option value="shoulder_press">Shoulder Press</option>
            <option value="tricep_extension">Tricep Extension</option>
            <option value="squat">Squat</option>
            <option value="lunge">Lunge</option>
          </select>

          <button 
            onClick={resetWorkout} 
            className="bg-gray-50 p-3 rounded-xl text-gray-500 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-200 border border-gray-200 transition-all"
            title="Reset"
          >
            <LuRotateCcw size={20} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-8 flex-1">
        
        {/* Video Region */}
        <div className="flex-1 bg-gray-50 rounded-2xl border flex items-center justify-center border-gray-200 overflow-hidden relative shadow-inner h-full min-h-[400px]">
          <video ref={videoRef} className="hidden" autoPlay playsInline />
          <canvas ref={canvasRef} className="w-full h-full object-cover" />
          
          {/* Subtle Overlay state indicator at the top instead of blurring the whole screen */}
          {!timerRunning && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-sm flex items-center gap-2 border border-gray-100 z-10 animate-bounce">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              <p className="text-sm text-gray-700 font-bold">Press Start to Begin Counting</p>
            </div>
          )}
        </div>

        {/* Stats Sidebar */}
        <div className="w-full lg:w-72 flex flex-col gap-6 shrink-0">
          
          <div className="bg-gray-50 border border-gray-100 p-6 rounded-2xl text-center shadow-xs">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Rep Count</p>
            <h2 className="text-7xl font-black text-blue-600">{counter}</h2>
          </div>

          <div className="bg-gray-50 border border-gray-100 p-6 rounded-2xl text-center shadow-xs">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Timer</p>
            <h2 className="text-4xl font-extrabold text-gray-800">
              {Math.floor(time / 60)}:{String(time % 60).padStart(2, "0")}
            </h2>

            <div className="flex gap-3 mt-4 justify-center">
              {!timerRunning ? (
                <button
                  onClick={startTimer}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-2.5 rounded-xl transition-all shadow-md shadow-green-500/20 w-full"
                >
                  Start
                </button>
              ) : (
                <button
                  onClick={stopTimer}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold px-6 py-2.5 rounded-xl transition-all shadow-md shadow-red-500/20 w-full"
                >
                  Stop
                </button>
              )}
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl">
            <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-3 flex items-center gap-2">
              <LuInfo /> Live Feedback
            </p>
            <p className="text-gray-900 font-bold text-lg leading-tight">{feedback}</p>

            <div className="mt-5 flex gap-2 items-center text-sm font-semibold text-gray-500 border-t border-blue-200/50 pt-4">
              <LuActivity className="text-blue-500" />
              <span className="capitalize">{exercise.replace("_", " ")}</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
