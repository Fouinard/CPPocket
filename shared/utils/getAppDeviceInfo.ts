import * as Application from "expo-application";
import * as Device from "expo-device";
import { Platform } from "react-native";

export function getAppDeviceInfo() {
    return {
        appName: Application.applicationName,
        appVersion: Application.nativeApplicationVersion,
        buildVersion: Application.nativeBuildVersion,

        manufacturer: Device.manufacturer,
        model: Device.modelName,
        brand: Device.brand,

        os: Platform.OS,
        osVersion: Device.osVersion,
        androidApiLevel: Device.platformApiLevel,
    };
}