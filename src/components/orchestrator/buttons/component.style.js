import styled from 'styled-components';

const backgroundButtonColor = '#085394';

export const StyleWrapper = styled.div`
  position: absolute;
  padding-right: 15%;
  bottom: 0;
  right: 0;
  display: grid;
  margin: auto;
  white-space: nowrap;

  grid-template-rows: 60px 60px 60px;

  .navigation {
    text-align: right;
  }

  .short-button {
    button {
      background-color: #9fc5f8;
      color: black;
      border-radius: 50%;
      padding: 0;

      svg {
        vertical-align: middle;
      }
    }

    &.next {
      grid-row-start: 2;
      grid-row-end: 2;
    }
    span {
      color: #777777;
      font-size: 13px;
      display: block;
      width: min-content;
      margin-left: auto;
    }
  }

  .fast-button {
    grid-row-start: 3;
    grid-row-end: 3;
    button {
      padding: 0.1em 0.5em 0.1em 0.5em;
      border-radius: 15px;
      text-transform: uppercase;
      font-size: 95%;

      &:hover,
      &:focus {
        svg.fast-icon {
          fill: ${backgroundButtonColor};
        }
      }
    }
    span {
      display: block;
      font-size: 68%;
    }
    .fast-icon {
      vertical-align: middle;
    }
  }
  .navigation-button {
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
