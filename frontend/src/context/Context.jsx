import React, { createContext } from 'react';
import { useNavigate } from 'react-router-dom';

export const Context = createContext();

const ContextProvider = (props) => {

  const navigate = useNavigate();

  const value = {
    navigate
  }
  
  return (
    <Context.Provider value={value}>
      {props.children}
    </Context.Provider>
  );
};

export default ContextProvider;
