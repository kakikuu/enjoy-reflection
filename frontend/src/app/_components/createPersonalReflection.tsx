import React, { useState } from "react";
import { useRouter } from "next/navigation";

// Propsの型定義
interface ReflectionFormProps {
  user_clerk_id: string;
  project_id: string | string[];
}

const ReflectionForm: React.FC<ReflectionFormProps> = ({
  user_clerk_id,
  project_id,
}) => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [keep, setKeep] = useState("");
  const [problems, setProblems] = useState("");
  const [tryNext, setTryNext] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    const reflection = {
      reflection_title: title,
      reflection_content_K: keep,
      reflection_content_P: problems,
      reflection_content_T: tryNext,
    };

    console.log("reflection", reflection);
    console.log("user_clerk_id", user_clerk_id);
    console.log("project_id", project_id);

    const endpoint = `http://localhost:3001/users/${user_clerk_id}/projects/${project_id}/personal-reflections`;

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reflection),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("Successfully submitted:", result);
      // 送信成功後の処理（例: フォームをクリアする、成功メッセージを表示する等）
      router.push(`/project/${project_id}`);
    } catch (error) {
      console.error("Submission failed:", error);
      // 送信失敗時の処理
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="title">反省タイトル:</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="keep">Keep（続けたいこと）:</label>
        <input
          id="keep"
          type="text"
          value={keep}
          onChange={(e) => setKeep(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="problems">Problems（問題点）:</label>
        <input
          id="problems"
          type="text"
          value={problems}
          onChange={(e) => setProblems(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="tryNext">Try（試したいこと）:</label>
        <input
          id="tryNext"
          type="text"
          value={tryNext}
          onChange={(e) => setTryNext(e.target.value)}
        />
      </div>
      <button type="submit">送信</button>
    </form>
  );
};

export default ReflectionForm;
