import { Lesson } from "@/features/schedule/components/Lesson";
import { Text, View } from "react-native";

export default function TestPage1() {
    return (
        <View className="bg-gray-800 flex-1">
            <Text>Page de tests (composants etc)</Text>
            <View className="px-4">
                <Lesson lessonData={{ startDate: new Date(), endDate: new Date(), teacher: "Prof 1", subject: "Maths", room: "Salle 1" }} backgroundColor={"#FF0000"} accentColor={"#000000"} />
            </View>
        </View>
    );
}
