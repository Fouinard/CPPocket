import { ADEApi } from "@/shared/services/ade/adeApi";
import Logger from "@/shared/services/logger/Logger";
import { queryClient } from "@/shared/utils/queryClient";
import { formatDateKey } from "@/shared/utils/Time";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import { ParsedLesson, ScheduleDayData } from "../types";
import { parseLessonsToPeriods } from "../utils/parseLessonsToPeriods";

export default function useScheduleDay(date: Date) {
    const dateKey = formatDateKey(date);
    const select = useCallback(
        (lessons: ParsedLesson[]): ScheduleDayData => ({ date, periods: parseLessonsToPeriods(lessons) }),
        [dateKey]
    );

    const { data, isLoading, error } = useQuery({
        queryKey: ['schedule-day', dateKey],
        queryFn: () => ADEApi.Schedule.getIcal(date),
        select,
        staleTime: 15 * 60 * 1000,
    });

    const refetch = async () => {
        try {
            await queryClient.refetchQueries({ queryKey: ['schedule-day', dateKey]});
        } catch (e) {
            Logger.error("Schedule refresh failed", e);
        }
    };

    return {
        data,
        isLoading,
        error,
        refetch
    };
}