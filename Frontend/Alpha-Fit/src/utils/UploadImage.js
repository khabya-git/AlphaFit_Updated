// import { API_PATHS } from "./apiPaths";
// // import axiosInstance from "./axiosInstance";
// import axios from "axios";

// export default async function uploadImage(imageFile) {
//   const formData = new FormData();
//   formData.append("image", imageFile);

//   const res = await axios.post("http://localhost:8000/api/upload", formData, {
//     headers: { "Content-Type": "multipart/form-data" },
//   });
//   // Normalize what callers receive
//   return {
//     imageUrl: res.data?.imageUrl,
//     filename: res.data?.filename,
//     contentType: res.data?.contentType,
//     size: res.data?.size,
//     raw: res.data,
//   };
// }


// import axios from "axios";

// export default async function uploadImage(imageFile) {
//   try {
//     const formData = new FormData();
//     formData.append("image", imageFile);

//     const res = await axios.post("http://localhost:8000/api/upload", formData, {
//       headers: { "Content-Type": "multipart/form-data" },
//     });

//     return {
//       imageUrl: res.data?.imageUrl,   // public URL of uploaded image
//       filename: res.data?.filename,   // stored file name
//       contentType: res.data?.contentType, // MIME type
//       size: res.data?.size,           // file size
//       raw: res.data,                  // full response
//     };
//   } catch (err) {
//     console.error("Image upload failed:", err);
//     throw err;
//   }
// }


import axios from "axios";

// const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

export default async function uploadImage(imageFile) {
  const formData = new FormData();
  formData.append("avatar", imageFile);

  try {
    const res = await axios.post(
      "http://localhost:8000/api/upload",
      // `${API_BASE_URL}/api/upload`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    // just return the backend response
    return res.data;
  } catch (err) {
    console.error("Image upload failed:", err);
    throw err;
  }
}
