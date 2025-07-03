import "../styles/NoBoards.css";
import React from "react"
import { ThemeSpecs } from "../utils/theme";
import nothink_selected from '../assets/nothing_selected.png';
import { useTranslation } from 'react-i18next';



interface NoBoardProps {
  currentTheme: ThemeSpecs;
}

const NoBoards: React.FC<NoBoardProps> = ({ currentTheme }) => {
  const { t } = useTranslation();

  return (
    <div className="no_boards_container" style={{ color: currentTheme['--main-text-coloure'] }}>
      <img src={nothink_selected} alt="nothing selected" className="nothing_selected_img" />
      <h2>{t('no_boards_available')}</h2>
      <p>{t('please_create_a_new_board_to_get_started.')}</p>
    </div>
  );
}



export default NoBoards;
















