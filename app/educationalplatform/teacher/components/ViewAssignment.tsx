"use client";

import { useEffect, useState } from "react";

export default function ViewAssignments() {
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    // Fetch assignments from the backend
    fetch("http://localhost:5000/api/get-assignments")
      .then((res) => res.json())
      .then((data) => setAssignments(data))
      .catch((error) => console.error("Error fetching assignments:", error));
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Student Assignments</h2>
      {assignments.length === 0 ? (
        <p>No assignments available.</p>
      ) : (
        <ul>
          {assignments.map((assignment: any, index) => (
            <li key={index} className="border p-3 mb-2 rounded">
              {assignment.title} - Submitted by {assignment.studentEmail}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
