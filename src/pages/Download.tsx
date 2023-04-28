import styled from 'styled-components';
import {useEffect, useMemo, useState} from 'react';
import {EnterPeerAddressForm} from '@/components/EnterPeerAddressForm';
import {isValidUrl} from '@/utils/is-valid-url';
import {RemoteDescriptorsRepository} from '@/data/remote-descriptors.repository';
import {DescriptorsGridView} from '@/components/FileList/DescriptorsGridView';
import type {RemoteDescriptor} from '@/entities/Descriptor';
import {RemoteDescriptorVM} from '@/components/FileList/RemoteDescriptorVM';
import {Observer} from 'mobx-react';

type DownloadProps = {
  className?: string
}

const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?):(6553[0-5]|655[0-2][0-9]|65[0-4][0-9][0-9]|6[0-4][0-9][0-9][0-9][0-9]|[1-5](\d){4}|[1-9](\d){0,3})$/;

export function Download({className}: DownloadProps) {
  const [errorMessage, setErrorMessage] = useState('');
  const [repository, setRepository] = useState<RemoteDescriptorsRepository | null>(null);
  const descriptorGridVM = useMemo(() => repository && new RemoteDescriptorVM(repository), [repository]);

  useEffect(() => {

    descriptorGridVM?.refetch()
      .catch(e => {
        setRepository((prevRepository) => {
          console.error(e);
          if (prevRepository != repository)
            return prevRepository;

          setErrorMessage('Error to fetch data');
          return null;
        });
      });
  }, [descriptorGridVM]);


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

    setRepository(new RemoteDescriptorsRepository(url));
  };

  return (
    <Wrapper className={className}>
      <AddressForm onSubmit={fetchPeerFiles} error={errorMessage}/>
      {repository && descriptorGridVM &&
        <Observer>{() =>
          <DescriptorsGridView<RemoteDescriptor>
            onFileDrag={descriptorGridVM?.startDrag}
            {...descriptorGridVM}
            selectedFiles={descriptorGridVM.selectedFiles}
            descriptors={descriptorGridVM.descriptors}
            onGoBack={descriptorGridVM.onGoBack}
          />
        }
        </Observer>
      }

    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  padding: 1rem;
  gap: 0.5rem;
  flex-direction: column;
`;


const AddressForm = styled(EnterPeerAddressForm)`
`;
