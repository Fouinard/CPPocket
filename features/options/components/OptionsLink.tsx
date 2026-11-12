import { Href, Link, useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

interface OptionsLinkProps {
    href: Href,
    mainText: string,
    icon?: React.ReactNode,
    description?: string
    onPress?: () => void
}

export default function OptionsLink(props: OptionsLinkProps) {

    const router = useRouter();

    return (
        <View>
            <Link href={props.href} asChild onPress={props.onPress}>
                <Pressable android_ripple={{ color: "#434147", }} onPress={() => router.push(props.href as any)} className="overflow-hidden p-5">
                    <View className="flex flex-row items-center gap-4">
                        {props.icon}
                        <View className="flex flex-col">
                            <Text className="text-text text-xl">{props.mainText}</Text>
                            {props.description && <Text className="text-grey text-lg">{props.description}</Text>}
                        </View>
                    </View>
                </Pressable>
            </Link>
        </View>
    )
}