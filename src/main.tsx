import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import { navigationWrapper } from './core/navigation/NavegationWrapper'
import './index.css'



createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={navigationWrapper} />
  </StrictMode>,
)
