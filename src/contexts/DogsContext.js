import React, { createContext, useState } from 'react';

export const DogsContext = createContext();
const DogsContextProvider = props => {
  const [dogs, setDogs] = useState([]);
  return (
    <DogsContext.Provider value={{ dogs, setDogs }}>
      {props.children}
    </DogsContext.Provider>
  );
};

export default DogsContextProvider;
