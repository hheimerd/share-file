import {DragAndDropZone} from '@/components/DragAndDropZone';
import styled from 'styled-components';
import {FileList} from '@/components/FileList';
import {useEffect} from 'react';
import {useSelectableData} from '@/hooks/useSelectableData';
import {useState} from 'react';
import {fileRepository} from '@/data/files-repository';
import type {AnyDescriptor} from '@/entities/Descriptor';
import type {LocalDescriptor} from '@/entities/Descriptor';
import {Tabs} from '@/components/Tabs';

function App() {
  const {selectedData, toggleSelectedData, clearSelectedData} = useSelectableData<AnyDescriptor>();
  const [localFiles, setLocalFiles] = useState<LocalDescriptor[]>([]);
  const [tab, setTab] = useState(0);

  useEffect(() => {
    clearSelectedData();
  }, [localFiles]);

  const handleFilesDrop = async (dataTransfer: DataTransfer) => {
    const alreadyAdded = localFiles.map(x => x.path);
    
    const newFiles = await Promise.all(
      Array.from(dataTransfer.items)
        .map(item => item.webkitGetAsEntry())
        .filter(entry => entry && !alreadyAdded.includes(entry.fullPath))
        .map(async entry=> await fileRepository.createDescriptor(entry!)),
    );

    if (newFiles.length)
      setLocalFiles(files => [...files, ...newFiles]);
  };

  return (
    <AppWrapper className="App">
      <Tabs selected={tab} tabs={['Upload ⬆️', 'Download ⬇️']} onTabSelect={setTab}/>
      <DragAndDropZone onFilesDropped={handleFilesDrop}>
        <FileList
          files={localFiles}
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
