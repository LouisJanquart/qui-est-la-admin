// auth.js
export async function verifierConnexion() {
  try {
    const res = await fetch("http://localhost:3000/api/login/me", {
      credentials: "include", // 🔑 Nécessaire pour la session
    });

    if (!res.ok) {
      window.location.href = "login.html"; // Redirige vers la page de login si non connecté
    }
  } catch (err) {
    window.location.href = "login.html"; // Redirige aussi en cas d'erreur réseau
  }
}
