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
  padding: 12px 20px;
  border: none;
  border-radius: 4px;
    rgba(0, 0, 0, 0.3) 0px 18px 36px -18px inset;
  font-size: 16px;
`;