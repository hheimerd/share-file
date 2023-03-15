import {DragAndDropZone} from '@/components/DragAndDropZone';
import styled from 'styled-components';
import {FileList} from '@/components/FileList';
import type {FileLink} from '@/entities/FileLink';
import {useEffect} from 'react';
import {useSelectableData} from '@/hooks/useSelectableData';
import {useState} from 'react';
import {basename} from 'node:path';
import {lstat} from 'node:fs/promises';

function App() {
  const {selectedData, toggleSelectedData, clearSelectedData} = useSelectableData<FileLink>();
  const [files, setFiles] = useState<FileLink[]>([]);

  useEffect(() => {
    clearSelectedData();
  }, [files]);

  return (
    <AppWrapper className="App">
      <DragAndDropZone onFilesDropped={async droppedFilePaths => {
        const existingPaths = files.map(x => x.path);
        const newFiles = await Promise.all(droppedFilePaths
          .filter(path => existingPaths.includes(path) == false)
          .map(async path => ({
            path,
            name: basename(path),
            isFolder: (await lstat(path)).isDirectory(),
          })));

        if (newFiles.length)
          setFiles([...files, ...newFiles]);
      }}>
        <FileList
          files={files}
          selectedFiles={selectedData}
          toggleFileSelected={toggleSelectedData}
          unselectAll={clearSelectedData}
        />
      </DragAndDropZone>
    </AppWrapper>
  );
}

const AppWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

export default App;
