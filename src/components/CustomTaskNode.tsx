import '../styles/MindMap.css';
import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import Avatar from '@mui/material/Avatar';
import getAvatarStyles from "../utils/SetRandomColor";




const CustomTaskNode: React.FC<NodeProps> = ({ data }) => (
  <div style={{ ...data.style, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
    {/* Only one handle at the top */}
    <Handle type="target" position={Position.Top} />
    <div style={{ width: '100%', textAlign: 'left' }}>{data.label}</div>
    
    {/* Associated Users */}
    {data.associatedUsers && data.associatedUsers.length > 0 && (
      <div className='all_user_image_cont'>
        {data.associatedUsers.map((user: any) => (
          <div className="tasknode_user_images_cont" key={user.id}>
            {user.profile_picture !== null ? (
              <img
                src={user.profile_picture}
                alt="user profile"
                className="tasknode_image"
              />
            ) : (

              <Avatar
                alt={user.username}
                style={{
                  backgroundColor: getAvatarStyles(user.username.charAt(0)).backgroundColor,
                  color: getAvatarStyles(user.username.charAt(0)).color
                }}
                sx={{ width: 25, height: 25 , fontSize: 12 }}

              >
                {user.username.charAt(0).toUpperCase()}
              </Avatar>
            )}
          </div>
        ))}
      </div>
    )}
  </div>
);

export default CustomTaskNode;