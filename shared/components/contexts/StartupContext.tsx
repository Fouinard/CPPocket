import Logger from "@/shared/services/logger/Logger";
import React, { createContext, useContext, useRef } from "react";

const StartupContext = createContext<{
    setPageAsReady: () => void;
} | null>(null);

export function StartupProvider({ children, onReady }: { children: React.ReactNode; onReady: () => void }) {

    const isSplashHidden = useRef(false);

    const setPageAsReady = () => {
        if (isSplashHidden.current) return;
        Logger.info("StartupContext: Page is ready, hiding splash screen", null, true);
        isSplashHidden.current = true;
        onReady(); 
    };

    return (
        <StartupContext.Provider value={{ setPageAsReady }}>
            {children}
        </StartupContext.Provider>
    );
}

export const useStartupContext = () => {
    const context = useContext(StartupContext);
    if (!context) throw new Error("useStartupReady has to be used within an StartupProvider");
    return context.setPageAsReady;
};
