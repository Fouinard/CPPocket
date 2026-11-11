import BottomNavBar from "@/shared/components/BottomNavBar";
import { StartupProvider } from "@/shared/components/contexts/StartupContext";
import { StorageManager } from "@/shared/services/storage/storage";
import Logger from "@/shared/services/logger/Logger"
import "@/styles/global.css";
import { toastConfig } from "@/styles/ToastsStyle";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from 'expo-font';
import { Redirect, RelativePathString, Stack } from "expo-router"; // Import de Slot
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
        const prepareApp = async () => {
            try {
                const username = await StorageManager.Secure.get("username");
                const password = await StorageManager.Secure.get("password");
                const classId = await StorageManager.Default.get("ADEClassTreeList");
                if (!username && !password) {
                    setInitialRoute("startup");
                } else if (!classId) {
                    setInitialRoute("(options)/treeselector");
                } else {
                    setInitialRoute("/schedule/schedule");
                }
                Logger.info("Initial route set", { route: initialRoute });
            } catch (error) {
                console.error(error);
                setInitialRoute("startup");
                Logger.error("Error in prepareApp", error);
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

    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 15 * 60 * 1000,
            },
        },
    });

    return (
        <StartupProvider onReady={() => SplashScreen.hideAsync()}>
            <QueryClientProvider client={queryClient}>
                <View className="flex-1 max-w-screen" style={{ backgroundColor: "#121212" }}>
                    <Stack
                        screenOptions={{
                            headerShown: false,
                            contentStyle: { backgroundColor: "#121212" },
                        }}
                    />
                    <Redirect href={initialRoute as RelativePathString} />
                    <BottomNavBar />
                    <Toast config={toastConfig} />
                </View>
            </QueryClientProvider>
        </StartupProvider>
    );
}