import '../styles/MindMap.css';
import { ThemeSpecs } from "../utils/theme";
import { lists } from '../utils/interface';
import { useTranslation } from 'react-i18next';


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
  const { t } = useTranslation();


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
              {t('edit_list_name')}
            </h3>

            <input
              type="text"
              placeholder={t('list_name')}
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
                borderColor: currentTheme['--border-color'],

              }}
              autoFocus
              maxLength={21}
            />

            <div className='listname_update_buttons_cont'>
              <button
                onClick={handleCancelListEdit}
                style={{
                  background: currentTheme['--list-background-color'],
                  borderColor: currentTheme['--border-color'],
                  color: currentTheme['--main-text-coloure'],
                }}
                className='listname_button_cancel'
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleListNameUpdate}
                disabled={!listNameInput.trim() || listNameInput.trim() === editingList.name}
                className='listname_button_update'
                style={{
                  background: currentTheme['--list-background-color'],
                  borderColor: currentTheme['--border-color'],
                  color: currentTheme['--main-text-coloure'],
                }}
              >
                {t('update')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )

}

export default Mindmap_ListName_Modal;




