import Logger from "@/shared/services/logger/Logger";
import { StorageManager } from "@/shared/services/storage/storage";
import { fetch } from "expo/fetch";
import { Manifest } from "./types";

export class LegalsUpdater {
    private static remoteManifestUrl = "https://cdn.fouinard.fr/CPPocket/manifest.json";
    static async getLocalManifest() {
        const manifest = await StorageManager.Default.get("legalsManifest");
        if (!manifest) return {
            manifestId: "no-manifest",
        } as Manifest
        return manifest as Manifest
    }

    static async getRemoteManifest() {
        const response = await fetch(this.remoteManifestUrl);
        const manifest: Manifest = await response.json();
        return manifest;
    }

    static async setLocalManifest(manifest: Manifest) {
        await StorageManager.Default.set("legalsManifest", JSON.stringify(manifest));
    }

    static async isUpdateAvailable() {
        const localManifest = await this.getLocalManifest();
        const remoteManifest = await this.getRemoteManifest();
        const updateAvailable = localManifest.manifestId != remoteManifest.manifestId;
        if (updateAvailable) {
            Logger.info("Update available for legals");
            Logger.info("Local manifest ", localManifest);
            Logger.info("Remote manifest", remoteManifest);
        }
        return [updateAvailable, localManifest.cguVersion != remoteManifest.cguVersion, localManifest.privacyVersion != remoteManifest.privacyVersion];
    }
}