import {DragAndDropZone} from '@/components/DragAndDropZone';
import {DescriptorsGridView} from '@/components/FileList/DescriptorsGridView';
import styled from 'styled-components';
import {useLocalObservable} from 'mobx-react-lite';
import {LocalDescriptorGridVM} from '@/components/FileList/LocalDescriptorGridVM';
import {Observer} from 'mobx-react';
import type {LocalDescriptor} from '@/entities/Descriptor';

type UploadProps = {
  className?: string
}


export const Upload = ({className}: UploadProps) => {
  const descriptorGridVM = useLocalObservable(() => new LocalDescriptorGridVM());

  return (
    <div className={className}>
      <DragAndDropWrapper onFilesDropped={descriptorGridVM.addDescriptorsFromInput}>
        <Observer>
          {() =>
            <DescriptorsGridView<LocalDescriptor>
              {...descriptorGridVM}
              selectedFiles={descriptorGridVM.selectedFiles}
              descriptors={descriptorGridVM.descriptors}
              onGoBack={descriptorGridVM.onGoBack}
            />}
        </Observer>
      </DragAndDropWrapper>
    </div>
  );
};

const DragAndDropWrapper = styled(DragAndDropZone)`
  padding: 1rem;
`;
