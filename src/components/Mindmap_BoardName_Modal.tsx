import React from 'react';
import { board } from '../utils/interface';
import { ThemeSpecs } from '../utils/theme';



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
          Edit Board Name
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
          className="new_item_input"
          style={{
            background: currentTheme['--task-background-color'],
            color: currentTheme['--main-text-coloure'],
          }}
          autoFocus
        />
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button
            onClick={handleCancelBoardEdit}
            style={{
              background: '#64748b',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleBoardNameUpdate}
            disabled={!boardNameInput.trim()}
            style={{
              background: boardNameInput.trim() ? '#6366f1' : '#64748b',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: boardNameInput.trim() ? 'pointer' : 'not-allowed',
              fontSize: '12px'
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default Mindmap_BoardName_Modal;