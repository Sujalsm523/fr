import React, { useEffect, useRef } from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import StudioPage from "./pages/StudioPage/StudioPage";
import CouponPage from "./pages/CouponPage/CouponPage";
import { Toaster } from "react-hot-toast";
import { ReactLenis } from "lenis/react";
import gsap from "gsap";
import ARStudioPage from "./pages/ARStudioPage/ARStudioPage";
import ProtectedRoute from "./components/ProtectedRoute";

function LenisWrapper({ children }) {
  const lenisRef = useRef();

  useEffect(() => {
    function update(time) {
      lenisRef.current?.lenis?.raf(time * 1000);
    }
    gsap.ticker.add(update);
    return () => gsap.ticker.remove(update);
  }, []);

  return (
    <>
      <ReactLenis root options={{ autoRaf: false }} ref={lenisRef} />
      {children}
    </>
  );
}

const App = () => {
  return (
    <div className="size-full">
      <Toaster />
      <Routes>
        <Route
          path="/"
          element={
            <LenisWrapper>
              <HomePage />
            </LenisWrapper>
          }
        />
        <Route
          path="/studio"
          element={
            <ProtectedRoute>
              <StudioPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ar/:sessionId/:userID/:scene"
          element={<ARStudioPage />}
        />
        <Route path="/coupon" element={<CouponPage />} />
      </Routes>
    </div>
  );
};

export default App;
