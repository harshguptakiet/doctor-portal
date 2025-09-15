import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// import AppRouter from './AppRouter.tsx'
// import TestRouter from './TestRouter.tsx'
// import SimpleAppRouter from './SimpleAppRouter.tsx'
// import MinimalTest from './MinimalTest.tsx'
// import UltraMinimal from './UltraMinimal.tsx'
// import DiagnosticRouter from './DiagnosticRouter.tsx'
import WorkingAppRouter from './WorkingAppRouter.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WorkingAppRouter />
  </StrictMode>,
)
