import '../../styles/Board Styles/SkeletonLoader.css';
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { ThemeSpecs } from '../../utils/theme';

interface SkeletonLoaderProps {
  currentTheme: ThemeSpecs; // Current theme for styling
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ currentTheme }) => {
  const taskCounts = [2, 3, 1];
  return (
    <div className="skeleton-container">
      {taskCounts.map((taskCount, listIndex) => (
        <div
          key={listIndex}
          className="skeleton-list"
          style={{ backgroundColor: `${currentTheme['--list-background-color']}` }}
        >
          {/* Skeleton for list title */}
          <div
            style={{
              height: 30,
              width: '100%',
              marginBottom: '10px',
              marginTop: '10px',
              borderRadius: 6,
              background: currentTheme['--main-text-coloure'],
              opacity: 0.15,
            }}
          />

          {/* Skeletons for tasks */}
          {Array.from({ length: taskCount }).map((_, taskIndex) => (
            <Skeleton
              key={taskIndex}
              height={40}
              width={'100%'}
              style={{ marginBottom: '15px' }}
              baseColor={currentTheme['--list-background-color']}
              highlightColor={currentTheme['--main-text-coloure']}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;