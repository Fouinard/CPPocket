import { ADEApi } from "@/shared/services/ade/adeApi";
import { formatDateKey } from "@/shared/utils/Time";
import { useQuery } from "@tanstack/react-query";
import { ParsedLesson, ScheduleDayData } from "../types";
import { parseLessonsToPeriods } from "../utils/parseLessonsToPeriods";

export default function useScheduleDay(date: Date) {
    const dateKey = formatDateKey(date);
    const { data, isLoading, error } = useQuery({
        queryKey: ['schedule-day', dateKey],
        queryFn: () => ADEApi.Schedule.getIcal(date),
        select: (lessons: ParsedLesson[]): ScheduleDayData => {return {date, periods: parseLessonsToPeriods(lessons)}},
    });

    return {
        data,
        isLoading,
        error,
    };
}