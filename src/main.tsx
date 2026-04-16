import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import CssBaseline from '@mui/material/CssBaseline'
import GlobalStyles from '@mui/material/GlobalStyles'
import { ThemeProvider } from '@mui/material/styles'
import App from './App.tsx'
import theme from './theme.ts'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles
        styles={{
          '@media print': {
            '.print-hide': { display: 'none !important' },
            '.print-title': { display: 'block !important' },
            '*': { boxShadow: 'none !important' },
          },
        }}
      />
      <App />
    </ThemeProvider>
  </StrictMode>,
)
