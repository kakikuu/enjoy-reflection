import React, { useEffect, useState } from "react";
import Link from "next/link";

const ConferencePage = ({ user_clerk_id, projectId }) => {
  console.log("user_clerk_id", user_clerk_id);
  console.log("projectId", projectId);
  const [conferenceRecords, setConferenceRecords] = useState([]);

  useEffect(() => {
    const fetchConferenceRecords = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/users/${user_clerk_id}/projects/${projectId}/conference-records`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch conference records");
        }
        const data = await response.json();
        setConferenceRecords(data);
      } catch (error) {
        console.error("Error fetching conference records:", error);
      }
    };

    fetchConferenceRecords();
  }, [user_clerk_id, projectId]);
  const conferenceIds = conferenceRecords.conference_ids || [];
  console.log("conferenceRecords", conferenceIds);
  conferenceIds.map((id: number) => console.log("conference_id", id));

  return (
    <div>
      <h1>Project Page for Project ID: {projectId}</h1>
      {conferenceIds.length > 0 ? (
        <ul>
          {conferenceIds.map((id: number) => (
            <button key={id}>Conference ID: {id}</button>
          ))}
        </ul>
      ) : (
        <p>No conference records found.</p>
      )}
    </div>
  );
};

export default ConferencePage;
