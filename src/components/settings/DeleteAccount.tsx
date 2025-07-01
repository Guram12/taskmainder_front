import '../../styles/settings/DeleteAccount.css';
import React, { useEffect, useState } from 'react';
import { ThemeSpecs } from '../../utils/theme';
import axiosInstance from '../../utils/axiosinstance';
import axios from 'axios'; // Import axios
import { useNavigate } from 'react-router-dom';


interface DeleteAccountProps {
  currentTheme: ThemeSpecs;
}

const DeleteAccount: React.FC<DeleteAccountProps> = ({ currentTheme }) => {
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [confirmationInput, setConfirmationInput] = useState('');
  const [isConfirmationCorrect, setIsConfirmationCorrect] = useState<boolean>(false);

  const navigate = useNavigate();
  // ============================================   delete account    ============================================
  const deleteAccount = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axiosInstance.delete('acc/delete-account/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(response.data);
      alert('Account deleted successfully.');
      navigate('/');
    } catch (error) {
      if (axios.isAxiosError(error)) { // Use axios.isAxiosError
        // Handle Axios-specific error
        console.error(error.response?.data || error.message);
      } else {
        // Handle non-Axios errors
        console.error(error);
        alert('An unexpected error occurred. Please try again.');
      }
    }
  };

  // =====================================   handle click for delete button   ==========================================
  const handleDeleteClick = () => {
    setIsConfirmationOpen(true);
  };

  const handleConfirmDelete = () => {
    if (confirmationInput === 'delete my account') {
      deleteAccount();
      setIsConfirmationOpen(false);
    } else {
      alert('You must type "delete my account" to confirm.');
    }
  };

  const handleCancel = () => {
    setIsConfirmationOpen(false);
    setConfirmationInput('');
  };

  useEffect(() => {
    if (confirmationInput === 'delete my account') {
      setIsConfirmationCorrect(true);
    } else {
      setIsConfirmationCorrect(false);
    }
  }, [confirmationInput]);

  return (
    <div className='main_delete_acc_container' style={{ color: currentTheme['--main-text-coloure'] }}>
      <div className="delete_acc_header_cont"
        style={{
          backgroundColor: currentTheme["--background-color"],
        }}
      >
        <p className="delete_acc_header_p">
          Danger Zone
        </p>
      </div>
      <h1 className='delete_aqq_h1' style={{ color: currentTheme['--main-text-coloure'] }} >Delete Your Account</h1>
      <button
        className='main_delete_account_button'
        onClick={handleDeleteClick}
        style={{ color: currentTheme['--main-text-coloure'] }}
      >
        Delete
      </button>

      {isConfirmationOpen && (
        <>
          <div className="modal-overlay"></div> {/* Dark overlay */}
          <div className="confirmation-modal" style={{ backgroundColor: currentTheme["--background-color"] }}>
            <h2 style={{ color: currentTheme['--main-text-coloure'] }}>Type "delete my account" to confirm:</h2>
            <input
              type="text"
              value={confirmationInput}
              onChange={(e) => setConfirmationInput(e.target.value)}
              placeholder="Type here..."
              className='confirmation-input'
              style={{
                color: currentTheme['--main-text-coloure'],
                backgroundColor: currentTheme['--list-background-color'],
                borderColor: currentTheme['--border-color'],
                ['--placeholder-color']: currentTheme['--due-date-color']
              } as React.CSSProperties}
            />
            <div className="confirmation-buttons">
              <button
                className='delete_acc_buutton'
                onClick={handleConfirmDelete}
                disabled={!isConfirmationCorrect}
                style={{
                  color: currentTheme['--main-text-coloure'],
                  backgroundColor: !isConfirmationCorrect ? currentTheme['--list-background-color'] : 'red',
                  cursor: isConfirmationCorrect ? 'pointer' : 'not-allowed',
                }}
              >
                Confirm</button>
              <button
                onClick={handleCancel}
                className='cancel_button'
                style={{
                  color: currentTheme['--main-text-coloure'],
                  backgroundColor: currentTheme['--list-background-color'],
                }}

              >Cancel</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DeleteAccount;