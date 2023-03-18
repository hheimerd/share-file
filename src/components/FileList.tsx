import type {FileLink} from '@/entities/FileLink';
import {FileLink as FileLinkEl} from './FileLink';
import styled from 'styled-components';
import type {Action} from '@/types/Action';
import {useRef} from 'react';
import {SelectionBox} from '@/components/SelectionBox';
import {keyboardManager} from '@/utils/keyboard-manager';
import {useState} from 'react';


type FileListProps = {
  files: FileLink[],
  toggleFileSelected: (file: FileLink, selected?: boolean) => void,
  unselectAll: Action,
  selectedFiles: FileLink[]
};

export const FileList = ({files, selectedFiles, toggleFileSelected, unselectAll}: FileListProps) => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [dragEl, setDragEl] = useState<FileLink | null>(null);

  const handleBoxSelection = (selectedList: Element[]) => {
    const newSelectedFiles = selectedList
      .map(el => files.find(file => file.path == el.getAttribute('data-key')))
      .filter(x => x) as FileLink[];

    if (!keyboardManager.ctrlCmd && !keyboardManager.shift)
      unselectAll();

    for (const newSelectedFile of newSelectedFiles) {
      if (keyboardManager.shift)
        toggleFileSelected(newSelectedFile, true);
      else if (keyboardManager.ctrlCmd)
        toggleFileSelected(newSelectedFile);
      else
        toggleFileSelected(newSelectedFile, true);
    }
  };


  return (
    <Wrapper ref={wrapperRef}>
      {files.map(fileLink => {
        const key = fileLink.path;
        const selected = selectedFiles.includes(fileLink);
        const dragging = dragEl == fileLink;

        const handleFileDragStart = () => {
          setDragEl(fileLink);
          if (!selected)
            unselectAll();

          toggleFileSelected(fileLink, true);
        };

        return (
          <FileLinkEl
            fileLink={fileLink} selected={selected}
            key={key} className="selectable" data-key={key}
            onDragStart={handleFileDragStart}
            onDragEnd={() => setDragEl(null)}
            dragFilesCount={dragging ? selectedFiles.length : 0}
          />
        );
      })}

      {wrapperRef.current && !dragEl &&
        <SelectionBox wrapper={wrapperRef.current} onIntersection={handleBoxSelection}/>}

    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;

  gap: 1rem;
  padding: 1rem;
  user-select: none;

  width: 100%;
  height: 100%;
  align-content: flex-start;

`;

