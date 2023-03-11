import type {FileLink} from '@/entities/FileLink';
import styled from 'styled-components';
import type {Action} from '@/types/Action';
import {useRef} from 'react';
import {SelectionBox} from '@/components/SelectionBox';
import {keyboardManager} from '@/utils/keyboard-manager';

type FileListProps = {
  files: FileLink[],
  toggleFileSelected: (file: FileLink, selected?: boolean) => void,
  unselectAll: Action,
  selectedFiles: FileLink[]
};


export const FileList = ({files, selectedFiles, toggleFileSelected, unselectAll}: FileListProps) => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  return (
    <Wrapper ref={wrapperRef}>

      {files.map(fileLink => (
        <FileLinkEl
          className="selectable" data-key={fileLink.path}
          key={fileLink.path} selected={selectedFiles.includes(fileLink)}
        >
          <img src={fileLink.iconUrl} alt="icon"/>
          <span>{fileLink.name}</span>
        </FileLinkEl>
      ))}

      {wrapperRef.current && <SelectionBox wrapper={wrapperRef.current} onIntersection={(selectedList) => {
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
      }
      }/>}

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

const FileLinkEl = styled.div<{ selected: boolean }>`
  display: flex;
  width: 4rem;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  transition: 0.1s;

  img {
    width: 100%;
    height: 4rem;
    object-fit: contain;
  }

  span {
    word-break: break-word;
    padding: 0 0.5rem;
    border-radius: 2px;
    background: ${({selected}) => selected ? 'rgba(114,114,255,0.71)' : 'transparent'};
  }
`;

