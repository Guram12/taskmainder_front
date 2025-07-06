import '../../styles/Board Styles/SkeletonEachTask.css';
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import { ThemeSpecs } from '../../utils/theme';

interface SkeletonEachTaskProps {
  currentTheme: ThemeSpecs;
}




const SkeletonEachTask: React.FC<SkeletonEachTaskProps> = ({ currentTheme }) => {





  return (
    <div className="skeleton_task_container" style={{ backgroundColor: currentTheme['--task-background-color'] }}>
      <Skeleton
        height={20}
        highlightColor={currentTheme['--main-text-coloure']}
        baseColor={currentTheme['--list-background-color']}
        containerClassName="sk_task_title"
      />
      <div className='skeleton_task_details'>
        <Skeleton
          width={70}
          height={10}
          highlightColor={currentTheme['--main-text-coloure']}
          baseColor={currentTheme['--list-background-color']}

        />
        <Skeleton
          width={50}
          height={10}
          highlightColor={currentTheme['--main-text-coloure']}
          baseColor={currentTheme['--list-background-color']}

        />

      </div>

    </div>
  );
}



export default SkeletonEachTask;






















