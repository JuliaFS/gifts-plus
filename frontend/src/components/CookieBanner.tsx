"use client";

import { useState, useEffect } from "react";

// Define a type for the banner's status for better readability
type BannerStatus = "visible" | "hidden" | "dismissed";

export default function CookieBanner() {
  const [status, setStatus] = useState<BannerStatus>("hidden");

  useEffect(() => {
    // Check local storage to see if user has already consented
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      // Delay slightly for a smoother entrance animation
      const timer = setTimeout(() => {
        setStatus("visible");
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleConsent = (consentType: "accepted" | "declined") => {
    localStorage.setItem("cookie-consent", consentType);
    // Animate out
    setStatus("hidden");
    // After animation, fully remove from DOM
    setTimeout(() => {
      setStatus("dismissed");
    }, 700); // Should match transition duration
  };

  if (status === "dismissed") return null;

  return (
    <div
      className={`fixed bottom-6 right-6 z-[100] max-w-sm w-full p-4 transition-all duration-700 ease-out transform ${
        status === "visible" ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      }`}
    >
      <div className="bg-white/90 backdrop-blur-md border border-gray-100 shadow-2xl rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-2xl">🍪</span>
          <h3 className="font-bold text-gray-900 text-lg">Cookie Consent</h3>
        </div>

        <p className="text-gray-600 text-sm mb-6 leading-relaxed">
          We use cookies to ensure you get the best experience on our website.
          By continuing, you agree to our use of cookies.
        </p>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleConsent("declined")}
            className="px-4 py-2.5 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
          >
            Decline
          </button>
          <button
            onClick={() => handleConsent("accepted")}
            className="px-4 py-2.5 text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-lg shadow-purple-500/20 transition-all hover:scale-[1.02] active:scale-95"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}