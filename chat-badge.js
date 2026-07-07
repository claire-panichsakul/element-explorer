import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { auth, db } from "./firebase-init.js";
import {
  doc,
  getDoc,
  collection,
  query,
  orderBy,
  limit,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

// Shows a red "X unread" badge on #chat-link, counting messages from
// other players sent since this player last opened chat.html.
// Only include this on pages that have a #chat-link element.

const MAX_MESSAGES = 50; // matches the cap in chat.html

onAuthStateChanged(auth, async (user) => {
  if (!user) return;

  const readStateSnap = await getDoc(doc(db, "chatReadState", user.uid));
  const lastReadAt = readStateSnap.exists() ? readStateSnap.data().lastReadAt : null;

  const recentMessagesQuery = query(collection(db, "chatMessages"), orderBy("timestamp", "desc"), limit(MAX_MESSAGES));

  onSnapshot(recentMessagesQuery, (snapshot) => {
    const unreadCount = snapshot.docs.filter((docSnap) => {
      const message = docSnap.data();
      if (message.email === user.email) return false; // never counts your own messages
      if (!lastReadAt) return true; // never opened chat before — everything's unread
      return message.timestamp && message.timestamp.toMillis() > lastReadAt.toMillis();
    }).length;

    showBadge(unreadCount);
  });
});

function showBadge(count) {
  const chatLink = document.getElementById("chat-link");
  if (!chatLink) return;

  let badge = document.getElementById("chat-unread-badge");

  if (count <= 0) {
    badge?.remove();
    return;
  }

  if (!badge) {
    badge = document.createElement("span");
    badge.id = "chat-unread-badge";
    chatLink.appendChild(badge);
  }
  badge.textContent = count > 9 ? "9+" : String(count);
}
