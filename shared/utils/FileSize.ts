export function formatFileSize(bytes: number): string {
    if (bytes < 0) return "0 o";

    const units = ["o", "ko", "Mo", "Go"];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
    }

    return `${Number(size.toFixed(2))} ${units[unitIndex]}`;
}