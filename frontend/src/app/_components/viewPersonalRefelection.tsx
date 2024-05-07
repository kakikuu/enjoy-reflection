// 特定の記者会見と結びついている個人反省記事を取得するためのコンポーネント
// → このコンポーネントは、記者会見の詳細ページで使用される

//今は、1つの反省記事に1つの記者会見になっている
import React, { useEffect, useState } from "react";

const PersonalReferencePage = ({
  user_clerk_id,
  project_id,
  conferenceRecordId,
}) => {
  // content のプロパティを持つオブジェクトではなく、適切な初期状態を設定
  const [personalReference, setPersonalReference] = useState({
    title: "",
    content_K: "",
    content_P: "",
    content_T: "",
  });

  useEffect(() => {
    const fetchPersonalReference = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/users/${user_clerk_id}/projects/${project_id}/personal-reflections/personal-reflections-details/${conferenceRecordId}`
        );
        if (!response.ok) {
          throw new Error("Personal Referenceの取得に失敗しました");
        }
        const data = await response.json();
        console.log("Personal Reference data:", data);

        // details 配列の最初の要素を使用して state を更新
        // 応答が配列を含むオブジェクトであると想定しているため、details 配列の最初の要素をセットする
        if (data.details && data.details.length > 0) {
          setPersonalReference(data.details[0]);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchPersonalReference();
  }, [user_clerk_id, project_id, conferenceRecordId]);

  return (
    <div>
      <h1>{personalReference.title}</h1>
      <div>
        <h2>Keep</h2>
        <p>{personalReference.content_K}</p>
      </div>
      <div>
        <h2>Problem</h2>
        <p>{personalReference.content_P}</p>
      </div>
      <div>
        <h2>Try</h2>
        <p>{personalReference.content_T}</p>
      </div>
    </div>
  );
};

export default PersonalReferencePage;
