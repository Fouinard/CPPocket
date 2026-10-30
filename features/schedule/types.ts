export type ParsedLesson = {
    startDate: Date,
    endDate: Date,
    teacher: string,
    subject: string,
    room: string,
    lessonType?: "TD" | "CM" | "TP" | null
}

export type SchedulePeriod = {
    startDate: Date;
    endDate: Date;
    lessons: ParsedLesson[] | null;
};

export type ScheduleDayData = {
    date: Date, 
    periods: SchedulePeriod[]
};