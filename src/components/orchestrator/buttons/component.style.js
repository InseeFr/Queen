import styled from 'styled-components';
const backgroundButtonColor = '#085394';

export const StyleWrapper = styled.div`
  text-align: right;

  .navigation-button {
    background-color: ${backgroundButtonColor};
    border: none;
    border-radius: 5px;
    color: white;
    font-weight: bold;
    padding: 0.5em 1em 0.5em 1em;
    margin-left: 2em;

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
  .specific-modality {
    display: inline-block;
    border-radius: 5px;
    border: none;
    color: white;
    vertical-align: middle;
    background-color: #666666;
    padding: 0.7em;
    margin-left: 2em;

    .shortcut {
      padding: 0.3em 0.5em 0.3em 0.5em;
      margin-right: 0.5em;
      color: #666666;
      font-weight: bold;
      border: 1px solid transparent;
      background-color: white;
      border-radius: 5px;
    }
    .checked {
      display: inline-block;
      width: 1em;
      margin-left: 1em;
      font-size: 85%;
      font-weight: bold;
    }

    &.doesntknow.content-checked,
    &.doesntknow:hover,
    &.doesntknow:focus {
      background-color: #f9cb9c;
      color: #b45f06;
      .shortcut {
        color: white;
        background-color: #b45f06;
      }
      .checked {
        color: #b45f06;
      }
    }

    &.refusal.content-checked,
    &.refusal:hover,
    &.refusal:focus {
      background-color: #ea9999;
      color: #990000;
      .shortcut {
        color: white;
        background-color: #990000;
      }
      .checked {
        color: #990000;
      }
    }
  }
`;
