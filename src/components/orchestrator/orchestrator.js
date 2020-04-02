import React, { useState } from 'react';
import PropTypes from 'prop-types';
import * as lunatic from '@inseefr/lunatic';
import alphabet from 'utils/constants/alphabet';
import * as CST from 'utils/constants';
import * as UQ from 'utils/questionnaire';
import Header from './header';
import Buttons from './buttons';
import NavBar from './rightNavbar';

const Orchestrator = ({
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

  const removeResponseToQueenData = responseName => {
    const newQueenData = { ...queenData };
    CST.QUEEN_DATA_KEYS.map(key => {
      newQueenData[key] = newQueenData[key].filter(name => name !== responseName);
      return null;
    });
    setQueenData(newQueenData);
    return newQueenData;
  };

  const addResponseToQueenData = responseName => dataType => {
    const newQueenData = { ...queenData };
    if (!newQueenData[dataType].includes(responseName)) {
      newQueenData[dataType] = [...newQueenData[dataType], responseName];
      setQueenData(newQueenData);
    }
    return newQueenData;
  };

  const onChange = updatedValue => {
    if (!readonly) {
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

  const updateQueenData = () => {
    let newQueenData = { ...queenData };
    const responsesName = UQ.getResponsesNameFromComponent(component);
    responsesName.map(responseName => {
      const collectedResponse = UQ.getCollectedResponse(component);
      if (Object.keys(collectedResponse).length === 0) {
        newQueenData = addResponseToQueenData(responseName)(CST.IGNORED_KEY);
      } else {
        newQueenData = removeResponseToQueenData(responseName);
      }
      return null;
    });
    return newQueenData;
  };

  const saveQueen = () => {
    const lastQueenData = updateQueenData();
    const dataToSave = UQ.getStateToSave(questionnaire)(lastQueenData);
    save(dataToSave);
  };

  const goPrevious = () => {
    setCurrentPage(UQ.getPreviousPage(filteredComponents)(currentPage));
  };

  const goNext = () => {
    saveQueen();
    const nextPage = UQ.getNextPage(filteredComponents)(currentPage);
    setViewedPages([...viewedPages, nextPage]);
    setCurrentPage(nextPage);
  };

  const goFastForward = () => {
    saveQueen();
    const fastForwardPage = UQ.getFastForwardPage(filteredComponents)(queenData);
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
                handleChange={onChange}
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
