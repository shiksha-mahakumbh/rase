"use client";

import { Component, type ReactNode } from "react";
import { reportError } from "@/lib/monitoring/reportError";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    reportError(error, {
      componentStack: info.componentStack ?? undefined,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div
            role="alert"
            className="mx-auto max-w-lg rounded-2xl border border-red-200 bg-red-50 p-8 text-center"
          >
            <h2 className="text-lg font-bold text-red-900">Something went wrong</h2>
            <p className="mt-2 text-sm text-red-800">
              Please refresh the page. If the problem continues, contact{" "}
              <a href="mailto:academics@shikshamahakumbh.com" className="underline">
                support
              </a>
              .
            </p>
            <button
              type="button"
              className="mt-4 min-h-[44px] rounded-lg bg-primary px-6 py-2 font-semibold text-white"
              onClick={() => this.setState({ hasError: false })}
            >
              Try again
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
