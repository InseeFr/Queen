import styled from 'styled-components';

const declarationColor = '#085394';
const backgroundBodyColor = '#eeeeee';
const borderColorCheckbox = '#aaaaaa';
const backgroundColorCheckbox = '#d6d6d6';
const backgroundColorCheckboxChecked = '#9fc5f8';
const modalityLabelColor = 'black';
const modalityLabelColorChecked = '#1d63a0';
const modalityCodeBackgroundColor = 'white';
const borderInput = '1px solid #767676';
const mobileWidth = '750';

export const StyleWrapper = styled.div`
  height: 100%;

  .body-container {
    flex: 1 1 auto;
    background-color: ${backgroundBodyColor};
    display: grid;
    grid-template-columns: auto 60px;
    grid-template-rows: 100%;
  }

  * {
    font-family: Gotham SSm A, Gotham SSm B, sans-serif;
  }

  .components {
    display: grid;
    grid-template-rows: auto 60px;
  }

  .lunatic.lunatic-component {
    width: 80%;
    margin-left: 100px;
    margin-top: 3em;
    margin-right: auto;
    @media (max-width: ${mobileWidth}px) {
      margin-left: auto;
    }

    .datepicker-lunatic {
      font-size: 100%;
      margin-left: 1em;
      border-radius: 10px;
      border: ${borderInput};
      padding: 5px;
      &:focus {
        outline: none;
        box-shadow: 0 0 5px ${declarationColor};
      }
    }

    > label {
      font-weight: bold;
    }

    .declaration-lunatic {
      color: ${declarationColor};
      margin-top: 1em;
      font-weight: normal;
      font-size: 92%;
    }

    .label-top label {
      font-weight: bold;
    }
    .lunatic-dropdown-label {
      font-weight: bold;
    }
    .checkbox-boolean-modality label {
      font-weight: bold;
    }

    fieldset legend {
      font-weight: bold;
    }

    .field-container {
      margin-top: 1em;
    }
    .textarea-lunatic {
      padding: 0.5em;
      font-size: 100%;
      margin-left: 1em;
      border-radius: 10px;
      border: ${borderInput};
      width: 80%;
      height: 10em;
      &:focus {
        outline: none;
        box-shadow: 0 0 5px ${declarationColor};
      }
    }
    .input-lunatic {
      padding-right: 0.5em;
      padding-left: 0.5em;
      font-size: 100%;
      margin-left: 1em;
      border-radius: 10px;
      border: ${borderInput};
      width: 80%;
      height: 1.5em;
      &:focus {
        outline: none;
        box-shadow: 0 0 5px ${declarationColor};
      }
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
        background-color: ${backgroundColorCheckboxChecked};
        border-color: ${modalityLabelColorChecked};
      }
    }

    .code-modality {
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
        .code-modality {
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
