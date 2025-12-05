import React, { createContext, useState } from "react";
import run from "../gemini";

export const datacontext = createContext();

function UserContext({ children }) {
  const [speaking, setSpeaking] = useState(false);
  const [prompt, setPrompt] = useState("listening...");
  const [response, setResponse] = useState(false);

  // TEXT SPEAKER with auto language detection
  function speak(text) {
    let text_speak = new SpeechSynthesisUtterance(text);
    text_speak.volume = 1;
    text_speak.rate = 1;
    text_speak.pitch = 1;

    // Auto detect Hindi if text contains Hindi characters
    const hindiPattern = /[\u0900-\u097F]/;
    if (hindiPattern.test(text)) {
      text_speak.lang = "hi-IN";
    } else {
      text_speak.lang = "en-US";
    }

    window.speechSynthesis.speak(text_speak);
    setSpeaking(true);
  }

  // PERSONALIZE AI RESPONSE
  function personalizeAnswer(text) {
    if (
      text.toLowerCase().includes("who created you") ||
      text.toLowerCase().includes("who built you") ||
      text.toLowerCase().includes("who made you")
    ) {
      return "I was created by Prince Turkar.";
    }
    return text.replace(/google/gi, "Prince Turkar");
  }

  // GEMINI AI RESPONSE
  async function aiResponse(prompt) {
    let text = await run(prompt);
    let newText = personalizeAnswer(text);

    setPrompt(newText);
    speak(newText);
    setResponse(true);

    setTimeout(() => setSpeaking(false), 5000);
  }

  // SPEECH RECOGNITION
  let speechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  let recognition = new speechRecognition();

  recognition.onresult = (e) => {
    let index = e.resultIndex;
    let transcript = e.results[index][0].transcript;
    console.log("Heard:", transcript);

    setPrompt(transcript);
    takeCommand(transcript.toLowerCase());
  };

  // PREDEFINED KNOWLEDGE
  function predefinedKnowledge(command) {
    // TECH DEFINITIONS
    if (command.includes("html")) {
      return "HTML is the standard markup language used to structure content on the web.";
    }
    if (command.includes("css")) {
      return "CSS is used to style and design web pages including layout, colors, and fonts.";
    }
    if (command.includes("javascript") || command.includes("js")) {
      return "JavaScript is a programming language used to add interactivity and logic to websites.";
    }
    if (command.includes("react")) {
      return "React is a JavaScript library for building fast and dynamic user interfaces.";
    }
    if (command.includes("node")) {
      return "Node.js is a runtime that lets JavaScript run outside the browser.";
    }
    if (command.includes("mongodb") || command.includes("mongo")) {
      return "MongoDB is a NoSQL database used to store flexible JSON-like documents.";
    }

    // CRICKET ANSWERS
    if (command.includes("virat")) {
      return "Virat Kohli is known as King Kohli, one of the greatest batsmen in modern cricket.";
    }
    if (command.includes("rohit")) {
      return "Rohit Sharma is known as Hitman, famous for multiple ODI double centuries.";
    }
    if (command.includes("dhoni") || command.includes("ms dhoni")) {
      return "MS Dhoni is called Captain Cool, one of the most successful captains in cricket history.";
    }

    // HINDI – WHO MADE YOU
    if (
      command.includes("kisne banaya") ||
      command.includes("tumhe kisne") ||
      command.includes("tumko kisne")
    ) {
      return "Mujhe Prince Turkar ne banaya hai.";
    }

    return null;
  }

  // COMMAND HANDLER
  function takeCommand(command) {
    console.log("Command:", command);

    // OPEN WEBSITES
    if (command.includes("open") && command.includes("youtube")) {
      window.open("https://www.youtube.com/", "_blank");
      speak("Opening YouTube");
      setPrompt("Opening YouTube...");
    } else if (command.includes("open") && command.includes("google")) {
      window.open("https://www.google.com/", "_blank");
      speak("Opening Google");
      setPrompt("Opening Google...");
    } else if (command.includes("open") && command.includes("instagram")) {
      window.open("https://www.instagram.com/", "_blank");
      speak("Opening Instagram");
      setPrompt("Opening Instagram...");
    }

    // TIME
    else if (command.includes("time")) {
      let time = new Date().toLocaleString(undefined, {
        hour: "numeric",
        minute: "numeric",
      });
      speak(time);
      setPrompt(time);
    }

    // DATE
    else if (command.includes("date")) {
      let date = new Date().toLocaleString(undefined, {
        day: "numeric",
        month: "short",
      });
      speak(date);
      setPrompt(date);
    }

    // WHO MADE YOU (ENGLISH)
    else if (
      command.includes("who built you") ||
      command.includes("who created you") ||
      command.includes("who made you")
    ) {
      let ans = "I was created by Prince Turkar.";
      speak(ans);
      setPrompt(ans);
    }

    // PREDEFINED KNOWLEDGE CHECK
    else {
      let localAnswer = predefinedKnowledge(command);

      if (localAnswer) {
        speak(localAnswer);
        setPrompt(localAnswer);
      } else {
        aiResponse(command);
      }
    }

    setResponse(true);
    setTimeout(() => setSpeaking(false), 5000);
  }

  const value = {
    recognition,
    speaking,
    setSpeaking,
    prompt,
    setPrompt,
    response,
    setResponse,
  };

  return (
    <datacontext.Provider value={value}>
      {children}
    </datacontext.Provider>
  );
}

export default UserContext;
