import '../../styles/Board Styles/SkeletonMember.css';
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import { ThemeSpecs } from '../../utils/theme';
import { RiUserSettingsFill } from "react-icons/ri";
import { FaClipboardList } from "react-icons/fa";

interface SkeletonMemberProps {
  currentTheme: ThemeSpecs;
}

const SkeletonMember: React.FC<SkeletonMemberProps> = ({ currentTheme }) => {


  return (
    <div className="skeleton_member_container">
      <RiUserSettingsFill className='skeleton_user_icon' />


      <Skeleton
        circle
        height={30}
        width={30}
        style={{ marginRight: '10px' }}
        baseColor={currentTheme['--list-background-color']}
        highlightColor="#e0e0e0"
      />
      <Skeleton
        circle
        height={30}
        width={30}
        style={{ marginRight: '10px', marginLeft: '-35px' }}
        baseColor={currentTheme['--list-background-color']}
        highlightColor="#e0e0e0"
      />
      <Skeleton
        circle
        height={30}
        width={30}
        style={{ marginRight: '10px', marginLeft: '-35px' }}
        baseColor={currentTheme['--list-background-color']}
        highlightColor="#e0e0e0"
      />
      <FaClipboardList className='skeleton_boardname_icon' />

      <Skeleton
        height={30}
        width={300}
        style={{ marginLeft: '10px' }}
        baseColor={currentTheme['--list-background-color']}
        highlightColor="#e0e0e0"
      />

    </div>
  )


}



export default SkeletonMember;
























