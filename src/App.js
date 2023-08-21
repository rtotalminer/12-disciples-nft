import './App.css';

import { Outlet } from "react-router-dom";

import { ChakraProvider } from '@chakra-ui/react';

import NavBar from './components/NavBar.js';

function App() {

  return (
    <ChakraProvider>
      <div className="overlay">
        <div className='moving-bg'></div>
        <div className="App">
            <NavBar/>
            <Outlet/>
        </div>
      </div>
    </ChakraProvider>
  );
}

export default App;
