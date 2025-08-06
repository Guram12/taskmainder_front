import '../../styles/settings/CustomTheme.css';
import React, { useState, useEffect } from 'react';
import { ThemeSpecs } from '../../utils/theme';
import { FaRegImages } from "react-icons/fa";
import axiosInstance from '../../utils/axiosinstance';
import { ColorPicker } from 'antd';
import { board } from '../../utils/interface';
import no_boards_image from '../../assets/no_boards_img.png';
import GridLoader from "react-spinners/GridLoader";
import { MdDeleteForever } from "react-icons/md";
import { ConfigProvider } from 'antd';
import { Tooltip } from 'antd';
import { UserBoardStatuses } from '../../utils/interface';
import { useTranslation } from 'react-i18next';



interface CustomThemeProps {
  currentTheme: ThemeSpecs;
  setCurrentTheme: (theme: ThemeSpecs) => void;
  setIsCustomThemeSelected: (isCustomThemeSelected: boolean) => void;
  setSaved_custom_theme: (theme: ThemeSpecs) => void;
  boards: board[];
  setBoards: (boards: board[]) => void;
  new_image_for_board: { boardId: number, NewImage: File };
  setNew_image_for_board: ({ boardId, NewImage }: { boardId: number, NewImage: File }) => void;
  loading_image: { boardId: number, isLoading: boolean };
  setLoading_image: ({ boardId, isLoading }: { boardId: number, isLoading: boolean }) => void;
  setIsImageDeleting: (isImageDeleting: boolean) => void;
  setDeleting_image_boardId: (boardId: number) => void;
  current_user_email: string;
}

