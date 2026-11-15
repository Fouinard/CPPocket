// shared/components/modal/ConfirmModal.tsx
import { ReactNode } from 'react';
import { AppModal, ModalVariant } from './AppModal';

interface Props {
    visible: boolean;
    title: string;
    message?: ReactNode;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: ModalVariant;
    onCancel: () => void;
    onConfirm: () => void;
}

export function ConfirmationModal({
    visible, title, message, variant,
    confirmLabel = 'Confirmer', cancelLabel = 'Annuler',
    onCancel, onConfirm,
}: Props) {
    return (
        <AppModal
            visible={visible} title={title} message={message} variant={variant}
            onRequestClose={onCancel}
            actions={[
                { label: cancelLabel, onPress: onCancel, kind: 'secondary' },
                { label: confirmLabel, onPress: onConfirm, kind: 'primary' },
            ]}
        />
    );
}