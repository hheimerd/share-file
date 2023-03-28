import type {Action} from '@/types/Action';
import type {DragEvent, ReactNode} from 'react';
import {useState} from 'react';
import styled from 'styled-components';

type DragAndDropZoneProps = {
  onFilesDropped?: (dataTransfer: DataTransfer) => void,
  children?: ReactNode,
  className?: string,
}

function preventAndRun(action?: Action<DragEvent>) {
  return (e: DragEvent) => {
    e.preventDefault();
    action?.(e);
  };
}

export const DragAndDropZone = ({className, children, onFilesDropped}: DragAndDropZoneProps) => {
  const [dropHereVisible, setDropHereVisible] = useState(false);
  const [isInnerDnD, setIsInnerDnD] = useState(false);

  const handleDragStart = () => {
    setDropHereVisible(true);
  };

  const handleDragEnd = () => {
    setDropHereVisible(false);
  };

  const handleDrop = (e: DragEvent) => {
    setDropHereVisible(false);
    onFilesDropped?.(e.dataTransfer);
  };

  return (
    <Wrapper
      className={className}
      onDragLeave={preventAndRun(handleDragEnd)}
      onDrop={preventAndRun(handleDrop)}
      onDragOver={preventAndRun(handleDragStart)}
    >
      <DropHereBanner show={!isInnerDnD && dropHereVisible}>
        Drop here
      </DropHereBanner>
      <Wrapper onDragStart={() => setIsInnerDnD(true)} onDragEnd={() => setIsInnerDnD(false)}>
        {children}
      </Wrapper>

    </Wrapper>
  );

};

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 50px;
  min-width: 100px;
`;

const DropHereBanner = styled.div<{ show: boolean }>`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  display: flex;

  align-items: center;
  justify-content: center;

  background: rgba(26, 26, 26, 0.75);
  opacity: ${({show}) => show ? 1 : 0};
  transition: 0.2s;

  font-size: 3em;
  pointer-events: none;

`;
