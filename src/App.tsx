import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/login/login';
import Home from './pages/home/home';
import AddMagic from './pages/add-magic/add-magic';
import ViewMagic from './pages/view-magic/view-magic';
import AddItem from './pages/add-item/add-item';
import Layout from './components/layout/layout';

function App() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(
    !!localStorage.getItem('token')
  );

  return (
    <Router>
      <Routes>
        {/* Página de login (sem sidebar) */}
        <Route path="/" element={<Login setIsLoggedIn={setIsLoggedIn} />} />

        {/* Páginas com sidebar */}
        <Route
          path="/home"
          element={
            isLoggedIn ? (
              <Layout>
                <Home />
              </Layout>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/add-magic"
          element={
            isLoggedIn ? (
              <Layout>
                <AddMagic />
              </Layout>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/view-magic"
          element={
            isLoggedIn ? (
              <Layout>
                <ViewMagic />
              </Layout>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/add-item"
          element={
            isLoggedIn ? (
              <Layout>
                <AddItem />
              </Layout>
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
