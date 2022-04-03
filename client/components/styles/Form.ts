import styled from 'styled-components';

export const Form = styled.form`
  width: 100%;
`;

// TODO: better props management (put it inside components, google it)
type InputProps = {
  readonly error?: boolean;
};

type SelectProps = {
  readonly error?: boolean;
};

type SubmitProps = {
  readonly direction: 'row' | 'column';
};

export const Label = styled.label`
  padding: 12px 0;
  font-size: 17px;
`;

export const Input = styled.input<InputProps>`
  width: 100%;
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.foreground};
  border: 1px solid
    ${(props) =>
    props.error ? ({ theme }) => theme.danger : ({ theme }) => theme.border};
  border-radius: 4px;
  outline: none;
  box-sizing: border-box;
  padding: 12px 14px;
  font-size: 16px;
`;

export const Select = styled.select<SelectProps>`
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.foreground};
  padding: 14px;
  border-radius: 4px;
  appearance: none;
  cursor: pointer;
  display: inline-block;
  border: 1px solid
    ${(props) =>
    props.error ? ({ theme }) => theme.danger : ({ theme }) => theme.border};
  &:focus {
    outline: none;
  }
`;

export const Wrapper = styled.div`
  width: 30%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  @media (max-width: 1150px) {
    width: 50%;
  }
  @media (max-width: 768px) {
    width: 75%;
  }
  @media (max-width: 400px) {
    width: 85%;
  }
`;

export const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  p {
    color: ${({ theme }) => theme.danger};
    margin-top: 10px;
    font-size: 14px;
  }
`;

export const SubmitWrapper = styled.div<SubmitProps>`
  display: flex;
  flex-direction: ${(props) => props.direction};
  justify-content: space-between;
  margin-top: 24px;
  p {
    margin-top: 12px;
    text-align: center;
    cursor: pointer;
  }
`;
