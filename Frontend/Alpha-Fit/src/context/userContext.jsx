import {
  createContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

export const UserContext = createContext(null);

function UserProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const [loading, setLoading] = useState(true);

  // Sync token to axios header
  const setAuthHeader = (token) => {
    if (token) {
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;
    } else {
      delete axiosInstance.defaults.headers.common[
        "Authorization"
      ];
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setAuthHeader(null);
      setLoading(false);
      return;
    }

    setAuthHeader(token);

    axiosInstance
      .get(API_PATHS.AUTH.GET_PROFILE)
      .then((res) => {
        const profile = res.data;
        localStorage.setItem("user", JSON.stringify(profile));
        setUser(profile);
      })
      .catch((err) => {
        if (err?.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setUser(null);
          setAuthHeader(null);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const updateUser = (data) => {
    const userObj = data.user || data;

    if (data?.token) {
      localStorage.setItem("token", data.token);
      setAuthHeader(data.token);
    }

    localStorage.setItem("user", JSON.stringify(userObj));
    setUser(userObj);
  };

  const cleanUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAuthHeader(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      updateUser,
      cleanUser,
    }),
    [user, loading]
  );

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export default UserProvider;


// import {
//   createContext,
//   useCallback,
//   useEffect,
//   useMemo,
//   useState,
// } from "react";
// import axiosInstance from "../utils/axiosInstance";
// import { API_PATHS } from "../utils/apiPaths";

// export const UserContext = createContext(null);

// export default function UserProvider({ children }) {
//   // 1. Immediate Hydration: Try to load from localStorage right away
//   const [user, setUser] = useState(() => {
//     const savedUser = localStorage.getItem("user");
//     return savedUser ? JSON.parse(savedUser) : null;
//   });
//   const [loading, setLoading] = useState(true);

//   const setAuthHeader = useCallback((token) => {
//     if (token) {
//       axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
//     } else {
//       delete axiosInstance.defaults.headers.common["Authorization"];
//     }
//   }, []);

//   // Hydrate on mount
//   useEffect(() => {
//     let alive = true;
//     const token = localStorage.getItem("token");

//     if (!token) {
//       setAuthHeader(null);
//       setLoading(false);
//       return () => { alive = false; };
//     }

//     setAuthHeader(token);

//     (async () => {
//       try {
//         const res = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
//         if (!alive) return;

//         const next = res.data;
//         // 2. Persistent Sync: Keep localStorage updated with the latest profile from DB
//         localStorage.setItem("user", JSON.stringify(next));
        
//         setUser((prev) => {
//           if (prev && next && (prev.id || prev._id) === (next.id || next._id)) {
//             return prev;
//           }
//           return next;
//         });
//       } catch (err) {
//         if (!alive) return;
//         if (err?.response?.status === 401) {
//           localStorage.removeItem("token");
//           localStorage.removeItem("user"); // Clear user data too
//           setAuthHeader(null);
//           setUser(null);
//         }
//       } finally {
//         if (alive) setLoading(false);
//       }
//     })();

//     return () => { alive = false; };
//   }, [setAuthHeader]);

//   // 3. Enhanced Update: Store user object in localStorage on Login/Update
//   const updateUser = useCallback(
//     (userData) => {
//       const userObj = userData.user || userData;
      
//       if (userData?.token) {
//         localStorage.setItem("token", userData.token);
//         setAuthHeader(userData.token);
//       }
      
//       // Save the object to disk so Sidebar sees the name immediately
//       localStorage.setItem("user", JSON.stringify(userObj));

//       setUser((prev) => {
//         if (prev && userObj && (prev.id || prev._id) === (userObj.id || userObj._id)) {
//           return prev;
//         }
//         return userObj;
//       });
//       setLoading(false);
//     },
//     [setAuthHeader]
//   );

//   const setUserAvatar = useCallback((url) => {
//     setUser((prev) => {
//       const next = prev ? { ...prev, avatarUrl: url } : prev;
//       if (next) localStorage.setItem("user", JSON.stringify(next));
//       return next;
//     });
//   }, []);

//   const cleanUser = useCallback(() => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user"); // Clear memory
//     setAuthHeader(null);
//     setUser(null);
//   }, [setAuthHeader]);

//   const value = useMemo(
//     () => ({ user, loading, updateUser, cleanUser, setUserAvatar }),
//     [user, loading, updateUser, cleanUser, setUserAvatar]
//   );

//   return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
// }

// // import {
// //   createContext,
// //   useCallback,
// //   useEffect,
// //   useMemo,
// //   useState,
// // } from "react";
// // import axiosInstance from "../utils/axiosInstance";
// // import { API_PATHS } from "../utils/apiPaths";

// // export const UserContext = createContext(null);

// // export default function UserProvider({ children }) {
// //   const [user, setUser] = useState(null);
// //   const [loading, setLoading] = useState(true);

// //   // Keep this stable
// //   const setAuthHeader = useCallback((token) => {
// //     if (token) {
// //       axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
// //     } else {
// //       delete axiosInstance.defaults.headers.common["Authorization"];
// //     }
// //   }, []);

// //   // Hydrate on mount (or when the token changes)
// //   useEffect(() => {
// //     let alive = true;
// //     const token = localStorage.getItem("token");

// //     if (!token) {
// //       setAuthHeader(null);
// //       setLoading(false);
// //       return () => {
// //         alive = false;
// //       };
// //     }

// //     setAuthHeader(token);

// //     (async () => {
// //       try {
// //         const res = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
// //         if (!alive) return;

// //         // Avoid redundant state updates that can contribute to loops
// //         setUser((prev) => {
// //           const next = res.data;
// //           if (prev && next && (prev.id || prev._id) === (next.id || next._id)) {
// //             return prev;
// //           }
// //           return next;
// //         });
// //       } catch (err) {
// //         if (!alive) return;
// //         if (err?.response?.status === 401) {
// //           localStorage.removeItem("token");
// //           setAuthHeader(null);
// //           setUser(null);
// //         }
// //       } finally {
// //         if (alive) setLoading(false);
// //       }
// //     })();

// //     return () => {
// //       alive = false;
// //     };
// //   }, [setAuthHeader]); // keep deps minimal and stable
// //   // Note: if you later read token from state instead of localStorage, add it here as a dep

// //   // Called after successful login/register
// //   const updateUser = useCallback(
// //     (userData) => {
// //       if (userData?.token) {
// //         localStorage.setItem("token", userData.token);
// //         setAuthHeader(userData.token);
// //       }
// //       // Store returned profile or minimal user object
// //       setUser((prev) => {
// //         const next = userData.user || userData;
// //         if (prev && next && (prev.id || prev._id) === (next.id || next._id)) {
// //           return prev;
// //         }
// //         return next;
// //       });
// //       setLoading(false);
// //     },
// //     [setAuthHeader]
// //   );

// //   // Update only avatar URL
// //   const setUserAvatar = useCallback((url) => {
// //     setUser((prev) => (prev ? { ...prev, avatarUrl: url } : prev));
// //   }, []);

// //   // Logout/clear
// //   const cleanUser = useCallback(() => {
// //     localStorage.removeItem("token");
// //     setAuthHeader(null);
// //     setUser(null);
// //   }, [setAuthHeader]);

// //   const value = useMemo(
// //     () => ({ user, loading, updateUser, cleanUser, setUserAvatar }),
// //     [user, loading, updateUser, cleanUser, setUserAvatar]
// //   );

// //   return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
// // }





// // import {
// //   createContext,
// //   useCallback,
// //   useEffect,
// //   useMemo,
// //   useState,
// // } from "react";
// // import axiosInstance from "../utils/axiosInstance";
// // import { API_PATHS } from "../utils/apiPaths";

// // export const UserContext = createContext(null);

// // export default function UserProvider({ children }) {
// //   const [user, setUser] = useState(null);
// //   const [loading, setLoading] = useState(true);

// //   // Sync axios auth header with the token in storage
// //   const setAuthHeader = useCallback((token) => {
// //     if (token) {
// //       axiosInstance.defaults.headers.common[
// //         "Authorization"
// //       ] = `Bearer ${token}`;
// //     } else {
// //       delete axiosInstance.defaults.headers.common["Authorization"];
// //     }
// //   }, []);

// //   // Hydrate on mount
// //   useEffect(() => {
// //     let alive = true;
// //     const token = localStorage.getItem("token");
// //     if (!token) {
// //       setAuthHeader(null);
// //       setLoading(false);
// //       return;
// //     }
// //     setAuthHeader(token);

// //     (async () => {
// //       try {
// //         const res = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
// //         if (!alive) return;
// //         setUser(res.data);
// //       } catch (err) {
// //         if (!alive) return;
// //         // Token invalid; clear session
// //         if (err?.response?.status === 401) {
// //           localStorage.removeItem("token");
// //           setAuthHeader(null);
// //           setUser(null);
// //         }
// //       } finally {
// //         if (alive) setLoading(false);
// //       }
// //     })();

// //     return () => {
// //       alive = false;
// //     };
// //   }, [setAuthHeader]);

// //   // Called after successful login/register
// //   const updateUser = useCallback(
// //     (userData) => {
// //       // Expect userData to include token and user fields
// //       if (userData?.token) {
// //         localStorage.setItem("token", userData.token);
// //         setAuthHeader(userData.token);
// //       }
// //       // If backend returned full user profile, store that; otherwise keep minimal and let hydration refetch
// //       setUser(userData.user || userData);
// //       setLoading(false);
// //     },
// //     [setAuthHeader]
// //   );

// //   // Narrow helper to update only the avatar URL after upload
// //   const setUserAvatar = useCallback(
// //     (url) => {
// //       setUser((prev) => (prev ? { ...prev, avatarUrl: url } : prev));
// //     },
// //     []
// //   );

// //   // Logout/clear
// //   const cleanUser = useCallback(() => {
// //     localStorage.removeItem("token");
// //     setAuthHeader(null);
// //     setUser(null);
// //   }, [setAuthHeader]);

// //   const value = useMemo(
// //     () => ({ user, loading, updateUser, cleanUser,setUserAvatar }),
// //     [user, loading, updateUser, cleanUser]
// //   );

// //   return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
// // }
