import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
// import KeyboardEventHandler from 'react-keyboard-event-handler';
import * as lunatic from '@inseefr/lunatic';
// import alphabet from 'utils/constants/alphabet';
import * as UQ from 'utils/questionnaire';
import { DIRECT_CONTINUE_COMPONENTS /* , KEYBOARD_SHORTCUT_COMPONENTS */ } from 'utils/constants';
import { sendStartedEvent, sendCompletedEvent } from 'utils/communication';
import Header from './header';
import Buttons from './buttons';
import NavBar from './rightNavbar';

const Orchestrator = ({
  surveyUnit,
  standalone,
  readonly,
  savingType,
  preferences,
  features,
  source,
  dataSU,
  filterDescription,
  save,
  close,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [started, setStarted] = useState(() => {
    if (dataSU.data.COLLECTED) {
      return Object.keys(dataSU.data.COLLECTED).length > 0;
    }
    return false;
  });

  const { questionnaire, components, handleChange, bindings } = lunatic.useLunatic(
    source,
    dataSU.data,
    {
      savingType,
      preferences,
      features,
    }
  );

  const [currentPage, setCurrentPage] = useState(1);

  const [specialQueenData, setSpecialQueenData] = useState(dataSU.specialQueenData);
  const [comment /* , setComment */] = useState(surveyUnit.comment);
  const [previousResponse, setPreviousResponse] = useState(null);

  /**
   * This function updates the values of the questionnaire responses
   * from the data entered by the user.
   * This function is disabled when app is in readonly mode.
   * @param {*} component the current component
   */
  const onChange = (component) => (updatedValue) => {
    if (!readonly) {
      if (!previousResponse) {
        setPreviousResponse(UQ.getCollectedResponse(questionnaire)(component));
      }
      handleChange(updatedValue);
    }
  };

  const filteredComponents = components.filter((c) => c.page);

  const component = filteredComponents.find(({ page }) => page === currentPage);
  const { id, componentType, sequence, subsequence, options, ...props } = component;
  console.log('current component');
  console.log(component);
  // TODO : get specialAnswer from component (specified in Pogues)
  // to wait, set to false by default
  const specialAnswer = { refusal: false, doesntKnow: false };

  const pageFilter = UQ.findPageIndex(filteredComponents)(currentPage);
  const isLastComponent = filteredComponents.length - 1 === pageFilter;
  /**
   *  This function update response values in questionnaire and specialQueenData.
   *  At the end, it calls the saving method of its parent (saving into indexdb)
   * @param {*} lastSpecialQueenData (specialQueenData update by "Refusal" and "doesn't know" buttons )
   */
  const saveQueen = useCallback(
    async (lastSpecialQueenData = specialQueenData) => {
      setSpecialQueenData(lastSpecialQueenData); // update specialQueenData according to selected buttons
      const dataToSave = UQ.getStateToSave(questionnaire)(lastSpecialQueenData);
      await save({ ...surveyUnit, data: dataToSave, comment });
    },
    [
      comment,
      component,
      save,
      surveyUnit,
      questionnaire,
      previousResponse,
      specialQueenData,
      setSpecialQueenData,
    ]
  );

  /**
   * @return boolean if user can continue to the next page.
   * TODO : manage "refusal" and "doesn't know" response
   */
  const goNextCondition = () => {
    return true;
  };

  const goPrevious = (lastSpecialQueenData = specialQueenData) => {
    setPreviousResponse(null);
    setCurrentPage(UQ.getPreviousPage(filteredComponents)(currentPage));
  };

  const goNext = useCallback(
    async (lastSpecialQueenData = specialQueenData) => {
      if (!started && !standalone) {
        const newResponse = UQ.getCollectedResponse(questionnaire)(component);
        if (Object.keys(newResponse).length > 0) {
          setStarted(true);
          await sendStartedEvent(surveyUnit.id);
        }
      }
      saveQueen(lastSpecialQueenData);
      setPreviousResponse(null);
      const nextPage = UQ.getNextPage(filteredComponents)(currentPage);
      setCurrentPage(nextPage);
    },
    [
      questionnaire,
      component,
      standalone,
      started,
      surveyUnit.id,
      filteredComponents,
      saveQueen,
      specialQueenData,
      currentPage,
    ]
  );

  const goFastForward = useCallback(
    (lastSpecialQueenData = specialQueenData) => {
      saveQueen(lastSpecialQueenData);
      setPreviousResponse(null);
      const fastForwardPage = UQ.getFastForwardPage(questionnaire)(bindings)(lastSpecialQueenData);
      setCurrentPage(fastForwardPage);
    },
    [questionnaire, bindings]
  );

  const quit = async () => {
    if (isLastComponent) {
      if (!standalone) {
        await sendCompletedEvent(surveyUnit.id);
      }
      await saveQueen();

      close();
    } else {
      await saveQueen();
      close();
    }
  };

  useEffect(() => {
    if (
      !isLastComponent &&
      previousResponse &&
      DIRECT_CONTINUE_COMPONENTS.includes(componentType)
    ) {
      goNext();
    }
  }, [questionnaire, componentType, isLastComponent, previousResponse, goNext]);

  const Component = lunatic[componentType];
  const newOptions = UQ.buildQueenOptions(componentType, options, bindings);
  // const keyToHandle = ['alphanumeric'];
  return (
    <>
      <div id="queen-body">
        <Header
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
          standalone={standalone}
          title={questionnaire.label}
          quit={quit}
          sequence={lunatic.interpret(['VTL'])(bindings)(sequence)}
          subsequence={lunatic.interpret(['VTL'])(bindings)(subsequence)}
          questionnaire={questionnaire}
          bindings={bindings}
          setPage={setCurrentPage}
        />
        <div className="body-container">
          <div className="components">
            <div
              className={`lunatic lunatic-component ${
                newOptions.length >= 8 ? 'split-fieldset' : ''
              }`}
              key={`component-${id}`}
            >
              <Component
                id={id}
                {...props}
                options={newOptions}
                handleChange={onChange(component)}
                labelPosition="TOP"
                preferences={preferences}
                features={features}
                bindings={bindings}
                filterDescription={filterDescription}
                writable
                readOnly={readonly}
                disabled={readonly}
                focused
                keyboardSelection={componentType === 'CheckboxGroup'}
              />
            </div>
          </div>
          <NavBar
            nbModules={questionnaire.components.filter((c) => c.page).length}
            page={currentPage}
          />
          <Buttons
            readonly={readonly}
            currentComponent={component}
            specialAnswer={specialAnswer}
            page={pageFilter}
            canContinue={goNextCondition()}
            specialQueenData={specialQueenData}
            isLastComponent={isLastComponent}
            pagePrevious={goPrevious}
            pageNext={goNext}
            pageFastForward={goFastForward}
            finalQuit={quit}
          />
          {/* {KEYBOARD_SHORTCUT_COMPONENTS.includes(componentType) && (
            <KeyboardEventHandler
              handleKeys={keyToHandle}
              onKeyEvent={(key, e) => {
                const responses = UQ.getResponsesNameFromComponent(component);
                const responsesCollected = UQ.getCollectedResponse(questionnaire)(component);
                const updatedValue = {};
                if (componentType === 'CheckboxOne') {
                  updatedValue[responses[0]] = key;
                  onChange(component)(updatedValue);
                } else if (componentType === 'CheckboxGroup') {
                  const index = alphabet.findIndex(l => l.toLowerCase() === key.toLowerCase());
                  updatedValue[responses[index]] = !responsesCollected[responses[index]];
                  onChange(component)(updatedValue);
                }
              }}
              handleFocusableElements
            />
          )} */}
        </div>
      </div>
    </>
  );
};

Orchestrator.propTypes = {
  surveyUnit: PropTypes.objectOf(PropTypes.any).isRequired,
  standalone: PropTypes.bool.isRequired,
  readonly: PropTypes.bool.isRequired,
  savingType: PropTypes.oneOf(['COLLECTED', 'FORCED', 'EDITED']).isRequired,
  preferences: PropTypes.arrayOf(PropTypes.string).isRequired,
  features: PropTypes.arrayOf(PropTypes.string).isRequired,
  filterDescription: PropTypes.bool.isRequired,
  source: PropTypes.objectOf(PropTypes.any).isRequired,
  dataSU: PropTypes.shape({
    data: PropTypes.objectOf(PropTypes.any).isRequired,
    specialQueenData: PropTypes.objectOf(PropTypes.any).isRequired,
  }).isRequired,
  save: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
};

export default React.memo(Orchestrator);
