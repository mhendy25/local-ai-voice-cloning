import NavBar from "@/components/navbar";
import Voice from "@/components/voice";
import Text from "@/components/text";
import Model from "@/components/model";
import { useState } from "react";
export default function Home() {
  const [sharedText, setSharedText] = useState<string>("");
  return (
    <>
      <NavBar />
      <Voice />
      <Text onTextChange={setSharedText} />
      <Model text={sharedText} />
    </>
  );
}
