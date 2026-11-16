import { Pressable } from "react-native";
import Animated, { interpolate, interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

type SwitchProps = {
    value: { value: number };
    onPress: () => void;
    style?: any;
    duration?: number;
    trackColors?: { on: string; off: string };
};

export const Switch = ({
    value,
    onPress,
    style,
    duration = 400,
    trackColors = { on: '#82cab2', off: '#fa7f7c' },
}: SwitchProps) => {
    const height = useSharedValue(0);
    const width = useSharedValue(0);

    const trackAnimatedStyle = useAnimatedStyle(() => {
        const color = interpolateColor(
            value.value,
            [0, 1],
            [trackColors.off, trackColors.on]
        );
        const colorValue = withTiming(color, { duration });

        return {
            backgroundColor: colorValue,
            borderRadius: height.value / 2,
        };
    });

    const thumbAnimatedStyle = useAnimatedStyle(() => {
        const moveValue = interpolate(
            Number(value.value),
            [0, 1],
            [0, width.value - height.value]
        );
        const translateValue = withTiming(moveValue, { duration });

        return {
            transform: [{ translateX: translateValue }],
            borderRadius: height.value / 2,
        };
    });

    return (
        <Pressable onPress={onPress}>
            <Animated.View
                onLayout={(e) => {
                    height.value = e.nativeEvent.layout.height;
                    width.value = e.nativeEvent.layout.width;
                }}
                >
                <Animated.View
                    ></Animated.View>
            </Animated.View>
        </Pressable>
    );
};