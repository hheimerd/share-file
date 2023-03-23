import {useSelectableData} from '@/hooks/useSelectableData';
import type {AnyDescriptor, LocalDescriptor} from '@/entities/Descriptor';
import {useEffect, useState} from 'react';
import {fileRepository} from '@/data/files-repository';
import {DragAndDropZone} from '@/components/DragAndDropZone';
import {FileList} from '@/components/FileList';

type UploadProps = {
  className?: string
}

export function Upload({className}: UploadProps) {
  const {selectedData, toggleSelectedData, clearSelectedData} = useSelectableData<AnyDescriptor>();
  const [localFiles, setLocalFiles] = useState<LocalDescriptor[]>([]);

  useEffect(() => {
    clearSelectedData();
  }, [localFiles]);

  const handleFilesDrop = async (dataTransfer: DataTransfer) => {
    const alreadyAdded = localFiles.map(x => x.path);

    const newFiles = await Promise.all(
      Array.from(dataTransfer.items)
        .map(item => item.webkitGetAsEntry())
        .filter(entry => entry && !alreadyAdded.includes(entry.fullPath))
        .map(async entry => await fileRepository.createDescriptor(entry!)),
    );

    if (newFiles.length)
      setLocalFiles(files => [...files, ...newFiles]);
  };

  return (
    <div className={className}>
      <DragAndDropZone onFilesDropped={handleFilesDrop}>
        <FileList
          files={localFiles}
          selectedFiles={selectedData}
          toggleFileSelected={toggleSelectedData}
          unselectAll={clearSelectedData}
        />
      </DragAndDropZone>
    </div>
  );
}
