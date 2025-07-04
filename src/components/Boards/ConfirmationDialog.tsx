import React from 'react';
import '../../styles/Board Styles/ConfirmationDialog.css';
import ReactDOM from 'react-dom';
import { ThemeSpecs } from '../../utils/theme';
import { useTranslation } from 'react-i18next';




interface ConfirmationDialogProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  currentTheme: ThemeSpecs;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({ message, onConfirm, onCancel, currentTheme }) => {
  const { t } = useTranslation();

  return (
    <>
      {ReactDOM.createPortal(
        <div className="confirmation-dialog-overlay">
          <div className="confirmation-dialog" style={{
            backgroundColor: currentTheme['--list-background-color'],
          }} >
            <p className='conf_text' style={{
              color: currentTheme['--main-text-coloure'],

            }} >{message}</p>
            <div className="confirmation-dialog-buttons">
              <button
                className="confirm-button"
                style={{
                  color: currentTheme['--main-text-coloure'],
                  backgroundColor: currentTheme['--task-background-color']
                }}
                onClick={onConfirm}
              >{t('yes')}
              </button>
              <button
                className="cancel-button"
                style={{
                  color: currentTheme['--main-text-coloure'],
                  backgroundColor: currentTheme['--task-background-color']
                }}
                onClick={onCancel}
              >{t('no')}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};



export default ConfirmationDialog;