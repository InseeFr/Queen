import styled from 'styled-components';

export const StyleWrapper = styled.div`
  grid-column-start: 2;
  grid-column-end: 2;
  grid-row-start: 1;
  grid-row-end: 3;

  position: relative;
  border-left: 1px solid #777777;

  div.page {
    position: absolute;
    bottom: 200px;
    right: 3px;
    padding-top: 0.3em;
    padding-bottom: 0.3em;
    font-size: 80%;
    text-align: center;
    border-radius: 5px;
    width: 90%;
    margin: auto;
    background-color: white;

    .label-page {
      font-size: 90%;
      margin-bottom: 4px;
    }
  }
`;
