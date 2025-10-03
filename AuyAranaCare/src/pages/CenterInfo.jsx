import React, { useEffect, useState } from "react";
import axios from "axios";

const CenterList = () => {
    const [centers, setCenters] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCenters = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/center");
                setCenters(res.data);
            } catch (err) {
                setError("Error fetching centers. Please try again later.");
            }
        };
        fetchCenters();
    }, []);

    if (error) return <div className="text-center p-6 text-red-600">{error}</div>;

    return (
        <div className="container mx-auto p-6">
            {/* Updated main heading color to match theme */}
            <h1 className="text-4xl font-bold text-center mb-10 text-red-900">Our Care Centers</h1>
            <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {centers.map((center) => (
                    <div key={center._id} className="bg-white p-4 shadow-lg rounded-lg text-center transition-transform transform hover:scale-105">
                        <img
                            src={`http://localhost:5000/uploads/${center.image}`}
                            alt={center.branchName}
                            className="w-full h-48 object-cover rounded-md mb-4"
                        />
                        {/* Updated branch name color to match theme */}
                        <h3 className="text-xl font-semibold text-red-900">{center.branchName}</h3>
                        
                        {/* Display the description */}
                        <p className="text-gray-600 mt-2 text-sm">{center.description}</p>
                        
                        <div className="mt-4 pt-4 border-t">
                             <p className="text-gray-700 font-medium">{center.address}</p>
                             <p className="text-sm text-gray-500 mt-1">{center.email}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CenterList;