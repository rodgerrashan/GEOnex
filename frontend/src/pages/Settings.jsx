import React, { useContext } from "react";
import Layout from "../components/Layout";
import System from "../components/System";
import Device from "../components/Device";
import Network from "../components/Network";
import { Context } from "../context/Context";
import Map from "../components/Map";

const Settings = () => {
  const { userData, settings, updateSetting, resetSettings, logout } =
    useContext(Context);

  if (!settings) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg">Loading settings…</p>
      </div>
    );
  }
  return (
    <div className="min-h-screen p-1">
      <div className="mb-10">
        <h1 className="text-4xl font-semi-bold">Settings</h1>
        <p className="text-md mt-1">
          Manage your communication,display,and user preferences
        </p>
      </div>

      <div className="flex flex-wrap gap-4">
        {/* Left column */}
        <div className="flex-1 min-w-[300px]">
          {/* System */}
          <section className="bg-white p-4 rounded-lg mb-4 h-[300px]">
            <System
              data={settings.system}
              onChange={(key, val) => updateSetting("system", key, val)}
            />
          </section>

          <section className="bg-white p-4 rounded-lg mb-4 h-[496px]">
            <Device
              data={settings.device}
              onChange={(key, val) => updateSetting("device", key, val)}
            />
          </section>
        </div>

        {/* Right column */}
        <div className="flex-1 min-w-[300px]">
          {/* Network */}
          <section className="bg-white p-4 rounded-lg mb-4 h-[300px]">
            <Network
              data={settings.network}
              onChange={(key, val) => updateSetting("network", key, val)}
            />
          </section>

          {/* Map */}
          <section className="bg-white p-4 rounded-lg mb-4 h-[200px]">
            <Map
              data={settings.map}
              onChange={(key, val) => updateSetting("map", key, val)}
            />
          </section>

          {/* Account */}
          <section className="bg-white p-4 rounded-lg mb-4 h-[280px]">
            <div>
              <h2 className="font-semibold text-xl">Account</h2>

              <div className="flex items-center justify-between mt-4">
                <span>Email</span>
                <span className="text-gray-500">{userData.email}</span>
              </div>
              <hr className="border-gray-300" />

              <div className="flex items-center justify-between mt-4">
                <span>Notifications</span>
                <select
                  value={settings.account.notifications}
                  onChange={(e) =>
                    updateSetting("account", "notifications", e.target.value)
                  }
                  className="text-blue-600 cursor-pointer outline-none rounded px-2 py-1"
                >
                  <option>ON</option>
                  <option>OFF</option>
                </select>
              </div>
            </div>
            <hr className="border-gray-300" />

            <div className="space-y-3 mt-8">
              <button className="w-full bg-black text-white rounded-full py-2 hover:bg-gray-900 transition">
                CHANGE PASSWORD
              </button>
              <button
                onClick={logout}
                className="w-full bg-red-500 text-white rounded-full py-2 hover:bg-red-600 transition"
              >
                LOGOUT
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Settings;
