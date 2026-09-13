import * as React from "react"
import { AlertCircleIcon } from "@/components/ui/icons"

import { Alert, AlertContent, AlertDescription, AlertIcon, AlertTitle } from "@/components/ui/alert"

type ErrorBoundaryProps = {
  children: React.ReactNode
  title?: string
}

type ErrorBoundaryState = { error: Error | null }

/** Remount via a changed `key` to clear a caught error. */
export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { error: null }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error }
  }

  render() {
    const { error } = this.state
    if (!error) return this.props.children

    return (
      <Alert variant="error" live="assertive" className="max-w-md">
        <AlertIcon><AlertCircleIcon /></AlertIcon>
        <AlertContent>
          <AlertTitle>{this.props.title ?? "Something went wrong"}</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
        </AlertContent>
      </Alert>
    )
  }
}
