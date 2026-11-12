import { EditLoginsScreen } from "@/features/options/screens/EditLoginsScreen";
import Logger from "@/shared/services/logger/Logger";

export default function EditLogins() {
    Logger.info("\n\nNavigated to EditLogins Screen\n\n");
    return <EditLoginsScreen />
}