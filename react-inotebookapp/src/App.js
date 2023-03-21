//import logo from './logo.svg';
//import './App.css';
import {
  HashRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import { Navbar } from './component/Navbar';
import Home from './component/Home';
import About from './component/About';
import NoteState from './context/NoteState';
import Alert from './component/Alert';
import Login from "./component/Login";
import SignUp from "./component/SignUp";
import { useState } from "react";

function App() {
  const [alert, setAlert] = useState(null);
  const showAlert = (message, type) => {
    setAlert({
      msg: message,
      type: type
    })

    setTimeout(() => {
      setAlert(null);
    }, 2000);
  }

  return (
    <div className="App">
      <NoteState>
        <Router>
          <Navbar />
          <Alert alert={alert} />
          <div className='container'>
            <Routes>
              <Route path="/about" exact element={<About />} />
              <Route path="/home" exact element={<Home showAlert={showAlert} />} />
              <Route path="/login" exact element={<Login showAlert={showAlert} />} />
              <Route path="/signup" exact element={<SignUp showAlert={showAlert} />} />
            </Routes>
          </div>
        </Router>
      </NoteState>
    </div>
  );
}

export default App;
