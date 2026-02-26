import React, { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }; // Update state to render fallback UI
  }

  componentDidCatch(error, info) {
    // You can log error to an external service (e.g., Sentry, LogRocket, etc.)
    console.error("ErrorBoundary caught an error", error, info);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong. Please try again later.</h1>;
    }
    return this.props.children; // Render children if no error
  }
}

export default ErrorBoundary;
