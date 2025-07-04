import '../../styles/settings/ChangePassword.css';
import React, { useEffect, useState } from 'react';
import { ThemeSpecs } from '../../utils/theme';
import { ProfileData } from '../../utils/interface';
import { FaEyeSlash } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import axiosInstance from '../../utils/axiosinstance';
import google_logo from "../../assets/google_logo.png";
import PulseLoader from "react-spinners/PulseLoader";
import { useTranslation } from 'react-i18next';




interface ChangePasswordProps {
  currentTheme: ThemeSpecs;
  profileData: ProfileData;
  FetchProfileData: () => Promise<void>;
}

const ChangePassword: React.FC<ChangePasswordProps> = ({ currentTheme, profileData, FetchProfileData }) => {
  const [oldPassword, setOldPassword] = useState<string>('');
  const [isOldPasswordCorrect, setIsOldPasswordCorrect] = useState<boolean | undefined>(undefined);
  const [oldPasswordLoading, setOldPasswordLoading] = useState<boolean | undefined>(undefined);


  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // States for validation rules
  const [isLongEnough, setIsLongEnough] = useState<boolean>(false);
  const [hasUppercase, setHasUppercase] = useState<boolean>(false);
  const [hasNumber, setHasNumber] = useState<boolean>(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isPasswordEccaptable, setIsPasswordEccaptable] = useState<boolean>(false);


  const { t } = useTranslation();
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
  // =====================================  check old password password ============================================



  const checkOldPassword = async () => {
    try {
      const response = await axiosInstance.post("/acc/check-old-password/", {
        old_password: oldPassword,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      if (response.status === 200) {
        setIsOldPasswordCorrect(response.data.is_correct);
        console.log("Old password is correct.", response.data);
      } else {
        setIsOldPasswordCorrect(false);
      }
    } catch (error) {
      console.error("Error checking old password:", error);
      setIsOldPasswordCorrect(false);
    } finally {
      setOldPasswordLoading(false);
    }
  };

  useEffect(() => {
    setOldPasswordLoading(true);
    if (!oldPassword) {
      setIsOldPasswordCorrect(false);
      return;
    }

    const handler = setTimeout(() => {
      checkOldPassword();
    }, 500); // 500ms debounce

    return () => {
      clearTimeout(handler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [oldPassword, isOldPasswordCorrect]);

  // =============================================  show password =================================================

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className='main_password_container' style={{ borderColor: currentTheme['--border-color'] }} >
      <div className="password_change_container"
        style={{
          backgroundColor: currentTheme["--background-color"],
          borderColor: currentTheme["--border-color"]
        }}
      >
        <p className="password_change_p" style={{ color: currentTheme["--main-text-coloure"] }}>{t('change_Password')}</p>
      </div>
      {is_social_account ? (
        <div className='social_account_case'>
          <img src={google_logo} alt="Google logo" className='google_logo' />
          <p className='social_account_case_p'>{t('you_are_logged_in_using_a_social')}</p>
        </div>
      ) : (
        <div>
          <div className='password_change_inputs_cont'>
            {/* old password check  */}
            <input
              type={showPassword ? "text" : "password"}
              placeholder={t('old_Password')}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="password_input"
              style={{
                borderColor: currentTheme['--border-color'],
                color: currentTheme['--main-text-coloure'],
                backgroundColor: currentTheme['--list-background-color'],
                ['--placeholder-color']: currentTheme['--due-date-color']
              } as React.CSSProperties}
            />

            {oldPassword && !oldPasswordLoading && isOldPasswordCorrect === true && (
              <p className='old_password_correct'>{t('correct')}</p>
            )}
            {oldPassword && !oldPasswordLoading && isOldPasswordCorrect === false && (
              <p className='old_password_incorrect'>{t('incorrect')}</p>
            )}

            {oldPassword && oldPasswordLoading && (
              <PulseLoader
                className='old_password_loading'
                color={currentTheme['--task-background-color']}
                size={10} 
              />
            )}
            <input
              type={showPassword ? "text" : "password"}
              placeholder={t('new_Password')}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="password_input"
              style={{
                borderColor: currentTheme['--border-color'],
                color: currentTheme['--main-text-coloure'],
                backgroundColor: currentTheme['--list-background-color'],
                ['--placeholder-color']: currentTheme['--due-date-color']
              } as React.CSSProperties}
            />
            <input
              type={showPassword ? "text" : "password"}
              placeholder={t('confirm_new_Password')}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="password_input"
              style={{
                borderColor: currentTheme['--border-color'],
                color: currentTheme['--main-text-coloure'],
                backgroundColor: currentTheme['--list-background-color'],
                ['--placeholder-color']: currentTheme['--due-date-color']
              } as React.CSSProperties}
            />
            {showPassword ? (
              <FaEye className='show_password' onClick={togglePasswordVisibility} />
            ) : (
              <FaEyeSlash className='show_password' onClick={togglePasswordVisibility} />
            )}

            <button
              disabled={!isPasswordEccaptable || isOldPasswordCorrect === false}
              onClick={handlePasswordChange}
              className="password_change_button"
              style={{
                color: currentTheme['--main-text-coloure'],
                backgroundColor: currentTheme['--list-background-color'],
                borderColor: currentTheme['--border-color'],
                cursor: isPasswordEccaptable && isOldPasswordCorrect ? 'pointer' : 'not-allowed'
              }}
            >
              {t('change_Password')}
            </button>


          </div>

          <div className='password_validations_container'>
            <p className='password_validations' style={{ color: isLongEnough ? 'seagreen' : 'red' }}>
              {!isLongEnough && <span>*</span>} {t('minimum_8_symbols')}
            </p>
            <p className='password_validations' style={{ color: hasUppercase ? 'seagreen' : 'red' }}>
              {!hasUppercase && <span>*</span>} {t('at_least_one_uppercase_letter')}
            </p>
            <p className='password_validations' style={{ color: hasNumber ? 'seagreen' : 'red' }}>
              {!hasNumber && <span>*</span>} {t('at_least_one_number')}
            </p>

            <p className='password_validations' style={{ color: isPasswordValid ? 'seagreen' : 'red' }}>
              {isPasswordValid ? (
                <span>{t('passwords_match')}</span>
              ) : (
                <span>{t('Passwords_do_not_match')}</span>
              )}
            </p>

          </div>
          {error && <p className="error_message">{error}</p>}
          {success && <p className="success_message">{success}</p>}
        </div>
      )}
    </div>
  );
};

export default ChangePassword;