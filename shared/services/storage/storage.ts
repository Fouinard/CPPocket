import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import Logger from '../logger/Logger';

export class StorageManager {
    public static Secure = {
        async set(key: string, value: string): Promise<void> {
            try {
                Logger.info(`[SecureStore] Setting value for key: ${key}`);
                await SecureStore.setItemAsync(key, value);
            } catch (error) {
                Logger.error(`[SecureStore] Error writing (${key}):`, error);
            }
        },

        async get(key: string): Promise<string | null> {
            try {
                Logger.info(`[SecureStore] Reading value for key: ${key}`);
                return await SecureStore.getItemAsync(key);
            } catch (error) {
                Logger.error(`[SecureStore] Error reading (${key}):`, error);
                return null;
            }
        },

        async remove(key: string): Promise<void> {
            try {
                Logger.info(`[SecureStore] Removing value for key: ${key}`);
                await SecureStore.deleteItemAsync(key);
            } catch (error) {
                Logger.error(`[SecureStore] Error removing (${key}):`, error);
            }
        }
    };

    public static Default = {
        async set<T = any>(key: string, value: T): Promise<void> {
            try {
                Logger.info(`[AsyncStorage] Setting value for key: ${key}`);
                const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
                await AsyncStorage.setItem(key, stringValue);
            } catch (error) {
                Logger.error(`[AsyncStorage] Error writing (${key}):`, error);
            }
        },

        async get<T = any>(key: string): Promise<T | null> {
            try {
                Logger.info(`[AsyncStorage] Reading value for key: ${key}`);
                const value = await AsyncStorage.getItem(key);
                if (value === null) return null;

                try {
                    return JSON.parse(value) as T;
                } catch {
                    return value as unknown as T;
                }
            } catch (error) {
                Logger.error(`[DefaultStorage] Error reading (${key}):`, error);
                return null;
            }
        },

        async remove(key: string): Promise<void> {
            try {
                Logger.info(`[AsyncStorage] Removing value for key: ${key}`);
                await AsyncStorage.removeItem(key);
            } catch (error) {
                Logger.error(`[DefaultStorage] Error removing (${key}):`, error);
            }
        },

        async clearAll(): Promise<void> {
            try {
                Logger.info(`[AsyncStorage] Clearing all values.`);
                await AsyncStorage.clear();
            } catch (error) {
                Logger.error(`[DefaultStorage] Error clearing everything:`, error);
            }
        }
    };
}