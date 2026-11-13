import { Calendar, Code, Gears } from "@getpapillon/papicons";
import { Link, RelativePathString, usePathname } from "expo-router";
import { StorageManager } from "@/shared/services/storage/storage";
import { Pressable, Text, View } from "react-native";
import { useEffect, useState } from "react";
import Logger from "../services/logger/Logger";

export default function BottomNavBar() {
    Logger.info("Rendering BottomNavBar");
    const disabledPathnames = ["/startup", "/(options)/treeselector", "/viewers/MarkdownViewer", "/logs"];
    const pathname = usePathname();
    const [developerMode, setDeveloperMode] = useState(false);
    const navBar = [
        {
            icon: Calendar,
            text: "Cours",
            open: ["/schedule/schedule", "/schedule/multiplelessons"]
        }, {
            icon: Gears,
            text: "Options",
            open: ["/options", "/treeselector", "/editlogins", "/about", "/logsmanaging"]
        }, {
            icon: Code,
            text: "Dev",
            open: ["/dev"]
        }
    ];
    useEffect(() => {
        const checkDeveloperMode = async () => {
            const isDevModeEnabled = await StorageManager.Default.get("developerMode");
            Logger.info("Checking developer mode in BottomNavBar", isDevModeEnabled);
            setDeveloperMode(Boolean(isDevModeEnabled));
        };
        checkDeveloperMode();
    }, [])
    return (
        <View className="w-full flex-row justify-center items-center" style={{ display: disabledPathnames.includes(pathname) ? "none" : "flex" }}>
            <View className="flex-row w-4/5 justify-around p-2 bg-black rounded-[36px] absolute bottom-[4.5rem]">
                {navBar.map((item, index) => {
                    if (item.open.includes("/dev")) {
                        if(!developerMode) return null;
                    }
                    return (
                        <Link href={item.open[0] as RelativePathString} key={index} asChild>
                            <Pressable className={`flex-1 flex-col items-center rounded-[28px] pt-2 pb-1 ${item.open.includes(pathname) ? "bg-gray-700" : ""}`}>
                                <item.icon size={30} color={item.open.includes(pathname) ? "#F0436E" : "white"} />
                                <Text className={`text-white ${item.open.includes(pathname) ? "text-[#F0436E]" : ""} text-base font-semibold`}>
                                    {item.text}
                                </Text>
                            </Pressable>
                        </Link>
                    );
                })}
            </View>
        </View>
    );
}