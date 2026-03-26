// // import React from "react";
// import UI_IMG from "../../assets/image.png";

// export default function AuthLayout({ children }) {
//   return (
//     <div className="flex min-h-screen">
//       {/* Left: form area */}
//       <div className="w-screen md:w-[60vw] h-screen px-12 pt-8 pb-12 overflow-y-auto">
//         <header className="mb-6">
//           <h1 className="text-lg font-semibold text-gray-900">Alpha Fit</h1>
//         </header>
//         {children}
//       </div>
//       text
//       {/* Right: illustration */}
//       <div
//         className="hidden md:flex w-[40vw] h-screen items-center justify-center bg-blue-50 bg-cover bg-no-repeat bg-center overflow-hidden p-8"
//         style={{ backgroundImage: "" }}
//       >
//         <img
//           src={UI_IMG}
//           alt="Alpha Fit onboarding"
//           className="w-64 lg:w-[85%] object-contain"
//         />
//       </div>
//     </div>
//   );
// }

// import React from "react";
import UI_IMG from "../../assets/image.png";

// export default function AuthLayout({ children }) {
//   return (
//     <div className="flex min-h-screen">
//       {/* Single column: form area */}
//       <div className="w-screen h-screen px-12 pt-8 pb-12 overflow-y-auto">
//         <header className="mb-6">
//           <h1 className="text-lg font-semibold text-gray-900"></h1>
//         </header>
//         {children}
//       </div>
//       {/* Removed side illustration */}
//     </div>
//   );
// }


export default function AuthLayout({ children }) {
return (
<div className="min-h-screen">
<div className="w-full min-h-screen overflow-y-auto overflow-x-hidden">
{children}
</div>
</div>
);
}


