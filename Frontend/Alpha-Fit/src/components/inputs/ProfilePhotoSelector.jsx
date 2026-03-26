// import { useEffect, useRef, useState } from "react";
// import { LuUser, LuUpload, LuTrash } from "react-icons/lu";

// export default function ProfilePhotoSelector({
// image, // File | null
// setImage, // (file | null) => void
// initialUrl = "", // optional: existing profile image URL
// maxSizeMB = 5, // size limit
// accept = ["image/jpeg", "image/png", "image/webp"], // allowed types
// }) {
// const inputRef = useRef(null);
// const [previewUrl, setPreviewUrl] = useState(initialUrl || null);
// const [error, setError] = useState("");

// // Cleanup object URL on unmount/change
// useEffect(() => {
// return () => {
// if (previewUrl && previewUrl.startsWith("blob:")) {
// URL.revokeObjectURL(previewUrl);
// }
// };
// }, [previewUrl]);

// const openPicker = () => {
// inputRef.current?.click();
// };

// const handleImageChange = (e) => {
// const file = e.target.files?.[0];
// if (!file) return;

// // Validate type
// if (!accept.includes(file.type)) {
//   setError("Please choose a JPG, PNG, or WEBP image.");
//   return;
// }

// // Validate size
// const maxBytes = maxSizeMB * 1024 * 1024;
// if (file.size > maxBytes) {
//   setError(`File is too large. Max ${maxSizeMB}MB.`);
//   return;
// }

// setError("");
// setImage(file);

// // Revoke previous blob URL if any
// if (previewUrl && previewUrl.startsWith("blob:")) {
//   URL.revokeObjectURL(previewUrl);
// }
// setPreviewUrl(URL.createObjectURL(file));
// };

// const handleRemoveImage = () => {
// setImage(null);
// if (previewUrl && previewUrl.startsWith("blob:")) {
// URL.revokeObjectURL(previewUrl);
// }
// setPreviewUrl(initialUrl || null);
// setError("");
// // also reset input so selecting the same file again re-fires change
// if (inputRef.current) inputRef.current.value = "";
// };

// return (
// <div className="flex flex-col items-center mb-6">
// <input
// ref={inputRef}
// type="file"
// accept={accept.join(",")}
// onChange={handleImageChange}
// className="hidden"
// />

//   {!previewUrl ? (
//     <button
//       type="button"
//       onClick={openPicker}
//       className="w-20 h-20 flex items-center justify-center bg-blue-100/50 rounded-full relative"
//       aria-label="Choose profile photo"
//     >
//       <LuUser className="text-4xl text-primary" />
//       <span className="sr-only">Upload</span>
//       <span className="w-8 h-8 flex items-center justify-center bg-primary text-white rounded-full absolute -bottom-1 -right-1">
//         <LuUpload />
//       </span>
//     </button>
//   ) : (
//     <div className="relative">
//       <img
//         src={previewUrl}
//         alt="Profile"
//         className="w-20 h-20 rounded-full object-cover"
//         onClick={openPicker}
//       />
//       <button
//         type="button"
//         className="w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full absolute -bottom-1 -right-1"
//         onClick={handleRemoveImage}
//         aria-label="Remove photo"
//       >
//         <LuTrash />
//       </button>
//     </div>
//   )}

//   {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
// </div>
// );
// }

// import { useEffect, useRef, useState } from "react";
// import { LuUser, LuUpload, LuTrash } from "react-icons/lu";

// export default function ProfilePhotoSelector({
//   image,            // File | null (state lives in parent)
//   setImage,         // (file | null) => void
//   initialUrl = "",  // existing profile image URL from backend
//   maxSizeMB = 5,
//   accept = ["image/jpeg","image/jpg", "image/png", "image/webp"],
// }) {
//   const inputRef = useRef(null);
//   const [previewUrl, setPreviewUrl] = useState(initialUrl || null);
//   const [error, setError] = useState("");
//   const [uploadError, setUploadError] = useState("");
//   const [isSaving, setIsSaving] = useState(false);

//   // Cleanup object URL on unmount/change
//   useEffect(() => {
//     return () => {
//       try {
//         if (previewUrl && previewUrl.startsWith("blob:")) {
//           URL.revokeObjectURL(previewUrl);
//         }
//       } catch {}
//     };
//   }, [previewUrl]);

//   // Keep preview in sync if initialUrl changes externally (e.g., after refetch)
//   useEffect(() => {
//     if (!image && initialUrl && previewUrl !== initialUrl) {
//       setPreviewUrl(initialUrl);
//     }
//   }, [initialUrl]); // eslint-disable-line react-hooks/exhaustive-deps

