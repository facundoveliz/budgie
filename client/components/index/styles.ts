import styled from 'styled-components';

export const Wrapper = styled.div`
  width: 95%;
  margin: 0 auto;
  margin-top: 24px;
  @media (max-width: 830px) {
    width: 90%;
  }
`;

export const Grid1 = styled.div`
  display: flex;
  height: auto;
  gap: 24px;
  margin: 24px 0;
  @media (max-width: 900px) {
    flex-direction: column;
  }
`;

export const BalanceWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 30%;
  gap: 24px;
  @media (max-width: 900px) {
    width: 100%;
  }
`;

export const Balance = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  height: 100%;
  padding: ${({ theme }) => theme.paddings.dashboard};
  border-radius: ${({ theme }) => theme.borders.radius};
  background: ${({ theme }) => theme.backgroundSoft};
  p {
    font-weight: bold;
    font-size: 24px;
  }
  button {
    margin-top: 10px;
    &:first-of-type {
      margin-right: 10px;
    }
  }
`;

export const DoughtnutWrapper = styled.div`
  display: flex;
  gap: 24px;
  width: 100%;
  @media (max-width: 900px) {
    width: 100%;
  }
  @media (max-width: 600px) {
    flex-direction: column;
  }
`;
export const Doughtnut = styled.div`
  width: 100%;
  text-align: center;
  background: ${({ theme }) => theme.backgroundSoft};
  border-radius: ${({ theme }) => theme.borders.radius};
  padding-bottom: 24px;
`;

export const LineWrapper = styled.div`
  margin-bottom: 24px;
  height: 350px;
  h3 {
    margin-top: 0;
    text-align: center;
  }
  background: ${({ theme }) => theme.backgroundSoft};
  border-radius: ${({ theme }) => theme.borders.radius};
  padding: ${({ theme }) => theme.paddings.dashboard};
`;
