import styled from 'styled-components';

const declarationColor = '#085394';
const backgroundBodyColor = '#eeeeee';
const borderColorCheckbox = '#aaaaaa';
const backgroundColorCheckbox = '#d6d6d6';
const modalityLabelColor = 'black';
const modalityLabelColorChecked = '#1d63a0';
const modalityCodeBackgroundColor = 'white';

export const StyleWrapper = styled.div`
  .components .declaration-lunatic {
    color: ${declarationColor};
  }

  .body-container {
    background-color: ${backgroundBodyColor};
    display: grid;
    grid-template-columns: auto 60px;
    grid-template-rows: auto;
    min-height: 75%;
  }

  .components {
    padding-top: 2em;
    .lunatic-component {
      min-height: 80vh;
      width: 80%;
      margin-left: auto;
      margin-right: auto;
    }
  }

  .split-fieldset fieldset.checkbox-group {
    .checkbox-modality {
      display: inline-block;
      width: 40%;
      margin: 4px;
    }
  }

  fieldset.checkbox-group {
    padding: 0;
    margin: 0;
    border: none;

    .checkbox-modality {
      white-space: nowrap;
      display: block;
      border-radius: 5px;
      border: 1px solid ${borderColorCheckbox};
      background-color: ${backgroundColorCheckbox};
      padding: 0.8em;
      margin: 8px;
      width: 60%;

      &.content-checked {
        background-color: ${backgroundColorCheckbox}-checked;
      }
    }

    .code {
      position: relative;
      left: -1em;
      padding: 0.3em 0.5em 0.3em 0.5em;
      color: ${modalityLabelColor};
      font-weight: bold;
      border: 1px solid ${borderColorCheckbox};
      background-color: ${modalityCodeBackgroundColor};
      border-radius: 5px;
    }

    .checkbox-lunatic {
      opacity: 0;

      &:checked + label::after {
        float: right;
        content: '✓';
      }
      &:focus + label,
      &:hover + label,
      &:checked + label {
        color: ${modalityLabelColorChecked};
        font-weight: bold;
        .code {
          color: ${modalityCodeBackgroundColor};
          background-color: ${declarationColor};
          border-color: ${declarationColor};
        }
      }
    }
  }
  @media (max-width: 460px) {
    .split-fieldset fieldset.checkbox-group,
    fieldset.checkbox-group {
      .checkbox-modality {
        display: block;
        width: 70%;
        margin: 8px;
      }
    }
  }
`;
