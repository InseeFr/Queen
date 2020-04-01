import D from 'i18n';

/**
 * Function to build Queen questionnaire.
 * We add attribute to components
 *   - page : the queen page
 *   -
 * @param {*} components
 */
export const buildQueenQuestionnaire = components => {
  let seq;
  let idSeq;
  let subseq;
  let idSubseq;
  return Array.isArray(components)
    ? components.reduce((_, component) => {
        const { componentType, label, id, declarations } = component;
        if (componentType && !['Sequence', 'Subsequence'].includes(componentType))
          return [
            ..._,
            {
              ...component,
              idSequence: idSeq,
              idSubsequence: idSubseq,
              sequence: seq,
              subsequence: subseq,
              page: _.length + 1,
            },
          ];
        if (componentType === 'Sequence') {
          idSeq = id;
          seq = label;
          subseq = '';
          idSubseq = '';
          /**
           * if there is no declarations, we display a new declaration : D.newSequenceComment (cf Dictionary)
           */
          const newDeclarations =
            !declarations || declarations.length === 0
              ? [
                  {
                    id: `${id}-d1`,
                    declarationType: 'COMMENT',
                    position: 'AFTER_QUESTION_TEXT',
                    label: D.newSequenceComment,
                  },
                ]
              : declarations;
          return [
            ..._,
            {
              ...component,
              labelNav: label,
              label: '',
              declarations: newDeclarations,
              sequence: seq,
              page: _.length + 1,
            },
          ];
        }
        if (componentType === 'Subsequence') {
          idSubseq = id;
          subseq = label;
          /**
           * if there is no declarations, we delete this component
           */
          if (!declarations || declarations.length === 0) {
            return _;
          }
          return [
            ..._,
            {
              ...component,
              labelNav: label,
              label: '',
              sequence: seq,
              subsequence: subseq,
              idSequence: idSeq,
              page: _.length + 1,
            },
          ];
        }
        return _;
      }, [])
    : [];
};
