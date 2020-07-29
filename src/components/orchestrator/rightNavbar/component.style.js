import styled from 'styled-components';

export const StyleWrapper = styled.div`
  grid-column-start: 2;
  grid-column-end: 2;
  grid-row-start: 1;
  grid-row-end: 3;

  position: relative;
  border-left: 1px solid #a3a3a3;

  div.page {
    font-size: 80%;
    text-align: center;
    border-radius: 10px;
    width: 90%;
    margin: auto;
    margin-top: 1em;
    background-color: white;
  }
`;
