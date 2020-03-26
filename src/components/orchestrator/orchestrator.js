import React, { useState } from 'react';
import PropTypes from 'prop-types';
import * as lunatic from '@inseefr/lunatic';
import alphabet from 'utils/alphabet';
import * as UQ from 'utils/questionnaire';
import Header from './header';
import Buttons from './buttons';
import NavBar from './rightNavbar';

const Orchestrator = ({ savingType, preferences, source, data, filterDescription }) => {
  const [navOpen, setNavOpen] = useState(false);

  const [questionnaire, setQuestionnaire] = useState(
    lunatic.mergeQuestionnaireAndData(source)(data)
  );
  const [currentPage, setCurrentPage] = useState(1);
  /**
   * viewedPages : list of page viewed by user
   */
  const [viewedPages, setViewedPages] = useState([1]);

  const onChange = updatedValue => {
    setQuestionnaire(
      lunatic.updateQuestionnaire(savingType)(questionnaire)(preferences)(updatedValue)
    );
  };

  const bindings = lunatic.getBindings(questionnaire);

  const queenComponents = UQ.buildQueenQuestionnaire(questionnaire.components);
  const filteredComponents = queenComponents.filter(
    ({ conditionFilter }) => lunatic.interpret(['VTL'])(bindings)(conditionFilter) === 'normal'
  );

  const goPrevious = () => {
    setCurrentPage(UQ.getPreviousPage(filteredComponents)(currentPage));
  };
  const goNext = () => {
    const nextPage = UQ.getNextPage(filteredComponents)(currentPage);
    setViewedPages([...viewedPages, nextPage]);
    setCurrentPage(nextPage);
  };

  const component = filteredComponents.find(({ page }) => page === currentPage);
  const { id, componentType, sequence, subsequence, options, ...props } = component;
  const Component = lunatic[componentType];
  let myOptions = [];
  if (componentType === 'CheckboxOne') {
    myOptions = options.map((option, index) => {
      const myLabel = (
        <span>
          <span className="code">{myOptions.length > 10 ? alphabet[index] : index}</span>
          {lunatic.interpret(['VTL'])(bindings)(option.label)}
        </span>
      );
      return {
        value: option.value,
        label: myLabel,
      };
    });
  } else {
    myOptions = options;
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
            <div className="lunatic lunatic-component" key={`component-${id}`}>
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
                focused
              />
            </div>
          </div>
          <NavBar nbModules={queenComponents.length} page={currentPage} />
          <Buttons
            nbModules={filteredComponents.length}
            save={() => {
              console.log(lunatic.getCollectedStateByValueType(questionnaire)(savingType));
            }}
            page={UQ.findPageIndex(filteredComponents)(currentPage)}
            pageDown={() => goPrevious()}
            pageUp={() => {
              goNext();
            }}
          />
        </div>
      </div>
    </>
  );
};

Orchestrator.propTypes = {
  savingType: PropTypes.oneOf(['COLLECTED', 'FORCED', 'EDITED']).isRequired,
  preferences: PropTypes.arrayOf(PropTypes.string).isRequired,
  filterDescription: PropTypes.bool.isRequired,
  source: PropTypes.objectOf(PropTypes.any).isRequired,
  data: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default Orchestrator;
