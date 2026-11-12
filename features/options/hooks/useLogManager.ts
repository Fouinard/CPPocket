import Logger from "@/shared/services/logger/Logger";
import { useCallback, useEffect, useState } from "react";

export default function useLogManager() {
    const [fileSize, setFileSize] = useState(() => Logger.getLogFileSize())

    useEffect(() => {
        const refresh = () => setFileSize(Logger.getLogFileSize())
        refresh()
        return Logger.subscribe(refresh)
    }, [])

    const deleteAllLogs = useCallback(async () => {
        await Logger.deleteAllLogs()
    }, [])

    return { fileSize, deleteAllLogs }
}