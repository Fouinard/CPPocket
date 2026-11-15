import { useModal } from "@/shared/components/contexts/ModalContext";
import { Pressable, Text, View } from "react-native";

export default function TestPage1() {

    const { confirm } = useModal();

    return (
        <View className="flex-1 justify-center items-center">
            <Pressable className="p-2 border border-text rounded-md w-1/2 self-center items-center" onPress={async () => await confirm({ title: "Confirmer", message: "Vous confirmez la confirmation ?" })}>
                <Text className="text-text">ouvrir la modale</Text>
            </Pressable>
        </View>
    );
}
