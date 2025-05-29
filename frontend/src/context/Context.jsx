import React, { createContext, useEffect, useRef, useState } from "react";
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

  const [rovers, setRovers] = useState([]);
  const [base, setBase] = useState();

  const [projects, setProjects] = useState([]);
  const [points, setPoints] = useState([]);
  const [loadingPoints, setLoadingPoints] = useState(false);

  const [isLoggedin, setIsLoggedin] = useState(false);
  const [userData, setUserData] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingDevices, setLoadingDevices] = useState(true);

  const [settings, setSettings] = useState(null);

  const [theme, setTheme] = useState("Light");

  // const [notifications, setNotifications] = useState([]);

  const getAuthState = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/auth/is-auth");
      if (data.success && data.verified) {
        setIsLoggedin(true);
        await getUserData();
      } else {
        setIsLoggedin(false);
        setUserData(null);
      }
    } catch (error) {
      setIsLoggedin(false);
      toast.error(error.message);
      navigate("/login");
    } finally {
      setIsLoading(false);
    }
  };

  const getUserData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/user/data");
      data.success ? setUserData(data.userData) : toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getProjectsData = async (userId) => {
    try {
      if (userId !== undefined) {
        const response = await axios.get(
          backendUrl + `/api/projects/recentprojects/${userId}`
        );

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
        `${backendUrl}/api/projects/${projectId}`
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
      const response = await axios.get(`${backendUrl}/api/points/${projectId}`);
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
        `${backendUrl}/api/points/${projectId}/${pointId}`
      );
      if (response.data.success) {
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
  // const getNotificationsData = async (userId, numOfNotifications) => {
  //   try {
  //     console.log("Getting notifications for user:", userId);
  //     const response = await axios.get(`${backendUrl}/api/notifications/user/${userId}/${numOfNotifications || 10}`);
  //     console.log("Notifications response:", response.data);
  //     if (Array.isArray(response.data.notifications)) {
  //       setNotifications(response.data.notifications);
  //     } else {
  //       console.warn("Unexpected notifications format", response.data);
  //       setNotifications([]);
  //     }
  //   } catch (error) {
  //     console.error("Failed to fetch notifications", error);
  //     setNotifications([]);
  //   }
  // };

  //   const markAsRead = async (id) => {
  //   try {
  //     console.log("Marking notification as read:", id);

  //     const response = await axios.put(`${backendUrl}/api/notifications/mark-read`, { id });
  //     console.log("Mark as read response:", response.data);

  //     if (response.data.success) {
  //       setNotifications((prevNotifications) =>
  //         prevNotifications.map((note) =>
  //           note._id === id ? { ...note, read: true } : note
  //         )
  //       );
  //     } else {
  //       toast.error("Failed to mark notification as read.");
  //     }
  //   } catch (error) {
  //     console.error("Error marking notification as read:", error);
  //     toast.error("Failed to mark notification as read.");
  //   }
  // };

  // devices
  const fetchUserDevices = async () => {
    if (!userData || !userData.userId) {
      console.warn("User ID not available, skipping device fetch");
      return;
    }
    setLoadingDevices(true);
    try {
      const response = await axios.get(
        `${backendUrl}/api/user/${userData.userId}/devices`
      );
      const data = response.data;
      console.log("Full response:", data);
      const rovers =
        data.connectedDevices?.filter((device) => device.Type === "rover") ||
        [];
      const baseDevice = data.connectedDevices?.find(
        (device) => device.Type === "base"
      );

      setRovers(rovers);
      setBase(baseDevice);
    } catch (error) {
      console.error("Error fetching devices:", error);
      toast.error("Failed to load connected devices");
    } finally {
      setLoadingDevices(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/user/settings");
      if (data.success) {
        setSettings(data.Data);
        setTheme(data.Data.map.theme);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  // updateSetting with optimistic UI + debounced API call
  const updateTimeout = useRef();

  const updateSetting = (section, key, value) => {
    // optimistic
    setSettings((prev) => ({
      ...prev,
      [section]: { ...prev[section], [key]: value },
    }));

    // if the user just changed the map theme, update <html> immediately
    if (section === "map" && key === "theme") {
      setTheme(value);
    }

    // debounce
    clearTimeout(updateTimeout.current);
    updateTimeout.current = setTimeout(async () => {
      try {
        await axios.put(backendUrl + "/api/user/settings", {
          [section]: { [key]: value },
        });
      } catch (err) {
        toast.error("Failed to save setting");
      }
    }, 300);
  };

  //  resetSettings
  const resetSettings = async () => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/settings/reset"
      );
      if (data.success) {
        setSettings(data.Data);
        toast.success("Settings restored to defaults");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Failed to reset settings");
    }
  };

  useEffect(() => {
    getAuthState();
    // getNotificationsData(userData?.userId);
  }, []);

  useEffect(() => {
    if (userData && userData.userId) {
      getProjectsData(userData.userId);
      fetchUserDevices();
      fetchSettings();
    }
  }, [userData]);

  useEffect(() => {
    if (theme === "Dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  // 🔍 watch auth state change
  useEffect(() => {
    console.log("userData changed ➜", userData);
  }, [userData]);

  useEffect(() => {
    console.log("isLoggedin changed ➜", isLoggedin);
  }, [isLoggedin]);

  useEffect(() => {
    console.log("🔧 settings updated:", settings);
    console.log("theme", theme);
  }, [settings]);

  const value = {
    // getNotificationsData,
    // notifications,
    // markAsRead,
    navigate,
    showPointRecorded,
    setShowPointRecorded,
    showConfirmDiscard,
    setShowConfirmDiscard,
    backendUrl,
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
    isLoading,
    isLoadingDevices,
    rovers,
    base,
    settings,
    updateSetting,
    resetSettings,
  };

  return <Context.Provider value={value}>{props.children}</Context.Provider>;
};

export default ContextProvider;
