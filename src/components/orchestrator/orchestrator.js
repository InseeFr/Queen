import React, { useState } from 'react';
import PropTypes from 'prop-types';
import * as lunatic from '@inseefr/lunatic';
import alphabet from 'utils/constants/alphabet';
import * as UQ from 'utils/questionnaire';
import Header from './header';
import Buttons from './buttons';
import NavBar from './rightNavbar';

const Orchestrator = ({
  surveyUnit,
  readonly,
  savingType,
  preferences,
  source,
  dataSU,
  filterDescription,
  save,
  close,
}) => {
  const [navOpen, setNavOpen] = useState(false);

  const [questionnaire, setQuestionnaire] = useState(
    lunatic.mergeQuestionnaireAndData(source)(dataSU.data)
  );
  const [currentPage, setCurrentPage] = useState(1);
  /**
   * viewedPages : list of page viewed by user
   */
  const [viewedPages, setViewedPages] = useState([1]);

  const [queenData, setQueenData] = useState(dataSU.queenData);
  const [comment, setComment] = useState(surveyUnit.comment);
  const [previousResponse, setPreviousResponse] = useState(null);

  const onChange = component => updatedValue => {
    if (!readonly) {
      if (!previousResponse) {
        setPreviousResponse(UQ.getCollectedResponse(component));
      }
      setQuestionnaire(
        lunatic.updateQuestionnaire(savingType)(questionnaire)(preferences)(updatedValue)
      );
    }
  };

  const bindings = lunatic.getBindings(questionnaire);

  const queenComponents = UQ.buildQueenQuestionnaire(questionnaire.components);
  const filteredComponents = queenComponents.filter(
    ({ conditionFilter }) => lunatic.interpret(['VTL'])(bindings)(conditionFilter) === 'normal'
  );

  const component = filteredComponents.find(({ page }) => page === currentPage);
  const { id, componentType, sequence, subsequence, options, ...props } = component;

  const saveQueen = () => {
    let newQuestionnaire = questionnaire;
    if (previousResponse) {
      const newResponse = UQ.getCollectedResponse(component);
      if (JSON.stringify(newResponse) !== JSON.stringify(previousResponse)) {
        newQuestionnaire = UQ.updateResponseFiltered(newQuestionnaire)(component);
      }
      setQuestionnaire(newQuestionnaire);
    }
    const lastQueenData = UQ.updateQueenData(queenData)(component);
    setQueenData(lastQueenData);
    const dataToSave = UQ.getStateToSave(newQuestionnaire)(lastQueenData);
    save({ ...surveyUnit, data: dataToSave, comment });
  };

  const goPrevious = () => {
    setPreviousResponse(null);
    setCurrentPage(UQ.getPreviousPage(filteredComponents)(currentPage));
  };

  const goNext = () => {
    saveQueen();
    setPreviousResponse(null);
    const nextPage = UQ.getNextPage(filteredComponents)(currentPage);
    setViewedPages([...viewedPages, nextPage]);
    setCurrentPage(nextPage);
  };

  const goFastForward = () => {
    saveQueen();
    setPreviousResponse(null);
    const fastForwardPage = UQ.getFastForwardPage(filteredComponents)(
      UQ.updateQueenData(queenData)(component)
    );
    setCurrentPage(fastForwardPage);
  };

  const quit = () => {
    saveQueen();
    close();
  };

  const Component = lunatic[componentType];
  let myOptions = [];
  if (componentType === 'CheckboxOne') {
    myOptions = options.map((option, index) => {
      const myLabel = (
        <span>
          <span className="code">{options.length > 10 ? alphabet[index] : index}</span>
          {lunatic.interpret(['VTL'])(bindings)(option.label)}
        </span>
      );
      return {
        value: option.value,
        label: myLabel,
      };
    });
  } else {
    myOptions = options || [];
  }
  return (
    <>
      <div id="queen-body" className={navOpen ? 'back' : ''}>
        <Header
          title={questionnaire.label}
          sequence={lunatic.interpret(['VTL'])(bindings)(sequence)}
          components={filteredComponents}
          bindings={bindings}
          subsequence={lunatic.interpret(['VTL'])(bindings)(subsequence)}
          setPage={setCurrentPage}
          viewedPages={viewedPages}
          setNavOpen={setNavOpen}
        />
        <div className="body-container">
          <div className="components">
            <div
              className={`lunatic lunatic-component ${
                myOptions.length >= 8 ? 'split-fieldset' : ''
              }`}
              key={`component-${id}`}
            >
              <Component
                id={id}
                {...props}
                options={myOptions}
                handleChange={onChange(component)}
                labelPosition="TOP"
                preferences={preferences}
                features={['VTL']}
                bindings={bindings}
                filterDescription={filterDescription}
                readOnly={readonly}
                disabled={readonly}
                focused
              />
            </div>
          </div>
          <NavBar nbModules={queenComponents.length} page={currentPage} />
          <Buttons
            nbModules={filteredComponents.length}
            page={UQ.findPageIndex(filteredComponents)(currentPage)}
            pagePrevious={goPrevious}
            pageNext={goNext}
            pageFastForward={goFastForward}
            quit={quit}
          />
        </div>
      </div>
    </>
  );
};

Orchestrator.propTypes = {
  surveyUnit: PropTypes.objectOf(PropTypes.any).isRequired,
  readonly: PropTypes.bool.isRequired,
  savingType: PropTypes.oneOf(['COLLECTED', 'FORCED', 'EDITED']).isRequired,
  preferences: PropTypes.arrayOf(PropTypes.string).isRequired,
  filterDescription: PropTypes.bool.isRequired,
  source: PropTypes.objectOf(PropTypes.any).isRequired,
  dataSU: PropTypes.shape({
    data: PropTypes.objectOf(PropTypes.any).isRequired,
    queenData: PropTypes.objectOf(PropTypes.any).isRequired,
  }).isRequired,
  save: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
};

export default Orchestrator;
