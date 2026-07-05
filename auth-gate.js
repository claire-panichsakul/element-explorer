import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { auth } from "./firebase-init.js";

// Shows #main-content only once someone is logged in, and wires up the
// #login-form / #logout-link on the page. Every page that uses this needs
// those same element ids in its HTML.
export function requireLogin(onUser) {
  const loginGate = document.getElementById("login-gate");
  const loginForm = document.getElementById("login-form");
  const loginEmail = document.getElementById("login-email");
  const loginPassword = document.getElementById("login-password");
  const loginHint = document.getElementById("login-hint");
  const mainContent = document.getElementById("main-content");
  const logoutLink = document.getElementById("logout-link");
  const loggedInAs = document.getElementById("logged-in-as");

  onAuthStateChanged(auth, (user) => {
    loginGate.style.display = user ? "none" : "flex";
    mainContent.style.display = user ? "block" : "none";
    if (loggedInAs) loggedInAs.textContent = user ? `Logged in as ${user.email}` : "";
    if (user && onUser) onUser(user);
  });

  let wrongAttempts = 0;

  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    signInWithEmailAndPassword(auth, loginEmail.value.trim(), loginPassword.value)
      .catch(() => {
        wrongAttempts++;
        if (wrongAttempts >= 3) {
          document.body.style.background = "red";
          loginGate.innerHTML = '<div style="font-size: 15vw; font-weight: bold; color: white; text-align: center;">TOO BAD</div>';
          return;
        }
        loginHint.textContent = "Wrong email or password.";
        loginPassword.value = "";
        loginPassword.focus();
      });
  });

  if (logoutLink) {
    logoutLink.addEventListener("click", () => signOut(auth));
  }
}
