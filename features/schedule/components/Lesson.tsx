import { getHueFromString, getHueStyle } from "@/shared/utils/RandomColor";
import { formatTime, getDurationFormatted } from "@/shared/utils/Time";
import { Clock, MapPin, User } from "@getpapillon/papicons";
import { useState } from "react";
import { ColorValue, ScrollView, Text, View } from "react-native";

interface LessonData {
    startDate: Date,
    endDate: Date,
    teacher: string,
    subject: string,
    room: string,
    classType?: "TD" | "CM" | "TP" | null
}

interface LessonProps {
    lessonData: LessonData,
    backgroundColor?: ColorValue,
    accentColor?: ColorValue
}

export function Lesson(props: LessonProps) {

    const [hue] = useState(() => getHueFromString(props.lessonData.subject));
    const [duration] = useState(() => getDurationFormatted(props.lessonData.startDate, props.lessonData.endDate));

    return (
        <View className="flex flex-row w-full h-32 gap-4">
            <View className="flex flex-col items-end w-1/5 h-full">
                <Text className="text-primary font-inter font-medium text-xl">{formatTime(props.lessonData.startDate)}</Text>
                <Text className="text-primary font-inter font-extralight text-base">{formatTime(props.lessonData.endDate)}</Text>
            </View>
            <View className="bg-dynamic/33 flex-1 gap-3 flex-row rounded-[20px] h-full p-3" style={getHueStyle(hue)}>
                <View className="bg-dynamic h-full w-[6px] rounded-full"></View>
                <View className="flex-1 h-full flex-col justify-between">
                    <View className="flex flex-row items-center gap-2">
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            <Text numberOfLines={1} className="text-primary font-inter font-medium text-base">{props.lessonData.subject}</Text>
                        </ScrollView>
                        {props.lessonData.classType && <Text className="bg-primary text-black font-inter font-medium text-sm px-2 py-1 rounded-full">{props.lessonData.classType}</Text>}
                    </View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <View className=" flex flex-row items-center gap-1.5">
                            <MapPin className="fill-primary size-[17px]" color="white" />
                            <Text numberOfLines={1} className="text-primary font-inter font-medium text-base">{props.lessonData.room}</Text>
                        </View>
                    </ScrollView>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <View className="flex flex-row items-center gap-1.5">
                            <User className="fill-primary size-[17px]" color="white" />
                            <Text numberOfLines={1} className="text-primary font-inter font-medium text-base">{props.lessonData.teacher}</Text>
                        </View>
                    </ScrollView>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <View className="flex flex-row items-center gap-1.5">
                            <Clock className="fill-primary size-[17px]" color="white" />
                            <Text numberOfLines={1} className="text-primary font-inter font-medium text-base">{`${duration.heures}h${duration.minutes}`}</Text>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </View>
    )
}