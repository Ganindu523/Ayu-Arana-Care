// === src/pages/TestReports.jsx ===
import React from 'react';
const reports=[
  {id:1,name:'Blood Test - John',date:'2025-05-14'},
  {id:2,name:'X-ray - Jane',date:'2025-04-30'},
];
export default function TestReports(){
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Test Reports</h2>
      <table className="w-full bg-white border">
        <thead className="bg-gray-100"><tr><th className="p-2 text-left">Report</th><th className="p-2 text-left">Date</th><th className="p-2 text-left">Action</th></tr></thead>
        <tbody>
          {reports.map(r=>(
            <tr key={r.id} className="border-t"><td className="p-2">{r.name}</td><td className="p-2">{r.date}</td><td className="p-2"><button className="bg-blue-600 text-white px-3 py-1 rounded">View</button></td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
