import OptionsScreen from "@/features/options/screens/OptionScreen";
import Logger from "@/shared/services/logger/Logger";

export default function Options() {
    Logger.info("\n\nNavigated to Options Screen\n\n");
    return <OptionsScreen />
}