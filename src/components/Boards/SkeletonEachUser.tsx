import '../../styles/Board Styles/SkeletonEachUser.css';
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import { ThemeSpecs } from '../../utils/theme';

interface SkeletonEachUserProps {
  currentTheme: ThemeSpecs;
}


const SkeletonEachUser: React.FC<SkeletonEachUserProps> = ({ currentTheme }) => {
  return (
    <div className="skeleton_user_container" style={{ backgroundColor: currentTheme['--task-background-color'] }}>
      <div className='skeleton_user_info'>
        <Skeleton
          width={30}
          height={30}
          circle={true}
          style={{ marginLeft: '10px' }}
          highlightColor={currentTheme['--main-text-coloure']}
          baseColor={currentTheme['--list-background-color']}
        />
        <Skeleton
          width={70}
          height={15}
          highlightColor={currentTheme['--main-text-coloure']}
          baseColor={currentTheme['--list-background-color']}
        />
        <Skeleton
          width={200}
          height={15}
          highlightColor={currentTheme['--main-text-coloure']}
          baseColor={currentTheme['--list-background-color']}
        />
      </div>
      <div className='skeleton_user_details'>
        <Skeleton
          width={100}
          height={15}
          style={{ marginRight: '10px' }}
          highlightColor={currentTheme['--main-text-coloure']}
          baseColor={currentTheme['--list-background-color']}
        />
      </div>
    </div>
  );
}



export default SkeletonEachUser;
