import styled from 'styled-components';

export const Form = styled.form`
  width: 100%;
`;

type InputProps = {
  readonly error?: boolean;
};

export const Input = styled.input<InputProps>`
  width: 100%;
  background: ${({ theme }) => theme.background};
  border: 1px solid
    ${(props) =>
    props.error ? ({ theme }) => theme.error : ({ theme }) => theme.border};
  border-radius: 4px;
  outline: none;
  box-sizing: border-box;
  padding: 12px 14px;
  font-size: 16px;
`;

export const Label = styled.label`
  padding: 8px 0;
  font-size: 17px;
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
  p {
    text-align: center;
    cursor: pointer;
  }
`;
