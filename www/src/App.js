import './App.css';
import Leftpanel from './leftpanel';
import PageRouter from './pageRouter';
import Login from './Login';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function App() {
  const location = useLocation();
  useEffect(() => {
    console.log("location: " + location.pathname);
  }, [location]);

  return (
    <div className="App">
      {localStorage.getItem("accessToken") != null ? <Leftpanel/> : <h1>well cum</h1>}
      <PageRouter/>
    </div>
  );
}

export default App;
