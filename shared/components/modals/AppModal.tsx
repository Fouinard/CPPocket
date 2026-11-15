import { ReactNode, useEffect, useRef, useState } from 'react';
import { Animated, BackHandler, Pressable, StyleSheet, Text, View } from 'react-native';

export type ModalVariant = 'default' | 'danger' | 'success' | 'warning';

const BUTTON_VARIANT: Record<ModalVariant, { bg: string; text: string }> = {
    default: { bg: 'bg-primary', text: 'text-black' },
    danger: { bg: 'bg-red-500', text: 'text-white' },
    success: { bg: 'bg-green-500', text: 'text-white' },
    warning: { bg: 'bg-amber-400', text: 'text-black' },
};

export interface ModalAction {
    label: string;
    onPress: () => void;
    kind?: 'primary' | 'secondary';
}

interface Props {
    visible: boolean;
    title: string;
    message?: ReactNode;
    children?: ReactNode;
    actions: ModalAction[];
    variant?: ModalVariant;
    onRequestClose: () => void;
    dismissOnBackdrop?: boolean;
    animated?: boolean;
}



export function AppModal({
    visible, title, message, children, actions,
    variant = 'default', onRequestClose, dismissOnBackdrop = false,
    animated = false,
}: Props) {
    const button_variant = BUTTON_VARIANT[variant];
    const opacity = useRef(new Animated.Value(0)).current;
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        if (visible) {
            setMounted(true);
            if (animated) {
                Animated.timing(opacity, { toValue: 1, duration: 150, useNativeDriver: true }).start();
            } else {
                opacity.setValue(1);
            }
        } else if (animated) {
            Animated.timing(opacity, { toValue: 0, duration: 150, useNativeDriver: true })
                .start(({ finished }) => { if (finished) setMounted(false); });
        } else {
            opacity.setValue(0);
            setMounted(false);
        }
    }, [visible, animated, opacity]);

    useEffect(() => {
        if (!visible) return;
        const sub = BackHandler.addEventListener('hardwareBackPress', () => {
            onRequestClose();
            return true;
        });
        return () => sub.remove();
    }, [visible, onRequestClose]);

    if (!mounted) return null;

    return (
        <Animated.View
            style={[StyleSheet.absoluteFill, { opacity, zIndex: 9999, elevation: 9999 }]}
        >
            <View className="flex-1 bg-black/50 justify-center items-center px-5">
                <Pressable
                    style={StyleSheet.absoluteFill}
                    onPress={dismissOnBackdrop ? onRequestClose : undefined}
                />
                <View className="bg-white dark:bg-gray-800 p-6 rounded-3xl w-full max-w-sm shadow-xl">
                    <Text className="text-xl font-semibold text-text mb-2">{title}</Text>
                    {message != null && (
                        <Text className="text-base text-gray-500 mb-6">{message}</Text>
                    )}
                    {children}
                    <View className="flex-row justify-end gap-3">
                        {actions.map((action) => {
                            const primary = (action.kind ?? 'secondary') === 'primary';
                            return (
                                <Pressable
                                    key={action.label}
                                    onPress={action.onPress}
                                    className={`px-4 py-2 rounded-xl ${primary ? button_variant.bg : 'bg-gray-100 dark:bg-gray-700'}`}
                                >
                                    <Text className={`font-medium ${primary ? button_variant.text : 'text-gray-700 dark:text-gray-200'}`}>
                                        {action.label}
                                    </Text>
                                </Pressable>
                            );
                        })}
                    </View>
                </View>
            </View>
        </Animated.View>
    );
}