import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import '@mantine/core/styles.css';
import './index.css'
import { RouterProvider } from 'react-router-dom'
import routes from './routes'
import Loading from './components/loading'
import { createTheme, MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'

const theme = createTheme({
  fontFamily: 'Open Sans, sans-serif',
  primaryColor: "dark",
});


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider theme={theme}>
      <Notifications position="bottom-center" />
      <Suspense fallback={<Loading />}>
        <RouterProvider router={routes} />
      </Suspense>
    </MantineProvider>
  </StrictMode>,
)
