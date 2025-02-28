import React, { createContext, useState} from 'react';
import { useNavigate } from 'react-router-dom';

export const Context = createContext();

const ContextProvider = (props) => {

  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);

  const value = {
    navigate,
    showPopup,
    setShowPopup
  }
  
  return (
    <Context.Provider value={value}>
      {props.children}
    </Context.Provider>
  );
};

export default ContextProvider;
