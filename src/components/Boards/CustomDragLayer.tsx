import React from 'react';
import { useDragLayer } from 'react-dnd';

const layerStyles: React.CSSProperties = {
  position: 'fixed',
  pointerEvents: 'none',
  zIndex: 100,
  left: 0,
  top: 0,
  width: '100vw',
  height: '100vh',
};

function getItemStyles(currentOffset: { x: number; y: number } | null) {
  if (!currentOffset) {
    return { display: 'none' };
  }
  const { x, y } = currentOffset;
  return {
    transform: `translate(${x}px, ${y}px)`,
    WebkitTransform: `translate(${x}px, ${y}px)`,
  };
}

const CustomDragLayer: React.FC = () => {
  const {
    itemType,
    isDragging,
    item,
    currentOffset,
  } = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging(),
  }));

  if (!isDragging || !item) {
    return null;
  }

  // You can customize this preview as you wish
  return (
    <div style={layerStyles}>
      <div style={getItemStyles(currentOffset)}>
        <div
          style={{
            padding: 10,
            borderRadius: 5,
            background: '#727272',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            minWidth: 200,
            opacity: 0.9,
            
          }}
        >
          {item.title || 'Dragging...'}
        </div>
      </div>
    </div>
  );
};

export default CustomDragLayer;