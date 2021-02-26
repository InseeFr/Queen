import styled from 'styled-components';

const backgroundHeaderColor = 'white';
const borderStyleHeader = '1px solid #777777';
const widthBorder = '59px'; // 60(width grid template) - 1(border-width)

export const StyleWrapper = styled.div`
  width: 100%;
  flex: 0 1 65px;
  display: grid;
  grid-template-columns: 60px 60px auto 60px;
  background-color: white;
  border-right: 0;
  border-left: 0;
  border-bottom: ${borderStyleHeader};

  &.standalone {
    grid-template-columns: 60px 60px auto;
  }

  .header-item {
    &.navigation {
      height: 100%;
      width: ${widthBorder};
      border-right: ${borderStyleHeader};
    }
    &.header-close {
      width: ${widthBorder};
      border-left: ${borderStyleHeader};
    }
    .header-logo {
      padding: 6px;
      margin-left: 2px;
    }
    .insee-icon {
      padding: 0;
      border: none;
      cursor: pointer;
      background-color: transparent;
    }
    .close-icon {
      margin-top: 11px;
      margin-left: 3px;
      background-color: transparent;
      border: none;
    }
  }

  .header-title {
    padding: 0.4em;
    padding-left: 1em;

    .questionnaire-title {
      text-transform: uppercase;
      font-size: 80%;
    }
  }

  .header-logo {
    // horizontal align
    justify-self: center;
    // vertical align
    align-self: center;
    height: 50px;
    width: auto;

    background-color: ${backgroundHeaderColor};
  }
`;
