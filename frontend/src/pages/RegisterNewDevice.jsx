import React, {useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import axios from "axios";
import { Context } from "../context/Context";
import { toast } from "react-toastify";


const RegisterNewDevice = () => {
  
  const [deviceId, setDeviceId] = useState("");
  const [deviceName, setDeviceName] = useState("");
  const [deviceType, setDeviceType] = useState("rover");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

const { backendUrl } = useContext(Context);
  const navigate = useNavigate();

  
  const { userId } = useParams(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!deviceId.trim()) {
      setError("Device ID is required");
      return;
    }
    
    if (!deviceName.trim()) {
      setError("Device name is required");
      return;
    }
    
    setIsSubmitting(true);
    setError("");
    setSuccess("");

    
    try {

        const payload = {
          deviceId,
        }
        const response =  await axios.post(backendUrl + "/api/devices/is-registered", payload);
      
      
      if (response.status !== 200) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Invalid device ID");
      }

        const isRegistered = response.data.isRegistered;
        if (isRegistered) {
            setError("Device ID is already registered. Please use a different ID.");
            return;
        }

      
      // Register the device
      const registerResponse = await fetch(backendUrl + `/api/devices/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          deviceId,
          deviceName,
          deviceType,
          userId
        }),
      });
      
      if (!registerResponse.ok) {
        const errorData = await registerResponse.json();
        throw new Error(errorData.message || "Failed to register device");
      }
      
      setSuccess("Device registered successfully!");
      
      // Wait a moment then navigate back
      setTimeout(() => {
        navigate("/", { state: { refresh: true } });
      }, 1500);
      
    } catch (error) {
      console.error("Error registering device:", error);
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

return (
    <div className=" mx-auto px-4 py-6 ">
        <div className="flex flex-col gap-6">
            <div className="flex gap-3">
                {/* Left arrow button */}
                <button
                    className="text-2xl"
                    onClick={() => navigate(-1)}
                    aria-label="Go back"
                >
                    <img className="w-6 h-6 md:w-8 md:h-8" src={assets.arrow} alt="go back" />
                </button>

                {/* Title & subtitle */}
                <div>
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold">Register New Device</h1>
                    <p className="text-sm md:text-base lg:text-lg mt-1">
                        Setup your new device
                    </p>
                </div>
            </div>

            {/* Registration Form */}
            <div className="bg-white rounded-lg shadow-md p-6">
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}
                
                {success && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
                        {success}
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="deviceId" className="text-sm font-medium text-gray-700">
                            Device ID <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="deviceId"
                            value={deviceId}
                            onChange={(e) => setDeviceId(e.target.value)}
                            className="mt-1 w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter the device ID (e.g., GNSS-123456)"
                        />
                        <p className="text-sm text-gray-500">
                            You can find the device ID on the label or in the device documentation
                        </p>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                        <label htmlFor="deviceName" className="text-sm font-medium text-gray-700">
                            Device Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="deviceName"
                            value={deviceName}
                            onChange={(e) => setDeviceName(e.target.value)}
                            className="mt-1 w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Give your device a name (e.g., Field Rover 1)"
                        />
                    </div>
                    
                    <div className="flex flex-col gap-2">
                        <label htmlFor="deviceType" className="text-sm font-medium text-gray-700">
                            Device Type
                        </label>
                        <select
                            id="deviceType"
                            value={deviceType}
                            onChange={(e) => setDeviceType(e.target.value)}
                            className="mt-1 w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="rover">Rover</option>
                            <option value="base">Base Station</option>
                        </select>
                    </div>
                    
                    <div className="flex items-center justify-end gap-4 pt-4">
                        <button
                            type="button"
                            onClick={() => navigate("/")}
                            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
                        >
                            {isSubmitting ? "Registering..." : "Register Device"}
                        </button>
                    </div>
                </form>
            </div>
            
            {/* Help section */}
            <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-medium text-blue-800 mb-2">Need help?</h3>
                <p className="text-blue-700 mb-4">
                    If you're having trouble registering your device, please check the following:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-blue-700">
                    <li>Make sure your device is powered on</li>
                    <li>Verify that the device ID is entered correctly</li>
                    <li>Ensure your device has been activated by the manufacturer</li>
                    <li>Check that your device is not already registered to another account</li>
                </ul>
            </div>
        </div>
    </div>
);
};

export default RegisterNewDevice;