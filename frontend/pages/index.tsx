import { useState } from "react";

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [result, setResult] = useState("");

  interface ProcessResponse {
    message: string;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:8000/process", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ item: inputText }),
      });

      const data: ProcessResponse = await response.json();
      setResult(data.message);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Enter text"
        />
        <button type="submit">Submit</button>
      </form>
      {result && <div style={{ marginTop: "1rem" }}>Result: {result}</div>}
    </div>
  );
}
