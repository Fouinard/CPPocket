import { StorageManager } from "@/shared/services/storage/storage";
import { Link, router } from "expo-router";
import { Pressable, Text, View } from "react-native";
import Toast from "react-native-toast-message";
import * as Updates from "expo-updates";

export default function () {
    return (
        <View className="flex-1 justify-center items-center bg-bg gap-5">
            <Link href="/dev/test1">
                <Text className="text-text">Page de tests 1</Text>
            </Link>
            <Link href="/dev/test2">
                <Text className="text-text">Page de tests 2</Text>
            </Link>
            <Link href="/startup">
                <Text className="text-text">Aller à /startup</Text>
            </Link>
            <Link href="/(options)/treeselector">
                <Text className="text-text">Afficher le selecteur de classe</Text>
            </Link>
            <Pressable onPress={async () => {
                await StorageManager.Secure.remove("username");
                await StorageManager.Secure.remove("password");
                router.replace("/startup");
            }}>
                <Text className="text-text">Se déconnecter</Text>
            </Pressable>
            <Pressable onPress={async () => {
                await StorageManager.Default.remove("ADEClassTreeList");
                Toast.show({
                    type: "success",
                    text1: "Class cleared"
                })
            }}>
                <Text className="text-text">Retirer la selection de sa classe</Text>
            </Pressable>
            <Pressable onPress={async () => {
                await StorageManager.Default.remove("ADEClassTreeList");
                await StorageManager.Secure.remove("username");
                await StorageManager.Secure.remove("password");
                router.replace("/startup");
            }}>
                <Text className="text-text">Nouveau départ</Text>
            </Pressable>

            <Pressable onPress={async () => {
                await StorageManager.Default.set("developerMode", "false");
                Updates.reloadAsync()
            }}>
                <Text className="text-text">Désactiver le mode développeur</Text>
            </Pressable>

        </View>
    )
}