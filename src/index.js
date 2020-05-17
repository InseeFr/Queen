import React from 'react';
import ReactDOM from 'react-dom';
import Root from './components/router';
import { listenParentApp } from 'utils/communication';

class QueenApp extends HTMLElement {
  mountPoint;
  componentAttributes = {};
  componentProperties = {};

  connectedCallback() {
    this.mountPoint = document.createElement('div');
    this.mountPoint.setAttribute('id', 'queen-app');
    this.mountReactApp();
  }

  disconnectedCallback() {
    ReactDOM.unmountComponentAtNode(this.mountPoint);
  }

  static get observedAttributes() {
    return ['standalone'];
  }

  attributeChangedCallback(name, oldVal, newVal) {
    this.componentAttributes[name] = newVal;
    ReactDOM.unmountComponentAtNode(this.mountPoint);
    this.mountReactApp();
  }

  get isStandalone() {
    return this.componentProperties.isStandalone;
  }

  set isStandalone(newValue) {
    this.componentProperties.isStandalone = newValue;
    ReactDOM.unmountComponentAtNode(this.mountPoint);
    this.mountReactApp();
  }
  reactProps() {
    return { ...this.componentAttributes, ...this.componentProperties };
  }

  mountReactApp() {
    ReactDOM.render(<Root {...this.reactProps()} />, this.mountPoint);
    this.appendChild(this.mountPoint);
  }
}

window.customElements.define('queen-app', QueenApp);
listenParentApp();
