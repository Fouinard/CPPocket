import MultipleLessonsScreen from "@/features/schedule/screens/MultipleLessonsScreen";
import Logger from "@/shared/services/logger/Logger";


export default function MultipleLessons() {
    Logger.info("\n\nNavigated to MultipleLessons Screen\n\n");
    return (
        <MultipleLessonsScreen />
    );
}