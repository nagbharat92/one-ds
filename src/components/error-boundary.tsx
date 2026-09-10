import * as React from "react"
import { TriangleAlertIcon } from "@/components/ui/icons"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

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
      <Alert variant="destructive" live="assertive" className="max-w-md">
        <TriangleAlertIcon />
        <AlertTitle>{this.props.title ?? "Something went wrong"}</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    )
  }
}
