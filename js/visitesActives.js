import { getVisitesActives, postSortie } from "./api.js";

const container = document.getElementById("visites-actives");

export async function chargerVisitesActives() {
  try {
    const visites = await getVisitesActives();
    afficherVisitesActives(visites);
  } catch (err) {
    console.error("Erreur chargement visites actives :", err);
    container.innerHTML = "<p>Erreur lors du chargement des visites.</p>";
  }
}

function afficherVisitesActives(visites) {
  container.innerHTML = "";

  if (visites.length === 0) {
    container.innerHTML = "<p>Aucune visite en cours.</p>";
    return;
  }

  visites.forEach((visite) => {
    const carte = creerCarteVisite(visite);
    container.appendChild(carte);
  });
}

function creerCarteVisite(visite) {
  const div = document.createElement("div");
  div.className = "carte-visite";

  const dateEntree = formatDateHeure(visite.date_heure_entree);

  div.innerHTML = `
    <h3>${visite.prenom} ${visite.nom}</h3>
    <p><strong>Email :</strong> ${visite.email}</p>
    <p><strong>Type :</strong> ${visite.type_visite}</p>
    <p><strong>Local :</strong> ${visite.local || "-"}</p>
    <p><strong>Entrée :</strong> ${dateEntree}</p>
    <button>Forcer la sortie</button>
  `;

  div.querySelector("button").addEventListener("click", async () => {
    const ok = confirm(
      `Confirmer la sortie de ${visite.prenom} ${visite.nom} ?`
    );
    if (!ok) return;

    try {
      await postSortie(visite.visiteur_id);
      alert("Sortie enregistrée !");
      chargerVisitesActives(); // recharger après la sortie
    } catch (err) {
      console.error("Erreur forçage sortie :", err);
      alert("Erreur lors de la sortie.");
    }
  });

  return div;
}

function formatDateHeure(iso) {
  if (!iso) return "-";
  const d = new Date(iso);
  return d.toLocaleString("fr-BE", {
    dateStyle: "short",
    timeStyle: "short",
  });
}
