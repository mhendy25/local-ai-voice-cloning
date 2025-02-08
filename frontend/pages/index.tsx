import { useState } from "react";
import NavBar from "@/components/navbar";

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [result, setResult] = useState("");

  // interface ProcessResponse {
  //   voice: AudioData;
  // }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/clone-voice-from-text",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: inputText }),
        }
      );

      if (response.ok) {
        const blob = await response.blob();
        const audioUrl = URL.createObjectURL(blob);
        setResult(audioUrl);
      } else {
        console.error("Failed to get audio");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <NavBar />
      <div style={{ padding: "2rem" }}>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter text"
          />
          <button className="primary" type="submit">
            Submit
          </button>
        </form>
        {result && <audio controls src={result}></audio>}
      </div>
    </>
  );
}
