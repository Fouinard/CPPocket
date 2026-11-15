// shared/components/modal/ModalProvider.tsx
import { createContext, ReactNode, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { AppModal, ModalAction, ModalVariant } from '../modals/AppModal';

interface ConfirmOptions {
    title: string;
    message?: ReactNode;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: ModalVariant;
}

interface AlertOptions {
    title: string;
    message?: ReactNode;
    okLabel?: string;
    variant?: ModalVariant;
}

interface ModalApi {
    confirm: (options: ConfirmOptions) => Promise<boolean>;
    alert: (options: AlertOptions) => Promise<void>;
}

interface ModalState {
    visible: boolean;
    title: string;
    message?: ReactNode;
    variant?: ModalVariant;
    actions: ModalAction[];
    onRequestClose: () => void;
}

const ModalContext = createContext<ModalApi | null>(null);

const INITIAL: ModalState = {
    visible: false,
    title: '',
    actions: [],
    onRequestClose: () => {},
};

export function ModalProvider({ children }: { children: ReactNode }) {
    const [modal, setModal] = useState<ModalState | null>(INITIAL);
    const resolver = useRef<((value: boolean) => void) | null>(null);

    const close = useCallback((result: boolean) => {
        setModal((modal) => (modal ? { ...modal, visible: false } : modal));
        resolver.current?.(result);
        resolver.current = null;
    }, []);

    const confirm = useCallback((options: ConfirmOptions) => {
        return new Promise<boolean>((resolve) => {
            resolver.current = resolve;
            setModal({
                visible: true,
                title: options.title,
                message: options.message,
                variant: options.variant,
                onRequestClose: () => close(false),
                actions: [
                    { label: options.cancelLabel ?? 'Annuler', onPress: () => close(false), kind: 'secondary' },
                    { label: options.confirmLabel ?? 'Confirmer', onPress: () => close(true), kind: 'primary' },
                ],
            });
        });
    }, [close]);

    const alert = useCallback((options: AlertOptions) => {
        return new Promise<void>((resolve) => {
            resolver.current = () => resolve();
            setModal({
                visible: true,
                title: options.title,
                message: options.message,
                variant: options.variant,
                onRequestClose: () => close(true),
                actions: [{ label: options.okLabel ?? 'OK', onPress: () => close(true), kind: 'primary' }],
            });
        });
    }, [close]);

    const api = useMemo(() => ({ confirm, alert }), [confirm, alert]);

    return (
        <ModalContext.Provider value={api}>
            {children}
            {modal && <AppModal {...modal} />}
        </ModalContext.Provider>
    );
}

export function useModal() {
    const ctx = useContext(ModalContext);
    if (!ctx) throw new Error('useModal doit être utilisé dans un <ModalProvider>');
    return ctx;
}