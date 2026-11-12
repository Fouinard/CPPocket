// features/schedule/hooks/useSchedulePager.ts
import { getClosestDay, getNextWeekday, getPreviousWeekday } from '@/shared/utils/Time';
import { useCallback, useMemo } from 'react';
import useDate from './useDate';

const cleanDate = (date: Date) => new Date(getClosestDay(date).setHours(0, 0, 0, 0));

export default function useSchedulePager() {
    const {date, setDate, naturalRelativeTime:dateRelativeTime, naturalLanguageDate} = useDate(cleanDate(new Date()));

    const {date: displayedDate, setDate:setDisplayedDate, naturalRelativeTime:displayedDateRelativeTime, naturalLanguageDate:naturalLanguageDisplayedDate} = useDate(cleanDate(new Date()));

    const prevDate = useMemo(() => getPreviousWeekday(date), [date]);
    const nextDate = useMemo(() => getNextWeekday(date), [date]);

    const updateDisplayedDate = useCallback((targetDate: Date) => {
        setDisplayedDate(prev => prev.getTime() !== targetDate.getTime() ? targetDate : prev);
    }, []);

    const changeCurrentDate = useCallback((newDate: Date) => {
        const cleanedDate = cleanDate(newDate);
        setDate(cleanedDate);
        setDisplayedDate(cleanedDate);
    }, [setDate, setDisplayedDate]);

    const handlePageScroll = useCallback((event: any) => {
        const { position, offset } = event.nativeEvent;
        if (offset > 0.5 && position === 1) {
            updateDisplayedDate(nextDate);
        } else if (offset < 0.5 && position === 0) {
            updateDisplayedDate(prevDate);
        } else {
            updateDisplayedDate(date);
        }
    }, [date, nextDate, prevDate, updateDisplayedDate]);

    const handlePageSelected = useCallback((event: any) => {
        const pos = event.nativeEvent.position;
        if (pos === 2) {
            changeCurrentDate(nextDate);
        } else if (pos === 0) {
            changeCurrentDate(prevDate);
        }
    }, [nextDate, prevDate, changeCurrentDate]);

    return {
        currentDate:{
            date,
            naturalRelativeTime:dateRelativeTime,
            naturalLanguageDate
        },
        displayedDate: {
            date: displayedDate,
            naturalRelativeTime: displayedDateRelativeTime,
            naturalLanguageDate: naturalLanguageDisplayedDate
        },
        pager:{
            prevDate,
            nextDate,
            changeCurrentDate,
            handlePageScroll,
            handlePageSelected,
        }
    };
}