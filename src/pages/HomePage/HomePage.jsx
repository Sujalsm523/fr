import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <ScrollProvider>
      <div className="w-full h-screen overflow-hidden p-3 font-kalnia">
        <LoadingScreen />
        <div className="h-full w-full overflow-hidden rounded-2xl relative ">
          {/* left bar  */}
          <div className="w-fit absolute z-100 top-3 md:top-2 left-4 md:left-2 p-0.5 rounded-full bg-white/30 backdrop-blur-lg border border-white/20 shadow-lg ">
            <div className="rounded-full overflow-hidden relative w-30 h-10">
              <img
                src="/homepagelogo.svg"
                alt="Logo"
                className="w-full h-full object-cover absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              />
            </div>
          </div>

          <Navbar />

          {/* canvas  */}

          <Experience />
        </div>
      </div>
    </ScrollProvider>
  );
};

export default HomePage;
