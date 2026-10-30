import React from 'react'
import ReactDOM from 'react-dom/client'
import { LazyMotion, domAnimation } from 'framer-motion'
import App from './App.jsx'
import './index.css'

// Components use the slim `m.*` instead of `motion.*` to keep Framer Motion's bundle small.
// LazyMotion supplies the renderer they need to follow MotionValue updates; `strict` makes a
// stray `motion.*` throw in development.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LazyMotion features={domAnimation} strict>
      <App />
    </LazyMotion>
  </React.StrictMode>,
)
