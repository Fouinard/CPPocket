import colors from "@/styles/colors";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, Switch, Text, TextInput, View } from "react-native";
import { mixColors } from "@/shared/utils/Color";
import * as DocumentPicker from "expo-document-picker";
import Logger from "@/shared/services/logger/Logger";
import ImageComponent from "@/features/options/components/ImageComponent";
import Toast from "react-native-toast-message";
import * as FileSystem from "expo-file-system/legacy";
import { File, Paths } from "expo-file-system";
import { useModal } from "@/shared/components/contexts/ModalContext";
import { router } from "expo-router";

interface FileToUpload {
    fileType: "attachments" | "logFile"
    fileUri: string
    fileName: string
    mimeType: string
}

async function createReport(title: string, message: string, files: FileToUpload[], email?: string) {
    const formData = new FormData();
    formData.append("title", title)
    formData.append("message", message)
    if (email) formData.append("email", email)
    for (const file of files) {
        if (file.fileType === "logFile") {
            const fileContent = await FileSystem.readAsStringAsync(file.fileUri, { encoding: FileSystem.EncodingType.UTF8 });
            const blob = new Blob([fileContent], { type: file.mimeType });
            formData.append(file.fileType, blob, file.fileName);
            continue;
        }
        const responseFile = await fetch(file.fileUri);
        const blob = await responseFile.blob();
        formData.append(file.fileType, blob, file.fileName);
    }
    const response = await fetch("http://82.66.51.212:2025/api/report/send", {
        method: "POST",
        body: formData,
        headers: {
            Accept: "application/json"
        }
    })
    const data = await response.json()
    return data
}

