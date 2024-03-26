// pages/reflectionAndParticipants.tsx
import React, { useEffect, useState } from "react";

// ダミーのAPI URL、適宜実際のAPIエンドポイントに置き換えてください。
const API_BASE_URL = "http://localhost:3001";

const ReflectionAndParticipantsPage = () => {
  const [reflection, setReflection] = useState(null);
  const [participants, setParticipants] = useState([]);

  // 個人反省記事を取得
  const fetchReflection = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/users/${user.id}/projects/${projectId}/reflections`
      );
      const data = await response.json();
      setReflection(data);
    } catch (error) {
      console.error("Failed to fetch reflection:", error);
    }
  };

  // 参加者を取得
  const fetchParticipants = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/your-participants-endpoint`
      );
      const data = await response.json();
      setParticipants(data);
    } catch (error) {
      console.error("Failed to fetch participants:", error);
    }
  };

  useEffect(() => {
    fetchReflection();
    fetchParticipants();
  }, []);

  return (
    <div>
      <h1>個人反省記事</h1>
      {reflection ? (
        <div>
          <h2>{reflection.title}</h2>
          <p>{reflection.content}</p>
        </div>
      ) : (
        <p>記事を読み込み中...</p>
      )}

      <h2>参加者一覧</h2>
      {participants.length > 0 ? (
        <ul>
          {participants.map((participant) => (
            <li key={participant.id}>{participant.name}</li>
          ))}
        </ul>
      ) : (
        <p>参加者を読み込み中...</p>
      )}
    </div>
  );
};

export default ReflectionAndParticipantsPage;
