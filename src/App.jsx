import React from 'react'
import { BrowserRouter as Router} from "react-router-dom";
import RouteConfig from './routes/RouteConfig.jsx';
import LoginPage from './pages/LoginPage.jsx';
function App() {
  return (
    <Router>
      <RouteConfig />
    </Router>
  )
}

export default App