import styled from 'styled-components';

export const Button = styled.button`
  padding: 0 20px;
  height: 40px;
  border: none;
  cursor: pointer;
  background-color: ${({ theme }) => theme.primary};
  border-radius: 6px;
    rgba(0, 0, 0, 0.3) 0px 18px 36px -18px inset;
  font-size: 16px;
  &:active {
    color: none;
  }
`;

export const SecondaryButton = styled(Button)`
  background-color: ${({ theme }) => theme.secondary};
`;

export const DangerButton = styled(Button)`
  background-color: ${({ theme }) => theme.danger};
`;
