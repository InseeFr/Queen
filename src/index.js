import './wdyr';
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from 'components/app';
import { listenParentApp } from 'utils/communication';
class QueenApp extends HTMLElement {
  element;
  root;

  componentAttributes = {};

  connectedCallback() {
    this.element = document.createElement('div');
    this.element.setAttribute('id', 'queen-app');
    this.mountReactApp();
  }

  disconnectedCallback() {
    this.root.unmount();
  }

  static get observedAttributes() {
    return ['queen_url', 'queen_api_url', 'queen_authentication_mode'];
  }

  attributeChangedCallback(name, newVal) {
    this.componentAttributes[name.toUpperCase()] = newVal;
  }

  reactProps() {
    return { ...this.componentAttributes };
  }

  mountReactApp() {
    this.root = createRoot(this.element);
    this.root.render(<App {...this.reactProps()} />);
    this.appendChild(this.element);
  }
}

window.customElements.define('queen-app', QueenApp);
listenParentApp();
