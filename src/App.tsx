import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/login/login';
import Home from './pages/home/home';
import AddMagic from './pages/add-magic/add-magic';
import ViewMagic from './pages/view-magic/view-magic';

function App() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(
    !!localStorage.getItem('token')
  );

  return (
    <Router>
      <Routes>
        {/* Página de login */}
        <Route path="/" element={<Login setIsLoggedIn={setIsLoggedIn} />} />

        {/* Páginas protegidas */}
        <Route
          path="/home"
          element={isLoggedIn ? <Home /> : <Navigate to="/" replace />}
        />
        <Route
          path="/add-magic"
          element={isLoggedIn ? <AddMagic /> : <Navigate to="/" replace />}
        />
        <Route
          path="/view-magic"
          element={isLoggedIn ? <ViewMagic /> : <Navigate to="/" replace />}
        />
      </Routes>
    </Router>
  );
}

export default App;
