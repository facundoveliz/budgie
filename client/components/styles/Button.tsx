import styled from 'styled-components';

// TODO: disable button when is making/getting something
type ButtonProps = {
  readonly secondary?: boolean;
};

export const Button = styled.button<ButtonProps>`
  background: ${(props) =>
    props.secondary
      ? ({ theme }) => theme.secondary
      : ({ theme }) => theme.primary};
  color: ${({ theme }) => theme.background};
  padding: 0 20px;
  height: 40px;
  border: none;
  cursor: pointer;
  border-radius: 4px;
    rgba(0, 0, 0, 0.3) 0px 18px 36px -18px inset;
  font-size: 16px;
  &:active {
    color: none;
  }
`;
