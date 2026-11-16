import { ParsedTreeNode } from '@/features/tree/types';
import { ConfirmationModal } from '@/shared/components/modals/ConfirmationModal';
import Logger from '@/shared/services/logger/Logger';
import { Modal, Pressable, Text, View } from 'react-native';

interface Props {
    visible: boolean;
    pendingNode: ParsedTreeNode | null;
    onCancel: () => void;
    onConfirm: () => void;
}

export function TreeConfirmationModal({ visible, pendingNode, onCancel, onConfirm }: Props) {
    Logger.info("Rendering TreeConfirmationModal", { visible, pendingNode });
    return (
        <ConfirmationModal
            visible={visible}
            title="Changer de classe"
            message={<>Voulez-vous sélectionner <Text className="font-bold text-primary">{pendingNode?.label}</Text> ?</>}
            confirmLabel="Confirmer"
            cancelLabel="Annuler"
            onCancel={onCancel}
            onConfirm={onConfirm}
        />
    );
}