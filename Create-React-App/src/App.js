import React, { useState, useEffect } from "react";
import './App.css';
import {
  HashRouter,
  Routes,
  Route
} from "react-router-dom";
import Home from './Components/home';
import CreateAccount from './Components/createaccount';
import Login from './Components/login';
import Deposit from './Components/deposit';
import Withdraw from './Components/withdraw';
import AllData from './Components/alldata';
import NavBar from './Components/navbar';
import { UserContext } from './Components/context';
//const { UserContext } = require('./Components/context');

function App() {
  const [data, setData] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
      async function getData() {
          const response = await fetch('./users.json', {
            headers : { 
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          });
          const json     = await response.json();
          setData(json);
          setLoaded(true);
      }
      getData();
  },[])

  return (
    <HashRouter>
    {loaded &&
      <UserContext.Provider value={data.users}>
        <NavBar/>
          <Routes className="container" style={{padding: "20px"}}>
            <Route path="/" exact element={<Home/>} />
            <Route path="/createAccount/" element={<CreateAccount/>} />
            <Route path="/login/" element={<Login/>} />
            <Route path="/deposit/" element={<Deposit/>} />
            <Route path="/withdraw/" element={<Withdraw/>} />
            <Route path="/allData/" element={<AllData/>} />
          </Routes>
        </UserContext.Provider>
    }
    </HashRouter>
  );
}

export default App;
