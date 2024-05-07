import { useRouter } from "next/router";
import { useState, useEffect } from "react";

interface Question {
  question_id: string;
  question_content: string;
  answers: string[];
}

interface ConferenceDetail {
  message: string;
  conference_id: string;
  results: Question[];
}

interface ConferenceDetailPageProps {
  conference_id: string | string[];
  userClerkId: string;
  projectId: string;
}

function ConferenceDetailPage({
  conference_id,
  userClerkId,
  projectId,
}: ConferenceDetailPageProps) {
  const [data, setData] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (conference_id && userClerkId && projectId) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const response = await fetch(
            `http://localhost:3001/users/${userClerkId}/projects/${projectId}/conference-records/conference_detail/${conference_id}`
          );
          if (!response.ok) throw new Error("Failed to fetch data");
          const result: ConferenceDetail = await response.json();
          setData(result.results);
        } catch (error: any) {
          // TypeScriptのError Handlingのため型を明示
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [conference_id, userClerkId, projectId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data || data.length === 0) return <div>No data found</div>;

  return (
    <div>
      <h1>記者会見記録</h1>
      {data.map((item, index) => (
        <div key={index}>
          <p>Question: {item.question_content}</p>
          <ul>
            {item.answers.map((answer, idx) => (
              <li key={idx}>{answer}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default ConferenceDetailPage;
