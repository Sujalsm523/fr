import { useState } from "react";
import {
  FiHome,
  FiInfo,
  FiMail,
  FiUser,
  FiChevronDown,
  FiLogIn,
  FiLogOut,
  FiNavigation,
  FiX,
  FiSettings,
  FiMenu,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import GenerateButton from "./Buttons/GenerateButton";
import { useScrollContext } from "../context/ScrollContext";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";
import ContactModal from "./modals/ContactModal";

// Profile Modal Component
const ProfileModal = ({ isOpen, onClose, user }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Blur Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] transition-all duration-300"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
        <div
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 scale-100"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-[#633A1C]">
              Profile Details
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
            >
              <FiX className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 space-y-4">
            {/* Profile Avatar */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#633a1c] to-[#c17238] flex items-center justify-center text-white">
                <FiUser className="w-8 h-8" />
              </div>
            </div>

            {/* User Details */}
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <label className="text-sm font-medium text-gray-500 block mb-1">
                  User ID
                </label>
                <p className="text-[#633A1C] font-medium">
                  {user?.user_id || user?.name || "Not Available"}
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <label className="text-sm font-medium text-gray-500 block mb-1">
                  Credits
                </label>
                <p className="text-[#633A1C] font-medium">
                  {user?.furnos || "Not Available"}
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <label className="text-sm font-medium text-gray-500 block mb-1">
                  Member Since
                </label>
                <p className="text-[#633A1C] font-medium">
                  {user?.created_at
                    ? new Date(user.created_at).toLocaleDateString()
                    : "Recently"}
                </p>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="p-6 border-t border-gray-100">
            <button
              onClick={onClose}
              className="w-full px-4 py-2 cursor-pointer bg-[#633A1C] text-white rounded-lg hover:bg-[#c17238] transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

const Navbar = () => {
  const {
    showUserLogin,
    setShowUserLogin,
    user,
    setUser,
    navigate,
    axios,
    setShowAuthModal,
  } = useAuthContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // State for contact modal
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const openContactModal = () => setIsContactModalOpen(true);
  const closeContactModal = () => setIsContactModalOpen(false);

  // Use scroll context
  const { navigateToPosition, scrollProgress } = useScrollContext();

  // Modal state
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const handleLogout = () => {
    // Clear user data
    setUser(null);
    setShowUserLogin(false);

    // Clear cookies/tokens
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    // Remove authorization header from Axios
    delete axios.defaults.headers.common["Authorization"];

    // Show success message
    toast.success("Logged out successfully");
    navigate("/");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Navigation functions
  const goToHome = () => navigateToPosition(0);
  const goToAbout = () => navigateToPosition(0.93);

  // Profile modal functions
  const openProfileModal = () => setIsProfileModalOpen(true);
  const closeProfileModal = () => setIsProfileModalOpen(false);

  // // Studio access with authentication check
  // const handleStudioAccess = () => {
  //   if (!showUserLogin || !user) {
  //     // Store the intended destination for after login
  //     localStorage.setItem("redirectAfterLogin", "/studio");
  //     toast("First sign in to access Furno Studio", {
  //       style: {
  //         border: "1px solid #713200",
  //         padding: "16px",
  //         color: "#713200",
  //       },
  //       iconTheme: {
  //         primary: "#713200",
  //         secondary: "#FFFAEE",
  //       },
  //     });
  //     navigate("/signin");
  //   } else {
  //     // User is authenticated, proceed to studio
  //     navigate("/studio");
  //   }
  // };

  return (
    <>
      {/* Mobile View */}
      <div className="lg:hidden fixed top-6 right-6 z-[100]">
        <button
          className="p-2 rounded-full bg-white/30 backdrop-blur-lg border border-white/20 shadow-lg hover:bg-white/50 transition-all duration-300"
          onClick={toggleMenu}
        >
          {isMenuOpen ? (
            <FiX className="w-6 h-6 text-[#F5F7DB]" />
          ) : (
            <FiMenu className="w-6 h-6 text-[#F5F7DB]" />
          )}
        </button>
      </div>

      {/* Desktop View */}
      <div className="hidden lg:block absolute top-2 right-2 w-max mx-auto bg-white/30 backdrop-blur-lg rounded-full border border-white/20 shadow-lg z-50 text-[0.85rem]">
        <div className="flex items-center justify-between p-1 gap-4">
          {/* Navigation Links */}
          <div className="flex items-center gap-2">
            <button
              onClick={goToHome}
              className="flex items-center border-2 border-yellow px-3 py-2 rounded-full text-gray-700 hover:bg-white/30 transition-all duration-300 group cursor-pointer bg-white/50"
            >
              <FiHome className="w-4 h-4 mr-2 text-[#633A1C] transition-colors" />
              <span className="font-medium text-[#633A1C] transition-colors">
                Home
              </span>
            </button>

            <button
              onClick={goToAbout}
              className="flex border-2 border-yellow items-center px-3 py-2 rounded-full text-gray-700 hover:bg-white/30 transition-all duration-300 group cursor-pointer bg-white/50"
            >
              <FiInfo className="w-4 h-4 mr-2 text-[#633A1C] transition-colors" />
              <span className="font-medium text-[#633A1C] transition-colors">
                About Us
              </span>
            </button>

            <button
              onClick={openContactModal}
              className="flex border-2 border-yellow items-center px-3 py-2 rounded-full text-gray-700 hover:bg-white/30 transition-all duration-300 group cursor-pointer bg-white/50"
            >
              <FiMail className="w-4 h-4 mr-2 text-[#633A1C] transition-colors" />
              <span className="font-medium text-[#633A1C] transition-colors">
                Contact
              </span>
            </button>
            {/* Progress Indicator */}
            <div className="border-2 border-yellow px-3 py-2 rounded-full bg-white/50">
              <div className="flex items-center gap-2">
                <FiNavigation className="w-3 h-3 text-[#633A1C]" />
                <span className=" text-[#633A1C]">
                  {(scrollProgress * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center gap-3">
            <GenerateButton />

            {/* User Profile */}
            <div className="relative group">
              <button className="flex items-center justify-center gap-2 border-3 border-yellow px-1 py-1 rounded-full bg-white/80 hover:bg-white transition-all duration-300 border border-gray-200 shadow-sm cursor-pointer">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#633a1c] to-[#c17238] flex items-center justify-center text-white">
                  <FiUser className="w-3 h-3" />
                </div>
                <span className="font-medium text-[#633A1C]">
                  {showUserLogin ? user?.name || "My Account" : "Account"}
                </span>
                <FiChevronDown className="w-4 h-4 text-gray-500 transition-transform group-hover:rotate-180" />
              </button>

              {/* Dropdown Menu - Enhanced (Settings Removed) */}
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-1 group-hover:translate-y-0 border border-gray-100 overflow-hidden z-50">
                {showUserLogin ? (
                  // Logged In State
                  <>
                    <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-[#fde791]/20 to-[#c17238]/20">
                      <p className="text-sm font-medium text-[#633A1C]">
                        Welcome, {user?.user_id || "User"}!
                      </p>
                      <p className="text-xs text-[#633A1C] truncate">
                        {user?.email || "Premium Member"}
                      </p>
                    </div>

                    {/* Profile - Opens Modal */}
                    <button
                      onClick={openProfileModal}
                      className="flex w-full items-center px-3 py-2 text-gray-700 hover:bg-[#fde791]/10 transition-colors cursor-pointer"
                    >
                      <FiUser className="w-4 h-4 mr-3 text-[#633A1C]" />
                      <span className="text-[#633A1C]">Profile</span>
                    </button>

                    <div className="border-t border-gray-100 my-1"></div>

                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center px-3 py-2 text-gray-700 hover:bg-[#fde791]/10 transition-colors cursor-pointer"
                    >
                      <FiLogOut className="w-4 h-4 mr-3 text-[#633A1C]" />
                      <span className="text-[#633A1C]">Logout</span>
                    </button>
                  </>
                ) : (
                  // Logged Out State
                  <>
                    <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-[#fde791]/20 to-[#c17238]/20">
                      <p className="text-sm font-medium text-[#633A1C]">
                        Welcome to FURNO.AI
                      </p>
                      <p className="text-xs text-[#633A1C]">
                        Sign in to access all features
                      </p>
                    </div>

                    <button
                      onClick={() => setShowAuthModal(true)}
                      className="flex items-center px-3 py-2 text-gray-700 hover:bg-[#fde791]/10 transition-colors cursor-pointer"
                    >
                      <FiLogIn className="w-4 h-4 mr-3 text-[#633A1C]" />
                      <span className="text-[#633A1C]">Sign In</span>
                    </button>

                    <div className="border-t border-gray-100 my-1"></div>

                    {/* <Link
                      to="/signup"
                      className="flex items-center px-3 py-2 text-gray-700 hover:bg-[#fde791]/10 transition-colors cursor-pointer"
                    >
                      <FiUser className="w-4 h-4 mr-3 text-[#633A1C]" />
                      <span className="text-[#633A1C]">Create Account</span>
                    </Link> */}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`lg:hidden fixed top-0 right-0 h-full w-1/2 bg-transparent z-[99] transition-transform duration-300 transform ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        } shadow-lg`}
      >
        <div className="flex flex-col items-end justify-center h-full gap-8 px-6">
          <button
            className="flex items-center border-2 border-yellow px-6 py-3 rounded-full text-gray-700 bg-gray-200 transition-all duration-300"
            onClick={() => {
              goToHome();
              toggleMenu();
            }}
          >
            <FiHome className="w-5 h-5 mr-3 text-[#633A1C]" />
            <span className="text-lg font-medium text-[#633A1C]">Home</span>
          </button>

          <button
            className="flex whitespace-nowrap items-center border-2 border-yellow px-6 py-3 rounded-full text-gray-700 bg-gray-200 transition-all duration-300"
            onClick={() => {
              goToAbout();
              toggleMenu();
            }}
          >
            <FiInfo className="w-5 h-5 mr-3 text-[#633A1C]" />
            <span className="text-lg font-medium text-[#633A1C]">About Us</span>
          </button>

          <button
            onClick={() => {
              openContactModal();
              toggleMenu();
            }}
            className="flex items-center border-2 border-yellow px-6 py-3 rounded-full text-gray-700 bg-gray-200 transition-all duration-300"
          >
            <FiMail className="w-5 h-5 mr-3 text-[#633A1C]" />
            <span className="text-lg font-medium text-[#633A1C]">Contact</span>
          </button>

          {/* Account Section */}

          {showUserLogin ? (
            // Logged In State
            <>
              <button
                className="flex items-center border-2 border-yellow px-6 py-3 text-gray-700 bg-gray-200  transition-colors cursor-pointer rounded-full"
                onClick={openProfileModal}
              >
                <FiUser className="w-5 h-5 mr-3 text-[#633A1C]" />
                <span className="text-[#633A1C]">Profile</span>
              </button>

              <button
                onClick={() => {
                  handleLogout();
                  toggleMenu();
                }}
                className="flex w-full items-center  border-2 border-yellow bg-gray-200  px-6 py-3 text-gray-700 transition-colors cursor-pointer rounded-full"
              >
                <FiLogOut className="w-5 h-5 mr-3 text-[#633A1C]" />
                <span className="text-[#633A1C]">Logout</span>
              </button>
            </>
          ) : (
            // Logged Out State
            <>
              <button
                onClick={() => {
                  setShowAuthModal(true);
                  toggleMenu();
                }}
                className="flex items-center border-2 border-yellow px-4 py-3 bg-gray-200 text-gray-700 transition-colors cursor-pointer rounded-full"
              >
                <FiLogIn className="w-5 h-5 mr-3 text-[#633A1C]" />
                <span className="text-[#633A1C] whitespace-nowrap">
                  Sign In
                </span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Contact Modal */}
      <ContactModal isOpen={isContactModalOpen} onClose={closeContactModal} />
      {/* Profile Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={closeProfileModal}
        user={user}
      />
    </>
  );
};

export default Navbar;
