import {DragAndDropZone} from '@/components/DragAndDropZone';
import styled from 'styled-components';
import {FileList} from '@/components/FileList';
import type {FileLink} from '@/entities/FileLink';
import {useEffect} from 'react';
import {useSelectableData} from '@/hooks/useSelectableData';
import {useState} from 'react';
import {makeFileList} from '@/entities/FileLink';

function App() {
  const {selectedData, toggleSelectedData, clearSelectedData} = useSelectableData<FileLink>();
  const [files, setFiles] = useState<FileLink[]>([]);

  useEffect(() => {
    clearSelectedData();
  }, [files]);

  const handleFilesDrop = async (droppedFilePaths: string[]) => {
    const existingPaths = files.map(x => x.path);
    const newFiles = await Promise.all(
      droppedFilePaths
        .filter(path => !existingPaths.includes(path))
        .map(makeFileList),
    );

    if (newFiles.length)
      setFiles([...files, ...newFiles]);
  };

  return (
    <AppWrapper className="App">
      <DragAndDropZone onFilesDropped={handleFilesDrop}>
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
