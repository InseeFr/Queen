import styled from 'styled-components';

const backgroundButtonColor = '#085394';

export const StyleWrapper = styled.div`
  width: auto;

  .continue-button {
    button {
      background-color: ${backgroundButtonColor};
      border: none;
      border-radius: 5px;
      color: white;
      font-weight: bold;
      padding: 0.5em 1em 0.5em 1em;

      &:hover,
      &:focus {
        border: none;
        background-color: white;
        color: ${backgroundButtonColor};
      }

      &:disabled {
        background-color: #414c5c;
        color: white;
      }
    }
  }
`;
