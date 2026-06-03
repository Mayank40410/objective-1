import React from 'react';
import Login from './components/Login';
import Register from './components/Register';

function App() {
  return (
    <div>
      <h1>Secure Authentication System</h1>

      <Register />
      <Login />
    </div>
  );
}

export default App;