//   const openPicker = () => {
//     if (inputRef.current) inputRef.current.value = ""; // allow reselecting same file
//     inputRef.current?.click();
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     // Validate type
//     if (!accept.includes(file.type)) {
//       setError("Please choose a JPEG, JPG, PNG, or WEBP image.");
//       return;
//     }

//     // Validate size
//     const maxBytes = maxSizeMB * 1024 * 1024;
//     if (file.size > maxBytes) {
//       setError(`File is too large. Max ${maxSizeMB}MB.`);
//       return;
//     }

//     setError("");
//     setUploadError("");
//     setImage(file);

//     // Revoke previous blob URL if any
//     if (previewUrl && previewUrl.startsWith("blob:")) {
//       try {
//         URL.revokeObjectURL(previewUrl);
//       } catch {}
//     }
//     setPreviewUrl(URL.createObjectURL(file));
//   };

//   const handleRemoveImage = () => {
//     setImage(null);
//     if (previewUrl && previewUrl.startsWith("blob:")) {
//       try {
//         URL.revokeObjectURL(previewUrl);
//       } catch {}
//     }
//     setPreviewUrl(initialUrl || null);
//     setError("");
//     setUploadError("");
//     if (inputRef.current) inputRef.current.value = "";
//   };

//   // Upload selected image to backend and replace preview with server URL on success
//   const uploadAvatar = async () => {
//     if (!image) return;
//     setIsSaving(true);
//     setUploadError("");
//     try {
//       const formData = new FormData();
//       formData.append("avatar", image); // field name expected by backend

//       const res = await fetch("/api/users/me/avatar", {
//         method: "POST",
//         body: formData, // browser sets multipart/form-data with boundary
//       });

//       if (!res.ok) {
//         throw new Error(`Upload failed (${res.status})`);
//       }

//       const data = await res.json(); // expected: { url: "https://..." }
//       if (data?.url) {
//         // swap preview to permanent URL
//         if (previewUrl && previewUrl.startsWith("blob:")) {
//           try {
//             URL.revokeObjectURL(previewUrl);
//           } catch {}
//         }
//         setPreviewUrl(data.url);
//         // clear local file reference since server is now source of truth
//         setImage(null);
//       } else {
//         throw new Error("No URL returned from server");
//       }
//     } catch (err) {
//       setUploadError("Could not save photo. Please try again.");
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center mb-6">
//       <input
//         ref={inputRef}
//         type="file"
//         accept={accept.join(",")}
//         onChange={handleImageChange}
//         className="hidden"
//       />

//       {!previewUrl ? (
//         <button
//           type="button"
//           onClick={openPicker}
//           className="w-20 h-20 flex items-center justify-center bg-blue-100/50 rounded-full relative"
//           aria-label="Choose profile photo"
//         >
//           <LuUser className="text-4xl text-primary" />
//           <span className="sr-only">Upload</span>
//           <span className="w-8 h-8 flex items-center justify-center bg-primary text-white rounded-full absolute -bottom-1 -right-1">
//             <LuUpload />
//           </span>
//         </button>
//       ) : (
//         <div className="relative">
//           <img
//             src={previewUrl}
//             alt="Profile"
//             className="w-20 h-20 rounded-full object-cover"
//             onClick={openPicker}
//           />
//           {/* Show remove only if preview is a local selection or user wants to clear */}
//           <button
//             type="button"
//             className="w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full absolute -bottom-1 -right-1"
//             onClick={handleRemoveImage}
//             aria-label="Remove photo"
//           >
//             <LuTrash />
//           </button>
//         </div>
//       )}

//       {/* Action row */}
//       <div className="mt-3 flex items-center gap-2">
//         <button
//           type="button"
//           onClick={openPicker}
//           className="btn btn-secondary"
//         >
//           Change
//         </button>
//         <button
//           type="button"
//           onClick={uploadAvatar}
//           disabled={!image || !!error || isSaving}
//           className="btn btn-primary disabled:opacity-50"
//         >
//           {isSaving ? "Saving..." : "Save photo"}
//         </button>
//       </div>

//       {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
//       {uploadError && <p className="mt-2 text-xs text-red-500">{uploadError}</p>}
//     </div>
//   );
// }

// import { useEffect, useRef, useState } from "react";
// import { LuUser, LuUpload, LuTrash } from "react-icons/lu";

// export default function ProfilePhotoSelector({
//   image,            // File | null (state lives in parent)
//   setImage,         // (file | null) => void
//   initialUrl = "",  // existing profile image URL from backend
//   maxSizeMB = 5,
//   accept = ["image/jpeg", "image/jpg", "image/png", "image/webp"],
//   authToken = null, // optional for protected routes
// }) {
//   const inputRef = useRef(null);
//   const [previewUrl, setPreviewUrl] = useState(initialUrl || null);
//   const [error, setError] = useState("");
//   const [uploadError, setUploadError] = useState("");
//   const [isSaving, setIsSaving] = useState(false);

