import "../styles/Members.css";
import React, { useEffect, useState, useCallback } from "react";
import { board } from "../utils/interface";
import { Board_Users } from "../utils/interface";
import { CgCloseR } from "react-icons/cg";
import axiosInstance from "../utils/axiosinstance";
import { RiCloseFill } from "react-icons/ri";
import { FaClipboardList } from "react-icons/fa";
import { ThemeSpecs } from "../utils/theme";
import { MdModeEdit } from "react-icons/md";
import { RiUserSettingsFill } from "react-icons/ri";
import { GrFormCheckmark } from "react-icons/gr";
import { HiOutlineXMark } from "react-icons/hi2";
import ConfirmationDialog from "./Boards/ConfirmationDialog";
import Avatar from '@mui/material/Avatar';
import getAvatarStyles from "../utils/SetRandomColor";
import Skeleton from 'react-loading-skeleton';
import { TbRefresh } from "react-icons/tb";
import SkeletonEachUser from "./Boards/SkeletonEachUser";
import ReactDOM from 'react-dom';
import { MdDeleteForever } from "react-icons/md";
import { ProfileData } from "../utils/interface";
import { PulseLoader } from "react-spinners";
import { useTranslation } from 'react-i18next';
import { BsFillDiagram3Fill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";



interface MembersProps {
  selectedBoard: board | null;
  socketRef: React.MutableRefObject<WebSocket | null>;
  current_user_email: string;
  currentTheme: ThemeSpecs;
  update_board_name: (new_board_name: string) => void;
  deleteBoard: () => void;
  setCurrent_board_users: (users: Board_Users[]) => void;
  current_board_users: Board_Users[];
  is_cur_Board_users_fetched: boolean;
  fetch_current_board_users: () => Promise<void>;
  setBoards: (boards: board[]) => void;
  boards: board[];
  is_members_refreshing: boolean;
  isMobile: boolean;
  profileData: ProfileData;
  setSelectedComponent: (component: string) => void;
  setIsLoading: (isLoading: boolean) => void;
  setActiveSidebarBoardId: (boardId: number | null) => void;
}

const Members: React.FC<MembersProps> = ({
  selectedBoard,
  socketRef,
  current_user_email,
  currentTheme,
  update_board_name,
  deleteBoard,
  setCurrent_board_users,
  current_board_users,
  is_cur_Board_users_fetched,
  fetch_current_board_users,
  setBoards,
  boards,
  is_members_refreshing,
  isMobile,
  profileData,
  setSelectedComponent,
  setIsLoading,
  setActiveSidebarBoardId,
}) => {

  const [isUsersWindowOpen, setIsUsersWindowOpen] = useState<boolean>(false);
  const [searchInput, setSearchInput] = useState<string>("");
  const [suggestedUsers, setSuggestedUsers] = useState<{ email: string }[]>([]);



  const [isDeletingSelectedUser, setIsDeletingSelectedUser] = useState<boolean>(false);
  const [current_board_user_to_delete, setCurrent_board_user_to_delete] = useState({} as Board_Users);
  const [selected_emails, setSelected_emails] = useState<string[]>([]);

  const [isBoardEditing, setIsBoardEditing] = useState<boolean>(false);
  const [isBoardDeleting, setIsBoardDeleting] = useState<boolean>(false);

  const [newBoardName, setNewBoardName] = useState<string>('');

  const [is_board_invitation_sent, setIs_board_invitation_sent] = useState<boolean>(false);
  const [invitation_loading, setInvitation_loading] = useState<boolean>(false);

  const navigate = useNavigate();
  const { t } = useTranslation();

  const is_current_user_owner = current_board_users.find(user => user.email === current_user_email)?.user_status === 'owner'
  const is_current_user_admin = current_board_users.find(user => user.email === current_user_email)?.user_status === 'admin'
  // const is_current_user_member = current_board_users.find(user => user.email === current_user_email)?.user_status === 'member'
  const is_current_user_admin_or_owner = is_current_user_owner || is_current_user_admin



  // ============================================  set new statuses for users ============================================
  const handleStatusChange = (userId: number, newStatus: string) => {
    console.log(`Changing status for user ${userId} to ${newStatus}`);

    const updatedUsers: Board_Users[] = current_board_users.map((user) =>
      user.id === userId ? { ...user, user_status: newStatus } : user
    );
    setCurrent_board_users(updatedUsers);

    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        action: 'set_status',
        payload: {
          user_id: userId,
          new_status: newStatus,
          board_id: selectedBoard?.id,
        },
      }));
    }
  };
  // ======================================== debaunce function for search input ========================================
  const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  useEffect(() => {
    if (!searchInput.trim()) {
      setSuggestedUsers([]);
      return;
    }
  }, [searchInput]);

  const fetchSuggestedUsers = async (value: string) => {
    console.log('value', value);
    try {
      if (!value.trim()) {
        setSuggestedUsers([]);
        return;
      }
      const response = await axiosInstance.get(`acc/user-emails/?search=${value}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      setSuggestedUsers(response.data);
    } catch (error) {
      console.error("Error fetching user emails:", error);
    }
  };

  const debouncedFetchSuggestedUsers = useCallback(debounce((value: string) => {
    if (value.trim()) {
      fetchSuggestedUsers(value);
    } else {
      setSuggestedUsers([]);
    }
  }, 300), []);

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);

    if (value.length > 0) {
      debouncedFetchSuggestedUsers(value);
    } else {
      setSuggestedUsers([]);
    }
  };



  // ======================================== fetch current  board useers ==================================================

  useEffect(() => {
    if (selectedBoard?.id) {
      fetch_current_board_users();
    }
  }, [selectedBoard?.id]);

  // -------------------------------------------- add new users to board ------------------------------------------------
  // boards/<int:board_id>/send-invitation/

  const handleAddUsers = async () => {
    setInvitation_loading(true);
    console.log('Sending invitations to:', selected_emails);
    try {
      const response = await axiosInstance.post(
        `/api/boards/${selectedBoard?.id}/send-invitation/`, // Add trailing slash here
        { email: selected_emails }, // array of emails 
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        }
      );

      if (response.status === 200) {
        console.log("Invitation sent successfully:", response.data);
        setSelected_emails([]); // Clear selected emails after sending invitations
        setIs_board_invitation_sent(true);
        setInvitation_loading(false);
      } else {
        console.error("Error sending invitation:", response.data);
        alert("Failed to send the invitation. Please try again.");
      }
    } catch (error) {
      console.error("Error sending invitation:", error);
      alert("An error occurred while sending the invitation.");
    } finally {
      setTimeout(() => {
        setIs_board_invitation_sent(false);
      }, 3000);
    }
  };
  // --------------------------------------------- email click --------------------------------------

  const handle_email_click = (email: string) => {
    setSelected_emails((prev_emails) => {
      if (prev_emails.includes(email)) {
        let filtered_emails = prev_emails.filter((prev_email) => prev_email !== email);
        return filtered_emails;
      } else {
        return [...prev_emails, email];
      }
    });
    // Remove selected user from suggestions
    setSuggestedUsers((prev) => prev.filter((user) => user.email !== email));
    // Clear search input
    setSearchInput("");
  };

  const handle_unselect_email = (email: string) => {
    setSelected_emails((prev_emails) => prev_emails.filter((prev_email) => prev_email !== email));
    // Add the unselected email back to suggestions

    // Clear search input
    setSearchInput("");
  }
  // ========================================== delete user from members ==================================================
  const handleDeleteUser = async (userId: number) => {
    console.log('Deleting user:', userId);
    const response = await axiosInstance.delete(`/api/boards/${selectedBoard?.id}/users/${userId}/delete/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`
      }
    })
    console.log("response", response)
    if (response.status === 200) {
      fetch_current_board_users();
      setIsDeletingSelectedUser(false);
    }
  };


  const handle_delete_icon_click = (boardUser: Board_Users) => {
    if (!is_current_user_admin_or_owner) return;
    setIsDeletingSelectedUser(true);
    setCurrent_board_user_to_delete(boardUser);
  }


  // =============================================   Edit board name   ========================================================



  const [isMobileBoardNameUpdateModalOpen, setIsMobileBoardNameUpdateModalOpen] = useState(false);

  const [is_board_newname_empty, setIs_board_newname_empty] = useState<boolean>(false);

  const handle_edit_board_click = () => {
    setNewBoardName(selectedBoard?.name || '');
    if (isMobile) {
      setIsMobileBoardNameUpdateModalOpen(true);
    } else {
      setIsBoardEditing(true);
    }
  };


  const handleBoardNameUpdate = () => {
    if (!newBoardName.trim()) {
      setIs_board_newname_empty(true);
      return;
    }
    // if length of  string is more than 25. i should not allow to update board name
    if (newBoardName.length > 25) {
      alert("Board name cannot be more than 25 characters long.");
      setIs_board_newname_empty(true);
      return;
    }
    console.log('Updating board name:', newBoardName);

    // Create the updated boards array
    const updatedBoards = boards.map((board: board) =>
      board.id === selectedBoard?.id ? { ...board, name: newBoardName } : board
    );

    // Update the board name in the sidebar
    setBoards(updatedBoards);

    // Send the update to the server
    update_board_name(newBoardName);
    setIsBoardEditing(false);

    // if mobile version is open, close it 
    if (isMobile) {
      setIsMobileBoardNameUpdateModalOpen(false);
    }
  };

  const board_name_update_icon_click = () => {
    if (!isMobile) {
      handleBoardNameUpdate();
      return;
    }

    // Mobile specific logic
    setIsMobileBoardNameUpdateModalOpen(true);
  };




  // =============================================   Delete Board   ========================================================



  const handle_delete_board_icon_click = () => {
    setIsBoardDeleting(true);
  }

  const delete_board = () => {
    console.log('Deleting board:', selectedBoard?.id);
    deleteBoard();
    setIsBoardDeleting(false);
  }

  const canselBoardDelete = () => {
    setIsBoardDeleting(false);
  }


  // ============================================== Leav board ========================================================


  const [is_leaving_board, setIs_leaving_board] = useState<boolean>(false);

  const handleLeaveBoardClick = () => {
    setIs_leaving_board(true);
  }

  const handleLeaveBoard = async () => {
    setIs_leaving_board(false);
    setIsLoading(true);
    try {
      const response = await axiosInstance.delete(`/api/boards/${selectedBoard?.id}/self-delete/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      })
      if (response.status === 200) {
        console.log("Successfully left the board:", response.data);
        // Optionally, you can update the UI or redirect the user
        // For example, you might want to remove the board from the list of boards
        const updatedBoards = boards.filter(board => board.id !== selectedBoard?.id);
        setBoards(updatedBoards);
        setIsLoading(false);


      } else {
        console.error("Failed to leave the board:", response.data);
      }
    } catch (error) {
      console.error("Error leaving the board:", error);
      setIsLoading(false);
    }
  }

  // =====================================================================================================================
  // const prev_mindmap_selected_board = localStorage.getItem('prev_mindmap_selected_board_id');

  const handle_diagram_click = (board_id: string) => {
    localStorage.setItem('prev_mindmap_selected_board_id', board_id);
    // setSelectedBoard(null)
    setActiveSidebarBoardId(null); // Unselect board in sidebar only
    setSelectedComponent('MindMap');
    navigate('/mainpage/mindmap')
  }




  // =====================================================================================================================

  return (
    <div className="main_members_container">
      <RiUserSettingsFill
        className="add_user_icon"
        onClick={() => setIsUsersWindowOpen(true)}
        style={{ color: currentTheme['--main-text-coloure'] }}
      />

      {/* skeleton loader  before fetching current board users, and after fetching current board users,
       it will be replaced with actual user avatars */}
      {!is_cur_Board_users_fetched ? (
        <div className="user_avatar_skeleton_cont" >
          <Skeleton
            circle
            height={30}
            width={30}
            style={{ marginLeft: '-10px' }}
            baseColor={currentTheme['--list-background-color']}
            highlightColor={currentTheme['--main-text-coloure']}
          />
          <Skeleton
            circle
            height={30}
            width={30}
            style={{ marginLeft: '-10px' }}
            baseColor={currentTheme['--list-background-color']}
            highlightColor={currentTheme['--main-text-coloure']}
          />
          <Skeleton
            circle
            height={30}
            width={30}
            style={{ marginLeft: '-10px' }}
            baseColor={currentTheme['--list-background-color']}
            highlightColor={currentTheme['--main-text-coloure']}
          />
        </div>
      )
        :
        (
          <>
            {isMobile ? (
              <>
                {current_board_users.slice(0, 3).map((boardUser) =>
                  boardUser.profile_picture !== null ? (
                    <img
                      key={boardUser.id}
                      src={boardUser.profile_picture}
                      alt="user profile"
                      className="user_profile_images"
                    />
                  ) : (
                    <Avatar
                      key={boardUser.id}
                      className="user_profile_images"
                      sx={{ width: 30, height: 30 }}
                      alt={boardUser.username}
                      style={{
                        backgroundColor: getAvatarStyles(boardUser.username.charAt(0)).backgroundColor,
                        color: getAvatarStyles(boardUser.username.charAt(0)).color
                      }}
                    >
                      {boardUser.username.charAt(0).toUpperCase()}
                    </Avatar>
                  )
                )}
                {current_board_users.length > 3 && (
                  <span className="more-avatars"
                    style={{
                      marginLeft: '-25px',
                      display: 'inline-block',
                      color: currentTheme['--main-text-coloure'],
                      borderRadius: '50%',
                      width: 30,
                      height: 30,
                      textAlign: 'center',
                      lineHeight: '30px',
                      fontWeight: 'bold',
                      marginTop: '15px',

                    }}>
                    ...
                  </span>
                )}
              </>
            ) : (
              <>
                {current_board_users.map((boardUser) =>
                  boardUser.profile_picture !== null ? (
                    <img
                      key={boardUser.id}
                      src={boardUser.profile_picture}
                      alt="user profile"
                      className="user_profile_images"
                    />
                  ) : (
                    <Avatar
                      key={boardUser.id}
                      className="user_profile_images"
                      sx={{ width: 30, height: 30 }}
                      alt={boardUser.username}
                      style={{
                        backgroundColor: getAvatarStyles(boardUser.username.charAt(0)).backgroundColor,
                        color: getAvatarStyles(boardUser.username.charAt(0)).color
                      }}
                    >
                      {boardUser.username.charAt(0).toUpperCase()}
                    </Avatar>
                  )
                )}
              </>
            )}
          </>
        )}



      {/* board name and icons for editing and deleting board, and board name */}
      {/* აქ არის ორი ვერსია სახელის აფდეითისთვის, ერტი მობაილისტვის და მეორე დესკტოპისთვის.isMobile  ის მიხედვით რენდერდება რომელიმე */}
      <>
        <div className="board_name_cont" color={`${currentTheme['--main-text-coloure']}`} >
          <FaClipboardList className='board_icon' style={{ fill: `${currentTheme['--main-text-coloure']}` }} />
          {isMobileBoardNameUpdateModalOpen && isMobile && ReactDOM.createPortal(
            <div>
              <div className="dark_mobile_background" ></div>
              <div className="board_name_update_modal_on_mobile" style={{ backgroundColor: `${currentTheme['--list-background-color']}` }} >
                <p className="update_board_name_text" style={{ color: currentTheme['--main-text-coloure'] }}>{t('Update_Board_Name_onmobile')}</p>
                <input
                  type="text"
                  value={newBoardName}
                  onChange={(e) => setNewBoardName(e.target.value)}
                  className="board_name_input"
                  placeholder={t('edit_board_name')}
                  style={{
                    backgroundColor: `${currentTheme['--list-background-color']}`,
                    color: `${currentTheme['--main-text-coloure']}`,
                    border: `1px solid ${currentTheme['--border-color']}`,
                    borderColor: is_board_newname_empty ? 'red' : currentTheme['--border-color'],
                    ['--placeholder-color' as any]: currentTheme['--due-date-color'] || '#888',
                  } as React.CSSProperties}
                  maxLength={25}
                />
                <div className="board_name_update_buttons_cont_onmobile" >

                  <button
                    onClick={() => handleBoardNameUpdate()}
                    style={{
                      color: `${currentTheme['--main-text-coloure']}`,
                      border: `1px solid ${currentTheme['--background-color']}`,
                    }}
                    className="save_btn_onmobile"
                  >
                    {t('save')}
                  </button>

                  <button
                    onClick={() => {
                      setIsMobileBoardNameUpdateModalOpen(false);
                      setIs_board_newname_empty(false);
                      setNewBoardName('');
                    }}
                    style={{
                      color: `${currentTheme['--main-text-coloure']}`,
                      border: `1px solid ${currentTheme['--background-color']}`,
                    }}
                    className="cancel_btn_onmobile"
                  >
                    {t('cancel')}
                  </button>

                </div>
              </div>
            </div>,
            document.body
          )}

          {isBoardEditing ? (
            <div className="board_name_inp_cont" >
              <input
                type="text"
                value={newBoardName}
                onChange={(e) => setNewBoardName(e.target.value)}
                className="board_name_input"
                placeholder={t('edit_board_name')}
                style={{
                  backgroundColor: `${currentTheme['--list-background-color']}`,
                  color: `${currentTheme['--main-text-coloure']}`,
                  border: `1px solid ${currentTheme['--border-color']}`,
                  borderColor: is_board_newname_empty ? 'red' : currentTheme['--border-color'],
                  ['--placeholder-color' as any]: currentTheme['--due-date-color'] || '#888',
                } as React.CSSProperties}
                maxLength={25}
              />
              <GrFormCheckmark
                style={{ color: `${currentTheme['--main-text-coloure']}` }}
                className="save_board_name_icon"
                onClick={() => { board_name_update_icon_click() }}
              />
              <HiOutlineXMark
                style={{ color: `${currentTheme['--main-text-coloure']}` }}
                className="discard_board_name_icon"
                onClick={() => { setIsBoardEditing(false); setIs_board_newname_empty(false); setNewBoardName(''); }}
              />
            </div>
          ) : (
            <>
              {/* aq unda davayeno skeletoni  */}
              <h3 className="board_name" style={{ color: `${currentTheme['--main-text-coloure']}` }} >
                {isMobile
                  ? (
                    <p className="board_name_text" >
                      {selectedBoard?.name && selectedBoard?.name.length > 7
                        ? `${selectedBoard?.name.slice(0, 7)}...`
                        : selectedBoard?.name}
                    </p>
                  )
                  : (
                    <p>
                      {selectedBoard?.name}
                    </p>
                  )
                }
              </h3>

              {is_current_user_admin_or_owner && (

                <MdModeEdit
                  className="edit_board_name_icon"
                  style={{ fill: `${currentTheme['--main-text-coloure']}` }}
                  onClick={() => handle_edit_board_click()}
                />
              )}
              {is_current_user_owner && (

                <MdDeleteForever
                  className="delete_board_icon"
                  style={{ fill: `${currentTheme['--main-text-coloure']}` }}
                  onClick={() => handle_delete_board_icon_click()}
                />
              )}
              {isBoardDeleting && (
                <ConfirmationDialog
                  message={`${t('are_you_sure_you_want_to_delete_the_board')} "${selectedBoard?.name}"?`}
                  onConfirm={delete_board}
                  onCancel={canselBoardDelete}
                  currentTheme={currentTheme}
                />
              )}
            </>
          )}
        </div>
      </>
      <div
        className="members_diagram_icon_cont"
        onClick={() => handle_diagram_click(String(selectedBoard?.id))}>
        <BsFillDiagram3Fill className="members_diagram_icon" />
        <p style={{ color: currentTheme['--main-text-coloure'] }} className="diagram_p"> {t('diagram')}</p>
      </div>

      {/* current board users list and their permission in window */}

      <div>
        {isUsersWindowOpen && ReactDOM.createPortal(
          <div className="all_users_main_window">
            <div className="bloored_ackgrownd"></div>
            <div className="each_user_container" style={{ backgroundColor: `${currentTheme['--list-background-color']}` }} >

              <div className="close_icon_cont">
                <p className="manage_users_text"
                  style={{ color: currentTheme['--main-text-coloure'] }}
                >{t('manage_users')}</p>
                <div className="refresh_and_close_icons_cont" >
                  {!is_members_refreshing && (
                    <TbRefresh className="refresh_users_icon" onClick={fetch_current_board_users} style={{ color: currentTheme['--main-text-coloure'] }} />
                  )}
                  <CgCloseR className="close_icon" onClick={() => setIsUsersWindowOpen(false)} style={{ color: currentTheme['--main-text-coloure'] }} />
                </div>
              </div>


              {/* search input for searching users  */}
              {is_current_user_admin_or_owner && (
                <div className="parent_of_input_and_emails" >

                  <input
                    type="text"
                    value={searchInput}
                    onChange={handleSearchInputChange}
                    placeholder={t('search_users_by_email')}
                    style={{
                      backgroundColor: currentTheme['--task-background-color'],
                      color: currentTheme['--main-text-coloure'],
                      border: `1px solid ${currentTheme['--border-color']}`,
                      ['--placeholder-color']: currentTheme['--due-date-color'],
                    } as React.CSSProperties}
                    className="search_input"
                  />

                  {is_board_invitation_sent && (
                    <p
                      style={{
                        color: currentTheme['--main-text-coloure'],
                        marginBottom: '0px',
                        fontWeight: 'bold',
                      }}>
                      {t('invitation_sent_successfully')}
                    </p>
                  )}


                  {/* suggested users conmtainer  */}
                  <div className="suggested_users_list"

                  >
                    {suggestedUsers
                      .filter(
                        (user) =>
                          !current_board_users.some(
                            (boardUser) =>
                              boardUser.email === user.email &&
                              (boardUser.user_status === "admin" || boardUser.user_status === "member" || boardUser.user_status === "owner")
                          )
                      )
                      .map((user) => (
                        <div
                          key={user.email}
                          className="suggested_user"
                          onClick={() => handle_email_click(user.email)}
                          style={{
                            backgroundColor: `${currentTheme['--task-background-color']}`,
                            color: `${currentTheme['--main-text-coloure']}`,
                            borderColor: `${currentTheme['--border-color']}`
                          }}
                        >
                          {user.email}
                        </div>
                      ))}
                  </div>

                  {/* selected emails container  */}
                  {selected_emails.length > 0 && (
                    <div className="selected_emails_cont"
                      style={{
                        backgroundColor: `${currentTheme['--background-color']}`,
                        color: `${currentTheme['--main-text-coloure']}`,
                        border: `1px solid ${currentTheme['--border-color']}`
                      }}
                    >
                      {selected_emails.map((email) => (
                        <div
                          key={email}
                          className="selected_email"
                          style={{
                            backgroundColor: `${currentTheme['--task-background-color']}`,
                            color: `${currentTheme['--main-text-coloure']}`
                          }}
                        >
                          {email}
                          <RiCloseFill className='unselect_email' onClick={() => handle_unselect_email(email)} />
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              )}

              {/* button for adding selected emails to board users  */}
              {is_current_user_admin_or_owner && selected_emails.length > 0 && (
                <>
                  {invitation_loading ?
                    (
                      <PulseLoader
                        size={10}
                        color={currentTheme['--due-date-color']}
                        speedMultiplier={0.7}
                        cssOverride={{
                          marginTop: '10px',
                        }}
                      />
                    ) : (
                      <button
                        onClick={() => handleAddUsers()}
                        disabled={selected_emails.length === 0}
                        className="invite_users_button"
                        style={{
                          cursor: `${selected_emails.length > 0 ? 'pointer' : 'not-allowed'}`,
                          backgroundColor: `${currentTheme['--task-background-color']}`,
                          color: `${currentTheme['--main-text-coloure']}`,
                          border: `1px solid ${currentTheme['--border-color']}`
                        }}
                      >
                        Invite
                      </button>

                    )}
                </>
              )}

              <div className="each_user_child_container">
                {is_members_refreshing ? (
                  <div className="users_skeleton_container" >
                    <SkeletonEachUser currentTheme={currentTheme} isMobile={isMobile} />
                    <SkeletonEachUser currentTheme={currentTheme} isMobile={isMobile} />
                    <SkeletonEachUser currentTheme={currentTheme} isMobile={isMobile} />
                  </div>

                ) : (

                  <>
                    {/* Rendering each user */}
                    {current_board_users.map(boardUser => (
                      <div
                        className="each_user"
                        key={boardUser.id}
                        style={{
                          backgroundColor: `${currentTheme['--task-background-color']}`,
                          color: `${currentTheme['--main-text-coloure']}`

                        }}
                      >

                        <div className="image_and_name_cont">
                          {boardUser.profile_picture !== null ? (

                            <img
                              src={boardUser.profile_picture}
                              alt="user profile"
                              className="board_user_images"
                            />
                          ) : (

                            <Avatar
                              className="board_user_images"
                              alt={boardUser.username}
                              style={{
                                backgroundColor: getAvatarStyles(boardUser.username.charAt(0)).backgroundColor,
                                color: getAvatarStyles(boardUser.username.charAt(0)).color
                              }}
                              sx={{ width: !isMobile ? 30 : 60, height: !isMobile ? 30 : 60 }}

                            >
                              {boardUser.username.charAt(0).toUpperCase()}
                            </Avatar>
                          )}
                          <p className="boarduser_name" style={{ color: currentTheme['--main-text-coloure'] }} >{boardUser.username} {boardUser.id === profileData.id ? '(me)' : ''}</p>
                          <p className="boarduser_email" style={{ color: currentTheme['--due-date-color'] }} >{boardUser.email}</p>
                        </div>

                        <div className="select_and_delete_icon">
                          {boardUser.user_status !== 'owner' && boardUser.email !== current_user_email && (
                            <MdDeleteForever
                              className={`delete_user ${is_current_user_admin_or_owner ? "delete_icon_for_admin" : "delete_icon_for_member"}`}
                              onClick={() => handle_delete_icon_click(boardUser)}
                            />
                          )}
                          {is_current_user_admin_or_owner ? (
                            boardUser.user_status === 'owner' ? (
                              <p className="owner_status" >{t('owner')}</p> // Owner cannot change their status
                            ) : (
                              <select
                                className="select_status"
                                value={boardUser.user_status}
                                onChange={(e) => handleStatusChange(boardUser.id, e.target.value)}
                                style={{
                                  backgroundColor: currentTheme['--task-background-color'],
                                  color: currentTheme['--main-text-coloure'],
                                  border: `1px solid ${currentTheme['--border-color']}`,

                                }}
                              >
                                <option value="admin">{t('admin')}</option>
                                <option value="member">{t('member')}</option>
                              </select>
                            )
                          ) : (
                            <p >{boardUser.user_status}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </>
                )}



              </div>
              {!is_current_user_owner && (
                <div>
                  <button onClick={handleLeaveBoardClick} className="leave_board_button" >Leave board</button>
                  {is_leaving_board && (
                    <ConfirmationDialog
                      message={`Are you sure you want to leav the board "${selectedBoard?.name}"?`}
                      onConfirm={handleLeaveBoard}
                      onCancel={() => setIs_leaving_board(false)}
                      currentTheme={currentTheme}
                    />
                  )}
                </div>
              )}

              {isDeletingSelectedUser && (
                <ConfirmationDialog
                  message={`${t('are_you_sure_you_want_to_delete_the_user')} "${current_board_user_to_delete.username}" ${t('from the board')} "${selectedBoard?.name}"?`}
                  onConfirm={() => handleDeleteUser(current_board_user_to_delete.id)}
                  onCancel={() => setIsDeletingSelectedUser(false)}
                  currentTheme={currentTheme}
                />
              )}

            </div>
          </div>,
          document.body
        )}
      </div>
    </div>
  );
};

export default Members;