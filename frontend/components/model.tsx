import { useState } from "react";

export default function Model() {
  const [outputVoice, setOutputVoice] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>("");
  const sendTextAndModelToAPI = async () => {
    const textArea = document.getElementById(
      "text-area"
    ) as HTMLTextAreaElement;
    const text = textArea.value;

    if (selectedModel) {
      const response = await fetch(
        "http://127.0.0.1:8000/clone-voice-from-text",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ model: selectedModel, text }),
        }
      );
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        setOutputVoice(url);
        console.log("Success:", url);
      } else {
        console.error("Error:", response.statusText);
      }
    } else {
      alert("Please select a model.");
    }
  };
  return (
    <div id="model-container" className="mt-6 mx-8">
      <h2 className="text-xl font-semibold text-center mb-4 py-2 px-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg shadow-md">
        Choose a model
      </h2>
      <div className="overflow-x-auto">
        <table className="table-auto border-collapse border border-gray-300 w-full  bg-gradient-to-b from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 transition-colors text-black">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-center">
                Model Name
              </th>
              <th className="border border-gray-300 px-4 py-2 text-center">
                Estimate Cloning Time
              </th>
              <th className="border border-gray-300 px-4 py-2 text-center">
                Quality
              </th>
              <th className="border border-gray-300 px-4 py-2 text-center">
                Select
              </th>
            </tr>
          </thead>
          <tbody>
            {/* Sample Row */}
            <tr>
              <td className="border border-gray-300 px-4 py-2 text-center">
                text-to-speech
              </td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                2 minutes
              </td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                medium
              </td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                <input
                  type="radio"
                  name="model"
                  value="text-to-speech"
                  onChange={(e) => setSelectedModel(e.target.value)}
                  checked={selectedModel === "text-to-speech"}
                />
              </td>
            </tr>

            {/* Add more rows as needed */}
          </tbody>
        </table>
      </div>
      {/* write a button to send the text and model name to the api */}

      <div className="flex justify-center mt-4">
        <button
          onClick={sendTextAndModelToAPI}
          className="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={!selectedModel}
        >
          Get your beautiful voice
        </button>
      </div>
      <div className="flex justify-center my-4">
        <div className="p-6 bg-white rounded-lg shadow-md w-full max-w-md">
          {outputVoice ? (
            <div>
              <h2>Output Voice</h2>
              <audio controls>
                <source src={outputVoice} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>
          ) : (
            <p className="text-gray-500 text-center">No voice generated yet.</p>
          )}
        </div>
      </div>
      {outputVoice && (
        <div className="mt-4">
          <h2>Output Voice</h2>
          <audio controls>
            <source src={outputVoice} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
    </div>
  );
}
