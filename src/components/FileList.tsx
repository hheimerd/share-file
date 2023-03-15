import type {FileLink} from '@/entities/FileLink';
import styled from 'styled-components';
import type {Action} from '@/types/Action';
import {useRef} from 'react';
import {SelectionBox} from '@/components/SelectionBox';
import {keyboardManager} from '@/utils/keyboard-manager';
import {getIcon} from 'material-file-icons';
import folderIcon from '@/assets/icons/folder.svg';
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

  return (
    <Wrapper ref={wrapperRef}>
      {files.map(fileLink => {
        const key = fileLink.path;
        const selected = selectedFiles.includes(fileLink);
        return (
          <FileLinkEl draggable={true} key={key}
            className="selectable" data-key={key}
            selected={selected}
            onDragStart={() => {
              setDragEl(fileLink);
              if (!selected)
                unselectAll();

              toggleFileSelected(fileLink, true);
            }}
            onDragEnd={() => setDragEl(null)}
          >
            <IconWrapper>
              {fileLink.isFolder
                ? <img src={folderIcon} alt="folder"/>
                : <div dangerouslySetInnerHTML={{__html: getIcon(fileLink.path).svg}}/>
              }
            </IconWrapper>
            <span>{fileLink.name}</span>
            {
              dragEl === fileLink && selectedFiles.length > 1 &&
            <PlusNDrag>
              +{selectedFiles.length - 1}
            </PlusNDrag>
            }
          </FileLinkEl>
        );
      })}


      {wrapperRef.current && !dragEl && <SelectionBox wrapper={wrapperRef.current} onIntersection={(selectedList) => {
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
  width: 5rem;
  height: 7rem;
  position: relative;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;

  transition: 0.1s;

  img {
    height: 4rem;
    object-fit: contain;
    margin: 0 auto;
    user-drag: none;
    user-select: none;
  }

  span {
    word-break: break-word;
    padding: 0 0.3rem;
    border-radius: 2px;
    background: ${({selected}) => selected ? 'rgba(114,114,255,0.71)' : 'transparent'};
    font-size: 0.8em;
  }
`;

const IconWrapper = styled.div`
  height: 4rem;
  margin-bottom: 0.5rem;
`;

const PlusNDrag = styled.div`
  position: absolute;
  bottom: -10px;
  right: -10px;
  background: aliceblue;
  height: 1.5rem;
  text-align: center;
  width: 1.5rem;
  border-radius: 2px;
  color: black;
`;
