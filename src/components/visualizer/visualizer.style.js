import styled from 'styled-components';

export const StyleWrapper = styled.div`
  height: 100vh;
  background-color: rgba(255, 255, 255, 0.8);

  .content {
    position: fixed;
    top: 10%;
    left: 0;
    margin: auto;
    width: 100%;
    height: 100%;
    text-align: center;
  }

  form {
    margin-top: 4em;
  }

  #label-input-questionnaire {
    margin-right: 1em;
  }

  .input-questionnaire {
    padding-right: 0.5em;
    padding-left: 0.5em;
    font-size: 100%;
    border-radius: 10px;
    border: 1px solid #767676;
    width: 55%;
    min-width: 200px;
    height: 1.5em;
    &:focus {
      outline: none;
      box-shadow: 0 0 5px #085394;
    }
  }

  .button-questionnaire {
    margin: auto;
    width: auto;
    display: block;
    margin-top: 1em;
    background-color: #085394;
    border: none;
    border-radius: 5px;
    color: white;
    font-weight: bold;
    padding: 0.5em 1em 0.5em 1em;

    &:hover,
    &:focus {
      border: none;
      background-color: white;
      color: #085394;
    }

    &:disabled {
      background-color: #414c5c;
      color: white;
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
