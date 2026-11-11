import { ActivityIndicator, Linking } from "react-native"
import { Markdown } from "react-native-remark"
import { ScrollView, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { fetch } from "expo/fetch"
import { useState, useEffect } from "react"
import Logger from "@/shared/services/logger/Logger";
import { SafeAreaView } from "react-native-safe-area-context";

export default function () {
    const { markdownUrl } = useLocalSearchParams<{ markdownUrl: string }>();

    const [markdown, setMarkdown] = useState("");
    useEffect(() => {
        Logger.info("Fetching markdown from URL: " + markdownUrl);
        fetch(markdownUrl)
            .then((res) => res.text())
            .then((text) => setMarkdown(text))
            .catch((err) => console.error(err));
    }, [markdownUrl]);

    return (
        <SafeAreaView className="flex-1 bg-bg">
            <ScrollView className="flex-1 pt-5 bg-bg px-5" contentContainerStyle={{ paddingBottom: 32 }}>
                {
                    markdown == "" ? (
                        <View className="justify-center items-center h-full">
                            <ActivityIndicator size="large" color="#687076" />
                            <Text className="text-text mt-3 text-base font-medium">
                                Chargement...
                            </Text>
                        </View>
                    ) : null
                }
                <Markdown
                    markdown={markdown}
                    onLinkPress={(url) => Linking.openURL(url)}
                />
            </ScrollView>
        </SafeAreaView>
    )
}