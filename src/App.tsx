import {DragAndDropZone} from '@/components/DragAndDropZone';
import styled from 'styled-components';
import {FileList} from '@/components/FileList';
import testIcon from '@/assets/electron-vite.svg';
import type {FileLink} from '@/entities/FileLink';
import {useEffect} from 'react';
import {useSelectableData} from '@/hooks/useSelectableData';

const files = Array.from({length: 20}, (_, i) => (
  {
    path: 'test' + i,
    name: 'test',
    iconUrl: testIcon,
  }
));


function App() {
  const {selectedData, toggleSelectedData, clearSelectedData} = useSelectableData<FileLink>();

  useEffect(() => {
    clearSelectedData();
  }, [files]);

  return (
    <AppWrapper className="App">
      <DragAndDropZone onFileDropped={console.log}>
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
