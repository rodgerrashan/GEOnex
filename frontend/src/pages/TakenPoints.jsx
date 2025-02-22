import React, { useContext } from "react";
import { Context } from "../context/Context";
import { assets } from "../assets/assets";

const points = [
  {
    id: 1,
    latitude: "12.345678",
    longitude: "78.910111",
    altitude: "50m",
    accuracy: "±1.2m",
    timestamp: "12:30:45",
  },
  {
    id: 2,
    latitude: "12.345678",
    longitude: "78.910111",
    altitude: "50m",
    accuracy: "±1.2m",
    timestamp: "12:30:45",
  },
  {
    id: 3,
    latitude: "12.345678",
    longitude: "78.910111",
    altitude: "50m",
    accuracy: "±1.2m",
    timestamp: "12:30:45",
  },
  {
    id: 4,
    latitude: "12.345678",
    longitude: "78.910111",
    altitude: "50m",
    accuracy: "±1.2m",
    timestamp: "12:30:45",
  },
  {
    id: 5,
    latitude: "12.345678",
    longitude: "78.910111",
    altitude: "50m",
    accuracy: "±1.2m",
    timestamp: "12:30:45",
  },
];

const TakenPoints = () => {
  const { navigate } = useContext(Context);
  return (
    <div>
      <div
        className="grid grid-cols-4 gap-4"
        style={{ gridTemplateRows: "80px auto" }}
      >
        {/* Header row with left group and right button */}
        <div className="col-span-4 flex items-center justify-between">
          {/* Left group: arrow and title */}
          <div className="flex items-center gap-3">
            {/* Left arrow button */}
            <button
              className="text-2xl"
              //   onClick={() => {
              //     navigate("/");
              //   }}
            >
              <img className="w-8 h-8" src={assets.arrow} alt="Go back" />
            </button>

            {/* Title & subtitle */}
            <div>
              <h1 className="text-2xl font-semibold">Taken Points</h1>
              <p className="text-xs mt-1">Play with points</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* refresh button */}
            <button
              className="text-2xl"
              //   onClick={() => {
              //     navigate("/");
              //   }}
            >
              <img className="w-7 h-7" src={assets.refresh} alt="refresh" />
            </button>

            <button
              className="flex items-center gap-1 text-s px-10 py-2 bg-black text-white rounded-xl"
            //   onClick={() => {
            //     navigate("/newproject");
            //   }}
            >
              Save Changes
            </button>
          </div>
        </div>

        <div className="col-span-4">
          <div className=" p-4 ">
            <div className="overflow-x-auto"></div>
            <table
              className="w-full text-sm text-left border-separate border-spacing-y-2"
              style={{ borderCollapse: "separate" }}
            >
              <thead className="text-xs text-gray-700 uppercase">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Point
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Latitude
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Longitude
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Altitude
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Accuracy
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Timestamp
                  </th>
                  <th scope="col" className="px-10 py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {points.map((point) => (
                  <tr
                    key={point.id}
                    style={{ backgroundColor: "rgba(217,217,217,1)" }}
                  >
                    <td className="px-6 py-4 rounded-l-lg">{`Point ${point.id}`}</td>
                    <td className="px-6 py-4">{point.latitude}</td>
                    <td className="px-6 py-4">{point.longitude}</td>
                    <td className="px-6 py-4">{point.altitude}</td>
                    <td className="px-6 py-4">{point.accuracy}</td>
                    <td className="px-6 py-4">{point.timestamp}</td>

                    <td className="px-6 py-4 rounded-r-lg">
                      <button className="text-white text-xs bg-black hover:text-blue-700 mr-2 px-2 py-1 rounded-lg">
                        Rename
                      </button>
                      <button className="text-white text-xs bg-red-500 hover:text-red-700 px-2 py-1 rounded-lg">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TakenPoints;
