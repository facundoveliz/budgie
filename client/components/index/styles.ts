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
    margin-bottom: 30px;
    &:first-of-type {
      margin-right: 10px;
    }
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
// TODO: highlight background on hover
export const EntryWrapper = styled.div<EntryStyleProps>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  padding: 16px 0;
  width: 40vw;
  border-bottom: 1px solid ${({ theme }) => theme.border} !important;
  @media (max-width: 1200px) {
    width: 80vw;
  }
  &:last-of-type {
    border: 0;
  }
`;

export const ParagraphWrapper = styled.div`
  display: flex;
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
  color: #141414;
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
