import { Text, ScrollView, Linking } from "react-native";
import * as Application from "expo-application";
import { Link } from "expo-router";
import Toast from "react-native-toast-message";
import { useEffect, useRef, useState } from "react";
import { StorageManager } from "@/shared/services/storage/storage";
import * as Updates from "expo-updates";

export default function () {
    const [developerMode, setDeveloperMode] = useState(false);
    const clickCount = useRef(0);
    const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const handleVersionPress = () => {
        if (developerMode) {
            return
        }
        if (resetTimer.current) {
            clearTimeout(resetTimer.current);
        }
        clickCount.current++;
        const remaining = 10 - clickCount.current;
        if (remaining < 6) {
            Toast.show({
                type: "info",
                text1: "Mode développeur",
                text2: "Plus que " + remaining + " étapes avant d'activer le mode développeur",
                position: 'bottom',
            });
        }
        if (clickCount.current >= 10) {
            setDeveloperMode(true);
            clickCount.current = 0;
            Toast.show({
                type: "success",
                text1: "Mode développeur activé",
                text2: "Vous avez désormais accès aux fonctionnalités développeur.",
                position: 'bottom',
            });
            Updates.reloadAsync();
            return;
        }
        resetTimer.current = setTimeout(() => {
            clickCount.current = 0;
        }, 1000);
    };

    useEffect(() => {
        StorageManager.Default.set("developerMode", developerMode.toString());
    }, [developerMode]);

    return (
        <ScrollView className="flex-1 pt-16 bg-bg">
            <Text className="text-text text-3xl font-semibold h-20 px-5">À propos</Text>
            <Text className="text-text text-lg font-normal px-5">
                Cette application a été développée par des étudiants de l'INP Grenoble pour faciliter l'accès aux informations de l'école.
                Elle est open-source et disponible sur <Text className="text-accent" onPress={() => {
                    Linking.openURL("https://github.com/fouinard/cppocket")
                }}>GitHub</Text>.
            </Text>
            <Text className="text-text text-lg font-normal px-5 mt-4"
                onPress={handleVersionPress}
            >
                Version : {Application.nativeApplicationVersion} (Build {Application.nativeBuildVersion})
            </Text>
            <Text className="text-text text-lg font-normal px-5 mt-4">
                Pour toute question ou suggestion, veuillez nous contacter à l'adresse <Text
                    className="text-accent" onPress={() => {
                        Linking.openURL("mailto:contact@fouinard.fr");
                    }}>
                    contact@fouinard.fr
                </Text>
            </Text>
            <Text className="text-text text-3xl font-semibold h-10 px-5 mt-8">
                Section légale
            </Text>
            <Text className="text-text text-lg font-normal px-5 mt-4">
                <Link href={{ pathname: "/viewers/MarkdownViewer", params: { markdownUrl: "https://cdn.fouinard.fr/CPPocket/mentions_legales.md" } }}>
                    Mentions légales
                </Link>
            </Text>
            <Text className="text-text text-lg font-normal px-5 mt-4">
                <Link href={{ pathname: "/viewers/MarkdownViewer", params: { markdownUrl: "https://cdn.fouinard.fr/CPPocket/cgu.md" } }}>
                    Conditions Générales d'Utilisation
                </Link>
            </Text>
            <Text className="text-text text-lg font-normal px-5 mt-4">
                <Link href={{ pathname: "/viewers/MarkdownViewer", params: { markdownUrl: "https://cdn.fouinard.fr/CPPocket/politique_confidentialite.md" } }}>
                    Politique de confidentialité
                </Link>
            </Text>
        </ScrollView>
    );
}