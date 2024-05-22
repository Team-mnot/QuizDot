import { useState } from 'react';

export const useOpenModal = () => {
  const [isOpenModal, setIsOpenModal] = useState(false);

  const clickModal = () => {
    setIsOpenModal(true);
  };

  const closeModal = () => {
    setIsOpenModal(false);
  };

  return { isOpenModal, clickModal, closeModal };
};
