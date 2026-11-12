import { dateToNaturalLanguage, getRelativeDate } from "@/shared/utils/Time";
import { useMemo, useState } from "react";

export default function useDate(initialDate: Date = new Date()) {
    const [date, setDate] = useState<Date>(initialDate);
    const naturalLanguageDate = useMemo(() => dateToNaturalLanguage(date), [date]);
    const naturalRelativeTime = useMemo(() => getRelativeDate(date), [date]);

    return { 
        date, 
        setDate, 
        naturalLanguageDate, 
        naturalRelativeTime 
    };
}