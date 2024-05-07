"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // next/navigationからではなくnext/routerを使用
import { useUser } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import PersonalReferencePage from "@/app/_components/viewPersonalRefelectionDetail";

export default function ConferenceRecordPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useUser();

  const [ws, setWs] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [answerText, setAnswerText] = useState("");
  const [showAnswerForm, setShowAnswerForm] = useState(false);
  const [selectedQuestionId, setSelectedQuestionId] = useState("");
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);

  // URLパラメーターからプロジェクトIDとカンファレンスレコードIDを取得
  const projectId = params.projectId;
  const conferenceRecordId = params.conferenceRecordId;
  const personal_reflection_id = params.personal_reflection_id;

  useEffect(() => {
    const websocket = new WebSocket("ws://localhost:3001");

    websocket.onopen = () => {
      console.log("WebSocketサーバーに接続しました");
      setWs(websocket);
    };

    websocket.onmessage = (event) => {
      console.log("メッセージを受信しました:", event.data);
      const data = JSON.parse(event.data);
      // データが質問の場合
      if (data.table === "questions") {
        setQuestions((prevQuestions) => [...prevQuestions, data.new]);
      }
      // データが回答の場合
      else if (data.table === "answers") {
        setAnswers((prevAnswers) => [...prevAnswers, data.new]);
      }
    };

    websocket.onclose = () => {
      console.log("WebSocketサーバーから切断されました");
      setWs(null);
    };

    websocket.onerror = (error) => {
      console.error("WebSocketエラー:", error);
      setWs(null);
    };

    return () => {
      websocket.close();
    };
  }, []);

  // テキスト入力のハンドラー
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setInputText(e.target.value);
  const handleAnswerChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setAnswerText(e.target.value);

  const handleSendQuestion = () => {
    console.log("メッセージを送信します:", inputText);
    sendDataToEndpoint(inputText);
    setInputText(""); // テキスト入力をクリア
  };

  const handleAnswerSubmit = () => {
    console.log("回答を送信します:", answerText);
    sendAnswerEndpoint(selectedQuestionId, answerText);
    setAnswerText(""); // テキスト入力をクリア
  };

  // エンドポイントにデータを送信する関数
  const sendDataToEndpoint = async (data: string) => {
    const endpoint = `/users/${user.id}/projects/${projectId}/conference-records/${conferenceRecordId}/questions`;
    const fullUrl = `http://localhost:3001${endpoint}`;
    try {
      const response = await fetch(fullUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question_content: data }),
      });
      const responseData = await response.json();
      console.log("サーバーからの応答:", responseData);

      if (responseData && responseData.data[0].question_id) {
        setSelectedQuestionId(responseData.data[0].question_id);
        setShowAnswerForm(true); // 回答フォームを表示
      }
    } catch (error) {
      console.error("送信エラー:", error);
    }
  };

  const sendAnswerEndpoint = async (questionId, answerText) => {
    const endpoint = `http://localhost:3001/users/${user.id}/projects/${projectId}/conference-records/${conferenceRecordId}/questions/${questionId}/answers`;
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answer_content: answerText }),
      });
      if (!response.ok) throw new Error("Failed to submit answer");
      setAnswerText(""); // Clear the answer input after sending
      setShowAnswerForm(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <button onClick={() => router.push(`/project/${projectId}`)}>
        プロジェクトページに戻る
      </button>
      <h1>カンファレンスレコードページ</h1>
      {user ? (
        <>
          <PersonalReferencePage
            user_clerk_id={user.id}
            project_id={projectId}
            personal_reflection_id={personal_reflection_id}
          />
          <div>
            <input
              type="text"
              placeholder="質問を入力"
              value={inputText}
              onChange={handleInputChange}
            />
            <button onClick={handleSendQuestion}>質問を送信</button>
          </div>
          {questions.map((question, index) => (
            <div key={index}>
              <p>質問: {question.content}</p>
              {/* 回答を探して表示する */}
              {answers
                .filter((answer) => answer.question_id === question.question_id)
                .map((answer, answerIndex) => (
                  <p key={answerIndex}>回答: {answer.content}</p>
                ))}
              {!answers.find(
                (answer) => answer.question_id === question.question_id
              ) && (
                <button
                  onClick={() => {
                    setSelectedQuestionId(question.question_id); // 選択された質問IDをセット
                    setShowAnswerForm(true); // 回答フォームを表示
                  }}
                >
                  回答する
                </button>
              )}
            </div>
          ))}
          {showAnswerForm && selectedQuestionId && (
            <div>
              <h3>回答フォーム</h3>
              <input
                type="text"
                placeholder="回答を入力"
                value={answerText}
                onChange={handleAnswerChange}
              />
              <button onClick={() => handleAnswerSubmit(selectedQuestionId)}>
                回答を送信
              </button>
            </div>
          )}
        </>
      ) : (
        <p>このページを表示するにはログインしてください。</p>
      )}
    </div>
  );
}
