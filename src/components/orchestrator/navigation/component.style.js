import styled from 'styled-components';

const menuWidthDesktop = 250;
const sequenceMenuWidthDesktop = 375;
const subsequenceMenuWidthDesktop = 250;

const menuWidthMobile = 250;
const sequenceMenuWidthMobile = 250;
const subsequenceMenuWidthMobile = 250;

export const StyleWrapper = styled.div`
  &.navigation {
    align-self: center;
  }

  .menu-icon {
    cursor: pointer;
    margin-top: 7px;
    position: relative;
    z-index: 35;
    background-color: transparent;
    border: none;
  }

  .menu {
    height: 100%;
    width: ${menuWidthDesktop}px;
    position: fixed;
    z-index: 30;
    top: 0;
    left: -${menuWidthDesktop}px;
    overflow-x: hidden; /* Disable horizontal scroll */
    transition: transform 250ms ease;

    background-color: white;
    border-right: 1px solid #777777;

    .version {
      background-color: whitesmoke;
      border-top: 1px solid #777777;
      position: fixed;
      width: 100%;
      left: 0;
      bottom: 0;
      text-align: center;
      padding-top: 2px;
      padding-bottom: 2px;
    }

    &.slideIn {
      transform: translateX(${menuWidthDesktop}px);
    }

    .navigation-container {
      margin-top: 80px;
      span.go-to-navigation {
        font-size: 80%;
        color: #777777;
        text-transform: uppercase;
        padding-left: 1.2em;
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
    cursor: pointer;
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
      span {
        font-weight: bold;
      }
    }
    &:hover,
    &:focus {
      font-weight: bold;
      background-color: #9fc5f8;
    }
    &:disabled {
      cursor: not-allowed;
      color: #777777;
      font-weight: normal;
      background-color: transparent;
    }
  }
  .subnav-btn span {
    float: right;
  }
  .back-subnav-btn {
    padding-left: 6px;
    span {
      padding-right: 1em;
      float: left;
    }
  }

  .sequence-navigation-container {
    width: ${sequenceMenuWidthDesktop}px;
    height: 100%;
    position: absolute;
    top: 0;
    left: -${sequenceMenuWidthDesktop}px;
    z-index: 29;
    overflow-x: hidden; /* Disable horizontal scroll */
    transition: transform 450ms ease;
    background-color: #eeeeee;
    border-right: 1px solid #777777;

    .content {
      > div {
        margin-top: 45px;
      }
    }

    .title {
      padding: 0.3em;
      padding-left: 1.2em;
      text-transform: uppercase;
      font-size: 80%;
    }

    ul {
      padding-left: 0;
    }

    &.slideIn {
      transform: translateX(${menuWidthDesktop + sequenceMenuWidthDesktop}px);
    }
  }

  .subsequence-navigation-container {
    width: ${subsequenceMenuWidthDesktop}px;
    position: absolute;
    height: 100%;
    top: 0;
    left: ${menuWidthDesktop - subsequenceMenuWidthDesktop}px;
    z-index: 28;
    overflow-x: hidden; /* Disable horizontal scroll */
    transition: transform 450ms ease;
    background-color: white;

    ul {
      padding-left: 0;
    }

    &.slideIn {
      transform: translateX(${sequenceMenuWidthDesktop + subsequenceMenuWidthDesktop}px);
    }
  }

  @media (max-width: ${menuWidthDesktop +
    sequenceMenuWidthDesktop +
    subsequenceMenuWidthDesktop}px) {
    .menu {
      width: ${menuWidthMobile}px;
      left: -${menuWidthMobile}px;
    }

    .sequence-navigation-container {
      width: ${sequenceMenuWidthMobile}px;
      left: -${sequenceMenuWidthMobile}px;
      z-index: 31;
      &.slideIn {
        transform: translateX(${sequenceMenuWidthMobile}px);
      }
      .content {
        margin-top: 70px;
      }
    }

    .subsequence-navigation-container {
      width: ${subsequenceMenuWidthMobile}px;
      left: -${subsequenceMenuWidthMobile}px;
      z-index: 32;
      &.slideIn {
        transform: translateX(${subsequenceMenuWidthMobile}px);
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
