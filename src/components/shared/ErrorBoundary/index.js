import React from 'react';
import Error from '../Error';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  // componentDidCatch(error, errorInfo) {}

  render() {
    if (this.state.hasError) {
      return <Error message={this.props.message} />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
