import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const ConferencePage = ({ user_clerk_id, project_id }) => {
  const router = useRouter();
  const [conferenceRecords, setConferenceRecords] = useState([]);

  // 引数で projectId を受け取るように修正
  function clickMoveConference(conference_id: number) {
    console.log("clickMoveConference", project_id);
    // router.push の引数を修正しました
    router.push(`/project/${project_id}/conferenceRecord/${conference_id}`);
  }

  useEffect(() => {
    const fetchConferenceRecords = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/users/${user_clerk_id}/projects/${project_id}/conference-records`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch conference records");
        }
        const data = await response.json();
        setConferenceRecords(data.conference_ids || []); // ここを修正
      } catch (error) {
        console.error("Error fetching conference records:", error);
      }
    };

    fetchConferenceRecords();
  }, [user_clerk_id, project_id]);

  return (
    <div>
      <h1>Project Page for Project ID: {project_id}</h1>
      <ul>
        {conferenceRecords.length > 0 ? (
          conferenceRecords.map((id) => (
            <li key={id}>
              <button onClick={() => clickMoveConference(id)}>
                Conference ID: {id}
              </button>
            </li>
          ))
        ) : (
          <p>No conference records found.</p>
        )}
      </ul>
    </div>
  );
};

export default ConferencePage;
