import {FileLink as FileLinkEl} from './FileLink';
import styled from 'styled-components';
import type {Action} from '@/types/Action';
import {useCallback, useEffect, useRef, useState} from 'react';
import {SelectionBox} from '@/components/SelectionBox';
import {keyboardManager} from '@/utils/keyboard-manager';
import type {AnyDescriptor} from '@/entities/Descriptor';
import {BackDescriptor, DescriptorType} from '@/entities/Descriptor';

type FileListProps = {
  files: AnyDescriptor[],
  toggleFileSelected: (file: AnyDescriptor, selected?: boolean) => void,
  unselectAll: Action,
  selectedFiles: AnyDescriptor[],
  onGoBack?: () => void
};

const dataKeyAttribute = 'data-key';

export const FileList = ({files, selectedFiles, toggleFileSelected, onGoBack, unselectAll}: FileListProps) => {
  const [filesWrapper, setFilesWrapper] = useState<HTMLDivElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [dragEl, setDragEl] = useState<AnyDescriptor | null>(null);
  const [openedFolderContent, setOpenedFolderContent] = useState<AnyDescriptor[]>([]);
  const [backSelected, setBackSelected] = useState(false);
  const sortedFiles = files.sort((a, b) => a.type - b.type);

  const handleBoxSelection = useCallback((selectedList: Element[]) => {
    setBackSelected(false);

    const newSelectedFiles = selectedList
      .map(el => sortedFiles.find(file => file.id == el.getAttribute(dataKeyAttribute)))
      .filter(x => x) as AnyDescriptor[];

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
  }, [toggleFileSelected, unselectAll, sortedFiles]);

  const openFileHandler = async (fileLink: AnyDescriptor) => {
    unselectAll();

    if (fileLink.type === DescriptorType.LocalDirectory) {
      setOpenedFolderContent(await fileLink.content());
    } else {
      return; // TODO: Handle file open
    }
  };

  useEffect(() => {
    setFilesWrapper(wrapperRef.current); // wrapperRef.current is null after go to the back directory
  }, [openedFolderContent]);

  return (
    openedFolderContent.length > 0
      ? <FileList
        files={openedFolderContent} selectedFiles={selectedFiles} onGoBack={() => setOpenedFolderContent([])}
        unselectAll={unselectAll} toggleFileSelected={toggleFileSelected}
      />
      : <Wrapper ref={wrapperRef}>

        {/* Go back folder (...)*/}
        {onGoBack &&
          <FileLinkEl
            selected={backSelected}
            onClick={() => {
              unselectAll();
              setBackSelected(true);
            }}
            descriptor={BackDescriptor}
            onDoubleClickCapture={() => onGoBack?.()}
          />
        }

        {/* Other files*/}
        {sortedFiles.map(fileLink => {
          const key = fileLink.id;
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
              descriptor={fileLink} selected={selected}
              key={key} className="selectable" data-key={key}
              onDragStart={handleFileDragStart}
              onDragEnd={() => setDragEl(null)}
              dragFilesCount={dragging ? selectedFiles.length : 0}
              onDoubleClickCapture={() => openFileHandler(fileLink)}
            />
          );
        })}

        {filesWrapper && !dragEl &&
          <SelectionBox wrapper={filesWrapper} onIntersection={handleBoxSelection}/>}

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
