import { MdClose } from 'react-icons/md';
import styled from 'styled-components';

// index
export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  h1 {
    font-size: 24px;
    letter-spacing: 2px;
    width: 240px;
    text-align: center;
  }
  button {
    margin: 0 10px 30px;
  }
`;

export const Balance = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 32px 0;
  font-size: 18px;
  p {
    font-weight: bold;
    font-size: 24px;
  }
`;

type EntryStyleProps = {
  readonly income?: boolean;
};

// entry
export const EntryWrapper = styled.div<EntryStyleProps>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;
  width: 40vw;
  @media (max-width: 1200px) {
    width: 80vw;
  }
  border-bottom: 1px solid ${({ theme }) => theme.border};
  &:last-of-type {
    border: 0;
  }
`;

export const Paragraph = styled.p<EntryStyleProps>`
  color: ${(props) =>
    props.income
      ? ({ theme }) => theme.primary
      : ({ theme }) => theme.secondary};
  &:last-of-type {
    font-size: 14px;
    color: ${({ theme }) => theme.foregroundSoft};
  }
`;

// modal
export const Background = styled.div`
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
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
  height: auto;
  box-shadow: 0 5px 16px rgba(0, 0, 0, 0.2);
  background: ${({ theme }) => theme.background};
  color: #000;
  position: relative;
  z-index: 10;
  border-radius: 10px;
`;

export const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  align-items: center;
  width: 90%;
  line-height: 1.8;
  color: #141414;
  p {
    margin-bottom: 1rem;
  }
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
