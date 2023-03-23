import styled, {css} from 'styled-components';
import type {InputHTMLAttributes} from 'react';
import {v4 as uuid} from 'uuid';

const primary = '#11998e';
const secondary = '#38ef7d';
const white = '#fff';
const gray = '#9b9b9b';
const red = '#dc3636';

type InputProps = {errorMessage?: string} & InputHTMLAttributes<HTMLInputElement>

export function Input({name, errorMessage, className, ...inputProps}: InputProps) {
  const _name = name ?? uuid().toString();

  return (
    <Wrapper className={className}>
      <FormField error={!!errorMessage} {...inputProps} name={_name}/>
      <FormLabel htmlFor={_name}>
        {inputProps.placeholder}
      </FormLabel>
      {errorMessage &&
        <ErrorMessage>
          {errorMessage}
        </ErrorMessage>
      }
    </Wrapper>
  );
}

const Wrapper = styled.div`
  position: relative;
  padding: 15px 0 0;
`;

const _invalidCss = css`
  box-shadow: none;
  border-image: none;
  border-bottom: 2px solid ${red};
`;

const FormField = styled.input<{error: boolean}>`
  font-family: inherit;
  width: 100%;
  border: 0;
  border-bottom: 2px solid ${gray};
  outline: 0;
  color: ${white};
  padding: 7px 0;
  background: transparent;
  transition: border-color 0.2s;

  &::placeholder {
    color: transparent;
  }

  &:placeholder-shown ~ label {
    cursor: text;
    top: 20px;
  }

  &:focus {
    ~ label {
      position: absolute;
      top: 0;
      display: block;
      transition: 0.2s;
      font-size: 0.8rem;
      color: ${primary};
      font-weight: 700;
    }

    padding-bottom: 6px;
    font-weight: 700;
    border-width: 2px;
    border-image: linear-gradient(to right, ${primary}, ${secondary}) 1;
  }

  &:required, &:invalid {
    ${_invalidCss};
  }
  
  ${({error}) => error && _invalidCss};
`;

const FormLabel = styled.label`
  position: absolute;
  top: 0;
  display: block;
  transition: 0.2s;
  font-size: 1rem;
  pointer-events: none;
  color: ${gray};
`;

const ErrorMessage = styled.span`
  color: ${red};
  font-size: 0.8rem;
`;
