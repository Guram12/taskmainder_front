import '../../styles/Board Styles/SkeletonListLoader.css';
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import { MdModeEdit } from "react-icons/md";
import { MdDeleteForever } from "react-icons/md";
import { ThemeSpecs } from '../../utils/theme';

interface SkeletonListLoaderProps {
  currentTheme: ThemeSpecs; // Current theme for styling
}

const SkeletonListLoader: React.FC<SkeletonListLoaderProps> = ({ currentTheme }) => {

  return (
    <div className="skeleton_list_loader_cont" style={{ backgroundColor: currentTheme['--list-background-color'] }}>
      <Skeleton
        height={25}
        width={200}
        highlightColor={currentTheme['--main-text-coloure']}
        baseColor={currentTheme['--list-background-color']}

      />
      <div className='skeleton_list_icon_cont' >
        <MdModeEdit
          style={{
            color: currentTheme['--main-text-coloure'],
            cursor: 'pointer',
            marginLeft: '10px',
            fontSize: '23px'

          }}
        />
        <MdDeleteForever
          style={{
            color: currentTheme['--main-text-coloure'],
            cursor: 'pointer',
            marginLeft: '10px',
            fontSize: '23px'

          }}
        />
      </div>
    </div>
  );

}



export default SkeletonListLoader;






















