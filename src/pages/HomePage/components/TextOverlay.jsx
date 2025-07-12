import React, { useState, useEffect, useRef } from "react";
import { FaLinkedin, FaEnvelope, FaArrowRight } from "react-icons/fa";
import toast from "react-hot-toast";
import { FaAnglesDown } from "react-icons/fa6";
import { useAuthContext } from "../../../context/AuthContext";
import GenerateButton from "../../../components/Buttons/GenerateButton";
import ContactModal from "../../../components/modals/ContactModal";

const ScrollIndicator = ({ show }) => {
  const [animateUp, setAnimateUp] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimateUp((prev) => !prev);
    }, 800); // Faster animation

    return () => clearInterval(interval);
  }, []);

  if (!show) return null;

  return (
    <>
      <div className="fixed left-[50%] max-sm:translate-x-[-50%] max-sm:hidden top-3/4 z-40 sm:left-2/3 sm:top-2/3 md:left-3/4 md:top-3/4 lg:left-4/5 lg:top-4/5 xl:left-[80%] xl:top-[70%]">
        {/* Responsive positioning across different screen sizes */}
        <div
          className={`transition-transform duration-600 flex flex-col items-center ease-in-out ${
            animateUp ? "transform -translate-y-3" : "transform translate-y-0"
          }`}
        >
          <FaAnglesDown className="w-6 h-6  md:w-10 md:h-10  text-yellow mb-1" />
        </div>
        <p className="text-center text-white text-base sm:text-lg md:text-xl mt-2">
          scroll down
        </p>
      </div>
      <div className="fixed left-[50%] max-sm:translate-x-[-50%] max-sm:block sm:hidden top-3/4 z-40 sm:left-2/3 sm:top-2/3 md:left-3/4 md:top-3/4 lg:left-4/5 lg:top-4/5 xl:left-[80%] xl:top-[70%]">
        {/* Responsive positioning across different screen sizes */}
        <div
          className={`transition-transform duration-600 flex flex-col items-center ease-in-out ${
            animateUp ? "transform -translate-y-3" : "transform translate-y-0"
          }`}
        >
          <FaAnglesDown className="w-6 h-6  md:w-10 md:h-10  text-yellow mb-1" />
        </div>
        <p className="text-center text-white text-base sm:text-lg md:text-xl mt-2">
          scroll down
        </p>
      </div>
    </>
  );
};

