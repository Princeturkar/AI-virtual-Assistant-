import React, { createContext, useState } from "react";
import run from "../gemini";

export const datacontext = createContext();

function UserContext({ children }) {
const [speaking, setSpeaking] = useState(false);
const [prompt, setPrompt] = useState("listening...");
const [response, setResponse] = useState(false);

// Text Speaker
function speak(text) {
let text_speak = new SpeechSynthesisUtterance(text);
text_speak.volume = 1;
text_speak.rate = 1;
text_speak.pitch = 1;
text_speak.lang = "hi-GB";
window.speechSynthesis.speak(text_speak);
}

// Personalize AI Response
function personalizeAnswer(text) {
if (
text.toLowerCase().includes("who created you") ||
text.toLowerCase().includes("who built you") ||
text.toLowerCase().includes("who made you")
) {
return "I was created by Prince Turkar.";
}

```
return text.replace(/google/gi, "Prince Turkar");
```

}

// AI Response
async function aiResponse(prompt) {
let text = await run(prompt);
let newText = personalizeAnswer(text);

```
setPrompt(newText);
speak(newText);
setResponse(true);

setTimeout(() => setSpeaking(false), 5000);
```

}

// Speech Recognition
let speechRecognition =
window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = new speechRecognition();

recognition.onresult = (e) => {
let index = e.resultIndex;
let transcript = e.results[index][0].transcript;
setPrompt(transcript);
takeCommand(transcript.toLowerCase());
};

// Predefined Library
function predefinedKnowledge(command) {
// TECH DEFINITIONS
if (command.includes("what is javascript")) {
return "JavaScript is a programming language used to add logic and interactivity to websites.";
}
if (command.includes("what is react")) {
return "React is a JavaScript library for building fast and dynamic user interfaces.";
}
if (command.includes("what is html")) {
return "HTML is the standard markup language used to structure content on the web.";
}
if (command.includes("what is css")) {
return "CSS is used to style and design web pages including layout, colors, and fonts.";
}
if (command.includes("what is node")) {
return "Node.js is a runtime that lets JavaScript run outside the browser.";
}
if (command.includes("what is mongodb")) {
return "MongoDB is a NoSQL database that stores data in JSON-like documents.";
}

```
// CRICKET ANSWERS
if (command.includes("who is virat")) {
  return "Virat Kohli is known as King Kohli, one of the greatest modern batsmen in cricket.";
}
if (command.includes("who is rohit")) {
  return "Rohit Sharma is called Hitman, famous for multiple ODI double centuries.";
}
if (command.includes("who is ms dhoni") || command.includes("who is mahendra singh dhoni")) {
  return "MS Dhoni is known as Captain Cool, one of the most successful captains in cricket history.";
}

// HINDI – WHO MADE YOU
if (
  command.includes("tumhe kisne banaya") ||
  command.includes("tumko kisne banaya") ||
  command.includes("kisne banaya")
) {
  return "Mujhe Prince Turkar ne banaya hai.";
}

return null;
```

}

// Command Handler
function takeCommand(command) {
// OPEN WEBSITES
if (command.includes("open") && command.includes("youtube")) {
window.open("[https://www.youtube.com/](https://www.youtube.com/)", "_blank");
speak("Opening YouTube");
setPrompt("Opening YouTube...");
} else if (command.includes("open") && command.includes("google")) {
window.open("[https://www.google.com/](https://www.google.com/)", "_blank");
speak("Opening Google");
setPrompt("Opening Google...");
} else if (command.includes("open") && command.includes("instagram")) {
window.open("[https://www.instagram.com/](https://www.instagram.com/)", "_blank");
speak("Opening Instagram");
setPrompt("Opening Instagram...");
}

```
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

// ENGLISH – WHO MADE YOU
else if (
  command.includes("who built you") ||
  command.includes("who created you") ||
  command.includes("who made you")
) {
  let ans = "I was created by Prince Turkar.";
  speak(ans);
  setPrompt(ans);
}

// CHECK PREDEFINED LIBRARY
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
```

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
