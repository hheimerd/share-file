import type {Action} from '@/types/Action';
import type {ReactNode} from 'react';
import type {DragEvent} from 'react';
import styled from 'styled-components';
import {useState} from 'react';

interface FileWithPath extends File {
  path: string
}

type DragAndDropZoneProps = {
  onFileDropped?: (filePath: string, isFolder: boolean) => void,
  children?: ReactNode
}

function preventAndRun(action?: Action<DragEvent>) {
  return (e: DragEvent) => {
    e.preventDefault();
    action?.(e);
  };
}

const preventAndStop = (e: DragEvent) => {
  e.preventDefault();
  e.stopPropagation();
};

export const DragAndDropZone = ({children, onFileDropped}: DragAndDropZoneProps) => {
  const [dropHereVisible, setDropHereVisible] = useState(false);

  const onDragStart = () => {
    setDropHereVisible(true);
  };

  const onDragEnd = () => {
    setDropHereVisible(false);
  };

  const onDrop = (e: DragEvent) => {
    setDropHereVisible(false);
    for (const item of e.dataTransfer.items) {
      const fileEntry = item.webkitGetAsEntry();
      if (item.kind != 'file' || !fileEntry)
        return;

      onFileDropped?.((item.getAsFile() as FileWithPath).path, fileEntry.isDirectory);
    }
  };

  return (
    <Wrapper
      onDragLeave={preventAndRun(onDragEnd)}
      onDrop={preventAndRun(onDrop)}
      onDragOver={preventAndRun(onDragStart)}
    >
      <DropHereBanner show={dropHereVisible}>
        Drop here
      </DropHereBanner>
      <Wrapper onDragStart={preventAndStop} onDragOver={preventAndStop} onDragEnd={preventAndStop}>
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
  display: flex;

  align-items: center;
  justify-content: center;
  
  background: rgba(26, 26, 26, 0.75);
  opacity: ${({show}) => show ? 1 : 0};
  transition: 0.2s;

  font-size: 3em;
  pointer-events: none;

`;
