
import React, { useState } from "react";

export default function App() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState(null);

  const submit = async () => {
    const data = input.split(",");
    const res = await fetch("https://full-stack-bajaj-0rvo.onrender.com/bfhl", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ data })
    });
    const json = await res.json();
    setOutput(json);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>BFHL Tree Builder</h2>
      <textarea rows="5" cols="40" onChange={e => setInput(e.target.value)} />
      <br /><br />
      <button onClick={submit}>Submit</button>
      <pre>{JSON.stringify(output, null, 2)}</pre>
    </div>
  );
}
