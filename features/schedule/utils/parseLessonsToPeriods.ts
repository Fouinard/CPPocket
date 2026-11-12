import { ParsedLesson, SchedulePeriod } from "../types";



export function parseLessonsToPeriods(lessonsOfDay: ParsedLesson[] | undefined): SchedulePeriod[] {
    if (!lessonsOfDay || lessonsOfDay.length === 0) return [];

    const periods: SchedulePeriod[] = [];

    lessonsOfDay.sort((a, b) => a.startDate.getTime() - b.startDate.getTime())

    lessonsOfDay.forEach((lesson, index) => {
        if (
            index > 0 &&
            lessonsOfDay[index - 1].startDate.getTime() === lesson.startDate.getTime()
        ) {
            return;
        }

        const multipleLessons = lessonsOfDay.filter(
            l => l.startDate.getTime() === lesson.startDate.getTime()
        );

        const groupEnd = Math.max(
            ...multipleLessons.map(l => l.endDate.getTime())
        );

        const nextLesson = lessonsOfDay.find(
            l => l.startDate.getTime() > lesson.startDate.getTime()
        );

        periods.push({
            startDate: lesson.startDate,
            endDate: new Date(groupEnd),
            lessons: multipleLessons,
        });

        const hasBreak = Boolean(
            nextLesson &&
            nextLesson.startDate.getTime() > groupEnd &&
            nextLesson.startDate.getTime() - groupEnd > 60000
        );

        if (hasBreak && nextLesson) {
            periods.push({
                startDate: new Date(groupEnd),
                endDate: nextLesson.startDate,
                lessons: null,
            });
        }
    });

    return periods;
}