import styled from 'styled-components';

const menuWidth = 250;
const sequenceMenuWidth = 250;
const subsequenceMenuWidth = 250;

export const StyleWrapper = styled.div`
  &.navigation {
    align-self: center;
  }

  .menu-icon {
    margin-top: 7px;
    position: relative;
    z-index: 35;
    background-color: transparent;
    border: none;
  }

  .menu {
    height: 100%;
    width: ${menuWidth}px;
    position: fixed;
    z-index: 30;
    top: 0;
    left: -${menuWidth}px;
    overflow-x: hidden; /* Disable horizontal scroll */
    transition: transform 250ms ease;

    background-color: white;
    border-right: 1px solid #a3a3a3;

    .version {
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

    &.slideIn {
      transform: translateX(${menuWidth}px);
    }

    .navigation-container {
      margin-top: 80px;
      span {
        padding-left: 0.5em;
      }
    }
    ul {
      padding-left: 0;
    }
    li {
      display: block;
    }
  }

  .back-subnav-btn,
  .subnav-btn {
    width: 100%;
    border: none;
    background-color: transparent;
    color: #085394;
    padding-left: 1.2em;
    padding-top: 0.5em;
    padding-bottom: 0.5em;
    outline: thin;
    text-align: left;
    &.selected {
      background-color: #9fc5f8;
    }
    &:hover,
    &:focus {
      font-weight: bold;
      background-color: #9fc5f8;
    }
    &:disabled {
      color: #928b94;
      font-weight: normal;
      background-color: transparent;
    }
  }
  .subnav-btn {
    span {
      float: right;
      font-weight: bold;
    }
  }
  .back-subnav-btn {
    padding-left: 6px;
    span {
      padding-right: 1em;
      float: left;
      font-weight: bold;
    }
  }

  .sequence-navigation-container {
    width: ${sequenceMenuWidth}px;
    height: 100%;
    position: absolute;
    top: 0;
    left: -${sequenceMenuWidth}px;
    z-index: 29;
    overflow-x: hidden; /* Disable horizontal scroll */
    transition: transform 450ms ease;
    background-color: #eeeeee;
    border-right: 1px solid #a3a3a3;

    h3 {
      padding: 0.3em;
      font-variant-caps: all-small-caps;
      text-align: center;
    }

    ul {
      padding-left: 0;
    }

    &.slideIn {
      transform: translateX(${menuWidth + sequenceMenuWidth}px);
    }
  }

  .subsequence-navigation-container {
    width: ${subsequenceMenuWidth}px;
    position: absolute;
    height: 100%;
    top: 0;
    left: ${menuWidth - subsequenceMenuWidth}px;
    z-index: 28;
    overflow-x: hidden; /* Disable horizontal scroll */
    transition: transform 450ms ease;
    background-color: white;

    ul {
      padding-left: 0;
    }

    &.slideIn {
      transform: translateX(${sequenceMenuWidth + subsequenceMenuWidth}px);
    }
  }

  @media (max-width: ${menuWidth + sequenceMenuWidth + subsequenceMenuWidth}px) {
    .sequence-navigation-container {
      left: -${sequenceMenuWidth}px;
      z-index: 31;
      &.slideIn {
        transform: translateX(${sequenceMenuWidth}px);
      }
      .content {
        margin-top: 70px;
      }
    }

    .subsequence-navigation-container {
      left: -${subsequenceMenuWidth}px;
      z-index: 32;
      &.slideIn {
        transform: translateX(${subsequenceMenuWidth}px);
      }
      .content {
        margin-top: 70px;
      }
    }
  }

  .background-menu {
    outline: none;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 20;
    width: 100%;
    height: 100%;
    background-color: grey;
    opacity: 0.5;
  }

  .subnav-content {
    background-color: whitesmoke;
    position: relative;
  }

  a {
    color: black;
    cursor: default;
  }
  a.active {
    color: green;
    cursor: pointer;
  }
`;
