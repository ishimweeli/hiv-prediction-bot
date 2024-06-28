// // hooks/useAuth.js
// import { useState, useEffect, useCallback } from 'react';
// import Cookies from 'js-cookie';
// import { jwtDecode } from 'jwt-decode';  // Changed this line

// export const useAuth = () => {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const [userRole, setUserRole] = useState(null);

//   const checkAuth = useCallback(() => {
//     console.log(Cookies)
//     const token = Cookies.get('token');
//     console.log("token",token)
//     if (token) {
//       try {
//         const decodedToken = jwtDecode(token);  // Changed this line
//         const currentTime = Date.now() / 1000;
        
//         if (decodedToken.exp > currentTime) {
//           setIsAuthenticated(true);
//           setUserRole(decodedToken.role);
//         } else {
//           // Token has expired
//           setIsAuthenticated(false);
//           setUserRole(null);
//           Cookies.remove('token');
//         }
//       } catch (error) {
//         console.error('Error decoding token:', error);
//         setIsAuthenticated(false);
//         setUserRole(null);
//         Cookies.remove('token');
//       }
//     } else {
//       setIsAuthenticated(false);
//       setUserRole(null);
//     }
//     setIsLoading(false);
//   }, []);

//   useEffect(() => {
//     checkAuth();
//   }, [checkAuth]);

//   const refreshAuth = useCallback(() => {
//     checkAuth();
//   }, [checkAuth]);

//   return { isAuthenticated, isLoading, userRole, refreshAuth };
// };