export const speak = (text) => {
  if (!window.speechSynthesis) return;

  const utterance = new SpeechSynthesisUtterance(text);

  utterance.rate = 1;      // speed (0.5 - 2)
  utterance.pitch = 1;     // voice tone
  utterance.volume = 1;    // 0 - 1

  // Optional: choose better voice
  const voices = window.speechSynthesis.getVoices();
  const femaleVoice = voices.find(v => v.name.includes("Google"));
  if (femaleVoice) utterance.voice = femaleVoice;

  window.speechSynthesis.speak(utterance);
};