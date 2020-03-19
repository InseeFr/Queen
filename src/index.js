import React from 'react';
import ReactDOM from 'react-dom';
import Root from './components/router';
import * as serviceWorker from './serviceWorker';

class QueenApp extends HTMLElement {
  mountPoint;
  componentAttributes = {};
  componentProperties = { questionnaire: '' };

  connectedCallback() {
    this.mountReactApp();
  }

  disconnectedCallback() {
    ReactDOM.unmountComponentAtNode(this.mountPoint);
  }

  static get observedAttributes() {
    return ['questionnaire'];
  }

  attributeChangedCallback(name, oldVal, newVal) {
    this.componentAttributes[name] = newVal;
    this.mountReactApp();
  }

  get questionnaire() {
    return this.componentProperties.questionnaire;
  }

  set questionnaire(newValue) {
    this.componentProperties.questionnaire = newValue;

    this.mountReactApp();
  }

  reactProps() {
    return { ...this.componentAttributes, ...this.componentProperties };
  }

  mountReactApp() {
    this.mountPoint = document.createElement('div');
    ReactDOM.render(<Root />, this.mountPoint);
    this.appendChild(this.mountPoint);
  }
}

//ReactDOM.render(<Root />, document.getElementById('root'));

window.customElements.define('queen-app', QueenApp);
serviceWorker.register();
