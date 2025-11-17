
"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface Settings {
  upiId: string;
}

interface SettingsContextType {
  settings: Settings;
  setSettings: (settings: Settings) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>({
    upiId: "",
  });

  useEffect(() => {
    // Load settings from localStorage on initial render
    try {
        const storedSettings = localStorage.getItem('appSettings');
        if (storedSettings) {
            const parsedSettings = JSON.parse(storedSettings);
            if (parsedSettings) {
                setSettings(parsedSettings);
            }
        }
    } catch (error) {
        console.error("Failed to parse settings from localStorage", error);
        localStorage.removeItem('appSettings');
    }
  }, []);
  
  const updateSettings = (newSettings: Settings) => {
      setSettings(newSettings);
      localStorage.setItem('appSettings', JSON.stringify(newSettings));
  }


  return (
    <SettingsContext.Provider value={{ settings, setSettings: updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
