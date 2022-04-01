import styled from 'styled-components';

export const Wrapper = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  padding: 4px 16px;
`;

export const OptionsWrapper = styled.div`
  display: flex;
  align-items: center;
  p {
    margin-right: 20px;
    cursor: pointer;
  }
`;

export const Brand = styled.h1`
  font-size: 24px;
`;
