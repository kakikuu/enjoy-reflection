"use client";
import React, { useState, useEffect } from "react";

const WebSocketComponent: React.FC = () => {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [inputText, setInputText] = useState("");

  // ユーザー、プロジェクト、カンファレンスレコードのID（仮設定）
  const user_id = 1;
  const projectId = 23;
  const conferenceRecordId = "2";

  useEffect(() => {
    const websocket = new WebSocket("ws://localhost:3001");

    websocket.onopen = () => {
      console.log("WebSocketサーバーに接続しました");
      setWs(websocket); // 接続が開かれた後にwsを設定
    };

    websocket.onmessage = (event) => {
      console.log("メッセージを受信しました:", event.data);
      // サーバーから受け取ったデータを解析
      const message = JSON.parse(event.data);
      console.log("サーバーからのメッセージ:", message);

      // 受け取ったメッセージを状態に追加
      setMessages((prevMessages) => [...prevMessages, message]);
      console.log("受信メッセージ:", messages);
    };

    websocket.onclose = () => {
      console.log("WebSocketサーバーから切断されました");
      setWs(null); // 接続が閉じられたらwsをnullに設定
    };

    websocket.onerror = (error) => {
      console.error("WebSocketエラー:", error);
      setWs(null); // エラーが発生したらwsをnullに設定
    };

    return () => {
      websocket.close();
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  // エンドポイントにデータを送信する関数
  const sendDataToEndpoint = async (data: string) => {
    const endpoint = `/users/${user_id}/projects/${projectId}/conference-records/${conferenceRecordId}/questions`;
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
    } catch (error) {
      console.error("送信エラー:", error);
    }
  };

  const handleSendClick = () => {
    console.log("メッセージを送信します:", inputText);
    sendDataToEndpoint(inputText);
    setInputText(""); // テキスト入力をクリア
  };

  return (
    <div>
      <h2>WebSocket通信デモ</h2>
      <input type="text" value={inputText} onChange={handleInputChange} />
      <button onClick={handleSendClick}>送信</button>
      <div>
        <h3>受信メッセージ:</h3>
        <ul>
          {messages.map((message, index) => (
            <li key={index}>{JSON.stringify(message)}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default WebSocketComponent;
