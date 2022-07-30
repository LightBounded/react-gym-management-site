import { FC, MouseEvent } from "react";

interface ModalProps {
  close: () => void;
  isOpen: boolean;
}

const Modal: FC<ModalProps> = ({ children, isOpen, close }) => {
  const handleOverlayClick = (e: MouseEvent) => {
    const el = e.target as HTMLElement;
    el.classList.contains("modal") && close();
  };

  if (!isOpen) return null;

  return (
    <div
      className="modal modal-open modal-bottom cursor-pointer sm:modal-middle"
      onMouseDown={handleOverlayClick}
    >
      <div className="modal-box cursor-auto">{children}</div>
    </div>
  );
};

export default Modal;
