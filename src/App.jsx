import React from 'react'
import { BrowserRouter as Router } from "react-router-dom";
import RouteConfig from './routes/RouteConfig.jsx';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { OrderMetaProvider } from './utils/OrderDataContext';

const theme = createTheme({
  typography: {
    fontFamily: "Poppins, sans-serif",
  },
});
function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <RouteConfig />
      </Router>
    </ThemeProvider >
  )
}

export default App