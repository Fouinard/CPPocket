import { StorageManager } from "@/shared/services/storage/storage";
import { Link, router } from "expo-router";
import { Pressable, Text, View } from "react-native";
import Toast from "react-native-toast-message";
import * as Updates from "expo-updates";
import Logger from "@/shared/services/logger/Logger";

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
            <Link href="/logs">
                <Text className="text-text">Afficher les logs</Text>
            </Link>
            <Pressable onPress={async () => {
                Logger.deleteAllLogs();
                Toast.show({
                    type: "success",
                    text1: "Logs supprimés"
                })
            }}>
                <Text className="text-text">Supprimer tous ses logs</Text>
            </Pressable>
            <Pressable onPress={async () => {
                Logger.info("Logging out user and clearing credentials");
                await StorageManager.Secure.remove("username");
                await StorageManager.Secure.remove("password");
                router.replace("/startup");
            }}>
                <Text className="text-text">Se déconnecter</Text>
            </Pressable>
            <Pressable onPress={async () => {
                Logger.info("Clearing class selection");
                await StorageManager.Default.remove("ADEClassTreeList");
                Toast.show({
                    type: "success",
                    text1: "Class cleared"
                })
            }}>
                <Text className="text-text">Retirer la selection de sa classe</Text>
            </Pressable>
            <Pressable onPress={async () => {
                Logger.info("Performing a fresh start: clearing class selection and credentials");
                await StorageManager.Default.remove("ADEClassTreeList");
                await StorageManager.Secure.remove("username");
                await StorageManager.Secure.remove("password");
                router.replace("/startup");
            }}>
                <Text className="text-text">Nouveau départ</Text>
            </Pressable>

            <Pressable onPress={async () => {
                Logger.info("\n\nDisabling developer mode\n\n");
                await StorageManager.Default.set("developerMode", "false");
                Updates.reloadAsync()
            }}>
                <Text className="text-text">Désactiver le mode développeur</Text>
            </Pressable>

        </View>
    )
}