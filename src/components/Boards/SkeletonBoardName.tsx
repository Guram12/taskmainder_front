import '../../styles/Board Styles/SkeletonBoardName.css';
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import { ThemeSpecs } from '../../utils/theme';
import { FaClipboardList } from "react-icons/fa";










interface SkeletonBoardNameProps {
  currentTheme: ThemeSpecs;
}


const SkeletonBoardName: React.FC<SkeletonBoardNameProps> = ({ currentTheme }) => {
  return (
    <div className="skeleton-board-name">
      <div className='skeleton-board-name-inner' >
        <FaClipboardList  className='skeleton-boardname-icon' style={{ color: currentTheme['--main-text-coloure'] }} />
        <Skeleton
          width={140}
          height={14}
          highlightColor={currentTheme['--main-text-coloure']}
          baseColor={currentTheme['--list-background-color']}

        />
      </div>
    </div>
  );
};




export default SkeletonBoardName;






















