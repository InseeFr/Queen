const getAlphabet = () => {
  var alphabets = [];
  var start = 'A'.charCodeAt(0);
  var last = 'Z'.charCodeAt(0);
  for (var i = start; i <= last; ++i) {
    alphabets.push(String.fromCharCode(i));
  }

  return alphabets.join('');
};

export default getAlphabet();
