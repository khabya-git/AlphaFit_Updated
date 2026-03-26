import React, { useState } from "react";
import toast from "react-hot-toast";
import AuthLayout from "../../components/Layout/AuthLayout";
import MeasurementFormComponent from "./MeasurementForm";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { useNavigate } from "react-router-dom";

export default function MeasurementForm() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (payload) => {
    try {
      setSaving(true);
      // Make sure this path exists in apiPaths (e.g., USER.SAVE_FITNESS_PROFILE)
      await axiosInstance.post(API_PATHS.PROFILE.CREATE_FITNESS, payload);      // changes UPDATE_FITNESS->CREATE_FITNESS
      toast.success("Profile saved");
      navigate("/user/dashboard", { replace: true });
    } catch (e) {
      console.error(e);
      toast.error(e?.response?.data?.message || "Failed to save profile");
      // Optionally show a toast or inline error
    } finally {
      setSaving(false);
    }
  };

  return (
    <AuthLayout>
      <div className="min-h-screen flex items-center justify-center py-10 px-4">
        <div className="w-full max-w-2xl">
          <MeasurementFormComponent onSubmit={handleSubmit} submitting={saving} />
        </div>
      </div>
    </AuthLayout>
  );
}


// import React, { useState } from "react";
// import AuthLayout from "../../components/Layout/AuthLayout";
// import FitnessProfileForm from "./FitnessProfileForm";
// import axiosInstance from "../../utils/axiosInstance";
// import { API_PATHS } from "../../utils/apiPaths";
// import { useNavigate } from "react-router-dom";

// export default function FitnessProfilePage() {
//   const navigate = useNavigate();
//   const [saving, setSaving] = useState(false);

//   const handleSubmit = async (payload) => {
//     const url = API_PATHS.USER.SAVE_FITNESS_PROFILE; // "/api/user/fitness-profile"
//     try {
//       setSaving(true);
//       console.log("POST", axiosInstance.defaults.baseURL + url, payload);
//       const res = await axiosInstance.post(url, payload);
//       console.log("Save OK:", res.status, res.data);

//       // Optional: verify by reading it back immediately
//       try {
//         const check = await axiosInstance.get(API_PATHS.USER.GET_FITNESS_PROFILE);
//         console.log("Fetched profile:", check.data);
//       } catch (gErr) {
//         console.warn("Fetch after save failed:", gErr?.response?.status, gErr?.response?.data || gErr?.message);
//       }

//       navigate("/user/dashboard", { replace: true });
//     } catch (e) {
//       // Stronger diagnostics
//       if (e?.response) {
//         console.error("Save failed:", e.response.status, e.response.data);
//       } else if (e?.request) {
//         console.error("Save failed: no response (network/CORS)", e.message);
//       } else {
//         console.error("Save failed:", e?.message);
//       }
//       // TODO: Show a toast or inline error here
//       return false; // lets the form decide not to navigate if you wire it that way
//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <AuthLayout>
//       <div className="min-h-screen flex items-center justify-center py-10 px-4">
//         <div className="w-full max-w-2xl">
//           <FitnessProfileForm onSubmit={handleSubmit} submitting={saving} />
//         </div>
//       </div>
//     </AuthLayout>
//   );
// }
