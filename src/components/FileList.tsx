import type {FileLink} from '@/entities/FileLink';
import {FileLink as FileLinkEl} from './FileLink';
import styled from 'styled-components';
import type {Action} from '@/types/Action';
import {useRef} from 'react';
import {SelectionBox} from '@/components/SelectionBox';
import {keyboardManager} from '@/utils/keyboard-manager';
import {useState} from 'react';
import {readdir} from 'node:fs/promises';
import {makeFileList} from '@/entities/FileLink';
import {join} from 'node:path';
import {useEffect} from 'react';
import {useCallback} from 'react';


type FileListProps = {
  files: FileLink[],
  toggleFileSelected: (file: FileLink, selected?: boolean) => void,
  unselectAll: Action,
  selectedFiles: FileLink[],
  onGoBack?: () => void
};

const dataKeyAttribute = 'data-key';

export const FileList = ({files, selectedFiles, toggleFileSelected, onGoBack, unselectAll}: FileListProps) => {
  const [filesWrapper, setFilesWrapper] = useState<HTMLDivElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [dragEl, setDragEl] = useState<FileLink | null>(null);
  const [openedFolderContent, setOpenedFolderContent] = useState<FileLink[]>([]);
  const [backSelected, setBackSelected] = useState(false);
  const sortedFiles = files.sort((a, b) => (a.isFolder ? 0 : 1) - (b.isFolder ? 0 : 1));

  const handleBoxSelection = useCallback((selectedList: Element[]) => {
    setBackSelected(false);

    const newSelectedFiles = selectedList
      .map(el => sortedFiles.find(file => file.path == el.getAttribute(dataKeyAttribute)))
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
  }, [toggleFileSelected, unselectAll, sortedFiles]);

  const openFileHandler = async (fileLink: FileLink) => {
    unselectAll();

    if (fileLink.isFolder) {
      const fileNames = await readdir(fileLink.path);
      const filePaths = fileNames.map(fileName => join(fileLink.path, fileName));
      setOpenedFolderContent(await Promise.all(filePaths.map(makeFileList)));
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
            fileLink={{path: '..', name: '..', isFolder: true}}
            onDoubleClickCapture={() => onGoBack?.()}
          />
        }

        {/* Other files*/}
        {sortedFiles.map(fileLink => {
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

