import colors from "@/styles/colors";
import { useState } from "react";
import { Pressable, ScrollView, Switch, Text, TextInput, View } from "react-native";
import { mixColors } from "@/shared/utils/Color";
import * as DocumentPicker from "expo-document-picker";
import Logger from "@/shared/services/logger/Logger";
import ImageComponent from "@/features/options/components/ImageComponent";
import Toast from "react-native-toast-message";
import * as FileSystem from "expo-file-system/legacy";
import { File, Paths } from "expo-file-system";

// async function getFileBlob(
//     uri: string,
//     mimeType: string
// ): Promise<Blob> {
//     const base64 = await FileSystem.readAsStringAsync(uri, {
//         encoding: FileSystem.EncodingType.Base64,
//     });

//     const binary = atob(base64);
//     const bytes = new Uint8Array(binary.length);

//     for (let i = 0; i < binary.length; i++) {
//         bytes[i] = binary.charCodeAt(i);
//     }

//     return new Blob([bytes], { type: mimeType });
// }

interface FileToUpload {
    fileType: "attachments" | "logFile"
    fileUri: string
    fileName: string
    mimeType: string
}

async function createReport(title: string, message: string, files: FileToUpload[], email?: string) {
    console.log("Uploading files:", files);
    const formData = new FormData();
    formData.append("title", title)
    formData.append("message", message)
    if(email) formData.append("email", email)
    for (const file of files) {
        if(file.fileType === "logFile") {
            const fileContent = await FileSystem.readAsStringAsync(file.fileUri, { encoding: FileSystem.EncodingType.UTF8 });
            console.log("Log file content:", fileContent);
            const blob = new Blob([fileContent], { type: file.mimeType });
            formData.append(file.fileType, blob, file.fileName);
            continue;
        }
        const responseFile = await fetch(file.fileUri);
        // console.log(await responseFile.text());
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
                        onValueChange={sendLogs}
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
                        const logsContent = await Logger.getLogsContent();
                        const logFile = new File(Paths.cache, "application.log");
                        if(!logFile.exists) {
                            logFile.create();
                        }
                        await logFile.write(logsContent, { append: false });
                        // console.log("Logs content:", logFile.textSync());
                        // const logsFile = new File(Logger.getFileUri())
                        // const logsFileUri = FileSystem.cacheDirectory + "logs.txt";
                        // await FileSystem.writeAsStringAsync(logsFileUri, logsContent, { encoding: FileSystem.EncodingType.UTF8 });
                        files.push({
                            fileType: "logFile" as const,
                            fileUri: logFile.uri,
                            fileName: logFile.name,
                            mimeType: logFile.type ?? "text/plain",
                        });
                    }
                    const result = await createReport(title, message, files as FileToUpload[], email != "" ? email : undefined);
                    console.log(result)
                }}>
                    <Text className="text-text text-lg font-normal">
                        Envoyer le rapport
                    </Text>
                </Pressable>
            </View>
        </ScrollView>
    );
}