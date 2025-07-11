import '../styles/MindMap.css';
import React from 'react';
import { board } from '../utils/interface';
import { ThemeSpecs } from '../utils/theme';
import { useTranslation } from 'react-i18next';



interface Props {
  editingBoard: board | null;
  isBoardEditModalOpen: boolean;
  currentTheme: ThemeSpecs;
  handleCancelBoardEdit: () => void;
  boardNameInput: string;
  setBoardNameInput: (name: string) => void;
  handleBoardNameUpdate: () => void;
}

const Mindmap_BoardName_Modal: React.FC<Props> = ({
  editingBoard,
  isBoardEditModalOpen,
  currentTheme,
  handleCancelBoardEdit,
  boardNameInput,
  setBoardNameInput,
  handleBoardNameUpdate,
}) => {

  if (!isBoardEditModalOpen || !editingBoard) return null;

  const { t } = useTranslation();


  return (
    <div className="diagram_new_item_container">
      <div
        className="new_item_modal"
        style={{
          background: currentTheme['--background-color'],
          border: `1px solid ${currentTheme['--border-color']}`,
        }}
      >
        <h3 style={{
          color: currentTheme['--main-text-coloure'],
          marginBottom: '15px',
          fontSize: '16px'
        }}>
          {t('board_name_edit')}
        </h3>
        <input
          type="text"
          value={boardNameInput}
          onChange={e => setBoardNameInput(e.target.value)}
          onKeyPress={e => {
            if (e.key === 'Enter' && boardNameInput.trim()) {
              handleBoardNameUpdate();
            }
          }}
          className="boardname_update_input"
          style={{
            background: currentTheme['--task-background-color'],
            color: currentTheme['--main-text-coloure'],
            ['placeholder-color']: currentTheme['--due-date-color']
          } as React.CSSProperties}
          placeholder={t('edit_board_name')}
          autoFocus
          maxLength={25}
        />
        <div className='boardname_update_buttons_cont'>
          <button
            onClick={handleCancelBoardEdit}
            style={{
              background: currentTheme['--list-background-color'],
              borderColor: currentTheme['--border-color'],
              color: currentTheme['--main-text-coloure'],
            }}
            className='boardname_button_cancel'
          >
            {t('cancel')}
          </button>
          <button
            onClick={handleBoardNameUpdate}
            disabled={!boardNameInput.trim()}
            style={{
              background: currentTheme['--list-background-color'],
              borderColor: currentTheme['--border-color'],
              color: currentTheme['--main-text-coloure'],
              cursor: boardNameInput.trim() ? 'pointer' : 'not-allowed',
            }}
            className='boardname_button_update'
          >
            {t('save')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Mindmap_BoardName_Modal;