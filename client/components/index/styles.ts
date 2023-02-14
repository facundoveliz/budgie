import styled from 'styled-components';

export const Wrapper = styled.div`
  width: 95%;
  margin: 0 auto;
  margin-top: 24px;
`;

export const Grid1 = styled.div`
  display: flex;
  height: 430px;
  gap: 24px;
  margin: 24px 0;
`;

export const BalanceWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 30%;
  gap: 24px;
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
`;
export const Doughtnut = styled.div`
  width: 100%;
  text-align: center;
  background: ${({ theme }) => theme.backgroundSoft};
  border-radius: ${({ theme }) => theme.borders.radius};
  p {
  }
`;

export const Empty = styled.div`
  margin: 24px 0;
  height: 280px;
  background: ${({ theme }) => theme.backgroundSoft};
  border-radius: ${({ theme }) => theme.borders.radius};
  padding: ${({ theme }) => theme.paddings.dashboard};
`;
