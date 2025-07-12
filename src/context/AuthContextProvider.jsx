import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import axios from "axios";
import { useEffect, useState } from "react";
import { getCookie } from "../utils/cookie";
import AuthModal from "../components/modals/AuthModal";
import toast from "react-hot-toast";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const AuthContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [redirectPath, setRedirectPath] = useState("/");

  // User State
  const [user, setUser] = useState(null);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [userCredits, setUserCredits] = useState(0);
  const [currentSceneId, setCurrentSceneId] = useState();

  // ===== AUTHENTICATION FUNCTIONS =====

  // Fetch User auth Status
  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/is-auth");

      if (data.success) {
        const user = {
          user_id: data.user_id,
          furnos: data.max_models_allowed,
        };
        toast.success("Authenticated");
        setUser(user);
        setShowUserLogin(true);
        setUserCredits(user.furnos);

        // Only set currentSceneId if last_scene_id exists in response
        if (data.last_scene_id != null) {
          // Checks for both undefined and null
          // setCurrentSceneId(data.last_scene_id);
        }

        return true;
      } else {
        setUser(null);
        toast.error(data.message || "Authentication failed");
        return false;
      }
    } catch (error) {
      setUser(null);
      toast.error(
        error.response?.data?.message || error.message || "Authentication error"
      );
      return false;
    }
  };

  // ===== INITIALIZATION =====

  useEffect(() => {
    const token = getCookie("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      fetchUser(); // Fetch user if token exists
      console.log("welcome to furno.ai website user");
      // console.log(currentSceneId);
    } else {
      console.log("welcome to furno.ai website non user");
    }
  }, []);

  // ===== CONTEXT VALUE =====

  const authContextValue = {
    navigate,
    showAuthModal,
    setShowAuthModal,
    redirectPath,
    setRedirectPath,
    user,
    setUser,
    showUserLogin,
    setShowUserLogin,
    userCredits,
    setUserCredits,
    axios,
    currentSceneId,
    setCurrentSceneId,
  };
  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
      <AuthModal />
    </AuthContext.Provider>
  );
};
