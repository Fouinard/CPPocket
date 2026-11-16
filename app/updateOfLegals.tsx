import { LegalsUpdater } from "@/features/legals/LegalsUpdater";
import { useStartupContext } from "@/shared/components/contexts/StartupContext";
import Logger from "@/shared/services/logger/Logger";
import colors from "@/styles/colors";
import { Checkbox } from "expo-checkbox";
import { Link, useLocalSearchParams } from "expo-router";
import { reloadAsync } from "expo-updates";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import Toast from "react-native-toast-message";

export default function () {
    const [termsChecked, setTermsChecked] = useState(false);
    const [privacyChecked, setPrivacyChecked] = useState(false);
    const setStartupReady = useStartupContext();
    const { _cguUpdated, _privacyUpdated } = useLocalSearchParams<{ _cguUpdated: string; _privacyUpdated: string }>();
    const cguUpdated = _cguUpdated == "true";
    const privacyUpdated = _privacyUpdated == "true";

    useEffect(() => {
        setStartupReady();
    }, [setStartupReady]);

    return (
        <ScrollView className="flex-1 pt-16 bg-bg px-5">
            <Text className="text-text text-3xl font-semibold h-32">
                Mise à jour {
                    cguUpdated && privacyUpdated ? "des conditions d'utilisation et de la politique de confidentialité" :
                        cguUpdated ? "des conditions d'utilisation" :
                            privacyUpdated ? "de la politique de confidentialité" : ""
                }
            </Text>
            <Text className="text-text text-lg font-normal">
                Pour continuer à utiliser l'application, vous devez accepter {
                    cguUpdated && privacyUpdated ? "les nouvelles conditions d'utilisation et la nouvelle politique de confidentialité" :
                        cguUpdated ? "les nouvelles conditions d'utilisation" :
                            privacyUpdated ? "la nouvelle politique de confidentialité" : ""
                }.
            </Text>
            <View className="flex flex-col gap-4">
                {
                    cguUpdated ? (
                        <Pressable
                            onPress={() => {
                                Logger.info("Toggled terms", !termsChecked);
                                setTermsChecked(!termsChecked)
                            }}
                            className="flex-row items-center gap-3 mt-5"
                        >
                            <Checkbox
                                value={termsChecked}
                                onValueChange={setTermsChecked}
                                color={termsChecked ? colors.accent : undefined}
                            />
                            <Text className="text-text flex-1">
                                J'ai lu et pris connaissance des{' '}
                                <Link href={
                                    {
                                        pathname: "/viewers/MarkdownViewer",
                                        params: {
                                            markdownUrl: "https://cdn.fouinard.fr/CPPocket/cgu.md"
                                        }
                                    }
                                } style={{ color: colors.accent }}>
                                    conditions d'utilisations
                                </Link>
                            </Text>
                        </Pressable>
                    ) : null
                }
                {
                    privacyUpdated ? (
                        <Pressable
                            onPress={() => {
                                Logger.info("Toggled privacy", !privacyChecked);
                                setPrivacyChecked(!privacyChecked);
                            }}
                            className="flex-row items-center gap-3"
                        >
                            <Checkbox
                                value={privacyChecked}
                                onValueChange={setPrivacyChecked}
                                color={privacyChecked ? colors.accent : undefined}
                            />
                            <Text className="text-text flex-1">
                                J'ai lu et pris connaissance de la{' '}
                                <Link href={
                                    {
                                        pathname: "/viewers/MarkdownViewer",
                                        params: {
                                            markdownUrl: "https://cdn.fouinard.fr/CPPocket/politique_confidentialite.md"
                                        }
                                    }
                                } style={{ color: colors.accent }}>
                                    politique de confidentialité
                                </Link>
                            </Text>
                        </Pressable>
                    ) : null
                }
            </View>
            <Pressable className="mt-10 p-2 border border-text rounded-md w-1/2 self-center" onPress={async () => {
                if (!termsChecked && cguUpdated) {
                    Logger.warn("User attempted to log in without accepting terms.");
                    return Toast.show({
                        type: 'error',
                        text2: 'Vous devez accepter les conditions d\'utilisation pour continuer.',
                        position: 'bottom',
                    });
                }
                if (!privacyChecked && privacyUpdated) {
                    Logger.warn("User attempted to log in without accepting privacy policy.");
                    return Toast.show({
                        type: 'error',
                        text2: 'Vous devez accepter la politique de confidentialité pour continuer.',
                        position: 'bottom',
                    });
                }
                Toast.hide();
                await LegalsUpdater.setLocalManifest(await LegalsUpdater.getRemoteManifest());
                reloadAsync();
            }}>
                <Text className="text-text text-center">
                    Accepter et continuer
                </Text>
            </Pressable>
        </ScrollView>
    );
}