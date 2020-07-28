import styled from 'styled-components';

export const StyleWrapper = styled.div`
  height: 100vh;

  .preloader {
    background-color: rgba(255, 255, 255, 0.8);
    margin: auto;
    width: 100%;
    height: 100%;
    text-align: center;
    img {
      margin-top: 10%;
    }
    h2 {
      color: #292664;
    }
  }

  .version {
    z-index: 2;
    background-color: whitesmoke;
    border-top: 1px solid black;
    position: fixed;
    width: 100%;
    left: 0;
    bottom: 0;
    text-align: center;
    padding-top: 2px;
    padding-bottom: 2px;
  }
`;
