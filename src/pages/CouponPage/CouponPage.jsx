import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import emailjs from "@emailjs/browser";
import { useAuthContext } from "../../context/AuthContext";

const CouponPage = () => {
  const [couponCode, setCouponCode] = useState("");
  const [isApplied, setIsApplied] = useState(false);
  const [isInvalid, setIsInvalid] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [applyMessage, setApplyMessage] = useState("");
  const [formData, setFormData] = useState({
    from_name: "",
    from_email: "",
    from_phone: "",
    message: "",
  });
  const { user, axios } = useAuthContext();

  const handleApply = async () => {
    if (couponCode.trim() === "") return;
    setIsApplying(true);
    setIsApplied(false);
    setIsInvalid(false);
    setApplyMessage("");

    try {
      const { data } = await axios.post(
        "/validate-coupon",
        {
          user_id: user.user_id,
          coupon_code: couponCode,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (data.status) {
        setIsApplied(true);
        setIsInvalid(false);
      } else {
        setIsApplied(false);
        setIsInvalid(true);
      }
      setApplyMessage(data.message || "");
    } catch (error) {
      setIsApplied(false);
      setIsInvalid(true);
      setApplyMessage(
        error.response?.data?.message ||
          error.message ||
          "Coupon validation failed"
      );
    } finally {
      setIsApplying(false);
    }
  };

  const handleChange = (e) => {
    setCouponCode(e.target.value);
    setIsApplied(false);
    setIsInvalid(false);
    setApplyMessage("");
  };

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const templateParams = {
        to_email: "contact@furno.ai",
        from_name: formData.from_name,
        from_email: formData.from_email,
        from_phone: formData.from_phone,
        message: formData.message,
      };

      await emailjs.send(
        import.meta.env.VITE_APP_EMAILJS_SERVICE_ID, // service id
        import.meta.env.VITE_APP_EMAILJS_TEMPLATE_ID, // template id
        templateParams,
        import.meta.env.VITE_APP_EMAILJS_PUBLIC_KEY // public api
      );

      setShowToast(true);
      setIsModalOpen(false);
      setFormData({
        from_name: "",
        from_email: "",
        from_phone: "",
        message: "",
      });

      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    } catch (error) {
      console.error("Error sending email:", error);
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const instructions = [
    "Use your coupon code to claim Furnos that allow you to generate individual furniture or interior items",
    "Each item consumes one Furno. You can create unlimited scenes, but items generated in one scene are not shared across others",
    "Remaining Furnos are visible at the top-right corner of the app",
    "Generate unlimited textures for walls, floors, and ceilings using the same code",
    "Currently available coupons: 10 Furnos and 20 Furnos",
  ];

  return (
    <div
      className="min-h-screen flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden relative"
      style={{
        background:
          "linear-gradient(135deg, #583717 0%, #a86432 50%, #f0d58a 100%)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg shadow-lg z-50 text-sm"
          >
            Message sent successfully! 🎉
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top-right logo */}
      <div className="absolute top-3 right-3 sm:top-6 sm:right-6 z-10">
        <img
          src="/homepagelogo.svg"
          alt="Logo"
          className="w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 object-contain drop-shadow-xl"
        />
      </div>

      {/* Single centered column box */}
      <div className="relative w-full max-w-4xl rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden border border-[#fde791] sm:border-2">
        <div className="w-full h-full backdrop-blur-md bg-[#583717]/90 p-4 sm:p-8 flex flex-col items-center">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-6"
          >
            <h1 className="text-2xl md:text-3xl font-bold text-[#fde791] mb-2">
              Special Discount Offer
            </h1>
            <p className="text-white/90 max-w-md mx-auto text-base"></p>
          </motion.div>

          {/* Coupon input and actions */}
          <div className="w-4/5 flex flex-col gap-3 mb-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={couponCode}
                onChange={handleChange}
                placeholder="Enter coupon code"
                className="flex-1 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#fde791]/50 text-center sm:text-left text-base font-medium transition-all duration-200 hover:brightness-105"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleApply}
                className="py-2 px-6 rounded-lg cursor-pointer font-bold transition-all hover:opacity-95 active:scale-[0.98] shadow-lg whitespace-nowrap text-base"
                style={{
                  background: "linear-gradient(to right, #c17238, #fde791)",
                  color: "#583717",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
                }}
                disabled={couponCode.trim() === "" || isApplying}
              >
                {isApplying ? "Validating..." : "Apply Coupon"}
              </motion.button>
            </div>

            {isApplied && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="text-center p-3 rounded-lg bg-green-500/20 border border-green-400/30 "
              >
                <p className="text-green-400 font-medium text-base">
                  🎉{" "}
                  {applyMessage ||
                    "25% discount applied successfully! Your total has been updated."}
                </p>
              </motion.div>
            )}

            {isInvalid && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="text-center p-3 rounded-lg bg-red-500/20 border border-red-400/30"
              >
                <p className="text-red-200 font-medium text-base">
                  {applyMessage ||
                    "The coupon code you entered is invalid or has expired"}
                </p>
              </motion.div>
            )}
          </div>
          {/* Waiting List Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsModalOpen(true)}
            className="py-2 px-6 w-4/5 mb-2 cursor-pointer rounded-lg font-bold transition-all hover:opacity-95 active:scale-[0.98] shadow-lg text-base"
            style={{
              background: "linear-gradient(to right, #c17238, #fde791)",
              color: "#583717",
              boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
            }}
          >
            Join The Waiting List
          </motion.button>
          <p className="text-white/70 text-sm text-center mb-4">
            Click "Join the Waiting List" above to receive your coupon codes
          </p>
          {/* Instructions */}
          <div className="w-full mb-2">
            <h2 className="text-lg font-semibold text-[#fde791] mb-3 text-center">
              How Furnos Work
            </h2>
            <ul className="space-y-2">
              {instructions.map((instruction, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ scale: 1.02 }}
                  className="flex items-start transition-transform duration-150"
                >
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#c17238] flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                    {index + 1}
                  </span>
                  <span className="text-white/90 text-base leading-relaxed">
                    {instruction}
                  </span>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-[#583717] rounded-xl shadow-2xl w-full max-w-md relative max-h-[90vh] overflow-y-auto"
          >
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors bg-black/20 hover:bg-black/30 p-2 rounded-full"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 sm:h-5 sm:w-5"
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

            <div className="p-6">
              <h2 className="text-xl sm:text-2xl font-bold text-[#fde791] mb-4 sm:mb-6 text-center">
                Join Our Waiting List
              </h2>
              <form
                onSubmit={handleFormSubmit}
                className="space-y-3 sm:space-y-4"
              >
                <div>
                  <label className="block text-white/90 mb-1 sm:mb-2 text-sm">
                    Name
                  </label>
                  <input
                    type="text"
                    name="from_name"
                    value={formData.from_name}
                    onChange={handleFormChange}
                    required
                    className="w-full px-3 py-2 sm:px-4 sm:py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#fde791]/50 text-sm"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="block text-white/90 mb-1 sm:mb-2 text-sm">
                    Email
                  </label>
                  <input
                    type="email"
                    name="from_email"
                    value={formData.from_email}
                    onChange={handleFormChange}
                    required
                    className="w-full px-3 py-2 sm:px-4 sm:py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#fde791]/50 text-sm"
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <label className="block text-white/90 mb-1 sm:mb-2 text-sm">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="from_phone"
                    value={formData.from_phone}
                    onChange={handleFormChange}
                    required
                    className="w-full px-3 py-2 sm:px-4 sm:py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#fde791]/50 text-sm"
                    placeholder="Enter your phone number"
                  />
                </div>
                <div>
                  <label className="block text-white/90 mb-1 sm:mb-2 text-sm">
                    Description
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleFormChange}
                    required
                    className="w-full px-3 py-2 sm:px-4 sm:py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#fde791]/50 h-20 sm:h-24 resize-none text-sm"
                    placeholder="Tell us about your interest"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 sm:py-3 rounded-lg font-bold transition-all hover:opacity-95 active:scale-[0.98] shadow-lg relative text-sm sm:text-base"
                  style={{
                    background: "linear-gradient(to right, #c17238, #fde791)",
                    color: "#583717",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
                  }}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 text-[#583717]"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Sending...
                    </div>
                  ) : (
                    "Send"
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default CouponPage;
