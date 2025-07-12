// /src/components/ProtectedRoute.jsx
import { useLocation, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { showUserLogin, user, axios, setShowAuthModal, setRedirectPath } =
    useAuthContext();

  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [couponData, setCouponData] = useState(null);
  const [authInitialized, setAuthInitialized] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  // Track when authentication state has been initialized
  useEffect(() => {
    if (user !== null || showUserLogin !== undefined) {
      setAuthInitialized(true);
    }
  }, [user, showUserLogin]);

  // Handle unauthenticated users
  useEffect(() => {
    if (!authInitialized) return;

    if (!showUserLogin || !user) {
      // Store current path to redirect back after login
      setRedirectPath(location.pathname);

      // If trying to access studio, redirect to homepage
      if (location.pathname.startsWith("/studio")) {
        setShouldRedirect(true);
      }

      // Open auth modal
      setShowAuthModal(true);
    }
  }, [
    authInitialized,
    showUserLogin,
    user,
    location,
    setShowAuthModal,
    setRedirectPath,
  ]);

  // Fetch coupon information when user is authenticated
  useEffect(() => {
    if (!authInitialized) return;
    if (!showUserLogin || !user) return;

    const fetchCouponInfo = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `/coupon-info?user_id=${user.user_id}`
        );

        if (response.data) {
          setCouponData(response.data);
        }
      } catch (error) {
        console.error("Error fetching coupon info:", error);
        setCouponData({ coupons_used: 1 });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCouponInfo();
  }, [user?.user_id, axios, authInitialized, showUserLogin, user]);

  // Redirect unauthenticated users trying to access studio
  if (shouldRedirect) {
    return <Navigate to="/" replace />;
  }

  // Show loading spinner while initializing auth or fetching data
  if (!authInitialized || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If unauthenticated, show nothing (auth modal will appear)
  if (!showUserLogin || !user) {
    return null;
  }

  // Check coupon usage
  if (couponData?.coupons_used === 0) {
    return <Navigate to="/coupon" replace />;
  }

  // Render children if all checks pass
  return children;
};

export default ProtectedRoute;
