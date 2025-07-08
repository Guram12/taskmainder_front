
import { ThemeSpecs } from "../utils/theme";
import { lists } from '../utils/interface';


interface Mindmap_ListName_ModalProps {
  editingList: lists | null;
  isListEditModalOpen: boolean;
  currentTheme: ThemeSpecs
  handleCancelListEdit: () => void;
  listNameInput: string;
  setListNameInput: (listNameInput: string) => void;
  handleListNameUpdate: () => void;


}


const Mindmap_ListName_Modal: React.FC<Mindmap_ListName_ModalProps> = ({
  editingList,
  isListEditModalOpen,
  currentTheme,
  handleCancelListEdit,
  listNameInput,
  setListNameInput,
  handleListNameUpdate,

}) => {



  return (
    <div>
      {/* List Edit Modal */}
      {isListEditModalOpen && editingList && (
        <div className='diagram_new_item_container'>
          <div
            className='new_item_modal'
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
              Edit List Name
            </h3>

            <input
              type="text"
              placeholder="Enter list name..."
              value={listNameInput}
              onChange={(e) => setListNameInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && listNameInput.trim()) {
                  handleListNameUpdate();
                } else if (e.key === 'Escape') {
                  handleCancelListEdit();
                }
              }}
              className='new_item_input'
              style={{
                background: currentTheme['--task-background-color'],
                color: currentTheme['--main-text-coloure'],
              }}
              autoFocus
            />

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '15px' }}>
              <button
                onClick={handleCancelListEdit}
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
                onClick={handleListNameUpdate}
                disabled={!listNameInput.trim() || listNameInput.trim() === editingList.name}
                style={{
                  background: (listNameInput.trim() && listNameInput.trim() !== editingList.name) ? '#6366f1' : '#64748b',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  cursor: (listNameInput.trim() && listNameInput.trim() !== editingList.name) ? 'pointer' : 'not-allowed',
                  fontSize: '12px'
                }}
              >
                Update List Name
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )

}

export default Mindmap_ListName_Modal;