//   // Cleanup object URL on unmount/change
//   useEffect(() => {
//     return () => {
//       if (previewUrl && previewUrl.startsWith("blob:")) {
//         try {
//           URL.revokeObjectURL(previewUrl);
//         } catch {}
//       }
//     };
//   }, [previewUrl]);

//   // Keep preview in sync if initialUrl changes externally (e.g., after refetch)
//   useEffect(() => {
//     if (!image && initialUrl && previewUrl !== initialUrl) {
//       setPreviewUrl(initialUrl);
//     }
//   }, [initialUrl]); // eslint-disable-line react-hooks/exhaustive-deps

//   const openPicker = () => {
//     if (inputRef.current) inputRef.current.value = ""; // allow reselecting same file
//     inputRef.current?.click();
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     // Validate type
//     if (!accept.includes(file.type)) {
//       setError("Please choose a JPEG, JPG, PNG, or WEBP image.");
//       return;
//     }

//     // Validate size
//     const maxBytes = maxSizeMB * 1024 * 1024;
//     if (file.size > maxBytes) {
//       setError(`File is too large. Max ${maxSizeMB}MB.`);
//       return;
//     }

//     setError("");
//     setUploadError("");
//     setImage(file);

//     // Revoke previous blob URL if any
//     if (previewUrl && previewUrl.startsWith("blob:")) {
//       try {
//         URL.revokeObjectURL(previewUrl);
//       } catch {}
//     }
//     setPreviewUrl(URL.createObjectURL(file));
//   };

//   const handleRemoveImage = () => {
//     setImage(null);
//     if (previewUrl && previewUrl.startsWith("blob:")) {
//       try {
//         URL.revokeObjectURL(previewUrl);
//       } catch {}
//     }
//     setPreviewUrl(initialUrl || null);
//     setError("");
//     setUploadError("");
//     if (inputRef.current) inputRef.current.value = "";
//   };

//   // Upload selected image to backend and replace preview with server URL on success
//   const uploadAvatar = async () => {
//     if (!image) return;
//     setIsSaving(true);
//     setUploadError("");
//     try {
//       const formData = new FormData();
//       formData.append("avatar", image); // field name expected by backend

//       const res = await fetch("/api/users/me/avatar", {
//         method: "POST",
//         headers: authToken ? { Authorization: `Bearer ${authToken}` } : undefined,
//         body: formData,
//       });

//       if (!res.ok) {
//         throw new Error(`Upload failed (${res.status})`);
//       }

//       const data = await res.json(); // expected: { url: "https://..." }
//       if (data?.url) {
//         // swap preview to permanent URL
//         if (previewUrl && previewUrl.startsWith("blob:")) {
//           try {
//             URL.revokeObjectURL(previewUrl);
//           } catch {}
//         }
//         setPreviewUrl(data.url);
//         setImage(null); // clear local file reference
//       } else {
//         throw new Error("No URL returned from server");
//       }
//     } catch (err) {
//       setUploadError("Could not save photo. Please try again.");
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center mb-6">
//       <input
//         ref={inputRef}
//         type="file"
//         accept={accept.join(",")}
//         onChange={handleImageChange}
//         className="hidden"
//       />

//       {!previewUrl ? (
//         <button
//           type="button"
//           onClick={openPicker}
//           className="w-20 h-20 flex items-center justify-center bg-blue-100/50 rounded-full relative"
//           aria-label="Choose profile photo"
//         >
//           <LuUser className="text-4xl text-primary" />
//           <span className="sr-only">Upload</span>
//           <span className="w-8 h-8 flex items-center justify-center bg-primary text-white rounded-full absolute -bottom-1 -right-1">
//             <LuUpload />
//           </span>
//         </button>
//       ) : (
//         <div className="relative">
//           <img
//             src={previewUrl}
//             alt="Profile"
//             className="w-20 h-20 rounded-full object-cover cursor-pointer"
//             onClick={openPicker}
//           />
//           <button
//             type="button"
//             className="w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full absolute -bottom-1 -right-1"
//             onClick={handleRemoveImage}
//             aria-label="Remove photo"
//           >
//             <LuTrash />
//           </button>
//         </div>
//       )}

//       {/* Action row */}
//       <div className="mt-3 flex items-center gap-2">
//         <button type="button" onClick={openPicker} className="btn btn-secondary">
//           Change
//         </button>

