import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

const CustomTaskNode: React.FC<NodeProps> = ({ data }) => (
  <div style={{ ...data.style, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
    {/* Only one handle at the top */}
    <Handle type="target" position={Position.Top} />
    <div style={{ width: '100%', textAlign: 'left' }}>{data.label}</div>
  </div>
);

export default CustomTaskNode;