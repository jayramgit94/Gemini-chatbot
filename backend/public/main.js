document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ Chat page loaded");
  
    const sendBtn = document.getElementById("sendBtn");
    const userInput = document.getElementById("userInput");
    const chatBox = document.getElementById("chat-box");
  
    function appendMessage(sender, message, className) {
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("message", className);
        messageDiv.innerHTML = `<span>${message}</span>`;
        chatBox.appendChild(messageDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    }
  
    function showTypingIndicator() {
        const typingDiv = document.createElement("div");
        typingDiv.classList.add("message", "ai-message", "typing");
        typingDiv.innerHTML = `<span>AI is typing...</span>`;
        chatBox.appendChild(typingDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
        return typingDiv;
    }
  
    sendBtn.addEventListener("click", function () {
        const userMessage = userInput.value.trim();
        if (userMessage === "") return;
  
        appendMessage("You", userMessage, "user-message");
        userInput.value = "";
  
        const typingIndicator = showTypingIndicator();
  
        fetch("/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: userMessage }),
        })
        .then(response => response.json())
        .then(data => {
            chatBox.removeChild(typingIndicator);
            appendMessage("AI", data.reply, "ai-message");
        })
        .catch(error => {
            console.error("❌ Error:", error);
            chatBox.removeChild(typingIndicator);
            appendMessage("AI", "Error connecting to AI service.", "ai-message");
        });
    });
  
    userInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            sendBtn.click();
        }
    });
  });
  