//         {image && (
//           <button
//             type="button"
//             onClick={uploadAvatar}
//             disabled={!!error || isSaving}
//             className="btn btn-primary disabled:opacity-50"
//           >
//             {isSaving ? "Saving..." : "Save photo"}
//           </button>
//         )}
//       </div>

//       {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
//       {uploadError && <p className="mt-2 text-xs text-red-500">{uploadError}</p>}
//     </div>
//   );
// }

import { useEffect, useRef, useState } from "react";
import { LuUser, LuUpload, LuTrash } from "react-icons/lu";

export default function ProfilePhotoSelector({
  image,
  setImage,
  initialUrl = "",
  maxSizeMB = 5,
  accept = ["image/jpeg", "image/jpg", "image/png", "image/webp"],
  authToken = null,
}) {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(initialUrl || null);
  const [error, setError] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        try {
          URL.revokeObjectURL(previewUrl);
        } catch {}
      }
    };
  }, [previewUrl]);

  useEffect(() => {
    if (!image && initialUrl && previewUrl !== initialUrl) {
      setPreviewUrl(initialUrl);
    }
  }, [initialUrl, image, previewUrl]);

  const openPicker = () => {
    if (inputRef.current) inputRef.current.value = "";
    inputRef.current?.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!accept.includes(file.type)) {
      setError("Please choose a JPEG, JPG, PNG, or WEBP image.");
      setImage(null);
      return;
    }

    const maxBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxBytes) {
      setError(`File is too large. Max ${maxSizeMB}MB.`);
      setImage(null);
      return;
    }

    setError("");
    setUploadError("");
    setImage(file);

    if (previewUrl && previewUrl.startsWith("blob:")) {
      try {
        URL.revokeObjectURL(previewUrl);
      } catch {}
    }
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setImage(null);
    if (previewUrl && previewUrl.startsWith("blob:")) {
      try {
        URL.revokeObjectURL(previewUrl);
      } catch {}
    }
    setPreviewUrl(initialUrl || null);
    setError("");
    setUploadError("");
    if (inputRef.current) inputRef.current.value = "";
  };

  const uploadAvatar = async () => {
    if (!image) return;
    setIsSaving(true);
    setUploadError("");

    try {
      const formData = new FormData();
      formData.append("avatar", image);

      const res = await fetch("http://localhost:8000/api/upload", {
        method: "POST",
        headers: authToken
          ? { Authorization: `Bearer ${authToken}` }
          : undefined,
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Upload failed (${res.status})`);
      }

      const data = await res.json();
      console.log("Upload response:", data);

      // const newUrl =
      //   data?.url ||
      //   data?.avatarUrl ||
      //   data?.data?.url ||
      //   (typeof data === "string" ? data : null);

      // if (!newUrl) throw new Error("No URL returned from server");

      // if (previewUrl && previewUrl.startsWith("blob:")) {
      //   try {
      //     URL.revokeObjectURL(previewUrl);
      //   } catch {}
      // }

      // setPreviewUrl(newUrl);
      if (!data.avatarUrl) throw new Error("No URL returned from server");

      setPreviewUrl(data.avatarUrl);
      setImage(null);
    } catch (err) {
      console.error(err);
      setUploadError("Could not save photo. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      {/* Smaller Preview Circle */}
      <div className="w-20 h-20 rounded-full border border-gray-300 overflow-hidden flex items-center justify-center bg-gray-100">
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-full object-cover"
          />
        ) : (
          <LuUser className="text-gray-400 text-4xl" />
        )}
      </div>

      {/* Hidden File Input */}
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept={accept.join(",")}
        onChange={handleImageChange}
      />

      {/* Smaller Buttons */}
      <div className="flex space-x-1">
        <button
          type="button"
          onClick={openPicker}
          className="flex items-center space-x-1 px-2 py-1 text-sm  text-blue rounded hover:bg-blue-600"
        >
          <LuUpload className="text-sm" /> <span>Select</span>
        </button>
        {previewUrl && (
          <>
            <button
              type="button"
              onClick={handleRemoveImage}
              className="flex items-center space-x-1 px-2 py-1 text-sm  text-red rounded hover:bg-red-600"
            >
              <LuTrash className="text-sm" /> <span>Remove</span>
            </button>
            <button
              type="button"
              onClick={uploadAvatar}
              className="flex items-center space-x-1 px-2 py-1 text-sm  text-green rounded hover:bg-green-600"
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Upload"}
            </button>
          </>
        )}
      </div>

      {/* Errors */}
      {error && <p className="text-red-500 text-xs">{error}</p>}
      {uploadError && <p className="text-red-500 text-xs">{uploadError}</p>}
    </div>
  );
}
