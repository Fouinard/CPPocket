import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import useSchedule from "../hooks/useScheduleDay";
import { SchedulePeriod } from "../types";
import Break from "./Break";
import { Lesson } from "./Lesson";
import MultipleLessons from "./MultipleLessons";

export default function ScheduleDay({ date }: { date: Date }) {
    const { data, isLoading } = useSchedule(date);

    return (
        <View key={`schedule-day-${date.toISOString()}`}>
            {isLoading && (
                <View className="justify-center items-center h-full">
                    <ActivityIndicator size="large" color="#687076" />
                    <Text className="text-text mt-3 text-base font-medium">
                        Chargement...
                    </Text>
                </View>
            )}

            {!isLoading && data?.periods.length === 0 && (
                <View className="justify-center items-center h-full">
                    <Text className="text-text text-base font-medium">
                        Aucun cours aujourd'hui.
                    </Text>
                </View>
            )}


            {!isLoading && (data?.periods?.length ?? 0) > 0 && (
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerClassName="flex-col gap-2 pb-[200] mb-4"
                >
                    {data?.periods.map((period: SchedulePeriod, index) => {
                        if (!period.lessons) {
                            return <Break key={`break-${date.toISOString()}-${index}`} startDate={period.startDate} endDate={period.endDate} />;
                        }
                        if (period.lessons.length === 1) {
                            return <Lesson key={`lesson-${date.toISOString()}-${index}`} lessonData={period.lessons[0]} />;
                        }
                        return <MultipleLessons key={`multiple-lessons-${date.toISOString()}-${index}`} startDate={period.startDate} endDate={period.endDate} lessons={period.lessons} />;
                    })}
                </ScrollView>
            )}
        </View>
    );
}