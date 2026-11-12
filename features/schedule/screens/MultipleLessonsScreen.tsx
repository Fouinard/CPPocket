import { Lesson } from "@/features/schedule/components/Lesson";
import { dateToNaturalLanguage, getRelativeDate } from "@/shared/utils/Time";
import { useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import { ScheduleDayData } from "../types";
import Logger from "@/shared/services/logger/Logger";

export default function MultipleLessonsScreen() {
    const { dateKey, startTime } = useLocalSearchParams<{ dateKey: string; startTime: string }>();
    const queryClient = useQueryClient();
    
    const data = queryClient.getQueryData<ScheduleDayData>(['schedule', dateKey]);
    const displayedDate = data?.date || new Date();
    Logger.info("Rendering MultipleLessonsScreen", { dateKey, startTime, displayedDate, data });
    
    const targetPeriod = data?.periods.filter(
        l => l.startDate.getTime() === Number(startTime)
    ) || [];

    return (
        <View className="flex-1 pt-16 bg-bg px-5">
            <Text className="text-text text-3xl font-semibold">
                {dateToNaturalLanguage(displayedDate)} - {targetPeriod[0]?.startDate.getHours()}h à {targetPeriod[0]?.endDate.getHours()}h
            </Text>
            <Text className="text-grey text-lg font-normal">
                {getRelativeDate(displayedDate)}
            </Text>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerClassName="flex-col gap-2 pb-[200] mb-4"
            >
                {targetPeriod[0]?.lessons &&
                    targetPeriod[0]?.lessons.map((lesson, index) => (
                        <Lesson
                            key={`lesson-${lesson.startDate.getTime()}-${lesson.subject}`}
                            lessonData={lesson}
                        />
                    ))
                }
            </ScrollView>
        </View >
    )
}