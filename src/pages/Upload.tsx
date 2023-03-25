import {useSelectableData} from '@/hooks/useSelectableData';
import type {AnyDescriptor, LocalDescriptor} from '@/entities/Descriptor';
import {useEffect, useRef, useState} from 'react';
import {fileRepository} from '@/data/files-repository';
import {DragAndDropZone} from '@/components/DragAndDropZone';
import {FileList} from '@/components/FileList';

type UploadProps = {
  className?: string
}

function createFileHash(file: File) {
  return `${file.path}${file.lastModified}${file.size}`;
}

export function Upload({className}: UploadProps) {
  const {selectedData, toggleSelectedData, clearSelectedData} = useSelectableData<AnyDescriptor>();
  const [localFiles, setLocalFiles] = useState<LocalDescriptor[]>([]);
  const filesHash = useRef<string[]>([]);

  useEffect(() => {
    clearSelectedData();
  }, [localFiles]);

  const handleFilesDrop = async (dataTransfer: DataTransfer) => {
    const newFiles: LocalDescriptor[] = [];

    for (const item of dataTransfer.items) {
      const file = item.getAsFile();
      if (!file) continue;

      const hash = createFileHash(file);
      if (filesHash.current.includes(hash))
        continue;

      filesHash.current.push(hash);

      const entry = item.webkitGetAsEntry();
      if (!entry)
        continue;

      const path = file?.path ?? entry.fullPath;

      newFiles.push(await fileRepository.createDescriptor(entry, path));
    }

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