export default function ReportPage() {
    const [sendLogsEnabled, sendLogs] = useState(true);
    const [filesSelected, setFilesSelected] = useState<DocumentPicker.DocumentPickerAsset[]>([]);
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [email, setEmail] = useState("");
    const { confirm, alert } = useModal();
    function handleSendLogsToggle(value: boolean) {
        if (!value) {
            confirm({
                title: "Êtes-vous sûr ?",
                message: "Désactiver l'envoi des journaux de l'application peut rendre plus difficile, voir impossible, la résolution de votre problème. Aucune information sensible n'est envoyée via les journaux. Êtes-vous sûr de vouloir continuer ?",
                cancelLabel: "Annuler",
                confirmLabel: "Désactiver l'envoi",
                variant: "danger"
            }).then((confirmed) => {
                if (confirmed) {
                    sendLogs(value);
                } else {
                    sendLogs(true);
                }
            });
        } else {
            sendLogs(value);
        }
    }

    return (
        <ScrollView className="flex-1 bg-bg" contentContainerClassName="pt-16 pb-48" showsVerticalScrollIndicator={false}>
            <Text className="text-text text-3xl font-semibold h-20 px-5">Support</Text>
            <View className="flex flex-col mx-5 gap-4">
                <Text className="text-text text-lg font-normal mb-8">
                    Un bug, une idée, contactez-nous ! Nous sommes toujours à l'écoute de vos retours pour améliorer l'application.
                </Text>
                <TextInput
                    className="text-text border-text text-base font-normal px-5 py-3 rounded-lg border"
                    placeholder="Titre du rapport"
                    multiline={false}
                    placeholderTextColor={colors.grey}
                    onChangeText={setTitle}
                />
                <TextInput
                    className="text-text border-text text-base font-normal px-5 py-3 rounded-lg border"
                    placeholder="Email de contact (optionnel)"
                    multiline={false}
                    textContentType="emailAddress"
                    autoCapitalize="none"
                    inputMode="email"
                    autoComplete="email"
                    placeholderTextColor={colors.grey}
                    onChangeText={setEmail}
                />
                <TextInput
                    className="text-text border-text text-base font-normal px-5 py-3 rounded-lg border h-48"
                    textAlignVertical="top"
                    placeholder="Votre message"
                    multiline={true}
                    numberOfLines={10}
                    maxLength={5000}
                    placeholderTextColor={colors.grey}
                    onChangeText={setMessage}
                />
                <View className="flex-row justify-between items-center">
                    <Text className="text-text text-lg font-normal">
                        Envoyer les journaux de l'application
                    </Text>
                    <Switch
                        trackColor={{ false: mixColors(colors.grey, colors.text, 0.7), true: colors.accent }}
                        thumbColor={sendLogsEnabled ? mixColors(colors.accent, colors.text, 0.7) : colors.text}
                        value={sendLogsEnabled}
                        onValueChange={handleSendLogsToggle}
                        className="h-8"
                    />
                </View>
                <View className="border-text border text-text rounded-lg">
                    {
                        filesSelected.length == 0 ? (
                            <Pressable className="w-full h-20 flex justify-center items-center" onPress={async () => {
                                const result = await DocumentPicker.getDocumentAsync({
                                    type: "image/*",
                                    multiple: true,
                                    copyToCacheDirectory: true
                                });
                                if (!result.canceled) {
                                    Logger.info("Selected file:", result.assets);
                                    setFilesSelected(result.assets);
                                }
                            }}>
                                <Text className="text-text text-lg text-center w-2/3">
                                    Ajouter des images au dossier (facultatif)
                                </Text>
                            </Pressable>
                        )
                            :
                            (
                                <View>
                                    <Pressable className="w-full h-20 flex justify-center" onPress={async () => {
                                        const result = await DocumentPicker.getDocumentAsync({
                                            type: "image/*",
                                            multiple: true,
                                            copyToCacheDirectory: true
                                        });
                                        if (!result.canceled) {
                                            Logger.info("Selected file:", result.assets);
                                            setFilesSelected([...filesSelected, ...result.assets]);
                                        }
                                    }}>
                                        <Text className="text-text text-lg text-center">
                                            Ajouter des images au dossier
                                        </Text>
                                    </Pressable>
                                    {
                                        filesSelected.map((file, index) => (
                                            <ImageComponent
                                                key={index}
                                                file={file}
                                                onDelete={() => {
                                                    Logger.info("Deleting file:", file);
                                                    setFilesSelected(filesSelected.filter((_, i) => i !== index));
                                                }}
                                            />
                                        ))
                                    }
                                </View>
                            )
                    }
                </View>
                <Pressable className="rounded-lg h-12 flex border border-text justify-center items-center mt-8" onPress={async () => {
                    if (!title.trim()) {
                        return Toast.show({
                            type: "error",
                            text1: "Erreur",
                            text2: "Veuillez donner un titre au rapport",
                            position: "bottom",
                        });
                    }
                    if (!message.trim()) {
                        return Toast.show({
                            type: "error",
                            text1: "Erreur",
                            text2: "Veuillez donner un message au rapport",
                            position: "bottom",
                        });
                    }
                    const files = filesSelected.map(file => ({
                        fileType: "attachments",
                        fileUri: file.uri,
                        fileName: file.name,
                        mimeType: file.mimeType ?? "application/octet-stream",
                    }));
                    if (sendLogsEnabled) {
                        Logger.logAppDeviceInfo();
                        const logsContent = await Logger.getLogsContent();
                        const logFile = new File(Paths.cache, "application.log");
                        if (!logFile.exists) {
                            logFile.create();
                        }
                        await logFile.write(logsContent, { append: false });
                        files.push({
                            fileType: "logFile" as const,
                            fileUri: logFile.uri,
                            fileName: logFile.name,
                            mimeType: logFile.type ?? "text/plain",
                        });
                    }
                    let send = false;
                    if (email.trim() == "") {
                        const confirmed = await confirm({
                            title: "Aucun email renseigné",
                            message: "Vous n'avez pas renseigné d'email de contact. Si vous ne le faites pas, nous ne pourrons pas vous recontacter pour poursuivre votre ticket. Voulez-vous continuer sans email ?",
                            confirmLabel: "Continuer sans email"
                        })
                        send = confirmed;
                    } else {
                        send = true;
                    }
                    if(!send) return;
                    const result = await createReport(title, message, files as FileToUpload[], email != "" ? email : undefined);
                    if(result.success) {
                        await alert({
                            title: "Rapport envoyé",
                            message: "Merci pour votre retour !"
                        });
                        router.back();
                    }
                }}>
                    <Text className="text-text text-lg font-normal">
                        Envoyer le rapport
                    </Text>
                </Pressable>
            </View>
        </ScrollView>
    );
}