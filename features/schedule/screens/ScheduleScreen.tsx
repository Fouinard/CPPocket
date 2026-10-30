import { useStartupContext } from "@/shared/components/contexts/StartupContext";
import DateTimePicker from '@expo/ui/community/datetime-picker';
import PagerView, { type PagerViewRef } from '@expo/ui/community/pager-view';
import { useEffect, useRef, useState } from "react";
import { Pressable, Text, View } from "react-native";
import ScheduleDay from "../components/ScheduleDay";
import useSchedulePager from "../hooks/useSchedulePager";

export default function ScheduleScreen() {
    const setStartupReady = useStartupContext();

    const { currentDate, displayedDate, pager } = useSchedulePager();

    const pagerRef = useRef<PagerViewRef>(null);

    const [timePickerShow, setTimePickerShow] = useState(false);

    useEffect(() => {
        setStartupReady();
    });

    return (
        <View className="flex-1 pt-16 bg-bg px-5">
            {timePickerShow && (
                <DateTimePicker
                    testID="dateTimePicker"
                    value={currentDate.date}
                    mode="date"
                    is24Hour={true}
                    onValueChange={(event, selectedDate) => {
                        if (selectedDate) {
                            pager.changeCurrentDate(selectedDate);
                        }
                        setTimePickerShow(false);
                    }}
                    onDismiss={() => setTimePickerShow(false)}
                />
            )}

            <Pressable onPress={() => setTimePickerShow(true)}>
                <Text className="text-text text-3xl font-semibold">
                    {displayedDate.naturalLanguageDate}
                </Text>
                <Text className="text-grey text-lg font-normal">
                    {displayedDate.naturalRelativeTime}
                </Text>
            </Pressable>

            <PagerView
                key={currentDate.date.toISOString()}
                ref={pagerRef}
                initialPage={1}
                className="flex-1"
                onPageSelected={pager.handlePageSelected}
                onPageScroll={pager.handlePageScroll}
            >
                <ScheduleDay date={pager.prevDate} />
                <ScheduleDay date={currentDate.date} />
                <ScheduleDay date={pager.nextDate} />
            </PagerView>
        </View>
    );
}