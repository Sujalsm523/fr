import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";
import { Mail, Phone, X } from "lucide-react";
import Lottie from "lottie-react";
import contactAnimation from "../../assets/lootieAnimation/Contact.json";

const Input = ({ label, name, value, onChange, textarea = false }) => (
  <div>
    <label className="block text-sm text-white/80 mb-1">{label}</label>
    {textarea ? (
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2.5 max-md:px-0 max-md:py-0 rounded-lg bg-white/10 border border-[#fde791]/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#fde791]/50"
        required
        rows={2}
      />
    ) : (
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2.5 max-md:px-2 max-md:py-1 rounded-lg bg-white/10 border border-[#fde791]/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#fde791]/50"
        required
      />
    )}
  </div>
);

const ContactModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success("Message sent successfully!");

      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        message: "",
      });

      // Close modal after delay
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-1000 flex items-center justify-center p-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Blurred background overlay */}
        <motion.div
          className="absolute inset-0 bg-black/50"
          onClick={onClose}
        />

        {/* Modal content */}
        <motion.div
          className="
            relative w-full 
            max-w-lg 
            md:max-w-2xl 
            lg:max-w-4xl 
            rounded-2xl shadow-2xl z-10
          "
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <button
            className="absolute top-4 right-4 text-white/80 hover:text-white z-20 cursor-pointer"
            onClick={onClose}
          >
            <X className="w-6 h-6" />
          </button>

          <div className="flex flex-col p-4 max-md:p-2 bg-white/30 backdrop-blur-xl border border-white/40 rounded-2xl">
            <div className="text-center mb-6 max-md:mb-2">
              <h2 className="text-2xl font-semibold text-[#fde791] mb-1">
                Let's Connect
              </h2>
              <p className="text-sm text-white/80">
                We'd love to hear from you
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-4">
              {/* Left Info */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col justify-between bg-white/10 p-4 max-md:p-2 md:p-3 rounded-2xl border border-[#fde791]/30"
              >
                <div className="md:space-y-6 ">
                  <div>
                    <h3 className="text-lg font-medium text-[#fde791] mb-3 max-md:mb-1">
                      Contact Information
                    </h3>
                    <div className="flex items-center text-white/80 mb-3 max-md:mb-1">
                      <Mail className="mr-2 w-5 h-5 text-[#fde791]" />
                      <span>contact@furno.ai</span>
                    </div>
                    <div className="flex items-center text-white/80">
                      <Phone className="mr-2 w-5 h-5 text-[#fde791]" />
                      <span>+1 (555) 123-4567</span>
                    </div>
                  </div>

                  <p className="text-sm  max-md:hidden text-white/60 mt-6">
                    We're here to answer any questions you may have. Don't
                    hesitate to reach out!
                  </p>
                </div>

                {/* Lottie Animation */}
                <div className="mt-6 max-md:hidden flex justify-center">
                  <Lottie
                    animationData={contactAnimation}
                    loop={true}
                    className="w-32 h-32 md:w-28 md:h-28 lg:w-48 lg:h-48"
                  />
                </div>
              </motion.div>

              {/* Form */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <form
                  onSubmit={handleSubmit}
                  className="space-y-4 max-md:space-y-1"
                >
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input
                      label="First Name"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                    />
                    <Input
                      label="Last Name"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                    />
                  </div>

                  <Input
                    label="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />

                  <Input
                    label="Phone"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                  />

                  <Input
                    label="Message"
                    name="message"
                    textarea={true}
                    value={formData.message}
                    onChange={handleChange}
                  />

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-3 mt-2 rounded-lg font-semibold transition-all cursor-pointer ${
                      isSubmitting
                        ? "opacity-70"
                        : "hover:opacity-90 active:scale-[0.98]"
                    }`}
                    style={{
                      background: "linear-gradient(to right, #c17238, #fde791)",
                      color: "#683d1e",
                      boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                    }}
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </button>
                </form>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ContactModal;
