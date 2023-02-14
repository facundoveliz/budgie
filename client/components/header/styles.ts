import styled from 'styled-components';
import { MdViewHeadline } from 'react-icons/md';

export const Wrapper = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  padding: 0 16px;
  height: 70px;
  background-color: ${({ theme }) => theme.backgroundSoft};
`;

export const Brand = styled.h1`
  font-size: 24px;
  @media (max-width: 560px) {
    display: none;
  }
`;

export const OptionsWrapper = styled.div`
  display: flex;
  align-items: center;
  p {
    margin-right: 20px;
    cursor: pointer;
  }
  @media (max-width: 560px) {
    display: none;
  }
`;

export const Hamburguer = styled(MdViewHeadline)`
  display: none;
  @media (max-width: 560px) {
    display: flex;
    cursor: pointer;
    height: 32px;
    width: 32px;
  }
`;

export const Menu = styled.div<{
  open: boolean;
}>`
  display: ${({ open }) => (open ? 'flex' : 'none')};
  flex-direction: column;
  transition: background 0.2s ease-in, color 0.2s ease-in;
  align-items: center;
  background-color: ${({ theme }) => theme.backgroundSoft};
  position: fixed;
  padding-top: 50px;
  top: 50px;
  right: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
`;

export const MenuItem = styled.div`
  padding-bottom: 70px;
  cursor: pointer;
`;