const CustomTheme: React.FC<CustomThemeProps> = ({
  currentTheme,
  setCurrentTheme,
  setIsCustomThemeSelected,
  setSaved_custom_theme,
  boards,
  setBoards,
  new_image_for_board,
  setNew_image_for_board,
  loading_image,
  setLoading_image,
  setIsImageDeleting,
  setDeleting_image_boardId,
  current_user_email,
}) => {


  const [backgroundColor, setBackgroundColor] = useState<string>(currentTheme['--background-color']);
  const [borderColor, setBorderColor] = useState<string>(currentTheme['--border-color']);
  const [mainTextColor, setMainTextColor] = useState<string>(currentTheme['--main-text-coloure']);
  const [scrollbarThumbColor, setScrollbarThumbColor] = useState<string>(currentTheme['--scrollbar-thumb-color']);
  const [listBackgroundColor, setListBackgroundColor] = useState<string>(currentTheme['--list-background-color']);
  const [taskBackgroundColor, setTaskBackgroundColor] = useState<string>(currentTheme['--task-background-color']);

  const [hoverColor, setHoverColor] = useState<string>(currentTheme['--hover-color']);
  const [dueDateColor, setDueDateColor] = useState<string>(currentTheme['--due-date-color']);


  const [userBoardStatuses, setUserBoardStatuses] = useState<UserBoardStatuses[]>([]);

  const { t } = useTranslation();

  const fileInputRefs = boards.reduce((acc, board) => {
    acc[board.id] = React.createRef<HTMLInputElement>();
    return acc;
  }, {} as Record<number, React.RefObject<HTMLInputElement>>);



  useEffect(() => {
    setBackgroundColor(currentTheme['--background-color']);
    setBorderColor(currentTheme['--border-color']);
    setMainTextColor(currentTheme['--main-text-coloure']);
    setScrollbarThumbColor(currentTheme['--scrollbar-thumb-color']);
    setListBackgroundColor(currentTheme['--list-background-color']);
    setTaskBackgroundColor(currentTheme['--task-background-color']);
  }, [currentTheme]);



  useEffect(() => {
    console.log('backgroundColor changed:', backgroundColor);
  }, [backgroundColor]);


  // ===========================================  get user status for board  ==========================================================

  const getUserStatusForBoard = (boardId: number) => {
    const status = userBoardStatuses.find(status => status.board_id === boardId);
    return status ? status.user_status : null;
  };

  // -----------------------  save user statuses in state -----------------------
  const user_board_statuses = boards.map(board => ({
    boardId: board.id,
    userStatus: getUserStatusForBoard(board.id),
  }));

  // -----------------------  show tooltip if user is not owner or admin -----------------------
  const [showToolTip, setShowToolTip] = useState<boolean>(false);

  const handle_image_click = (boardId: number) => {
    if (user_board_statuses.some(status => status.boardId === boardId && status.userStatus === 'owner' || status.userStatus === 'admin')) {
      const fileInputRef = fileInputRefs[boardId];
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    } else {
      setShowToolTip(true);
      setTimeout(() => {
        setShowToolTip(false);
      }, 3000); // Hide tooltip after 3 seconds
    }
  }
  // ============================================== fetch user board status  ================================================

  useEffect(() => {
    const fetchUserBoardStatuses = async () => {
      try {
        const response = await axiosInstance.get('/api/user-boards-status/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access')}`,
          },
        });

        if (response.status === 200) {
          setUserBoardStatuses(response.data);
        } else {
          console.error('Failed to fetch user board statuses:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching user board statuses:', error);
      }
    };

    fetchUserBoardStatuses();
  }, [current_user_email]);






  // ===========================================  save the image ==========================================================

  const handleSaveImage = async (boardId: number) => {
    const formData = new FormData();
    formData.append('background_image', new_image_for_board.NewImage);

    try {
      const response = await axiosInstance.patch(`/api/boards/${boardId}/update-background-image/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('access')}`,
        },

      });

      if (response.status === 200) {
        console.log('Image saved successfully:', response.data);
        setNew_image_for_board({
          boardId: 0,
          NewImage: new File([], "")
        });
        // Optionally, you can update the boards state to reflect the new background image

        const updatedBoards = boards.map(board => {
          if (board.id === boardId) {
            return {
              ...board,
              background_image: URL.createObjectURL(new_image_for_board.NewImage) // Update the background image
            };
          }
          return board;
        });
        // Update the boards state with the new background image
        setBoards(updatedBoards);

      } else {
        console.error('Failed to save image:', response.statusText);
      }
    } catch (error) {
      console.error('Error saving image:', error);
    } finally {
      // Reset the new_image_for_board state after saving
      setNew_image_for_board({
        boardId: 0,
        NewImage: new File([], "")
      });
      setLoading_image({ boardId: 0, isLoading: false });
    }
  }

  // ===========================================  delet current image icon click ==========================================================
  const handleDeleteImageClick = (boardId: number) => {
    if (user_board_statuses.some(status => status.boardId === boardId && status.userStatus === 'owner' || status.userStatus === 'admin')) {
      setIsImageDeleting(true); // Show the confirmation dialog
      setDeleting_image_boardId(boardId); // Do not update the image immediately
    } else {
      setShowToolTip(true);
      setTimeout(() => {
        setShowToolTip(false);
      }, 3000); // Hide tooltip after 3 seconds
    }
  };



  // ============================================   save and cancel click function  ======================================================


  const handleSaveImageClick = (boardId: number) => {
    setLoading_image({ boardId, isLoading: true });
    handleSaveImage(boardId);
  }

  const handleCancelClick = () => {
    setNew_image_for_board({
      boardId: 0,
      NewImage: new File([], "")
    });
  };
  // ===========================================  save the colors  ==========================================================

  const handleColoresSavce = async () => {
    localStorage.setItem('isCustomThemeSelected', 'true');
    setIsCustomThemeSelected(true);

    setSaved_custom_theme({
      '--background-color': backgroundColor,
      '--border-color': borderColor,
      '--main-text-coloure': mainTextColor,
      '--scrollbar-thumb-color': scrollbarThumbColor,
      '--list-background-color': listBackgroundColor,
      '--task-background-color': taskBackgroundColor,
      '--hover-color': hoverColor,
      '--due-date-color': dueDateColor,

    });

    localStorage.setItem('theme', JSON.stringify({
      '--background-color': backgroundColor,
      '--border-color': borderColor,
      '--main-text-coloure': mainTextColor,
      '--scrollbar-thumb-color': scrollbarThumbColor,
      '--list-background-color': listBackgroundColor,
      '--task-background-color': taskBackgroundColor,
      '--hover-color': hoverColor,
      '--due-date-color': dueDateColor,
    }));

    document.body.style.backgroundColor = backgroundColor;
    document.body.style.color = mainTextColor;

    setCurrentTheme({
      '--background-color': backgroundColor,
      '--border-color': borderColor,
      '--main-text-coloure': mainTextColor,
      '--scrollbar-thumb-color': scrollbarThumbColor,
      '--list-background-color': listBackgroundColor,
      '--task-background-color': taskBackgroundColor,
      '--hover-color': hoverColor,
      '--due-date-color': dueDateColor,
    });
    console.log("Theme colors saved to localStorage.");
  };

  // =======================================================================================================
  return (
    <div className="custom_theme_container"
      style={{
        backdropFilter: 'blur(13px)',
        WebkitBackdropFilter: 'blur(10px)',
        backgroundColor: 'transparent',
        borderColor: currentTheme["--border-color"],
      }}
    >

      <div className="customtheme_container"
        id='customtheme_container_shepherd'
        style={{
          backgroundColor: currentTheme["--background-color"],
          borderColor: currentTheme["--border-color"]
        }}
      >
        <p className="customtheme_p" style={{ color: currentTheme["--main-text-coloure"] }}> {t('create_custom_theme')} </p>

      </div>


      {boards.length !== 0 && (
        <div className='background_image_tooltip_container'>
          <h1 className='background_image_set_h1'>{t('click_image_to_select_new_background')}</h1>
          <Tooltip
            title={t('you_can_change_board_background')}
            placement="right"
            color={currentTheme["--list-background-color"]}
            styles={{
              body: {
                color: currentTheme["--main-text-coloure"],
                background: currentTheme["--list-background-color"],
              },
            }}
            open={showToolTip || undefined} // Show on hover and when showToolTip is true
          >

            <span style={{ marginLeft: 8, cursor: 'pointer', fontSize: 18, color: currentTheme["--main-text-coloure"] }}>🛈</span>
          </Tooltip>
        </div>
      )}
      <div className='boards_and_background_images_container' >
        {boards.length === 0 && (
          <div className='no_boards_container_customtheme'>
            <img src={no_boards_image} alt="No Boards" className='no_boards_image_customtheme' />
            <p className='no_boards_text'>{t('no_boards_available_for_theme')}</p>

          </div>
        )}

        {boards.map((boardItem) => (

          <div key={boardItem.id} className='each_board_container'
            style={{
              borderColor: currentTheme['--border-color'],
              opacity: ['owner', 'admin'].includes(user_board_statuses.find(status => status.boardId === boardItem.id)?.userStatus || '')
                ? 1
                : 0.50,
            }}

          >

            <div className='board_name_container' >
              <p className='board_name_p'
                style={{
                  color: currentTheme['--main-text-coloure'],
                  opacity: ['owner', 'admin'].includes(user_board_statuses.find(status => status.boardId === boardItem.id)?.userStatus || '')
                    ? 1
                    : 0.50,
                }}
              >{boardItem.name}</p>
              {boardItem.background_image && (
                <MdDeleteForever className='delete_backg_img_icon' onClick={() => handleDeleteImageClick(boardItem.id)} />
              )}

            </div>
            <div className='board_image_container'
              style={{
                borderColor: currentTheme['--border-color'],
              }}
            >
              {boardItem.background_image ? (
                <>
                  {loading_image.isLoading && loading_image.boardId === boardItem.id ? (
                    <div className='loading_image_container'>
                      <GridLoader color={`${currentTheme['--border-color']}`} size={20} className="gridloader" />
                    </div>
                  ) : (
                    <>
                      <img
                        src={boardItem.id === new_image_for_board.boardId ? URL.createObjectURL(new_image_for_board.NewImage) : boardItem.background_image}
                        alt="Board Background"
                        className='board_background_image'
                        onClick={() => handle_image_click(boardItem.id)}

                      />
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        ref={fileInputRefs[boardItem.id]}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setNew_image_for_board({
                              boardId: boardItem.id,
                              NewImage: file
                            });
                          }
                        }}
                      />
                    </>
                  )}

                </>
              ) : (
                <div
                  className="no_image_container"
                  style={{
                    borderColor: currentTheme['--border-color'],
                  }}
                  onClick={() => handle_image_click(boardItem.id)}
                >

                  {loading_image.isLoading && loading_image.boardId === boardItem.id ? (
                    <div className='loading_image_container'>
                      <GridLoader color={`${currentTheme['--border-color']}`} size={20} className="gridloader" />
                    </div>

                  ) : (

                    <>
                      {boardItem.id === new_image_for_board.boardId ? (
                        <img
                          src={URL.createObjectURL(new_image_for_board.NewImage)}
                          alt="Board Background"
                          className='board_background_image'
                          onClick={() => handle_image_click(boardItem.id)}
                        />
                      ) : (
                        <FaRegImages className="no_image_icon" style={{ color: currentTheme['--border-color'] }} />
                      )}
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    ref={fileInputRefs[boardItem.id]}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setNew_image_for_board({
                          boardId: boardItem.id,
                          NewImage: file
                        });
                      }
                    }}
                  />
                </div>
              )}
            </div>
            {boardItem.id === new_image_for_board.boardId && new_image_for_board.NewImage && (
              <div className='save_image_btn_container' >
                <button onClick={() => handleSaveImageClick(boardItem.id)} className='save_backg_img' >{t('save_image')}</button>
                <button onClick={handleCancelClick} className='cansel_backg_img' >{t('cancel_image_save')}</button>

              </div>
            )}
          </div>
        ))}


      </div>

      {/* line */}
      {/* <div className='division_line' ></div> */}

      <div className='second_h1_and_tooltip_container' >
        <h1 className='second_h1' >{t('select_colors')}</h1>
        <Tooltip
          title={t('customtheme_tooltip_text')}
          placement="right"
          color={currentTheme["--list-background-color"]}
        >
          <span style={{ marginLeft: 8, cursor: 'pointer', fontSize: 18, color: currentTheme["--main-text-coloure"] }}>🛈</span>
        </Tooltip>
      </div>


      <div className='color_selection_container' >
        {/*1  background color selection  */}
        <div className='each_color_property' >


          <ConfigProvider
            theme={{
              token: {
                colorBgBase: currentTheme['--list-background-color'],
                colorTextBase: currentTheme['--main-text-coloure'],
                lineWidth: 1,
              },
            }}
          >
            <ColorPicker
              value={backgroundColor}
              allowClear
              mode="single"
              onChangeComplete={(color) => {
                setBackgroundColor(color.toCssString());
              }}
              size='large'
              showText={(color) => <span>Background Color {color.toHexString()}</span>}
              className="large-color-picker"


            />
          </ConfigProvider>
        </div>

        {/*2  borderColor color selection  */}
        <div className='each_color_property' >
          <ConfigProvider
            theme={{
              token: {
                colorBgBase: currentTheme['--list-background-color'],
                colorTextBase: currentTheme['--main-text-coloure'],
                lineWidth: 1,
                // colorBgContainer: currentTheme['--background-color'],
              },
            }}
          >
            <ColorPicker
              value={borderColor}
              allowClear
              showText={(color) => <span>Border Color {color.toHexString()}</span>}
              className="large-color-picker"
              mode="single"
              onChangeComplete={(color) => {
                setBorderColor(color.toCssString());
              }}
              size='large'
            />
          </ConfigProvider>
        </div>


        {/*3  mainTextColor color selection  */}
        <div className='each_color_property' >
          <ConfigProvider
            theme={{
              token: {
                colorBgBase: currentTheme['--list-background-color'],
                colorTextBase: currentTheme['--main-text-coloure'],
                lineWidth: 1,
              },
            }}
          >
            <ColorPicker
              value={mainTextColor}
              allowClear
              showText={(color) => <span>Text Color {color.toHexString()}</span>}
              className="large-color-picker"
              mode="single"
              onChangeComplete={(color) => {
                setMainTextColor(color.toCssString());
              }}
              size='large'
            />
          </ConfigProvider>
        </div>

        {/*4  scrollbarThumbColor color selection  */}
        <div className='each_color_property' >

          <ConfigProvider
            theme={{
              token: {
                colorBgBase: currentTheme['--list-background-color'],
                colorTextBase: currentTheme['--main-text-coloure'],
                lineWidth: 1,
              },
            }}
          >
            <ColorPicker
              value={scrollbarThumbColor}
              allowClear
              showText={(color) => <span>Scrollbar Thumb Color {color.toHexString()}</span>}
              className="large-color-picker"
              mode="single"
              onChangeComplete={(color) => {
                setScrollbarThumbColor(color.toCssString());
              }}
              size='large'
            />
          </ConfigProvider>
        </div>

        {/*5  listBackgroundColor color selection  */}
        <div className='each_color_property' >
          <ConfigProvider
            theme={{
              token: {
                colorBgBase: currentTheme['--list-background-color'],
                colorTextBase: currentTheme['--main-text-coloure'],
                lineWidth: 1,
              },
            }}
          >
            <ColorPicker
              value={listBackgroundColor}
              allowClear
              showText={(color) => <span>List Background Color {color.toHexString()}</span>}
              className="large-color-picker"
              mode="single"
              onChangeComplete={(color) => {
                setListBackgroundColor(color.toCssString());
              }}
              size='large'
            />
          </ConfigProvider>
        </div>

        {/*6  taskBackgroundColor color selection  */}
        <div className='each_color_property' >
          <ConfigProvider
            theme={{
              token: {
                colorBgBase: currentTheme['--list-background-color'],
                colorTextBase: currentTheme['--main-text-coloure'],
                lineWidth: 1,
              },
            }}
          >
            <ColorPicker
              value={taskBackgroundColor}
              allowClear
              showText={(color) => <span>Task Background Color {color.toHexString()}</span>}
              className="large-color-picker"
              mode="single"
              onChangeComplete={(color) => {
                setTaskBackgroundColor(color.toCssString());
              }}
              size='large'
            />
          </ConfigProvider>
        </div>

        {/*7  hoverColor color selection  */}
        <div className='each_color_property' >
          <ConfigProvider
            theme={{
              token: {
                colorBgBase: currentTheme['--list-background-color'],
                colorTextBase: currentTheme['--main-text-coloure'],
                lineWidth: 1,
              },
            }}
          >
            <ColorPicker
              value={hoverColor}
              allowClear
              showText={(color) => <span>Hover Color {color.toHexString()}</span>}
              className="large-color-picker"
              mode="single"
              onChangeComplete={(color) => {
                setHoverColor(color.toCssString());
              }}
              size='large'
            />
          </ConfigProvider>
        </div>

        {/*8  dueDateColor color selection  */}
        <div className='each_color_property' >
          <ConfigProvider
            theme={{
              token: {
                colorBgBase: currentTheme['--list-background-color'],
                colorTextBase: currentTheme['--main-text-coloure'],
                lineWidth: 1,
              },
            }}
          >
            <ColorPicker
              value={dueDateColor}
              allowClear
              showText={(color) => <span>Due Date Color {color.toHexString()}</span>}
              className="large-color-picker"
              mode="single"
              onChangeComplete={(color) => {
                setDueDateColor(color.toCssString());
              }}
              size='large'
            />
          </ConfigProvider>
        </div>


      </div>

      <div className='save_coolore_btn_container' >
        <button onClick={handleColoresSavce} className='save_colour_btn'>{t('save_theme')}</button>
      </div>

    </div>
  );
};

export default CustomTheme; 