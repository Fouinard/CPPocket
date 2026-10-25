import Class from "@/features/schedule/components/Class";
import { useLessonsContext } from "@/shared/components/contexts/LessonsContext";
import { dateToNaturalLanguage, getRelativeDate } from "@/utils/Time";
import { ScrollView, Text, View } from "react-native";

export default function MultipleLessonsScreen() {
    const lessonsContext = useLessonsContext();
    const lessons = lessonsContext.getLessons();
    const displayedDate = lessonsContext.getDate();
    const hours = lessonsContext.getHours();

    return (
        <View className="flex-1 pt-16 bg-bg px-5">
            <Text className="text-text text-3xl font-semibold">
                {dateToNaturalLanguage(displayedDate)} - {hours.start}h à {hours.end}h
            </Text>
            <Text className="text-grey text-lg font-normal">
                {getRelativeDate(displayedDate)}
            </Text>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerClassName="flex-col gap-2 pb-[200] mb-4"
            >
                {
                    lessons.map((lesson, index) => (
                        <Class
                            key={`lesson-${lesson.startDate.getTime()}-${lesson.subject}`}
                            classData={lesson}
                        />
                    ))
                }
            </ScrollView>
        </View >
    )
}