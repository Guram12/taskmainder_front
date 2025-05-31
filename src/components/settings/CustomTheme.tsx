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

// setNew_image_for_board={setNew_image_for_board}
// new_image_for_board={new_image_for_board}
// setLoading_image={setLoading_image}
// loading_image={loading_image}


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

}) => {
  const [backgroundColor, setBackgroundColor] = useState<string>(currentTheme['--background-color']);
  const [borderColor, setBorderColor] = useState<string>(currentTheme['--border-color']);
  const [mainTextColor, setMainTextColor] = useState<string>(currentTheme['--main-text-coloure']);
  const [scrollbarThumbColor, setScrollbarThumbColor] = useState<string>(currentTheme['--scrollbar-thumb-color']);
  const [listBackgroundColor, setListBackgroundColor] = useState<string>(currentTheme['--list-background-color']);
  const [taskBackgroundColor, setTaskBackgroundColor] = useState<string>(currentTheme['--task-background-color']);




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

  // ============================================== Reference for the file input   ================================================


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
    setIsImageDeleting(true); // Show the confirmation dialog
    setDeleting_image_boardId(boardId); // Do not update the image immediately
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
    });

    localStorage.setItem('theme', JSON.stringify({
      '--background-color': backgroundColor,
      '--border-color': borderColor,
      '--main-text-coloure': mainTextColor,
      '--scrollbar-thumb-color': scrollbarThumbColor,
      '--list-background-color': listBackgroundColor,
      '--task-background-color': taskBackgroundColor,
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
      }}
    >

      <div className="customtheme_container" style={{ backgroundColor: currentTheme["--background-color"] }}>
        <p className="customtheme_p" style={{ color: currentTheme["--main-text-coloure"] }}> Create Custom Theme </p>
      </div>


      {boards.length !== 0 && (
        <h1 className='background_image_set_h1'>Click image to select new background</h1>
      )}
      <div className='boards_and_background_images_container' >
        {boards.length === 0 && (
          <div className='no_boards_container_customtheme'>
            <img src={no_boards_image} alt="No Boards" className='no_boards_image_customtheme' />
            <p className='no_boards_text'>No boards available. Please create a board first.</p>
          </div>
        )}

        {boards.map((boardItem) => (
          <div key={boardItem.id} className='each_board_container' >

            <div className='board_name_container' >
              <p className='board_name_p' >{boardItem.name}</p>
              {boardItem.background_image &&(
                <MdDeleteForever className='delete_backg_img_icon' onClick={() => handleDeleteImageClick(boardItem.id)} />
              )}

            </div>
            <div className='board_image_container' >
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
                        onClick={() => {
                          const fileInputRef = fileInputRefs[boardItem.id];
                          if (fileInputRef.current) {
                            fileInputRef.current.click();
                          }
                        }}
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
                  onClick={() => {
                    const fileInputRef = fileInputRefs[boardItem.id];
                    if (fileInputRef && fileInputRef.current) {
                      fileInputRef.current.click(); // Trigger the file input click
                    } else {
                      console.error(`File input ref not found for board ID: ${boardItem.id}`);
                    }
                  }}
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
                          onClick={() => {
                            const fileInputRef = fileInputRefs[boardItem.id];
                            if (fileInputRef.current) {
                              fileInputRef.current.click();
                            }
                          }}
                        />
                      ) : (
                        <FaRegImages className="no_image_icon" />
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
                <button onClick={() => handleSaveImageClick(boardItem.id)} className='save_backg_img' >Save Image</button>
                <button onClick={handleCancelClick} className='cansel_backg_img' >Cancel</button>

              </div>
            )}
          </div>
        ))}

      </div>

      {/* line */}
      <div className='division_line' ></div>

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



      </div>

      <div className='save_coolore_btn_container' >
        <button onClick={handleColoresSavce} className='save_colour_btn'>Save Theme</button>
      </div>

    </div>
  );
};

export default CustomTheme; 