import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import React from 'react';
import Registration from './components/Registration';
import Home from './components/Home';

function App() {
  return (
   
    <Router>

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/registration' element={<Registration/>} />
      </Routes>

    </Router>
  );
}

export default App;
