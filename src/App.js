import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Home from './components/Home/Home';
import DogDetails from './components/DogDetails/DogDetails';
import './App.css';
import DogsContextProvider from './contexts/DogsContext';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <DogsContextProvider>
          <Route exact path='/' component={Home} />
          <Route exact path='/dog/:id' component={DogDetails} />
        </DogsContextProvider>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
