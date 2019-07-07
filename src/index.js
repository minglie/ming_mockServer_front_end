import React from 'react'
import ReactDOM from 'react-dom'

import App from './app.js'
import Context from "./Context.js"

 import CodeModel from "./pages/components/CodeModel.jsx"

 import InterFaceManager from "./pages/components/InterFaceManager.jsx"

import './asset/css/normalize.css'

ReactDOM.render(
  <InterFaceManager/>,
  document.getElementById('root')
)
