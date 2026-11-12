import ADETreeScreen from '@/features/tree/screens/adetreescreen';
import Logger from '@/shared/services/logger/Logger';

export default function TreeScreen() {
    Logger.info("\n\nNavigated to TreeSelector Screen\n\n");
    return <ADETreeScreen />
}