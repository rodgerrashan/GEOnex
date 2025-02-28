import React, { useContext } from 'react';
import { Context } from '../context/Context';

const ConfirmDiscard = () => {

  const { setShowConfirmDiscard } = useContext(Context);

  return (
    <div>
      <div className="bg-white p-6 rounded-lg shadow-lg w-[300px] text-center">
        <h2 className="text-lg font-bold text-red-500">Confirm Action</h2>
        <p className="text-gray-700 mt-2">
          Do you want to discard the last point data? This action cannot be undone.
        </p>

        {/* Displayed Point Name */}
        <div className="mt-3 font-bold text-lg flex items-center justify-center">
          <span className="text-black">⚫ Point 3</span>
        </div>

        {/* Buttons */}
        <div className="mt-4 flex flex-col gap-2">
          {/* Yes, Discard */}
          <button 
            className="border border-red-500 text-red-500 p-2 rounded-md hover:bg-red-500 hover:text-white transition"
            onClick={() => setShowConfirmDiscard(false)}
          >
            Yes, Discard
          </button>

          {/* No, Keep It */}
          <button
            className="border border-black p-2 rounded-md bg-black text-white"
            onClick={() => setShowConfirmDiscard(false)}
          >
            No, Keep It
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDiscard;


