import '../../styles/Board Styles/SkeletonNotification.css';
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import { ThemeSpecs } from '../../utils/theme';
import { RiDeleteBin4Fill } from "react-icons/ri";


interface SkeletonNotificationProps {
  currentTheme: ThemeSpecs;
}

const SkeletonNotification: React.FC<SkeletonNotificationProps> = ({ currentTheme }) => {

  return (
    <div
      className="skeleton_notification_container"
      style={{
        borderColor: currentTheme['--border-color'],
        backgroundColor: currentTheme['--list-background-color']
      }}>
      <RiDeleteBin4Fill className='skeleton_notification_icon' />
      <Skeleton
        height={30}
        width={200}
        style={{ marginLeft: '10px', marginTop: '10px' }}
        baseColor={currentTheme['--list-background-color']}
        highlightColor="#e0e0e0"
      />
      <Skeleton
        height={30}
        width={500}
        style={{ marginLeft: '10px', marginTop: '30px' }}
        baseColor={currentTheme['--list-background-color']}
        highlightColor="#e0e0e0"
      />
      <Skeleton
        height={10}
        width={150}
        style={{ 
          marginLeft: '10px',
           marginTop: '30px', 
           position: 'absolute',
            bottom: '15px',
            right: '10px'
          
          }}
        baseColor={currentTheme['--list-background-color']}
        highlightColor="#e0e0e0"
      />

    </div>
  );
}


export default SkeletonNotification;























