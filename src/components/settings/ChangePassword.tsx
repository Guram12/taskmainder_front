import '../../styles/settings/ChangePassword.css';
import React, { useEffect, useState } from 'react';
import { ThemeSpecs } from '../../utils/theme';
import { ProfileData } from '../../utils/interface';
import { FaEyeSlash } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import axiosInstance from '../../utils/axiosinstance';
import google_logo from "../../assets/google_logo.png";

interface ChangePasswordProps {
  currentTheme: ThemeSpecs;
  profileData: ProfileData;
  FetchProfileData: () => Promise<void>;
}

const ChangePassword: React.FC<ChangePasswordProps> = ({ currentTheme, profileData, FetchProfileData }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // States for validation rules
  const [isLongEnough, setIsLongEnough] = useState(false);
  const [hasUppercase, setHasUppercase] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isPasswordEccaptable, setIsPasswordEccaptable] = useState<boolean>(false);



  const is_social_account = profileData.is_social_account;
  // =========================================================================================================
  useEffect(() => {
    setIsLongEnough(newPassword.length >= 8);
    setHasUppercase(/[A-Z]/.test(newPassword));
    setHasNumber(/\d/.test(newPassword));
    if (newPassword.length > 0) {
      if (newPassword === confirmPassword) {
        setIsPasswordValid(true);
      }
      else {
        setIsPasswordValid(false);
      }
    }
  }, [newPassword, confirmPassword]);

  useEffect(() => {
    setIsPasswordEccaptable(validatePassword());
  }, [isLongEnough, hasUppercase, hasNumber, isPasswordValid, newPassword, confirmPassword]);


  const validatePassword = (): boolean => {
    return isLongEnough && hasUppercase && hasNumber && isPasswordValid;
  };

  // =================================================== change password function    ====================================================

  const handlePasswordChange = async () => {
    try {
      const response = await axiosInstance.post("/acc/password-change/", {
        new_password: confirmPassword,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      if (response.status === 200) {
        setSuccess("Password changed successfully.");
        setTimeout(() => {
          setSuccess('');
        }, 3000);
        setError('');
        setNewPassword('');
        setConfirmPassword('');
        setIsPasswordValid(false);
        await FetchProfileData();
      }
    } catch (error) {
      setError("Failed to change password.");
      setSuccess('');
    }
  };
  // =============================================  show password =================================================

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className='main_password_container'>
      <div className="password_change_container" style={{ backgroundColor: currentTheme["--background-color"] }}>
        <p className="password_change_p" style={{ color: currentTheme["--main-text-coloure"] }}>Change Password </p>
      </div>
      {is_social_account ? (
        <div className='social_account_case'>
          <img src={google_logo} alt="Google logo" className='google_logo' />
          <p className='social_account_case_p'>You are logged in using a social account. Password changes are not applicable.</p>
        </div>
      ) : (
        <div>
          <div className='password_change_inputs_cont'>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="password_input"
            />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="password_input"
            />
            {showPassword ? (
              <FaEye className='show_password' onClick={togglePasswordVisibility} />
            ) : (
              <FaEyeSlash className='show_password' onClick={togglePasswordVisibility} />
            )}
            <button disabled={!isPasswordEccaptable} onClick={handlePasswordChange} className="password_change_button">
              Change Password
            </button>
            {error && <p className="error_message">{error}</p>}
            {success && <p className="success_message">{success}</p>}
          </div>
          <div className='password_validations_container'>
            <p className='password_validations' style={{ color: isLongEnough ? 'limegreen' : 'red' }}>
            {!isLongEnough && <span>*</span>} hasUppercase Minimum 8 symbols
            </p>
            <p className='password_validations' style={{ color: hasUppercase ? 'limegreen' : 'red' }}>
              {!hasUppercase && <span>*</span>} At least one uppercase letter
            </p>
            <p className='password_validations' style={{ color: hasNumber ? 'limegreen' : 'red' }}>
              {!hasNumber && <span>*</span>} At least one number
            </p>

            <p className='password_validations' style={{ color: isPasswordValid ? 'limegreen' : 'red' }}>
              {isPasswordValid ? (
                <span>Passwords match</span>
              ) : (
                <span>* Passwords do not match</span>
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChangePassword;