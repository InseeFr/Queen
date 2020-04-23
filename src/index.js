import React from 'react';
import ReactDOM from 'react-dom';
import Root from './components/router';
import { listenParentApp } from 'utils/communication';

class QueenApp extends HTMLElement {
  mountPoint;
  componentAttributes = {};
  componentProperties = { configuration: undefined };

  connectedCallback() {
    this.mountPoint = document.createElement('div');
    this.mountReactAppLoadingConfiguration();
    this.setConfiguration();
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

  async setConfiguration() {
    const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
    const response = await fetch(`${publicUrl.origin}/configuration.json`);
    let configuration = await response.json();
    const { urlQueen } = configuration;
    if (urlQueen === publicUrl.origin) {
      configuration.standalone = true;
    } else {
      const responseFromQueen = await fetch(`${urlQueen}/configuration.json`);
      configuration = await responseFromQueen.json();
      configuration.standalone = false;
    }
    this.componentProperties.configuration = configuration;
    this.mountReactApp();
  }

  reactProps() {
    return { ...this.componentAttributes, ...this.componentProperties };
  }

  mountReactApp() {
    ReactDOM.render(<Root {...this.reactProps()} />, this.mountPoint);
    this.appendChild(this.mountPoint);
  }

  mountReactAppLoadingConfiguration() {
    ReactDOM.render(<Root />, this.mountPoint);
    this.appendChild(this.mountPoint);
  }
}
window.customElements.define('queen-app', QueenApp);
listenParentApp();
