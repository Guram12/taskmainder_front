import '../../styles/Board Styles/SkeletonUserInfo.css';
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import { ThemeSpecs } from '../../utils/theme';










interface SkeletonUserInfoProps {
  currentTheme: ThemeSpecs;
  height: number;
  width: number;
}


const SkeletonUserInfo: React.FC<SkeletonUserInfoProps> = ({ currentTheme, height, width }) => {
  return (
    <div className="skeleton-user-board-name">
      <div className='skeleton-user-board-name-inner' >
        <Skeleton
          width={width}
          height={height}
          highlightColor={currentTheme['--main-text-coloure']}
          baseColor={currentTheme['--list-background-color']}
        />
      </div>
    </div>
  );
};




export default SkeletonUserInfo;






















