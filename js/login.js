// public/js/login.js
const form = document.getElementById("login-form");
const erreur = document.getElementById("erreur");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form));

  try {
    const res = await fetch("https://qui-est-la-api.onrender.com/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // 🔑 envoie le cookie session
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) {
      erreur.textContent = result.error || "Erreur inconnue";
      erreur.classList.remove("hidden");
      return;
    }

    // ✅ Connexion OK → rediriger vers l'admin
    window.location.href = "index.html";
  } catch (err) {
    erreur.textContent = "Erreur réseau";
    erreur.classList.remove("hidden");
  }
});
