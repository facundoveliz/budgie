import styled from 'styled-components';

export const Button = styled.button`
  padding: 0 20px;
  height: 40px;
  border: none;
  cursor: pointer;
  background-color: ${({ theme }) => theme.primary};
  border-radius: 6px;
  font-size: 16px;
  &:active {
    color: none;
  }
  &:disabled {
    background-color: ${({ theme }) => theme.foregroundSofter};
    color: ${({ theme }) => theme.foreground};
  }
`;

export const SecondaryButton = styled(Button)`
  background-color: ${({ theme }) => theme.secondary};
`;

export const DangerButton = styled(Button)`
  background-color: ${({ theme }) => theme.danger};
`;
