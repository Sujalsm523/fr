import React, { useState, useEffect, useRef } from "react";
import { useProgress } from "@react-three/drei";

const LoadingScreen = () => {
  const { progress: rawProgress } = useProgress();
  const [displayProgress, setDisplayProgress] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isAnimationFinished, setIsAnimationFinished] = useState(false);
  const animationRef = useRef(null);
  const lastUpdateTime = useRef(performance.now());
  const completionTimeout = useRef(null);

  // Optimized progress animation
  useEffect(() => {
    if (rawProgress >= 100) return;

    const animate = () => {
      const now = performance.now();
      const delta = Math.min((now - lastUpdateTime.current) / 16, 1);

      setDisplayProgress((p) => {
        // Only update if the new progress is higher than current
        if (rawProgress > p) {
          const diff = rawProgress - p;
          const newProgress = p + diff * 0.5 * delta;
          return Math.min(newProgress, 99.9);
        }
        return p; // Keep current progress if new progress is lower
      });

      lastUpdateTime.current = now;
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [rawProgress]);

  // Handle loading completion
  useEffect(() => {
    if (rawProgress >= 100) {
      const animateToCompletion = () => {
        setDisplayProgress((p) => {
          // Ensure we only move forward
          const next = Math.max(p, Math.min(p + (100 - p) * 0.5, 100));

          if (next >= 99.99) {
            cancelAnimationFrame(animationRef.current);
            completionTimeout.current = setTimeout(() => {
              setIsRevealed(true);
            }, 100);
            return 100;
          }

          animationRef.current = requestAnimationFrame(animateToCompletion);
          return next;
        });
      };

      // Cancel any existing animations
      cancelAnimationFrame(animationRef.current);

      if (displayProgress < 100) {
        animationRef.current = requestAnimationFrame(animateToCompletion);
      } else {
        completionTimeout.current = setTimeout(() => {
          setIsRevealed(true);
        }, 100);
      }
    }

    return () => {
      if (completionTimeout.current) {
        clearTimeout(completionTimeout.current);
      }
    };
  }, [rawProgress, displayProgress]);

  // Handle final cleanup after reveal
  useEffect(() => {
    if (isRevealed) {
      const timeout = setTimeout(() => {
        setIsAnimationFinished(true);
      }, 700);
      return () => clearTimeout(timeout);
    }
  }, [isRevealed]);

  if (isAnimationFinished) return null;

  const Logo = () => (
    <div className="relative w-32 h-32 transition-all duration-700">
      <svg width="298" height="57" viewBox="0 0 298 57" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <defs>
          <linearGradient
            id="logo-gradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#fde791" />
            <stop offset={`${displayProgress}%`} stopColor="#fde791" />
            <stop offset={`${displayProgress}%`} stopColor="#c17238" />
            <stop offset="100%" stopColor="#c17238" />
          </linearGradient>
        </defs>
        <path d="M28.7764 10.3239H10.5676V22.436H27.6384V31.5404H10.5676V55.4395H0V1.2195H28.7764V10.3239Z" fill="url(#logo-gradient)"/>
        <path d="M64.1986 42.9981V54.6966C61.5641 55.5927 58.7069 56.0489 55.8235 56.0489C48.8331 56.0489 42.0044 53.3666 38.1031 48.2448C34.8513 44.0992 34.0384 38.8972 34.0384 33.7753V0.609894H44.6057V34.6699C44.6057 38.8155 45.9881 41.3352 47.2071 42.7176C48.7513 44.587 51.5969 46.4571 55.8234 46.4571C59.8387 46.4571 62.6075 44.7696 64.1986 42.9981Z" fill="url(#logo-gradient)"/>
        <path d="M89.8018 31.9869C92.4032 31.4999 94.3542 30.6053 95.7359 29.6298C99.9631 26.7849 102.077 22.1516 102.077 16.8671C102.077 12.8032 100.858 8.1698 96.7114 4.6739C94.1917 2.5603 90.3713 0.610001 82.8923 0.610001H80.6145V9.2263H80.9412C82.8922 9.2263 91.1842 9.3072 91.1842 17.3549C91.1842 25.3217 82.8114 25.5651 80.7786 25.5651H80.6145V33.7754C80.6145 34.3048 80.606 34.8226 80.5891 35.3288L93.5414 54.83H106.71L89.8018 31.9869Z" fill="url(#logo-gradient)"/>
        <path d="M77.6093 0.609894V33.7753C77.6093 38.8972 76.7964 44.0992 73.5446 48.2448C71.8879 50.4193 69.7042 52.1538 67.2037 53.4307V0.610001L77.6093 0.609894Z" fill="url(#logo-gradient)"/>
        <path d="M77.7712 47.2315V54.8299H70.7645C72.7718 53.5153 74.5194 51.9203 75.9218 50.0833C76.6138 49.1987 77.2318 48.2471 77.7712 47.2315Z" fill="url(#logo-gradient)"/>
        <path d="M108.579 55.4394V1.21941H115.895L148.899 37.3931V1.2193H159.466V55.4393H152.15L119.147 19.1843V55.4393L108.579 55.4394Z" fill="url(#logo-gradient)"/>
        <path d="M222.206 28.37C222.206 44.8717 210.338 56.6587 193.267 56.6587C176.196 56.6587 164.328 44.8717 164.328 28.37C164.328 11.8683 176.196 0 193.267 0C210.338 0 222.206 11.8683 222.206 28.37ZM211.313 28.37C211.313 17.3959 203.835 9.5921 193.267 9.5921C182.699 9.5921 175.221 17.3959 175.221 28.37C175.221 39.3441 182.699 47.0665 193.267 47.0665C203.835 47.0665 211.313 39.344 211.313 28.37Z" fill="url(#logo-gradient)"/>
        <path d="M224.644 43.815C228.221 43.815 230.984 46.5788 230.984 50.1556C230.984 53.7324 228.221 56.4961 224.644 56.4961C221.067 56.4961 218.303 53.7323 218.303 50.1556C218.303 46.5789 221.067 43.815 224.644 43.815Z" fill="url(#logo-gradient)"/>
        <path d="M270.182 44.0588H248.316L243.52 55.4393H232.058L255.388 1.2193H263.679L286.359 55.4393H274.979L270.182 44.0588ZM267.094 35.4422L259.371 15.9327L251.648 35.4422H267.094Z" fill="url(#logo-gradient)"/>
        <path d="M298 1.2193V55.4393H287.432V1.2193H298Z" fill="url(#logo-gradient)"/>
      </svg>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[999] bg-transparent overflow-hidden pointer-events-none">
      {/* Top Panel */}
      <div
        className={`absolute top-0 left-0 w-full h-1/2 bg-brown-dark transition-transform duration-700 ease-in-out ${
          isRevealed ? "-translate-y-full" : "translate-y-0"
        }`}
      />

      {/* Bottom Panel */}
      <div
        className={`absolute top-1/2 left-0 w-full h-1/2 bg-brown-dark transition-transform duration-700 ease-in-out ${
          isRevealed ? "translate-y-full" : "translate-y-0"
        }`}
      />

      {/* Logo + Progress */}
      <div className="absolute inset-0 flex flex-col justify-center items-center">
        <div
          className={`transition-all duration-700 ease-in-out ${
            isRevealed
              ? "opacity-0 scale-95 translate-y-5"
              : "opacity-100 scale-100 translate-y-0"
          }`}
        >
          <Logo />
        </div>

        {/* Progress Bar */}
        {!isRevealed && (
          <div className="absolute bottom-1/4 w-64">
            <div className="w-full h-1.5 bg-brown-dark bg-opacity-50 rounded-full overflow-hidden">
              <div
                className="h-full bg-yellow"
                style={{
                  width: `${displayProgress}%`,
                  transition: "width 50ms linear"
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingScreen;
