import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import styles from "./RenderModal.module.css";

import MainModal from "../MainModal/MainModal";
import SearchModal from "../SearchModal/SearchModal";
import AuthModal from "../AuthModal/AuthModal";
import ViewDetails from "../ViewDetails/ViewDetails";
// ?import AddProductModal from "../AddProductModal/AddProductModal";
import { closeModal } from "../../redux/slices/modalSlice";

export default function RenderModal() {
  const dispatch = useDispatch();
  const modalState = useSelector((s) => s.modal || {});

  const rawActive =
    modalState.type ?? modalState.modalName ?? modalState.modal ?? null;
  const activeModal = rawActive === null ? null : String(rawActive);
  const modalData = modalState.modalData ?? modalState.payload ?? null;
  const isOpen = modalState.isOpen ?? false;

  const handleClose = () => dispatch(closeModal());

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const key = activeModal ? activeModal.toUpperCase() : null;

  const renderContent = () => {
    switch (key) {
      case "SEARCH":
        return (
          <SearchModal
            open={isOpen}
            onClose={handleClose}
            position="top"
            topOffset={110}
            data={modalData}
          />
        );
      case "AUTH":
        return (
          <AuthModal open={isOpen} onClose={handleClose} data={modalData} />
        );
      case "VIEW_DETAILS":
      case "VIEWDETAILS":
        return (
          <ViewDetails open={isOpen} onClose={handleClose} data={modalData} />
        );

      default:
        return null;
    }
  };

  const content = renderContent();

  return (
    // PASS handleClose to MainModal so background clicks work
    <MainModal onClose={handleClose}>
      <AnimatePresence mode="wait">
        {isOpen && content && (
          <motion.div
            key={key}
            className={styles.RenderModal}
            // IMPORTANT: Stop click propagation so clicking the modal form doesn't close it
            onClick={(e) => e.stopPropagation()}
            // UPDATED ANIMATION: Scale up from center instead of sliding from right
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </MainModal>
  );
}
