import styled from 'styled-components';

export const Form = styled.form`
  width: 100%;
`;

type Props = {
  readonly error?: boolean;
};

export const Label = styled.label`
  padding: 8px 0;
  font-size: 17px;
`;

export const Input = styled.input<Props>`
  width: 100%;
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.foreground};
  border: 1px solid
    ${(props) =>
    props.error ? ({ theme }) => theme.error : ({ theme }) => theme.border};
  border-radius: 4px;
  outline: none;
  box-sizing: border-box;
  padding: 12px 14px;
  font-size: 16px;
`;

export const Select = styled.select<Props>`
  background: ${({ theme }) => theme.background};
  padding: 14px;
  border-radius: 4px;
  appearance: none;
  cursor: pointer;
  display: inline-block;
  border: 1px solid
    ${(props) =>
    props.error ? ({ theme }) => theme.error : ({ theme }) => theme.border};
  &:focus {
    outline: none;
  }
`;

export const Wrapper = styled.div`
  height: 100vh;
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
    color: ${({ theme }) => theme.error};
  }
`;

export const SubmitWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  /* TODO: Check if this works well in register/login forms */
  margin-top: 24px;
  p {
    margin-top: 12px;
    text-align: center;
    cursor: pointer;
  }
`;
