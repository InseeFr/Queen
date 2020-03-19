import React, { useState } from 'react';
import * as lunatic from '@inseefr/lunatic';
import simpsons from '../../utils/fake-survey/simpsons copy.json';
import data from '../../utils/fake-survey/data.json';
import alphabet from '../../utils/alphabet';
import * as UQ from '../../utils/questionnaire';
import Header from './header';
import Buttons from './buttons';

const Questionnaire = () => {
  const [questionnaire, setQuestionnaire] = useState(
    lunatic.mergeQuestionnaireAndData(simpsons)(data)
  );
  const [currentPage, setCurrentPage] = useState(1);
  /**
   * viewedPages : list of page viewed by user
   */
  const [viewedPages, setViewedPages] = useState([1]);

  const onChange = updatedValue => {
    console.log('update value');
    console.log(updatedValue);
    setQuestionnaire(
      lunatic.updateQuestionnaire('COLLECTED')(questionnaire)(['COLLECTED'])(updatedValue)
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
      let myLabel = (
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
  }
  console.log('current page :' + currentPage);
  console.log('viewed pages :' + viewedPages);
  return (
    <>
      <Header
        title={questionnaire.label}
        sequence={lunatic.interpret(['VTL'])(bindings)(sequence)}
        components={filteredComponents}
        bindings={bindings}
        subsequence={lunatic.interpret(['VTL'])(bindings)(subsequence)}
        setPage={setCurrentPage}
        viewedPages={viewedPages}
      />
      <div className="body-container">
        <div className="components">
          <div className="lunatic lunatic-component" key={`component-${id}`}>
            <Component
              id={id}
              {...props}
              options={myOptions || label}
              handleChange={updatevalue => onChange(updatevalue)}
              labelPosition="TOP"
              preferences={['COLLECTED']}
              features={['VTL']}
              bindings={bindings}
              focused
            />
          </div>
        </div>
        <Buttons
          nbModules={filteredComponents.length}
          save={() => {
            console.log('saving ...');
            console.log('currentpage:' + currentPage);
            console.log(lunatic.getCollectedStateByValueType(questionnaire)('COLLECTED'));
          }}
          page={UQ.findPageIndex(filteredComponents)(currentPage)}
          pageDown={() => goPrevious()}
          pageUp={() => {
            goNext();
          }}
        />
      </div>
    </>
  );
};

export default Questionnaire;
