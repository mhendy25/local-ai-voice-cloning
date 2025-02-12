import React, {
  useState,
  ChangeEvent,
  DragEvent,
  useRef,
  useEffect,
} from "react";

export default function NavBar() {
  const [file, setFile] = useState<File | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [volume, setVolume] = useState(0);
  const animationFrameRef = useRef<number>();
  const audioContextRef = useRef<AudioContext>();
  const analyserRef = useRef<AnalyserNode>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const [builtInVoices, setBuiltInVoices] = useState<string[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<{
    name: string;
    type: "upload" | "built-in" | "recording";
    content: File | Blob | string | null;
  } | null>(null);
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    setSelectedVoice(null);
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith("audio/")) {
      setFile(droppedFile);
      setSelectedVoice({
        name: droppedFile.name,
        type: "upload",
        content: droppedFile,
      });
    } else {
      alert("Please upload a valid voice file.");
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
    if (browsedFile && browsedFile.type.startsWith("audio/")) {
      setFile(browsedFile);
      setSelectedVoice({
        name: browsedFile.name,
        type: "upload",
        content: browsedFile,
      });
    } else {
      alert("Please upload a valid voice file.");
    }
  };

  const handleCancel = () => {
    setSelectedVoice(null);
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      analyzeVolume(stream);

      mediaRecorder.ondataavailable = (e) => {
        chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/wav" });
        const url = URL.createObjectURL(blob);
        setAudioURL(url);
        setSelectedVoice({
          name: "audio.wav",
          type: "recording",
          content: blob,
        });
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingDuration(0);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert(
        "Error accessing microphone. Please make sure you have granted permission."
      );
    }
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isRecording) {
      intervalId = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isRecording]);
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setRecordingDuration(0);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    }
  };

  const analyzeVolume = (stream: MediaStream) => {
    audioContextRef.current = new AudioContext();
    analyserRef.current = audioContextRef.current.createAnalyser();
    const source = audioContextRef.current.createMediaStreamSource(stream);
    source.connect(analyserRef.current);

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);

    const updateVolume = () => {
      if (!analyserRef.current) return;

      analyserRef.current.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
      setVolume(average / 128);

      animationFrameRef.current = requestAnimationFrame(updateVolume);
    };

    updateVolume();
  };

  useEffect(() => {
    setBuiltInVoices([
      "Abrahan Mack.wav",
      "Andrew Chipper.wav",
      "Barbora MacLean.wav",
    ]);
  }, []);
  const handleBuiltInVoiceSelect = async (speaker: string) => {
    console.log("the built-in voice string is", speaker);
    setSelectedVoice({
      name: speaker,
      type: "built-in",
      content: speaker,
    });
    const formData = new FormData();
    formData.append("speaker", speaker);
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/built-in-voice-sample",
        {
          method: "POST",
          body: JSON.stringify({ speaker }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload voice");
      }

      const result = await response.json();
      console.log("Upload successful:", result);
    } catch (error) {
      console.error("Error uploading voice:", error);
      alert("Error uploading voice. Please try again.");
    }
  };
  useEffect(() => {
    console.log("selectedVoice updated:", selectedVoice);
  }, [selectedVoice]);
  const uploadVoice = async () => {
    if (!selectedVoice) {
      alert("No voice selected.");
      return;
    }
    console.log("selected voice:", selectedVoice);

    const formData = new FormData();
    if (selectedVoice.content instanceof Blob) {
      // Convert Blob to File if it's not already a File
      const file =
        selectedVoice.content instanceof File
          ? selectedVoice.content
          : new File([selectedVoice.content], selectedVoice.name, {
              type: selectedVoice.content.type || "audio/wav",
            });
      console.log("file", file);
      formData.append("file", file);
    } else if (typeof selectedVoice.content === "string") {
      // Convert string content to File
      const file = new File([selectedVoice.content], selectedVoice.name, {
        type: "audio/wav",
      });
      console.log("file", file);
      formData.append("file", file);
    }

    console.log("the form data is", formData);

    try {
      const response = await fetch("http://127.0.0.1:8000/upload-voice", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload voice");
      }

      const result = await response.json();
      console.log("Upload successful:", result);
    } catch (error) {
      console.error("Error uploading voice:", error);
      alert("Error uploading voice. Please try again.");
    }
  };
  return (
    <div
      id="voice-container"
      className="flex flex-col align-center justify-center mx-8"
    >
      <h1 className="text-3xl font-bold text-center my-4">
        Appreciate Your Voice
      </h1>
      <div className="flex flex-row grid grid-cols-3 mt-1 gap-4">
        <div className="flex flex-col justify-between">
          <h2 className="text-xl font-semibold text-center mb-4 py-2 px-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg shadow-md">
            Upload Voice
          </h2>
          <div
            id="drag-and-drop"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="border-2  p-8 text-center h-full rounded-lg bg-gradient-to-b from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 transition-colors"
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
                  d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                />
              </svg>

              <div className="space-y-2">
                <p className="text-lg font-medium text-gray-700">
                  Drop files here
                </p>
                <p className="text-sm text-gray-500">
                  Supported formats: .mp3, .wav
                </p>

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
                    accept="audio/*"
                    onChange={handleBrowse}
                    className="hidden"
                    ref={fileInputRef}
                  />
                </label>

                <button
                  onClick={handleCancel}
                  disabled={!(selectedVoice?.type === "upload")}
                  className="rounded-full bg-red-500 text-white px-4 py-2 mt-2 disabled:opacity-50 w-full"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          {/* todo */}
          <h2 className="text-xl font-semibold text-center mb-4 py-2 px-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg shadow-md">
            Use Mic
          </h2>
          <div
            id="use-mic"
            className="p-4 text-center flex flex-col items-center bg-gradient-to-b from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 transition-colors w-full h-full rounded-lg"
          >
            <div className="relative w-20 h-32 mb-4">
              <svg
                viewBox="0 0 24 24"
                className="w-full h-full"
                style={{
                  filter: isRecording ? "drop-shadow(0 0 4px #ef4444)" : "none",
                }}
              >
                <path
                  fill="#6B7280"
                  d="M12,2A3,3 0 0,1 15,5V11A3,3 0 0,1 12,14A3,3 0 0,1 9,11V5A3,3 0 0,1 12,2Z"
                />
                <path
                  fill="#6B7280"
                  d="M19,11C19,14.53 16.39,17.44 13,17.93V21H11V17.93C7.61,17.44 5,14.53 5,11H7A5,5 0 0,0 12,16A5,5 0 0,0 17,11H19Z"
                />

                <defs>
                  <mask id="fluid-mask">
                    <rect
                      x="0"
                      y={21 - volume * 19}
                      width="24"
                      height="21"
                      fill="white"
                    />
                  </mask>
                </defs>

                {isRecording && (
                  <g mask="url(#fluid-mask)">
                    <path
                      fill="#ef4444"
                      opacity="0.7"
                      d="M12,2A3,3 0 0,1 15,5V11A3,3 0 0,1 12,14A3,3 0 0,1 9,11V5A3,3 0 0,1 12,2Z"
                    />
                    <path
                      fill="#ef4444"
                      opacity="0.7"
                      d="M19,11C19,14.53 16.39,17.44 13,17.93V21H11V17.93C7.61,17.44 5,14.53 5,11H7A5,5 0 0,0 12,16A5,5 0 0,0 17,11H19Z"
                    />
                  </g>
                )}
              </svg>
            </div>

            {isRecording && (
              <div className="text-red-500 font-mono mb-2">
                {Math.floor(recordingDuration / 60)}:
                {(recordingDuration % 60).toString().padStart(2, "0")}
              </div>
            )}

            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`px-4 py-2 rounded-full ${
                isRecording
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-blue-500 hover:bg-blue-600"
              } text-white transition-colors`}
            >
              {isRecording ? "Stop Recording" : "Start Recording"}
            </button>

            <div className="mt-4">
              <button
                onClick={() => setAudioURL(null)}
                disabled={!audioURL}
                className="rounded-full bg-red-500 text-white px-4 py-2 mt-2 disabled:opacity-50"
              >
                Clear Recording
              </button>
            </div>
            {audioURL && (
              <audio controls src={audioURL} className="w-full mt-4" />
            )}
          </div>
        </div>
        <div className="flex flex-col">
          {/* todo */}

          <h2 className="text-xl font-semibold text-center mb-4 py-2 px-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg shadow-md">
            Try Built-in Voice
          </h2>
          <div
            id="built-in-voices"
            className="flex flex-col space-y-4 p-4 border-dashed border-2 border-gray-400"
          >
            {builtInVoices.map((voice, index) => (
              <div
                key={index}
                className={`flex flex-col p-2 rounded-lg cursor-pointer transition-colors ${
                  selectedVoice?.name === voice
                    ? "bg-blue-100 border-2 border-blue-500"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => handleBuiltInVoiceSelect(voice)}
              >
                <li className="text-sm text-gray-600 mb-2 flex justify-between items-center">
                  <span>{voice}</span>
                  {selectedVoice?.name === voice && (
                    <span className="text-blue-500 text-xs font-medium">
                      Selected
                    </span>
                  )}
                </li>
                <audio
                  controls
                  src={`/built-in-voices/${voice}`}
                  className="w-full"
                />
              </div>
            ))}
            {builtInVoices.length === 0 && (
              <p className="text-gray-500 text-center">
                No built-in voices available
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="mt-8 w-full max-w-md mx-auto">
        <h2 className="text-xl font-semibold text-center mb-4">
          {selectedVoice ? "Selected Voice" : "Select a voice from above"}
        </h2>
        <div className="p-6 bg-white rounded-lg shadow-md">
          {selectedVoice ? (
            <>
              <div className="flex justify-between items-center mb-3">
                <span className="text-gray-700">{selectedVoice.name}</span>
                <div className="flex flex-row justify-center items-center">
                  <button
                    onClick={uploadVoice}
                    disabled={!selectedVoice}
                    className="px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors disabled:opacity-50"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={handleCancel}
                    className="text-red-500 hover:text-red-600"
                  >
                    <div className="flex items-center space-x-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="w-6 h-6 cursor-pointer hover:text-red-800 transition-colors"
                        onClick={handleCancel}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </div>
                  </button>
                </div>
              </div>
              <audio
                controls
                src={
                  selectedVoice.type === "built-in"
                    ? `/built-in-voices/${selectedVoice.content}`
                    : URL.createObjectURL(selectedVoice.content as Blob)
                }
                className="w-full"
              />
            </>
          ) : (
            <p className="text-gray-500 text-center">
              Voice not selected yet...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
