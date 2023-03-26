import styled from 'styled-components';
import {Input} from '@/components/Input';
import {useState} from 'react';
import {hoverable} from '@/styles/mixins';

type EnterIpForm = {
  className?: string,
  onSubmit: (address: string) => void,
  error?: string
}

export const EnterPeerAddressForm = ({className, onSubmit, error}: EnterIpForm) => {
  const [ip, setIp] = useState('');

  return (
    <Wrapper className={className}>
      <AddressInput
        placeholder="Enter peer IP"
        value={ip}
        onChange={(e) => setIp(e.currentTarget.value)}
        errorMessage={error}
      />
      <SubmitButton onClick={() => onSubmit(ip)}>⇥</SubmitButton>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: fit-content;
  position: relative;
  height: 72px;
`;

const SubmitButton = styled.button`
  position: absolute;
  right: -30px;

  height: 72px;

  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 1.3rem;

  ${hoverable};
`;

const AddressInput = styled(Input)`
  width: 20vw;
  min-width: 150px;
`;
