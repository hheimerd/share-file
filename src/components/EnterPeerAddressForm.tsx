import styled from 'styled-components';
import {Input} from '@/components/Input';
import {useLocalStorage} from 'usehooks-ts';
import {hoverable} from '@/styles/mixins';

type EnterIpForm = {
  className?: string,
  onSubmit: (address: string) => void,
  error?: string
}

export const EnterPeerAddressForm = ({className, onSubmit, error}: EnterIpForm) => {
  const [ip, setIp] = useLocalStorage('download-ip', '');

  return (
    <Wrapper className={className} onSubmit={(e) => {
      e.preventDefault();
      onSubmit(ip);
    }}>
      <AddressInput
        placeholder="Enter peer IP"
        value={ip}
        onChange={(e) => setIp(e.currentTarget.value)}
        errorMessage={error}
      />
      <SubmitButton type="submit">⇥</SubmitButton>
    </Wrapper>
  );
};

const Wrapper = styled.form`
  display: flex;
  flex-direction: row;
  width: fit-content;
  position: relative;
  min-height: 72px;
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
