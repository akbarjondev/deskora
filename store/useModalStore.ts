import { MODAL_TYPES } from 'core/types';
import { create } from 'zustand';

interface ModalStoreProps {
  current?: keyof typeof MODAL_TYPES;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
  setModal: (props: Omit<ModalStoreProps, 'setModal'>) => void;
}

export const useModalStore = create<ModalStoreProps>((set) => ({
  current: undefined,
  data: undefined,
  setModal(props) {
    set(props);
  }
}));

export const openModal = (type: keyof typeof MODAL_TYPES) => {
  useModalStore.getState().setModal({ current: type });
};

export const closeModal = () => {
  useModalStore.getState().setModal({ current: undefined, data: undefined });
};
