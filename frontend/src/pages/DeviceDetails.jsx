import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import PageTopic from "../components/PageTopic";
import { assets } from "../assets/assets";

const DeviceDetails = () => {
  const { deviceId } = useParams();
  const navigate      = useNavigate();
  const backendUrl    = import.meta.env.VITE_BACKEND_URL;

  const [device, setDevice]   = useState(null);
  const [loading, setLoading] = useState(true);

  /* ─ Fetch once ─ */
  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/devices/${deviceId}`);
        setDevice(data.device);   // adjust to your API’s shape
      } catch (err) {
        toast.error("Failed to load device");
      } finally {
        setLoading(false);
      }
    })();
  }, [deviceId]);

  /* ─ Placeholder actions ─ */
  const confirmAction = (title, okMsg) => {
    if (window.confirm(title)) toast.success(okMsg);
  };

  if (loading)   return <div className="p-6">Loading…</div>;
  if (!device)   return null;

  const badgeClr =
    device.Status === "Online"
      ? "bg-green-600"
      : device.Status === "Offline"
      ? "bg-red-600"
      : "bg-indigo-600";

  return (
    <div className="text-gray-900 dark:text-gray-100">
      {/* Header */}
      <PageTopic
        topic={device.Name}
        intro={device.DeviceCode}
      />

      {/* Grid */}
      <div className="grid gap-4 lg:grid-cols-[2fr_3fr]">
        {/* Info card */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Information</h2>

          <ul className="space-y-2 text-sm">
            <li><span className="text-gray-500 dark:text-gray-400">Type:</span> {device.Type}</li>
            <li><span className="text-gray-500 dark:text-gray-400">Status:</span>
              <span className={`ml-2 px-2 py-0.5 rounded text-white ${badgeClr}`}>
                {device.Status}
              </span>
            </li>
            <li><span className="text-gray-500 dark:text-gray-400">Battery:</span> {device.Battery_Percentage ?? "N/A"}%</li>
            <li><span className="text-gray-500 dark:text-gray-400">Signal:</span> {device.Signal_Strength ?? "N/A"}</li>
            <li><span className="text-gray-500 dark:text-gray-400">Registered:</span> {dayjs(device.Registered_Date).format("YYYY-MM-DD HH:mm")}</li>
            <li><span className="text-gray-500 dark:text-gray-400">Last update:</span> {dayjs(device.Last_Update).fromNow()}</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm flex flex-col gap-3">
          <h2 className="text-lg font-semibold mb-4">Actions</h2>

          <button
            onClick={() => confirmAction("Rename device?", "Rename command sent")}
            className="py-2 rounded-lg bg-black hover:bg-gray-900 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white"
          >
            Rename (static)
          </button>

          <button
            onClick={() => confirmAction("Factory-reset this device?", "Reset command sent")}
            className="py-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white"
          >
            Reset (static)
          </button>

          <button
            onClick={() => confirmAction("Reboot this device now?", "Reboot command sent")}
            className="py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white"
          >
            Reboot (static)
          </button>
        </div>
      </div>

      {/* Back CTA for mobile convenience */}
      <div className="mt-8">
        <button
          onClick={() => navigate(-1)}
          className="text-sm underline text-blue-600 dark:text-blue-400"
        >
          ← Back to devices
        </button>
      </div>
    </div>
  );
};

export default DeviceDetails;

