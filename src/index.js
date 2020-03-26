import React from 'react';
import ReactDOM from 'react-dom';
import Root from './components/router';
import * as serviceWorker from './serviceWorker';

class QueenApp extends HTMLElement {
  mountPoint;
  componentAttributes = {};
  componentProperties = { isStandalone: false, authenticationMode: 'anonymous' };

  connectedCallback() {
    this.setStandalone();
  }

  disconnectedCallback() {
    ReactDOM.unmountComponentAtNode(this.mountPoint);
  }

  static get observedAttributes() {
    return ['standalone'];
  }

  attributeChangedCallback(name, oldVal, newVal) {
    this.componentAttributes[name] = newVal;
    this.mountReactApp();
  }

  get isStandalone() {
    return this.componentProperties.isStandalone;
  }

  set isStandalone(newValue) {
    this.componentProperties.isStandalone = newValue;
    this.mountReactApp();
  }

  async setStandalone() {
    const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
    const response = await fetch(`${publicUrl.origin}/configuration.json`);
    const data = await response.json();
    const { urlQueen, authenticationMode } = data;
    if (urlQueen === publicUrl.origin) {
      this.componentProperties.isStandalone = true;
    } else {
      this.componentProperties.isStandalone = false;
    }
    this.componentProperties.authenticationMode = authenticationMode;
    this.mountReactApp();
  }

  reactProps() {
    return { ...this.componentAttributes, ...this.componentProperties };
  }

  mountReactApp() {
    this.mountPoint = document.createElement('div');
    ReactDOM.render(<Root {...this.reactProps()} />, this.mountPoint);
    this.appendChild(this.mountPoint);
  }
}
window.customElements.define('queen-app', QueenApp);
serviceWorker.register();
