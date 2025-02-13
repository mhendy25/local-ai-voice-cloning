import { useState, ChangeEvent } from "react";

interface TextProps {
  onTextChange: (text: string) => void;
}

export default function Text({ onTextChange }: TextProps) {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState<string>("");
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === "application/pdf") {
      setFile(droppedFile);
    } else {
      alert("Please upload a valid PDF file.");
    }
  };

  const handleBrowse = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) {
      alert("No file selected.");
      return;
    }
    const browsedFile = files[0];
    console.log("browsedFile", browsedFile);
    if (browsedFile && browsedFile.type.startsWith("application/pdf")) {
      setFile(browsedFile);
      handleStoreDocument(browsedFile);
      handleGetTextfromDocumentAPI(browsedFile);
    } else {
      alert("Please upload a valid PDF file.");
    }
  };

  const handleStoreDocument = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await fetch("http://localhost:8000/upload-document", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };
  const handleGetTextfromDocumentAPI = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/get-text-from-document",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      setText(data.text);
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };
  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    onTextChange(newText); // Pass text up to parent
  };

  const handleCancel = () => {
    setFile(null);
  };
  return (
    <div id="text-container" className="mx-8">
      <h1 className="text-3xl font-bold text-center my-4">
        Text You want to clone your voice over
      </h1>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h2 className="text-xl font-semibold text-center mb-4 py-2 px-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg shadow-md">
            Enter your custom text
          </h2>
          <div>
            <textarea
              className="w-full h-80 text-black p-2 rounded-lg"
              placeholder="Type text here or upload a PDF to load its content..."
              value={text}
              onChange={handleTextChange}
              id="text-area"
            ></textarea>
          </div>
        </div>

        <div id="pdf-viewer">
          <h2 className="text-xl font-semibold text-center mb-4 py-2 px-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg shadow-md">
            PDF Viewer
          </h2>
          <div
            id="drag-and-drop"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="border-2 h-80 p-8 text-center rounded-lg bg-gradient-to-b from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 transition-colors"
          >
            <div className="flex flex-col items-center space-y-4">
              <svg
                className="w-16 h-16 text-gray-400"
                fill="none"
                stroke="#6B7280"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zM14 3.5V9h5.5M9 13h6M9 17h6M9 7h1"
                />
              </svg>

              <div className="space-y-2">
                <p className="text-lg font-medium text-gray-700">
                  Drop your file here
                </p>
                <p className="text-sm text-gray-500">Supported formats: .pdf</p>

                <div className="flex items-center justify-center space-x-2 my-3">
                  <div className="h-px w-12 bg-gray-300"></div>
                  <span className="text-gray-500 text-sm mb-4">OR</span>
                  <div className="h-px w-12 bg-gray-300"></div>
                </div>

                <label className="cursor-pointer flex flex-col items-center">
                  <span className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors w-full text-center">
                    Browse files
                  </span>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleBrowse}
                    className="hidden"
                  />
                </label>

                <button
                  onClick={handleCancel}
                  disabled={!file}
                  className="rounded-full bg-red-500 text-white px-4 py-2 mt-2 disabled:opacity-50 w-full"
                >
                  Cancel
                </button>
                {file && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-500">Selected file:</p>
                    <p className="text-sm text-gray-700">{file.name}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
