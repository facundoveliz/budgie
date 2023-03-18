import styled from 'styled-components';

export const Form = styled.form`
  width: 100%;
`;

export const Label = styled.label`
  padding: 12px 0;
  font-size: 17px;
`;

export const Input = styled.input<{
  readonly error?: boolean;
}>`
  width: 100%;
  background: ${({ theme }) => theme.backgroundSoft};
  color: ${({ theme }) => theme.foreground};
  border: 1px solid
    ${(props) =>
    props.error ? ({ theme }) => theme.danger : ({ theme }) => theme.border};
  border-radius: 8px;
  outline: none;
  box-sizing: border-box;
  padding: 12px 14px;
  font-size: 16px;
  transition: background 0.2s ease-in, color 0.2s ease-in;
`;

export const Select = styled.select<{
  readonly error?: boolean;
}>`
  background: ${({ theme }) => theme.backgroundSoft};
  color: ${({ theme }) => theme.foreground};
  padding: 14px;
  border-radius: 8px;
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

export const SubmitWrapper = styled.div<{
  readonly direction: 'row' | 'column';
}>`
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  margin-top: 24px;
  p {
    margin-top: 12px;
    text-align: center;
    cursor: pointer;
  }
`;
