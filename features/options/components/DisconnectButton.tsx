import colors from "@/styles/colors";
import { Logout } from "@getpapillon/papicons";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { StorageManager } from "@/shared/services/storage/storage";
import Logger from "@/shared/services/logger/Logger";
import { useModal } from "@/shared/components/contexts/ModalContext";

export default function DisconnectButton() {
    const router = useRouter();
    const { confirm } = useModal();
    return (
        <View>
            <Pressable android_ripple={{ color: "#434147", }} className="overflow-hidden p-5" onPress={() => {
                confirm({
                    title: "Êtes-vous sûr ?",
                    message: "Cette action vous déconnectera de votre compte et supprimera vos identifiants stockés. Êtes-vous sûr de vouloir continuer ?",
                    cancelLabel: "Annuler",
                    confirmLabel: "Se déconnecter",
                }).then((confirmed) => {
                    if (!confirmed) return;
                    Logger.info("DisconnectButton pressed, clearing stored credentials and navigating to /startup");
                    StorageManager.Secure.remove("username");
                    StorageManager.Secure.remove("password");
                    StorageManager.Default.remove("ADEClassTreeList");
                    router.replace("/startup");
                })
            }}>
                <View className="flex flex-row items-center gap-4">
                    <Logout color={colors.text} className="size-[17px]" />
                    <View className="flex flex-col">
                        <Text className="text-text text-xl">Se déconnecter</Text>
                        <Text className="text-grey text-lg">Déconnectez-vous de votre compte</Text>
                    </View>
                </View>
            </Pressable>
        </View>
    );
}