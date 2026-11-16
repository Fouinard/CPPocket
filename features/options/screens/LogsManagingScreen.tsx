import Logger from "@/shared/services/logger/Logger";
import { formatFileSize } from "@/shared/utils/FileSize";
import { Link } from "expo-router";
import { useEffect } from "react";
import { ScrollView, Text } from "react-native";
import Toast from "react-native-toast-message";
import useLogManager from "../hooks/useLogManager";
import { useModal } from "@/shared/components/contexts/ModalContext";

export default function LogsManagingScreen() {
    useEffect(() => {
        Logger.info("\n\nNavigated to LogsManaging Screen\n\n")
    }, [])

    const { deleteAllLogs, fileSize } = useLogManager()
    const { confirm } = useModal();

    return (
        <ScrollView className="flex-1 pt-16 bg-bg">
            <Text className="text-text text-3xl font-semibold h-20 px-5">Gestion des journaux</Text>
            <Text className="text-text text-lg font-normal px-5">
                Cette section vous permet de gérer les journaux de l'application. Vous pouvez consulter les journaux actuels, les exporter ou les supprimer.
            </Text>
            <Text className="text-text text-lg font-normal px-5 mt-4">
                Poids des journaux : {formatFileSize(fileSize)}
            </Text>
            <Text className="text-text text-lg font-bold px-5 mt-4">
                <Link href="/logs">
                    Voir les journaux
                </Link>
            </Text>
            <Text className="text-text text-lg font-bold px-5 mt-4" onPress={() => {
                confirm({
                    title: "Êtes-vous sur ?",
                    message: "Cette action supprimera tous les journaux de l'application. Êtes-vous sûr de vouloir continuer ?",
                    cancelLabel: "Annuler",
                    confirmLabel: "Supprimer",
                }).then((confirmed) => {
                    if (!confirmed) return;
                    deleteAllLogs();
                    Toast.show({
                        type: "success",
                        text1: "Journaux supprimés",
                        position: "bottom"
                    });
                });
            }}>
                Supprimer tous les journaux
            </Text>
        </ScrollView>
    );
}