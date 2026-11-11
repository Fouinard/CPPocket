import { ADEApi } from "@/shared/services/ade/adeApi";
import { StorageManager } from "@/shared/services/storage/storage";
import colors from "@/styles/colors";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Pressable, Text, TextInput, TextInputInstance, View } from "react-native";
import Toast from "react-native-toast-message";

export function EditLoginsScreen() {

    const [username, setUsername] = useState<string | null>(null);
    const [password, setPassword] = useState<string | null>(null);

    const usernameInputRef = useRef<TextInputInstance>(null);
    const passwordInputRef = useRef<TextInputInstance>(null);

    useEffect(() => {
        const init = async () => {
            const storedUsername = await StorageManager.Secure.get("username");
            setUsername(storedUsername);
            usernameInputRef.current?.setNativeProps({ text: storedUsername || "" });
        }
        init();
    }, [])

    const saveCredentials = async () => {
        const storedPassword = await StorageManager.Secure.get("password")
        const credentials = {
            username: username || "",
            password: password || storedPassword || "",
        }

        Toast.hide()
        try {
            await ADEApi.Auth.createSession(credentials)
        } catch (error) {
            Toast.show({
                type: "error",
                text2: "Identifiants invalides !",
                position: "bottom",
            })
            return
        }

        await StorageManager.Secure.set("username", credentials.username)
        if (password) {
            await StorageManager.Secure.set("password", password)
        }
        Toast.show({
            type: "success",
            text2: "Identifiants enregistrés avec succès !",
            position: "bottom"
        })
        router.back()
    }

    return (
        <View className="flex-1 pt-16 bg-bg px-5">
            <Text className="text-text text-3xl font-semibold h-20">
                Modifier vos identifiants
            </Text>
            <View className="flex flex-col gap-4">
                <View className="flex flex-col gap-2">
                    <Text className="text-text text-xl">
                        Nom d'utilisateur
                    </Text>
                    <TextInput
                        ref={usernameInputRef}
                        placeholder="nomp"
                        autoCapitalize="none"
                        keyboardType="visible-password"
                        className="text-text border border-text p-2 rounded-md"
                        placeholderTextColor={colors.grey}
                        onChangeText={setUsername}
                    />
                </View>
                <View className="flex flex-col gap-2">
                    <Text className="text-text text-xl">
                        Mot de passe
                    </Text>
                    <TextInput
                        ref={passwordInputRef}
                        placeholder="Laissez ce champ vide pour ne pas modifier votre mot de passe"
                        autoCapitalize="none"
                        onChangeText={setPassword}
                        className="text-text border border-text p-2 rounded-md"
                        placeholderTextColor={colors.grey}
                        secureTextEntry
                    />
                </View>
            </View>
            <Pressable
                className="mt-10 p-2 border border-text rounded-md w-1/2 self-center"
                onPress={saveCredentials}
            >
                <Text className="text-text text-center">
                    Enregistrer
                </Text>
            </Pressable>
        </View>
    )
}