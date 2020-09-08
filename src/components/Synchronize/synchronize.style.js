import styled from 'styled-components';

export const StyleWrapper = styled.div`
  height: 100vh;
  background-color: rgba(255, 255, 255, 0.8);

  .content {
    position: fixed;
    top: 0;
    left: 0;
    margin: auto;
    width: 100%;
    height: 100%;
    text-align: center;
  }

  .sync-detail {
    text-align: center;
    .progress {
      display: inline-block;
    }
    .current {
      font-weight: bold;
    }
  }

  .preloader-container {
    height: min-content;
    .preloader {
      background-color: rgba(255, 255, 255, 0);
    }
  }

  .preloader-container .preloader img {
    margin-top: 5%;
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
