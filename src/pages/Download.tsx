import styled from 'styled-components';
import {useEffect, useState} from 'react';
import {EnterPeerAddressForm} from '@/components/EnterPeerAddressForm';
import {isValidUrl} from '@/utils/is-valid-url';
import {RemoteFilesRepository} from '@/data/remote-files.repository';
import {FileList} from '@/components/FileList';
import type {RemoteDescriptorDto} from '@/api/dto/remote-descriptor.dto';
import {useSelectableData} from '@/hooks/useSelectableData';
import type {Descriptor} from '@/entities/Descriptor';

type DownloadProps = {
  className?: string
}

const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?):(6553[0-5]|655[0-2][0-9]|65[0-4][0-9][0-9]|6[0-4][0-9][0-9][0-9][0-9]|[1-5](\d){4}|[1-9](\d){0,3})$/;

export function Download({className}: DownloadProps) {
  const [errorMessage, setErrorMessage] = useState('');
  const [repository, setRepository] = useState<RemoteFilesRepository | null>(null);
  const [files, setFiles] = useState<RemoteDescriptorDto[]>([]);
  const {selectedData, toggleSelectedData, clearSelectedData} = useSelectableData<Descriptor>();

  useEffect(() => {
    repository?.getFiles().then((value) => {
      console.log(value);
      setFiles(value);
    }).catch(e => {
      console.error(e);
      setErrorMessage('URL is not accessible');
      setRepository(null);
    });
  }, [repository]);

  const fetchPeerFiles = (address: string) => {
    const isIp = ipRegex.test(address);
    const isUrl = isValidUrl(address);

    if (!isUrl && !isIp) {
      setErrorMessage('Invalid URL address');
      return;
    }
    setErrorMessage('');

    const url = isIp
      ? new URL('http://' + address)
      : new URL(address);

    setRepository(new RemoteFilesRepository(url));
  };

  return (
    <Wrapper className={className}>
      <AddressForm onSubmit={fetchPeerFiles} error={errorMessage}/>
      {repository &&
        <FileList
          files={files}
          selectedFiles={selectedData}
          toggleFileSelected={toggleSelectedData}
          unselectAll={clearSelectedData}
        />
      }
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  padding: 1rem;
  flex-direction: column;
`;


const AddressForm = styled(EnterPeerAddressForm)`
`;
