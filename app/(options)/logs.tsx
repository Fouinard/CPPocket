import { ActivityIndicator, Linking, ScrollViewInstance } from "react-native"
import { ScrollView, Text, View } from "react-native";
import { useState, useEffect, useRef } from "react"
import Logger from "@/shared/services/logger/Logger";
import { SafeAreaView } from "react-native-safe-area-context";

export default function () {
    const [logs, setLogs] = useState("")
    const scrollViewRef = useRef<ScrollViewInstance>(null)

    useEffect(() => {
        async function readLogs() {
            const content = await Logger.getLogsContent()
            setLogs(content)
        }
        readLogs()
    }, [])

    useEffect(() => {
        if(logs != "") {
            scrollViewRef.current?.scrollToEnd({ animated: true })
        }
    }, [logs])

    return (
        <SafeAreaView className="flex-1 bg-bg">
            <ScrollView className="flex-1 pt-5 bg-bg px-5" contentContainerStyle={{ paddingBottom: 32 }} ref={scrollViewRef}>
                {
                    logs == "" ? (
                        <View className="justify-center items-center h-full">
                            <ActivityIndicator size="large" color="#687076" />
                            <Text className="text-text mt-3 text-base font-medium">
                                Chargement...
                            </Text>
                        </View>
                    ) : null
                }
                <Text className="text-text text-base font-medium">
                    {logs}
                </Text>
            </ScrollView>
        </SafeAreaView>
    )
}