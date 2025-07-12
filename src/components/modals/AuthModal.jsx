import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

import { setCookie } from "../../utils/cookie";
import { useAuthContext } from "../../context/AuthContext";

const Input = ({ label, name, value, onChange, type = "text" }) => (
  <div>
    <label className="block text-sm text-white/80 mb-1">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-2.5 rounded-lg bg-white/10 border border-[#fde791]/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#fde791]/50"
      required
    />
  </div>
);

const AuthModal = () => {
  const {
    showAuthModal,
    setShowAuthModal,
    setShowUserLogin,
    setUser,
    axios,
    fetchUser,
    showUserLogin,
    user,
  } = useAuthContext();

  const [isSignIn, setIsSignIn] = useState(true);
  const [signUpStep, setSignUpStep] = useState(1);
  const [verificationCode, setVerificationCode] = useState("");

  const [signInData, setSignInData] = useState({
    email: "",
    password: "",
  });

  const [signUpData, setSignUpData] = useState({
    email: "",
    otp: "",
    password: "",
    confirmPassword: "",
  });

  // Close modal on successful authentication
  useEffect(() => {
    if (showAuthModal && showUserLogin && user) {
      setShowAuthModal(false);
    }
  }, [showUserLogin, user, showAuthModal, setShowAuthModal]);

  const handleSignInChange = (e) => {
    const { name, value } = e.target;
    setSignInData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignUpChange = (e) => {
    const { name, value } = e.target;
    setSignUpData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `/LoginUser?email=${signInData.email}&password=${signInData.password}`
      );

      if (data.status && data.token) {
        setCookie("token", data.token, 7);
        axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
        await fetchUser();
        toast.success("Login successful!");
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || "Login error"
      );
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (signUpStep === 1) {
      try {
        const { data } = await axios.post(
          `/SignUpCheck?email=${encodeURIComponent(signUpData.email)}`
        );

        if (data.status && data.verification_code) {
          setVerificationCode(data.verification_code);
          setSignUpStep(2);
          toast.success("OTP sent to your email");
        } else {
          toast.error(data.message || "Failed to send OTP");
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message || error.message || "Failed to send OTP"
        );
      }
    } else if (signUpStep === 2) {
      if (signUpData.otp === verificationCode) {
        setSignUpStep(3);
        toast.success("OTP verified successfully");
      } else {
        toast.error("Invalid OTP. Please try again.");
      }
    } else {
      if (signUpData.password !== signUpData.confirmPassword) {
        toast.error("Passwords don't match");
        return;
      }

      try {
        const { data } = await axios.post(
          `/CreateNewUser?email=${encodeURIComponent(
            signUpData.email
          )}&password=${encodeURIComponent(signUpData.password)}`
        );

        if (data.status && data.token) {
          setCookie("token", data.token, 7);
          axios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${data.token}`;
          await fetchUser();
          toast.success("Account created successfully!");
        } else {
          toast.error(data.message || "Failed to create account");
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            error.message ||
            "Failed to create account"
        );
      }

      setSignUpData({ email: "", otp: "", password: "", confirmPassword: "" });
      setSignUpStep(1);
      setVerificationCode("");
    }
  };

  const resetForm = () => {
    setIsSignIn(true);
    setSignUpStep(1);
    setSignInData({ email: "", password: "" });
    setSignUpData({ email: "", otp: "", password: "", confirmPassword: "" });
  };

  return (
    <AnimatePresence>
      {showAuthModal && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Blurred background overlay */}
          <motion.div
            className="absolute inset-0 bg-black/50"
            onClick={() => {
              resetForm();
              setShowAuthModal(false);
            }}
          />

          {/* Modal content */}
          <motion.div
            className="relative w-full max-w-md rounded-2xl shadow-2xl z-10 w-"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            style={{
              // background: "url(/signinbg.jpg)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <button
              className="absolute top-4 right-4 text-white/80 hover:text-white z-20 cursor-pointer "
              onClick={() => {
                resetForm();
                setShowAuthModal(false);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="flex flex-col p-8 bg-white/30 backdrop-blur-xl border border-white/40 rounded-2xl">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-semibold text-[#fde791] mb-1">
                  {isSignIn ? "Welcome Back" : "Create Account"}
                </h2>
                <p className="text-sm text-white/80">
                  {isSignIn ? "Sign in to continue" : "Join us today"}
                </p>
              </div>

              {isSignIn ? (
                <form onSubmit={handleSignIn} className="space-y-4">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <Input
                      label="Email Address"
                      name="email"
                      type="email"
                      value={signInData.email}
                      onChange={handleSignInChange}
                    />
                    <Input
                      label="Password"
                      name="password"
                      type="password"
                      value={signInData.password}
                      onChange={handleSignInChange}
                    />
                  </motion.div>

                  <button
                    type="submit"
                    className="w-full py-3 mt-2 rounded-lg font-semibold transition-all hover:opacity-80 active:scale-[0.98] cursor-pointer"
                    style={{
                      background: "linear-gradient(to right, #c17238, #fde791)",
                      color: "#683d1e",
                      boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                    }}
                  >
                    Sign In
                  </button>
                </form>
              ) : (
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="min-h-[180px]">
                    <AnimatePresence mode="wait">
                      {signUpStep === 1 && (
                        <motion.div
                          key="step1"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.3 }}
                          className="space-y-4"
                        >
                          <Input
                            label="Email Address"
                            name="email"
                            type="email"
                            value={signUpData.email}
                            onChange={handleSignUpChange}
                          />
                        </motion.div>
                      )}

                      {signUpStep === 2 && (
                        <motion.div
                          key="step2"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.3 }}
                          className="space-y-4"
                        >
                          <p className="text-sm text-center text-white/70 mb-1">
                            OTP sent to {signUpData.email}
                          </p>
                          <div className="bg-white/5 border border-white/20 rounded-lg p-3 mb-2">
                            <p className="text-xs text-white/60 text-center">
                              💡 Check your spam folder if you don't see the
                              email
                            </p>
                          </div>
                          <Input
                            label="Enter OTP"
                            name="otp"
                            value={signUpData.otp}
                            onChange={handleSignUpChange}
                          />
                        </motion.div>
                      )}

                      {signUpStep === 3 && (
                        <motion.div
                          key="step3"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.3 }}
                          className="space-y-4"
                        >
                          <Input
                            label="Set Password"
                            name="password"
                            type="password"
                            value={signUpData.password}
                            onChange={handleSignUpChange}
                          />
                          <Input
                            label="Confirm Password"
                            name="confirmPassword"
                            type="password"
                            value={signUpData.confirmPassword}
                            onChange={handleSignUpChange}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 mt-2 rounded-lg font-semibold transition-all hover:opacity-95 active:scale-[0.98] cursor-pointer"
                    style={{
                      background: "linear-gradient(to right, #c17238, #fde791)",
                      color: "#683d1e",
                      boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                    }}
                  >
                    {signUpStep === 1
                      ? "Send OTP"
                      : signUpStep === 2
                      ? "Verify OTP"
                      : "Create Account"}
                  </button>
                </form>
              )}

              <div className="mt-4 text-center text-sm text-white/80">
                {isSignIn ? (
                  <>
                    Don't have an account?{" "}
                    <button
                      onClick={() => {
                        setIsSignIn(false);
                        setSignUpStep(1);
                      }}
                      className="text-[#fde791] font-semibold underline hover:text-[#fde791]/80 cursor-pointer transition"
                    >
                      Sign Up
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{" "}
                    <button
                      onClick={() => {
                        setIsSignIn(true);
                        setSignUpStep(1);
                      }}
                      className="text-[#fde791] font-semibold underline hover:text-[#fde791]/80 cursor-pointer transition"
                    >
                      Sign In
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
