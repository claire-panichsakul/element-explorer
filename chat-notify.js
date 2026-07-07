import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { auth, db } from "./firebase-init.js";
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

// Pops up a banner with the newest chat message, on whatever page you're
// looking at. Include this file on any page that should show it:
//   <script type="module" src="./chat-notify.js"></script>

injectStyles();

onAuthStateChanged(auth, (user) => {
  if (!user) return;

  const pageLoadedAt = Date.now();
  let isFirstSnapshot = true;

  const latestMessageQuery = query(collection(db, "chatMessages"), orderBy("timestamp", "desc"), limit(1));

  onSnapshot(latestMessageQuery, (snapshot) => {
    // The first snapshot is just "here's the latest message that already
    // existed" — skip it so you don't get a popup for old messages.
    if (isFirstSnapshot) {
      isFirstSnapshot = false;
      return;
    }
    if (snapshot.empty) return;

    const message = snapshot.docs[0].data();
    if (message.email === user.email) return; // no need to notify yourself
    if (!message.timestamp || message.timestamp.toMillis() < pageLoadedAt) return;

    showNotification(message);
  });
});

function showNotification(message) {
  document.getElementById("chat-notify-banner")?.remove();

  const banner = document.createElement("div");
  banner.id = "chat-notify-banner";

  const sender = document.createElement("div");
  sender.className = "chat-notify-sender";
  sender.textContent = "💬 " + message.email;

  const text = document.createElement("div");
  text.className = "chat-notify-text";
  text.textContent = message.text;

  const closeBtn = document.createElement("button");
  closeBtn.className = "chat-notify-close";
  closeBtn.type = "button";
  closeBtn.setAttribute("aria-label", "Close");
  closeBtn.textContent = "×";
  closeBtn.addEventListener("click", () => banner.remove());

  banner.append(sender, text, closeBtn);
  document.body.appendChild(banner);
}

function injectStyles() {
  const style = document.createElement("style");
  style.textContent = `
    #chat-notify-banner {
      position: fixed;
      top: 24px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 9999;
      background: #26a69a;
      color: white;
      font-family: Arial, sans-serif;
      padding: 22px 56px 22px 26px;
      border-radius: 14px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
      max-width: 90vw;
      min-width: 320px;
    }
    #chat-notify-banner .chat-notify-sender {
      font-size: 15px;
      font-weight: bold;
      margin-bottom: 6px;
      opacity: 0.9;
    }
    #chat-notify-banner .chat-notify-text {
      font-size: 22px;
      font-weight: bold;
      word-wrap: break-word;
    }
    #chat-notify-banner .chat-notify-close {
      position: absolute;
      top: 10px;
      right: 14px;
      background: none;
      border: none;
      color: white;
      font-size: 26px;
      line-height: 1;
      cursor: pointer;
      padding: 0;
    }
  `;
  document.head.appendChild(style);
}
