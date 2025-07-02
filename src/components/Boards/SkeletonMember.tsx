import '../../styles/Board Styles/SkeletonMember.css';
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import { ThemeSpecs } from '../../utils/theme';
import { RiUserSettingsFill } from "react-icons/ri";
import { FaClipboardList } from "react-icons/fa";

interface SkeletonMemberProps {
  currentTheme: ThemeSpecs;
  isMobile: boolean;
}

const SkeletonMember: React.FC<SkeletonMemberProps> = ({ currentTheme, isMobile }) => {


  return (
    <div className="skeleton_member_container">
      <RiUserSettingsFill className='skeleton_user_icon' />

      <Skeleton
        circle
        height={30}
        width={30}
        style={{ marginRight:  isMobile ?  '5px' : '10px'  }}
        baseColor={currentTheme['--list-background-color']}
        highlightColor={currentTheme['--main-text-coloure']}
      />
      <Skeleton
        circle
        height={30}
        width={30}
        style={{ marginRight: '10px', marginLeft: '-35px' }}
        baseColor={currentTheme['--list-background-color']}
        highlightColor={currentTheme['--main-text-coloure']}
      />
      <Skeleton
        circle
        height={30}
        width={30}
        style={{ marginRight: '10px', marginLeft: '-35px' }}
        baseColor={currentTheme['--list-background-color']}
        highlightColor={currentTheme['--main-text-coloure']}
      />

      <FaClipboardList className='skeleton_boardname_icon' />

      <Skeleton
        height={30}
        width={ isMobile ? 170 : 300}
        style={{ marginLeft: '10px' }}
        baseColor={currentTheme['--list-background-color']}
        highlightColor={currentTheme['--main-text-coloure']}
      />

    </div>
  )


}



export default SkeletonMember;
























