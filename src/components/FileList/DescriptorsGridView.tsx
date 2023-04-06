import {DescriptorView as FileLinkEl} from './DescriptorView';
import styled from 'styled-components';
import type {Action} from '@/types/Action';
import {useCallback, useEffect, useRef, useState} from 'react';
import {SelectionBox} from '@/components/SelectionBox';
import {keyboardManager} from '@/utils/keyboard-manager';
import type {Descriptor} from '@/entities/Descriptor';
import {BackDescriptor} from '@/entities/Descriptor';
import {ContextMenu} from '@/components/FileList/ContextMenu';


type FileListProps<TDescriptor extends Descriptor> = {
  descriptors: TDescriptor[],
  toggleFileSelected: (file: TDescriptor, selected?: boolean) => void,
  unselectAll: Action,
  selectedFiles: TDescriptor[],
  onGoBack?: () => void,
  openFile?: (descriptor: TDescriptor) => void,
};

const dataKeyAttribute = 'data-key';

export const DescriptorsGridView = <TDescriptor extends Descriptor>({
  descriptors,
  openFile,
  selectedFiles,
  toggleFileSelected,
  onGoBack,
  unselectAll,
}: FileListProps<TDescriptor>) => {

  const [filesWrapper, setFilesWrapper] = useState<HTMLDivElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [dragEl, setDragEl] = useState<TDescriptor | null>(null);
  const [openedFolderContent, setOpenedFolderContent] = useState<TDescriptor[]>([]);
  const [backSelected, setBackSelected] = useState(false);
  const sortedFiles = descriptors.sort((a, b) => a.type - b.type);
  const [contextMenuPosition, setContextMenuPosition] = useState<{ x: number, y: number } | null>(null);

  const handleBoxSelection = useCallback((selectedList: Element[]) => {
    setBackSelected(false);

    const newSelectedFiles = selectedList
      .map(el => sortedFiles.find(file => file.id == el.getAttribute(dataKeyAttribute)))
      .filter(x => x) as TDescriptor[];

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

  useEffect(() => {
    setFilesWrapper(wrapperRef.current); // wrapperRef.current is null after go to the back directory
  }, [openedFolderContent]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setContextMenuPosition({x: e.clientX, y: e.clientY});
    };

    wrapperRef.current?.addEventListener('contextmenu', handler);
    return () => {
      wrapperRef.current?.removeEventListener('contextmenu', handler);
    };
  }, [wrapperRef]);


  return (
    openedFolderContent.length > 0
      ? <DescriptorsGridView
        descriptors={openedFolderContent} selectedFiles={selectedFiles} onGoBack={() => setOpenedFolderContent([])}
        unselectAll={unselectAll} toggleFileSelected={toggleFileSelected}
      />
      : <Wrapper ref={wrapperRef}>

        {contextMenuPosition &&
          <ContextMenu items={[
            {title: 'Open', onClick: () => void(0)},
            {title: 'Download', onClick: () => void(0)},
            {title: 'Delete', onClick: () => void(0)},
          ]} 
          position={contextMenuPosition}
          onDismiss={() => setContextMenuPosition(null)}
          />
        }

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
        {sortedFiles.map(descriptor => {
          const key = descriptor.id;
          const selected = selectedFiles.includes(descriptor);
          const dragging = dragEl == descriptor;

          const handleFileDragStart = () => {
            setDragEl(descriptor);
            if (!selected)
              unselectAll();

            toggleFileSelected(descriptor, true);
          };

          return (
            <FileLinkEl
              descriptor={descriptor} selected={selected}
              key={key} className="selectable" data-key={key}
              onDragStart={handleFileDragStart}
              onDragEnd={() => setDragEl(null)}
              dragFilesCount={dragging ? selectedFiles.length : 0}
              onDoubleClickCapture={() => openFile?.(descriptor)}
            />
          );
        })}

        {filesWrapper && !dragEl &&
          <SelectionBox wrapper={filesWrapper} onIntersection={handleBoxSelection}/>}

      </Wrapper>
  );
};


const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;

  gap: 1rem;
  user-select: none;

  width: 100%;
  height: 100%;
  align-content: flex-start;
`;
