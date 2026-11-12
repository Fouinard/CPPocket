import ScheduleScreen from "@/features/schedule/screens/ScheduleScreen";
import Logger from "@/shared/services/logger/Logger";


export default function Schedule() {
    Logger.info("\n\nNavigated to Schedule Screen\n\n");
    return (
        <ScheduleScreen />
    );
}