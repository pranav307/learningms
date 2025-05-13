import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import store from './storertk/store.jsx'
import {Provider} from "react-redux";
import {Toaster} from "@/components/ui/toaster";
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <Provider store={store}>
    <App />
    <Toaster/>
    
    </Provider>
    </BrowserRouter>
  </StrictMode>,
)
