import { View, Text, Image, Pressable } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { formatFileSize } from "@/shared/utils/FileSize";
import { Cross } from "@getpapillon/papicons";

export default function ImageComponent({ file, onDelete }: { file: DocumentPicker.DocumentPickerAsset; onDelete: () => void }) {
    return (
        <View className="flex flex-row gap-4 items-center justify-between border-t border-text p-5">
            <View className="flex flex-1 flex-row gap-4 items-center pr-3">
                <Image
                    src={file.uri}
                    width={80}
                    height={80}
                />
                <View className="flex-col gap-1 flex-1">
                    <Text className="text-text text-wrap">{file.name}</Text>
                    <Text className="text-text">{formatFileSize(file.size!)}</Text>
                </View>
            </View>
            <View className="w-9 h-9">
                <Pressable onPress={onDelete} className="w-full h-full flex justify-center items-center">
                    <Cross size={25} color="white" />
                </Pressable>
            </View>
        </View>
    );
}