"use client";

import { useState, useEffect } from "react";
import { useCurrentUser } from "./useCurrentUser";

export function useAuthGuard() {
  const { data: currentUser } = useCurrentUser();
  const [showMessage, setShowMessage] = useState(false);

  const guard = (callback: () => void) => {
    if (!currentUser) {
      setShowMessage(true);
      return;
    }

    callback();
  };

  useEffect(() => {
    if (showMessage) {
      const timer = setTimeout(() => {
        setShowMessage(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [showMessage]);

  return { guard, showMessage, currentUser };
}

