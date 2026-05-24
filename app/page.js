"use client";

import { useState, useRef, useEffect } from "react";

export default function Home() {

  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text:
        "Hi 👋 Welcome to AI Support Assistant.\n\nPlease describe your issue and I'll help troubleshoot it."
    }
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }, [messages]);

  async function sendMessage() {

    if (!input.trim() || loading) return;

    const userMessage = {
      sender: "user",
      text: input
    };

    setMessages(prev => [...prev, userMessage]);

    const currentInput = input;

    setInput("");

    setLoading(true);

    try {

      const response = await fetch(
        "YOUR_N8N_WEBHOOK_URL",
        {
          method: "POST",
          headers: {
            "Content-Type":"application/json"
          },
          body: JSON.stringify({
            user:"test-user",
            message:currentInput
          })
        }
      );

      const data = await response.json();

      setMessages(prev => [
        ...prev,
        {
          sender:"bot",
          text:data.reply || "No response received"
        }
      ]);

    } catch(error){

      setMessages(prev=>[
        ...prev,
        {
          sender:"bot",
          text:"❌ Unable to connect to support server"
        }
      ]);

    }

    setLoading(false);

  }

  return (

    <div className="main">

      <div className="chat-container">

        <div className="header">

          <h2>AI Support Assistant</h2>

          <p>Enterprise Troubleshooting Tool</p>

        </div>


        <div className="chat-box">

          {messages.map((msg,index)=>(

            <div
              key={index}
              className={
                msg.sender==="user"
                ? "message user"
                : "message bot"
              }
            >

              {msg.text}

            </div>

          ))}


          {loading && (

            <div className="message bot">

              Typing...

            </div>

          )}

          <div ref={messagesEndRef}></div>

        </div>


        <div className="input-area">

          <input
            type="text"
            placeholder="Describe your issue..."
            value={input}
            onChange={(e)=>setInput(e.target.value)}

            onKeyDown={(e)=>{
              if(e.key==="Enter"){
                sendMessage();
              }
            }}
          />

          <button
            onClick={sendMessage}
          >
            Send
          </button>

        </div>

      </div>

    </div>

  );
}
