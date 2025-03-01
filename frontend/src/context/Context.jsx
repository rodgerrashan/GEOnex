import React, { createContext, useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from "react-toastify";

export const Context = createContext();

const ContextProvider = (props) => {

  const navigate = useNavigate();
  const [showPointRecorded, setShowPointRecorded] = useState(false);
  const [showConfirmDiscard, setShowConfirmDiscard] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [projects, setProjects] = useState([]);

  const getProjectsData = async () => {
    try {

      const response = await axios.get(backendUrl + '/api/projects');
    
      if(response.data.success){
        setProjects(response.data.projects);
      }else{
        toast.error(response.data.message)

      }
      
    } catch (error) {
      
    }
  }

  useEffect(()=>{
    getProjectsData()
  },[])



  const value = {
    navigate,
    showPointRecorded,
    setShowPointRecorded,
    showConfirmDiscard,
    setShowConfirmDiscard,
    backendUrl,
    projects
  }
  
  return (
    <Context.Provider value={value}>
      {props.children}
    </Context.Provider>
  );
};

export default ContextProvider;