const TextOverlay = ({ scrollProgress }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [currentView, setCurrentView] = useState("text");

  // State for contact modal
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const openContactModal = () => setIsContactModalOpen(true);
  const closeContactModal = () => setIsContactModalOpen(false);

  const [animation, setAnimation] = useState({
    opacity: 1,
    translateY: 0,
    scale: 1,
  });
  const timeoutRef = useRef(null);
  const isAnimating = useRef(false);
  const { showUserLogin, user, navigate } = useAuthContext();
  // Studio access with authentication check
  const handleStudioAccess = () => {
    if (!showUserLogin || !user) {
      // Store the intended destination for after login
      localStorage.setItem("redirectAfterLogin", "/studio");
      toast("First sign in to access Furno Studio", {
        style: {
          border: "1px solid #713200",
          padding: "16px",
          color: "#713200",
        },
        iconTheme: {
          primary: "#713200",
          secondary: "#FFFAEE",
        },
      });
      navigate("/signin");
    } else {
      // User is authenticated, proceed to studio
      navigate("/studio");
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const segments = [
    {
      heading: "REVOLUTIONIZING FURNITURE WITH AI AND DESIGN!",
      description: "Handcrafted furniture designed for modern living spaces",
    },
    {
      heading: "Sustainable Materials",
      description: "Ethically sourced wood with eco-friendly finishes",
    },
    {
      heading: "Artisan Craftsmanship",
      description: "Each piece meticulously finished by master craftsmen",
    },
    {
      heading: "Tailored to Your Space",
      description: "Custom sizing and configuration options available",
    },
  ];

  const founders = [
    {
      name: "Abhay Gilda",
      title: "Co-Founder/CEO",
      social: [
        { type: "linkedin", url: "https://linkedin.com/in/abhaygilda" },
        { type: "email", url: "mailto:abhay@furno.ai" },
      ],
      img: "/founders/ab.jpg",
    },
    {
      name: "Rishi Basantwani",
      title: "Co-Founder/CMO",
      social: [
        { type: "linkedin", url: "https://linkedin.com/in/rishibasantwani" },
        { type: "email", url: "mailto:rishi@furno.ai" },
      ],
      img: "/founders/ri.jpg",
    },
  ];

  const aboutContent = {
    heading: "About Us",
    description: `At FURNO.AI, we are on a mission to transform the way people design and experience their interiors.

Born out of a passion for innovation and a deep understanding of the furniture and interior industry, FURNO.AI is India's first AI-powered interior and furniture design platform that empowers users to create personalized, immersive living spaces effortlessly.

Whether you're a homeowner looking to visualize your dream bedroom, or a designer seeking AI-powered efficiency, our platform brings your imagination to life — from floor to ceiling, wall textures to modular furniture.

With real-time 3D visualization, smart customization, and Augmented Reality (AR) integration, FURNO.AI lets users walk through their future rooms virtually and make confident decisions about designs, finishes, and layouts.

We believe great design should be accessible, interactive, and inspired by you. That's why we're combining cutting-edge AI, intuitive design tools, and a deep industry understanding to reshape the future of interior design — one room at a time.

Welcome to the future of home design. Welcome to FURNO.AI.`,
    stats: [
      { value: "10K+", label: "Homes Transformed" },
      { value: "150+", label: "Master Craftsmen" },
      { value: "12", label: "International Awards" },
    ],
  };

  const contactContent = {
    heading: "Let's Create Together",
    description:
      "Have questions or ready to start your custom furniture project? Our design consultants are here to help.",
  };

  useEffect(() => {
    if (isAnimating.current) return;
    let newView = "text";
    if (scrollProgress >= 0.92 && scrollProgress < 0.96) newView = "founders";
    else if (scrollProgress >= 0.96 && scrollProgress < 0.98) newView = "about";
    else if (scrollProgress >= 0.98) newView = "contact";

    if (newView !== currentView) {
      isAnimating.current = true;
      setAnimation({ opacity: 0, translateY: -20, scale: 0.95 });
      timeoutRef.current = setTimeout(() => {
        setCurrentView(newView);
        setAnimation({ opacity: 0, translateY: 20, scale: 0.95 });
        timeoutRef.current = setTimeout(() => {
          setAnimation({ opacity: 1, translateY: 0, scale: 1 });
          isAnimating.current = false;
        }, 20);
      }, 300);
    }
  }, [scrollProgress, currentView]);

  useEffect(() => {
    if (currentView !== "text" || isAnimating.current) return;
    let newIndex = activeIndex;
    if (scrollProgress < 0.92) newIndex = 0;
    if (newIndex !== activeIndex) {
      isAnimating.current = true;
      setAnimation((prev) => ({ ...prev, opacity: 0, translateY: -15 }));
      timeoutRef.current = setTimeout(() => {
        setActiveIndex(newIndex);
        setAnimation((prev) => ({ ...prev, opacity: 0, translateY: 25 }));
        timeoutRef.current = setTimeout(() => {
          setAnimation((prev) => ({ ...prev, opacity: 1, translateY: 0 }));
          isAnimating.current = false;
        }, 20);
      }, 300);
    }
  }, [scrollProgress, activeIndex, currentView]);

  const renderCurrentView = () => {
    switch (currentView) {
      case "founders":
        return (
          <div className="bg-brown-dark/20 backdrop-blur-xl border border-yellow-600 md:border-yellow/40 rounded-2xl p-4 max-w-4xl w-full mx-0 md:mx-4 shadow-2xl h-fit">
            {/* Title */}
            <h2 className="text-4xl sm:text-5xl md:text-3xl font-bold text-white md:text-yellow mt-4 sm:mt-20 md:mt-0  md:ml-0 mb-6 uppercase leading-tight">
              MEET THE <br className="hidden sm:block" /> FOUNDERS
            </h2>

            {/* Cards: horizontal scroll on mobile, wrap on large screens */}
            <div className="flex flex-row md:flex-wrap overflow-x-auto md:overflow-visible gap-6 md:gap-10 pb-4">
              {founders.map((founder, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-[140px] sm:w-[230px] md:w-sm flex flex-col text-center items-center"
                >
                  <div className="relative rounded-xl bg-brown/20 border-2 border-brown aspect-[14/14] md:aspect-[14/15] w-full mb-4 flex items-center justify-center overflow-hidden">
                    <img
                      src={founder.img}
                      alt={founder.name}
                      className="w-full h-full object-cover hover:scale-[1.05] cursor-pointer transition-transform duration-500"
                    />
                    <div className="absolute w-full h-full inset-0 bg-gradient-to-t from-black/70 from-20% to-transparent to-35% pointer-events-none"></div>
                    <div className="absolute h-full pointer-events-none justify-between items-center inset-0 w-full">
                      <div className="w-full h-full relative">
                        <div className="flex flex-col justify-start items-start absolute left-3 md:left-4 bottom-6 md:bottom-1">
                          <h3 className="text-sm sm:text-2xl font-semibold text-yellow drop-shadow-md">
                            {founder.name}
                          </h3>
                          <p className="text-white/90 mb-2 text-sm sm:text-sm drop-shadow-sm">
                            {founder.title}
                          </p>
                        </div>
                        <div className="flex gap-2 md:gap-3 mt-1 absolute bottom-1 right-10 md:right-4 md:bottom-4 pointer-events-auto">
                          {founder.social.map((social, i) => (
                            <a
                              key={i}
                              href={social.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-yellow p-1 md:p-3 rounded-full hover:bg-yellow/90 transition-all"
                              aria-label={`${social.type} link`}
                            >
                              {social.type === "linkedin" ? (
                                <FaLinkedin className="text-brown-dark md:text-xl" />
                              ) : (
                                <FaEnvelope className="text-brown-dark md:text-xl" />
                              )}
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* About Us button */}
            <div className="flex block md:hidden justify-center md:justify-start">
              <button className="flex items-center gap-2 bg-gray-300 text-white px-6 py-3 md:px-6 md:py-2 rounded-full text-xl font-semibold shadow-md hover:bg-yellow/90 transition-all">
                About Us
                <span className="rounded-full bg-white/40 p-2">
                  <FaArrowRight className="text-white text-xl md:text-base" />
                </span>
              </button>
            </div>
          </div>
        );

      case "about":
        return (
          <div className=" bg-brown-dark/30 backdrop-blur-xl border border-yellow/40 rounded-3xl  p-2 md:p-6 max-w-4xl w-full md:mx-2 shadow-2xl">
            <h2 className=" text-3xl md:text-4xl font-bold text-white text-center mb-2 md:mb-6">
              {aboutContent.heading}
            </h2>
            <p className="text-sm md:text-lg text-white/90 text-left md:text-center max-w-3xl mx-auto mb-0 md:mb-10">
              {aboutContent.description}
            </p>
            <div className="mt-4 md:mt-10 pt-3 md:pt-6 border-t border-yellow/30">
              <p className="text-center text-md md:text-xl text-yellow italic">
                REVOLUTIONIZING FURNITURE WITH AI AND DESIGN!
              </p>
            </div>
          </div>
        );

      case "contact":
        return (
          <div className="bg-brown-dark/20 backdrop-blur-xl pointer-events-auto border border-yellow/40 rounded-3xl p-6 max-w-3xl w-full md:mx-4 shadow-2xl flex flex-col">
            <div className="flex-grow">
              <h2 className="text-4xl font-bold text-yellow text-center mb-6">
                Contact Us
              </h2>
              <p className="text-lg text-white/90 text-center max-w-2xl mx-auto mb-8">
                {contactContent.description}
              </p>

              <div className="flex justify-center">
                <button
                  onClick={openContactModal}
                  className="flex cursor-pointer items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl text-lg font-semibold"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  Contact Us
                </button>
              </div>
            </div>
            <div className="mt-8 bg-brown/30 backdrop-blur-sm rounded-2xl p-4 border border-yellow/30">
              <p className="text-yellow text-center mb-4 text-xl">
                Follow our journey:
              </p>
              <span className="ml-2 inline-flex gap-3 flex-wrap justify-center w-full">
                <button
                  onClick={() =>
                    window.open("https://www.instagram.com/furno.ai", "_blank")
                  }
                  className="flex cursor-pointer items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:from-pink-600 hover:to-purple-600 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Instagram
                </button>

                <button
                  onClick={() =>
                    window.open(
                      "https://www.linkedin.com/company/furno-ai",
                      "_blank"
                    )
                  }
                  className="flex cursor-pointer items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
                      clipRule="evenodd"
                    />
                  </svg>
                  LinkedIn
                </button>

                <button
                  onClick={() =>
                    (window.location.href = "mailto:contact@furno.ai")
                  }
                  className="flex cursor-pointer items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"
                      clipRule="evenodd"
                    />
                    <path
                      fillRule="evenodd"
                      d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Email
                </button>
              </span>
            </div>
          </div>
        );
      default:
        return (
          <div className="bg-brown-dark/20 order-yellow/30 rounded-2xl p-4 overflow-hidden transition-all duration-300 hover:bg-brown-dark/30 pl-8 md:pl-12">
            <div
              className="transition-all duration-500 flex items-start flex-col gap-7 ease-[cubic-bezier(0.25,0.1,0.25,1)]"
              style={{
                opacity: animation.opacity,
                transform: `translateY(${animation.translateY}px)`,
              }}
            >
              <h2 className="text-3xl md:text-6xl font-semibold text-yellow mb-3 leading-tight tracking-tight">
                {segments[activeIndex].heading}
              </h2>

              {/* Added FURNO STUDIO button */}
              <GenerateButton />
            </div>
          </div>
        );
    }
  };

  const getContainerClass = () => {
    switch (currentView) {
      case "text":
        return "absolute top-[25%] md:top-[50%] left-0 md:left-2 max-w-6xl z-50 pointer-events-none";
      case "founders":
      case "about":
      case "contact":
        return "fixed inset-1 flex items-center md:justify-center z-50 pointer-events-none p-4";
      default:
        return "";
    }
  };

  return (
    <>
      {/* Simple Scroll Indicator - Shows until 4% scroll progress */}
      <ScrollIndicator show={scrollProgress < 0.04} />

      {/* Main Content */}
      <div className={getContainerClass()}>
        <div
          className="transition-all  duration-500 ease-out"
          style={{
            opacity: animation.opacity,
            transform: `translateY(${animation.translateY}px) scale(${animation.scale})`,
            transitionProperty: "opacity, transform",
            transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          {renderCurrentView()}
        </div>
      </div>

      {/* Contact Modal */}
      <ContactModal isOpen={isContactModalOpen} onClose={closeContactModal} />
    </>
  );
};

export default TextOverlay;
