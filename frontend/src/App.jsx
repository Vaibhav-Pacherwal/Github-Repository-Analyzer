import { useState } from 'react'
import LandingPage from './LandingPage';
import Dashboard from './Dashboard';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import URL from './Environment.js';
import './App.css'

function App() {
  let [data, setData] = useState({});

  const getData = async (username) => {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({username})
    }

    const response = await fetch(`${URL}/fetch`, options);
    const responseData = await response.json();
    console.log(responseData);
    setData(responseData);
  }

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<LandingPage getData={getData}/>}></Route>
          <Route path='/dashboard' element={<Dashboard details={data}/>}></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
