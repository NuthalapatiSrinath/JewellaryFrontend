import { useSelector } from "react-redux";
import styles from "./MainModal.module.css";

// ADD: onClose prop to handle background clicks
function MainModal({ children, onClose }) {
  const activeModal = useSelector((state) => state.modal.type);

  return (
    <div
      className={styles.MainModal}
      // ADD: Close modal when background is clicked
      onClick={onClose}
    >
      {children}
    </div>
  );
}

export default MainModal;
