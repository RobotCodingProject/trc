"use strict";

// Select elements
const id = document.querySelector("#id"),
  pw = document.querySelector("#pw"),
  loginBtn = document.querySelector("#button");

loginBtn.addEventListener("click", login);

function login() {

// Event listener for login button
// loginBtn.addEventListener("click", (e) => {
//   e.preventDefault(); // Prevent default form submission

  // Validate input fields
  if (!id.value) return alert("Please enter your ID.");
  if (!pw.value) return alert("Please enter your password.");

  // Prepare login request payload
  const req = {
    id: id.value,
    pw: pw.value,
  };

  // Simulate server request
  fetch("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.success) {
        // Redirect to homepage
        alert("Login successful! Redirecting to homepage...");
        // window.location.href = "/"; // Adjust the URL to your homepage
        location.href = "/";
      } else {
        alert(res.message || "Login failed. Check your credentials.");
      }
    })
    .catch((err) => {
      console.error("Error during login:", err);
      alert("An error occurred. Please try again later.");
    });
}


