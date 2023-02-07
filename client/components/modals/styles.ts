import styled from 'styled-components';
import { MdClose } from 'react-icons/md';

export const Background = styled.div`
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ModalWrapper = styled.div`
  width: 30%;
  @media (max-width: 1200px) {
    width: 40%;
  }
  @media (max-width: 850px) {
    width: 60%;
  }
  @media (max-width: 600px) {
    width: 90%;
  }
  box-shadow: 0 5px 16px rgba(0, 0, 0, 0.2);
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.foreground};
  position: relative;
  z-index: 10;
  border-radius: ${({ theme }) => theme.borders.radius};
`;

export const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  align-items: center;
  width: 90%;
  color: ${({ theme }) => theme.foreground};
  p {
    margin-bottom: 1rem;
  }
`;

export const ModalButtons = styled.div`
  display: flex;
  justify-content: end;
  margin-top: 24px;
`;

export const CloseModalButton = styled(MdClose)`
  cursor: pointer;
  position: absolute;
  top: 20px;
  right: 20px;
  width: 28px;
  height: 28px;
  padding: 0;
  z-index: 10;
`;
