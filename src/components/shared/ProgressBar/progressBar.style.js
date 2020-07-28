import styled from 'styled-components';

export const StyleWrapper = styled.div`
  width: 30%;
  height: 1.5em;
  min-width: 150px;
  margin: auto;
  border: 1px solid black;
  border-radius: 5px;
  z-index: 99;

  .progress-bar {
    width: ${props => props.progress}%;
    height: 1.5em;
    text-align: center;
    background-color: #47b52c;
    border-radius: 3.8px;

    span {
      line-height: 1.5em;
      color: white;
      font-weight: bold;
    }
  }
`;
