import React from 'react'
import { Button, Card, CardContent, Typography } from '@mui/material'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught an error', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <Card className="card error-boundary">
          <CardContent>
            <Typography variant="h5" component="h2" gutterBottom>
              Something went wrong.
            </Typography>
            <Typography sx={{ mb: 2 }}>
              The page could not be shown, but the application is still running.
            </Typography>
            {this.state.error && (
              <Typography className="error-text" sx={{ mb: 2 }}>
                {this.state.error.message}
              </Typography>
            )}
            <Button
              variant="contained"
              onClick={() => this.setState({ hasError: false, error: null })}
            >
              try again
            </Button>
          </CardContent>
        </Card>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
