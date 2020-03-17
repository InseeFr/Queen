const prefixEvent = 'QUEEN';

const sendEvent = body => {
  console.log('sending Queen event....');
  var event = new CustomEvent(prefixEvent, {
    detail: body,
  });
  console.log(event);
  window.dispatchEvent(event);
  event.preventDefault();
};

export default sendEvent;
