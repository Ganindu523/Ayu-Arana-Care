// C:\Users\ASUS\Desktop\ayu arana care\test-app\test-app\test-app\frontend\src\components\CenterList.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";

const CenterList = () => {
  const [centers, setCenters] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCenters = async () => {
      try {
        // *** FIX: Corrected API URL to remove /auth/ ***
        const res = await axios.get("http://localhost:5000/api/center"); // <--- CHANGE THIS LINE
        setCenters(res.data);
      } catch (err) {
        console.error('Error fetching centers:', err);
        setError("Error fetching centers. Please try again later.");
        alert("Error fetching centers");
      }
    };
    fetchCenters();
  }, []);

  if (error) {
    return (
      <div className="text-center p-6 text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 p-6">
      {centers.map((center, index) => (
        <div key={center._id || index} className="bg-white p-4 shadow rounded text-center">
          <img
            src={`http://localhost:5000/uploads/${center.image}`}
            alt={center.branchName}
            className="w-full h-40 object-cover rounded mb-3"
          />
          <h3 className="text-xl font-semibold text-blue-800">{center.branchName}</h3>
          <p className="text-gray-700">{center.address}</p>
          <p className="text-sm text-gray-500">{center.email}</p>
        </div>
      ))}
    </div>
  );
};

export default CenterList;