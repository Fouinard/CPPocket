import Logger from "@/shared/services/logger/Logger";
import { memo, useCallback, useState } from "react";
import { ActivityIndicator, RefreshControl, ScrollView, Text, View } from "react-native";
import useSchedule from "../hooks/useScheduleDay";
import { SchedulePeriod } from "../types";
import Break from "./Break";
import { Lesson } from "./Lesson";
import MultipleLessons from "./MultipleLessons";

export default memo(function ScheduleDay({ date }: { date: Date }) {
    const { data, isLoading, refetch } = useSchedule(date);
    const [refreshing, setRefreshing] = useState(false);
    Logger.info("Rendering ScheduleDay component", { date });

    const handleRefresh = useCallback(async () => {
        setRefreshing(true);
        try {
            Logger.info("Refreshing schedule day", { date });
            await refetch();
        } catch (e) {
            Logger.error("Schedule refresh failed", e);
        } finally {
            setRefreshing(false);
        }
    }, [refetch, date]);

    const periods = data?.periods ?? [];

    return (
        <ScrollView
            key={`schedule-day-${date.toISOString()}`}
            className="flex-1"
            showsVerticalScrollIndicator={false}
            contentContainerClassName={
                !isLoading && periods.length > 0
                    ? "flex-col gap-2 pb-[200] mb-4"
                    : "flex-grow justify-center items-center"
            }
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                    tintColor="#687076"
                    colors={["#687076"]}
                />
            }
        >
            {isLoading && (
                <View className="items-center">
                    <ActivityIndicator size="large" color="#687076" />
                    <Text className="text-text mt-3 text-base font-medium">
                        Chargement...
                    </Text>
                </View>
            )}

            {!isLoading && periods.length === 0 && (
                <Text className="text-text text-base font-medium">
                    Aucun cours aujourd'hui.
                </Text>
            )}

            {!isLoading && periods.map((period: SchedulePeriod, index) => {
                if (!period.lessons) {
                    return <Break key={`break-${date.toISOString()}-${index}`} startDate={period.startDate} endDate={period.endDate} />;
                }
                if (period.lessons.length === 1) {
                    return <Lesson key={`lesson-${date.toISOString()}-${index}`} lessonData={period.lessons[0]} />;
                }
                return <MultipleLessons key={`multiple-lessons-${date.toISOString()}-${index}`} startDate={period.startDate} endDate={period.endDate} lessons={period.lessons} />;
            })}
        </ScrollView>
    );
})