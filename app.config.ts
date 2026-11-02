import { ConfigContext, ExpoConfig } from "@expo/config";

const APP_PACKAGE = "com.fouinard.cppocket";

function getPackage() {
  switch (process.env.APP_VARIANT) {
    case "production":
      return APP_PACKAGE;
    default:
      return APP_PACKAGE + ".dev";
  }
}

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: config.name + (process.env.APP_VARIANT === "production" ? "" : " (dev)"),
  android: {
    ...config.android,
    package: getPackage()
  }
}) as ExpoConfig;