import styled from 'styled-components';

const notificationUpdateHeight = '90px';
const notificationHeight = '65px';
const notificationHeightMobile = '185px';
const mobileWidth = '550px';
export const StyleWrapper = styled.div`
  position: fixed;
  top: -${notificationHeight};
  z-index: 1500;
  background-color: rgba(46, 139, 166, 0.9);
  left: 0%;
  width: 100%;
  margin: auto;
  height: ${notificationHeight};
  text-align: center;
  transition: transform 350ms ease;

  &.update {
    top: -${notificationUpdateHeight};
    height: ${notificationUpdateHeight};
  }

  &.visible {
    display: block;
    transform: translateY(${notificationHeight});
  }

  &.update.visible {
    transform: translateY(${notificationUpdateHeight});
  }

  @media (max-width: ${mobileWidth}) {
    top: -${notificationHeightMobile};
    height: ${notificationHeightMobile};
    &.update {
      top: -${notificationHeightMobile};
      height: ${notificationHeightMobile};
    }

    &.visible,
    &.update.visible {
      transform: translateY(${notificationHeightMobile});
    }
  }

  .close-button {
    position: absolute;
    right: 0;
    color: white;
    background-color: transparent;
    border: none;

    &:hover,
    &:focus {
      font-weight: bold;
    }
  }

  div.title {
    padding: 1em;
    padding-top: 1.3em;
    padding-bottom: 0.2em;
    font-weight: bold;
    color: white;

    @media (max-width: ${mobileWidth}) {
      padding: 3em;
      padding-bottom: 2em;
    }

    @media (max-width: 370px) {
      padding-bottom: 1em;
    }
  }
  .update-button {
    border: 1px solid black;
    border-radius: 4px;
    padding: 0.3em;
    background-color: white;

    &:hover,
    &:focus {
      background-color: #eeeded;
    }
  }
`;
