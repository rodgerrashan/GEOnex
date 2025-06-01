import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
axios.defaults.withCredentials = true;
import { toast } from "react-toastify";

export const Context = createContext();

const ContextProvider = (props) => {
  const navigate = useNavigate();
  const [showPointRecorded, setShowPointRecorded] = useState(false);
  const [showConfirmDiscard, setShowConfirmDiscard] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const userPort = import.meta.env.API_USER_PORT;
  const authPort = import.meta.env.API_AUTH_PORT;
  const devicesPort = import.meta.env.API_DEVICES_PORT;
  const projectsPort = import.meta.env.API_PROJECTS_PORT;
  const pointsPort = import.meta.env.API_POINTS_PORT;
  const exportPort = import.meta.env.API_EXPORT_PORT;
  const mqttPort = import.meta.env.API_MQTT_PORT;
  const notificationsPort = import.meta.env.API_NOTIFICATIONS_PORT;


  const [rovers, setRovers] = useState([]);
  const [base, setBase] = useState();

  const [projects, setProjects] = useState([]);
  const [points, setPoints] = useState([]);
  const [loadingPoints, setLoadingPoints] = useState(false);

  const [isLoggedin, setIsLoggedin] = useState(false);
  const [userData, setUserData] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingDevices, setLoadingDevices] = useState(true);

  const [notifications, setNotifications] = useState([]);

  const getAuthState = async () => {
    try {
      const { data } = await axios.get(backendUrl +authPort+ "/api/auth/is-auth");
      if (data.success && data.verified) {
        setIsLoggedin(true);
        await getUserData();
      }else{
        setIsLoggedin(false);
        setUserData(null);
      }
    } catch (error) {
      setIsLoggedin(false);
      toast.error(error.message);
      navigate("/login");
    }finally{
      setIsLoading(false)
    }
  };

  const getUserData = async () => {
    try {
      const { data } = await axios.get(backendUrl +userPort+ "/api/user/data");
      data.success ? setUserData(data.userData) : toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getProjectsData = async (userId) => {
    try {
      if (userId !== undefined) {
        const response = await axios.get(backendUrl +projectsPort + `/api/projects/recentprojects/${userId}`);

      if (response.data.success) {
        setProjects(response.data.projects);
      } else {
        toast.error(response.data.message);
      }

      }
      
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error(error.message);
    }
  };

  const removeProject = async (projectId) => {
    try {
      const response = await axios.delete(
        `${backendUrl}${projectsPort}/api/projects/${projectId}`
      );
      if (response.data.success) {
        toast.success(response.data.message);
        getProjectsData();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // Function to fetch points by project id
  const fetchPoints = async (projectId) => {
    setLoadingPoints(true);
    setPoints([]);
    try {
      const response = await axios.get(`${backendUrl}${pointsPort}/api/points/${projectId}`);
      if (response.data.success) {
        setPoints(response.data.points);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching points:", error);
    } finally {
      setLoadingPoints(false);
    }
  };

  const deletePoint = async (projectId, pointId) => {
    console.log(projectId, pointId);
    try {
      const response = await axios.delete(
        `${backendUrl}${pointsPort}/api/points/${projectId}/${pointId}`
      );
      if (response.data.message) {
        toast.success(response.data.message);
        // Remove the deleted point from the local state
        setPoints((prevPoints) =>
          prevPoints.filter((point) => point._id !== pointId)
        );
      } else {
        toast.error("Failed to delete point.");
      }
    } catch (error) {
      console.error("Error deleting point:", error);
      toast.error("Failed to delete point.");
    }
  };



  // Notifications 
  const getNotificationsData = async (userId, numOfNotifications) => {
    try {
      console.log("Getting notifications for user:", userId);
      const response = await axios.get(`${backendUrl}${notificationsPort}/api/notifications/user/${userId}/${numOfNotifications || 10}`);
      console.log("Notifications response:", response.data);
      if (Array.isArray(response.data.notifications)) {
        setNotifications(response.data.notifications);
      } else {
        console.warn("Unexpected notifications format", response.data);
        setNotifications([]);
      }
    } catch (error) {
      console.error("Failed to fetch notifications", error);
      setNotifications([]);
    }
  };


  const markAsRead = async (id) => {
  try {
    console.log("Marking notification as read:", id);

    const response = await axios.put(`${backendUrl}${notificationsPort}/api/notifications/mark-read`, { id });
    console.log("Mark as read response:", response.data);

    if (response.data.success) {
      setNotifications((prevNotifications) =>
        prevNotifications.map((note) =>
          note._id === id ? { ...note, read: true } : note
        )
      );
    } else {
      toast.error("Failed to mark notification as read.");
    }
  } catch (error) {
    console.error("Error marking notification as read:", error);
    toast.error("Failed to mark notification as read.");
  }
};



  // devices
  const fetchUserDevices = async () => {
    setLoadingDevices(true);
    try {
        const response = await fetch(`${backendUrl}${userPort}/api/user/${userData.userId}/devices`);
        if (!response.ok) {
            throw new Error("Failed to fetch devices");
        }

        const data = await response.json();
        console.log("Full response:", data);
        // Filter and set devices based on their type
        const rovers = data.connectedDevices?.filter(device => device.Type === 'rover') || [];
        const baseDevice = data.connectedDevices?.find(device => device.Type === 'base');
        
        setRovers(rovers);
        setBase(baseDevice);

        console.log(rovers);
        console.log(baseDevice);
    } catch (error) {
        console.error("Error fetching devices:", error);
        setError("Failed to load connected devices");
    } finally {
        setLoadingDevices(false);
    }
};

  useEffect(() => {
    getProjectsData();
    getAuthState();
    fetchUserDevices();
    getNotificationsData(userData?.userId);
  }, []);

  // 🔍 watch auth state change
  useEffect(() => {
    console.log("userData changed ➜", userData);
  }, [userData]);

  useEffect(() => {
    console.log("isLoggedin changed ➜", isLoggedin);
  }, [isLoggedin]);

  const value = {
    getNotificationsData,
    notifications,
    markAsRead,
    navigate,
    showPointRecorded,
    setShowPointRecorded,
    showConfirmDiscard,
    setShowConfirmDiscard,
    backendUrl,
    userPort,
    authPort,
    devicesPort,
    projectsPort,
    pointsPort,
    exportPort,
    mqttPort,
    notificationsPort,
    projects,
    getProjectsData,
    removeProject,
    points,
    loadingPoints,
    fetchPoints,
    fetchUserDevices,
    setPoints,
    deletePoint,
    isLoggedin,
    setIsLoggedin,
    userData,
    setUserData,
    getUserData,
    isLoadingDevices,
    rovers,
    base
  };

  return <Context.Provider value={value}>{props.children}</Context.Provider>;
};

export default ContextProvider;
