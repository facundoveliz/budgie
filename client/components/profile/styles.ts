import styled from 'styled-components';

export const Wrapper = styled.div`
  height: 80vh;
  width: 30%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  @media (max-width: 1150px) {
    width: 50%;
  }
  @media (max-width: 768px) {
    width: 75%;
  }
  @media (max-width: 400px) {
    width: 85%;
  }
`;
