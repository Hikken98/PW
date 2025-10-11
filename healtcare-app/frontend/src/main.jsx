import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'            // <-- importa App.jsx
import './styles.css'              // opzionale, se esiste

createRoot(document.getElementById('root')).render(<App />)
