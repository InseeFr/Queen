export const buildQueenQuestionnaire = components => {
  let seq;
  let idSeq;
  let subseq;
  let idSubseq;
  return Array.isArray(components)
    ? components.reduce((_, component) => {
        const { componentType, label, id } = component;
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
          return [
            ..._,
            { ...component, labelNav: label, label: '', sequence: seq, page: _.length + 1 },
          ];
        }
        if (componentType === 'Subsequence') {
          idSubseq = id;
          subseq = label;
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
