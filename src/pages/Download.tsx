import styled from 'styled-components';
import {useState} from 'react';
import {EnterPeerAddressForm} from '@/components/EnterPeerAddressForm';
import {isValidUrl} from '@/utils/is-valid-url';

type DownloadProps = {
  className?: string
}

const ipRegex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

export function Download({className}: DownloadProps) {

  const [errorMessage, setErrorMessage] = useState('');

  const fetchPeerFiles = (address: string) => {
    const isAddressValid = ipRegex.test(address) || isValidUrl(address);

    if (!isAddressValid) {
      setErrorMessage('Invalid URL address');
      return;
    }
    setErrorMessage('');
  };

  return (
    <Wrapper className={className}>
      <AddressForm onSubmit={fetchPeerFiles} error={errorMessage}/>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`;


const AddressForm = styled(EnterPeerAddressForm)`
  margin: 35vh auto;
`;
