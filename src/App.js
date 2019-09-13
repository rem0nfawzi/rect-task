import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Home from './components/Home/Home';
import DogDetails from './components/DogDetails/DogDetails';
import './App.css';
import DogsContextProvider from './contexts/DogsContext';

function App() {
  return (
    <DogsContextProvider>
      <BrowserRouter>
        <Switch>
          <Route exact path='/' component={Home} />
          <Route exact path='/dog/:id' component={DogDetails} />
        </Switch>
      </BrowserRouter>
    </DogsContextProvider>
  );
}

export default App;
