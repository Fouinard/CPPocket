import OptionsLink from "@/features/options/components/OptionsLink";
import colors from "@/styles/colors";
import { GraduationHat, Info, Lock, List } from "@getpapillon/papicons";
import { ScrollView, Text } from "react-native";
import DisconnectButton from "../components/DisconnectButton";

export default function OptionsScreen() {
    return (
        <ScrollView className="flex-1 pt-16 bg-bg">
            <Text className="text-text text-3xl font-semibold h-20 px-5">Options</Text>
            <OptionsLink href="/(options)/editlogins" mainText="Identifiants" description="Modifier vos identifiants Agalan" icon={<Lock color={colors.text} className="size-[17px]"/>}/>
            <OptionsLink href="/(options)/treeselector" mainText="Classe" description="Modifier votre classe" icon={<GraduationHat color={colors.text} className="size-[17px]"/>}/>
            <OptionsLink href="/(options)/logsmanaging" mainText="Journaux" description="Gérer les journaux de l'application" icon={<List color={colors.text} className="size-[17px]"/>}/>
            <OptionsLink href="/(options)/about" mainText="À propos" description="Informations sur l'application" icon={<Info color={colors.text} className="size-[17px]"/>}/>
            <DisconnectButton />
        </ScrollView>
    );
}