import '../../styles/Board Styles/ConfirmationDialog.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeSpecs } from '../../utils/theme';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';

interface ConfirmationDialogProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  currentTheme: ThemeSpecs;
  isOpen: boolean;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  message,
  onConfirm,
  onCancel,
  currentTheme,
  isOpen
}) => {
  const { t } = useTranslation();

  return (
    <>
      {ReactDOM.createPortal(
        <AnimatePresence>
          {isOpen && (
            <div className="confirmation-dialog-overlay" >
              <motion.div
                className="confirmation-dialog"
                style={{
                  backgroundColor: currentTheme['--list-background-color'],
                }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 25,
                  duration: 0.5
                }}
              >
                <p
                  className="conf_text"
                  style={{
                    color: currentTheme['--main-text-coloure'],
                  }}
                >
                  {message}
                </p>
                <div className="confirmation-dialog-buttons">
                  <button
                    className="confirm-button"
                    style={{
                      color: currentTheme['--main-text-coloure'],
                      backgroundColor: currentTheme['--task-background-color'],
                    }}
                    onClick={onConfirm}
                  >
                    {t('yes')}
                  </button>
                  <button
                    className="cancel-button"
                    style={{
                      color: currentTheme['--main-text-coloure'],
                      backgroundColor: currentTheme['--task-background-color'],
                    }}
                    onClick={onCancel}
                  >
                    {t('no')}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};

export default ConfirmationDialog;
// ...existing code...