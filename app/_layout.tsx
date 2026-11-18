import { LegalsUpdater } from "@/features/legals/LegalsUpdater";
import BottomNavBar from "@/shared/components/BottomNavBar";
import { ModalProvider } from "@/shared/components/contexts/ModalContext";
import { StartupProvider } from "@/shared/components/contexts/StartupContext";
import Logger from "@/shared/services/logger/Logger";
import { StorageManager } from "@/shared/services/storage/storage";
import { queryClient } from "@/shared/utils/queryClient";
import "@/styles/global.css";
import { toastConfig } from "@/styles/ToastsStyle";
import { QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from 'expo-font';
import { Redirect, RelativePathString, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { View } from "react-native";
import Toast from "react-native-toast-message";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [dbReady, setDbReady] = useState(false);
    const [initialRoute, setInitialRoute] = useState<string | null>(null);

    const [fontLoaded] = useFonts({
        'Inter': require('../assets/fonts/Inter-Variable.ttf'),
    });

    useEffect(() => {
        const defaultRoute = ["schedule/schedule", "report", "updateOfLegals"][0];
        const prepareApp = async () => {
            let route: string = "startup";
            try {
                const username = await StorageManager.Secure.get("username");
                const password = await StorageManager.Secure.get("password");
                const classId = await StorageManager.Default.get("ADEClassTreeList");
                if (!username && !password) {
                    route = "startup";
                } else if (!classId) {
                    route = "(options)/treeselector";
                } else {
                    try {
                        const [isUpdateAvailable, cguUpdated, privacyUpdated] = await LegalsUpdater.isUpdateAvailable();
                        Logger.info("Update available", isUpdateAvailable);
                        Logger.info("CGU updated", cguUpdated);
                        Logger.info("Privacy updated", privacyUpdated);
                        if (isUpdateAvailable) {
                            route = `updateOfLegals?_cguUpdated=${cguUpdated}&_privacyUpdated=${privacyUpdated}`;
                        } else {
                            route = defaultRoute;
                        }
                        
                    } catch (error) {
                        Logger.error("Error in prepareApp: Failed to fetch legals manifest", error);
                        route = defaultRoute;
                    }
                }
                Logger.info("Route de chargement définie sur", route);
                setInitialRoute(route);
            } catch (error) {
                Logger.error("Error in prepareApp", error);
                setInitialRoute("startup");
            } finally {
                setDbReady(true);
            }
        };
        prepareApp();
    }, []);

    // TANT QUE CE N'EST PAS PRÊT : On renvoie "null", l'écran reste bloqué sur le Splash Screen natif
    if (!dbReady || !fontLoaded || !initialRoute) {
        return null;
    }

    return (
        <StartupProvider onReady={() => SplashScreen.hideAsync()}>
            <QueryClientProvider client={queryClient}>
                <View className="flex-1 max-w-screen" style={{ backgroundColor: "#121212" }}>
                    <ModalProvider>
                        <Stack
                            screenOptions={{
                                headerShown: false,
                                contentStyle: { backgroundColor: "#121212" }
                            }}
                        />
                        <Redirect href={initialRoute as RelativePathString} />
                    </ModalProvider>
                        <BottomNavBar />
                        <Toast config={toastConfig} />
                </View>
            </QueryClientProvider>
        </StartupProvider>
    );
}