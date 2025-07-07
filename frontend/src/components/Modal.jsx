import { useRef } from "react";

const Modal = ({ isOpen, onClose, children }) => {
  const modalRef = useRef();

  // Close modal if clicking outside the modal box
  const handleBackdropClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onMouseDown={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className="relative bg-white dark:bg-[#23272f] rounded-lg shadow-lg p-6 w-full max-w-md"
      >
        <button
          className="absolute top-1 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 font-semibold focus:outline-none mr-2 text-2xl"
          onClick={onClose}
          aria-label="Close modal"
        >
          
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;