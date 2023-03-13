import './wdyr';
import React from 'react';
import ReactDOM from 'react-dom';
import App from 'components/app';

import { listenParentApp } from 'utils/communication';

class QueenApp extends HTMLElement {
  mountPoint;

  componentAttributes = {};

  connectedCallback() {
    this.mountPoint = document.createElement('div');
    this.mountPoint.setAttribute('id', 'queen-app');
    this.mountReactApp();
  }

  disconnectedCallback() {
    ReactDOM.unmountComponentAtNode(this.mountPoint);
  }

  static get observedAttributes() {
    return ['queen_url', 'queen_api_url', 'queen_authentication_mode'];
  }

  attributeChangedCallback(name, oldVal, newVal) {
    this.componentAttributes[name.toUpperCase()] = newVal;
  }

  reactProps() {
    return { ...this.componentAttributes };
  }

  mountReactApp() {
    ReactDOM.render(<App {...this.reactProps()} />, this.mountPoint);
    this.appendChild(this.mountPoint);
  }
}

window.customElements.define('queen-app', QueenApp);
listenParentApp();
