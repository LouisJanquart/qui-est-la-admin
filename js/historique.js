let toutesLesVisites = [];

export async function chargerHistorique() {
  try {
    const res = await fetch(
      "https://qui-est-la-api.onrender.com/api/visites/historique"
    );
    const data = await res.json();
    toutesLesVisites = data;
    afficherFiltres();
    appliquerFiltresEtTris();
    initialiserFiltres();
  } catch (err) {
    console.error("Erreur chargement historique :", err);
  }
}

function afficherVisites(visites) {
  const container = document.getElementById("historique-list");
  container.innerHTML = "";

  if (visites.length === 0) {
    container.innerHTML = "<p>Aucune visite trouvée.</p>";
    return;
  }

  for (const v of visites) {
    const div = document.createElement("div");
    div.className = "carte-visite";
    div.innerHTML = `
      <strong>${v.prenom} ${v.nom}</strong><br>
      📧 ${v.email}<br>
      📍 ${v.local || "-"}<br>
      🏷️ ${v.type_visite}<br>
      🟢 Entrée : ${formatDateHeure(v.entree)}<br>
      🔴 Sortie : ${formatDateHeure(v.sortie)}
    `;
    container.appendChild(div);
  }
}

function formatDateHeure(iso) {
  if (!iso) return "-";
  const d = new Date(iso);
  return d.toLocaleString("fr-BE", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function appliquerFiltresEtTris() {
  let resultats = [...toutesLesVisites];

  const recherche =
    document.getElementById("filtre-texte")?.value.toLowerCase() || "";
  const type = document.getElementById("filtre-type")?.value || "";
  const debutEntree = document.getElementById("filtre-debut")?.value;
  const finEntree = document.getElementById("filtre-fin")?.value;
  const debutSortie = document.getElementById("filtre-sortie-debut")?.value;
  const finSortie = document.getElementById("filtre-sortie-fin")?.value;
  const tri = document.getElementById("filtre-tri")?.value || "";

  if (recherche) {
    resultats = resultats.filter((v) =>
      [v.nom, v.prenom, v.email, v.local]
        .filter(Boolean)
        .some((champ) => champ.toLowerCase().includes(recherche))
    );
  }

  if (type) {
    resultats = resultats.filter((v) => v.type_visite === type);
  }

  if (debutEntree) {
    const date = new Date(debutEntree);
    resultats = resultats.filter((v) => new Date(v.entree) >= date);
  }

  if (finEntree) {
    const date = new Date(finEntree + "T23:59:59");
    resultats = resultats.filter((v) => new Date(v.entree) <= date);
  }

  if (debutSortie) {
    const date = new Date(debutSortie);
    resultats = resultats.filter((v) => v.sortie && new Date(v.sortie) >= date);
  }

  if (finSortie) {
    const date = new Date(finSortie + "T23:59:59");
    resultats = resultats.filter((v) => v.sortie && new Date(v.sortie) <= date);
  }

  resultats.sort((a, b) => {
    switch (tri) {
      case "date_asc":
        return a.entree.localeCompare(b.entree);
      case "date_desc":
        return b.entree.localeCompare(a.entree);
      case "nom_asc":
        return a.nom.localeCompare(b.nom);
      case "nom_desc":
        return b.nom.localeCompare(a.nom);
      default:
        return 0;
    }
  });

  afficherVisites(resultats);
}

function initialiserFiltres() {
  const ids = [
    "filtre-texte",
    "filtre-type",
    "filtre-debut",
    "filtre-fin",
    "filtre-sortie-debut",
    "filtre-sortie-fin",
    "filtre-tri",
  ];

  ids.forEach((id) => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener("input", appliquerFiltresEtTris);
    }
  });

  const reset = document.getElementById("filtre-reset");
  if (reset) {
    reset.addEventListener("click", () => {
      ids.forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.value = "";
      });
      appliquerFiltresEtTris();
    });
  }
}

function afficherFiltres() {
  const section = document.getElementById("historique");
  if (!section.querySelector(".filtres")) {
    const div = document.createElement("div");
    div.className = "filtres";
    div.innerHTML = `
      <input type="search" id="filtre-texte" placeholder="🔎 Rechercher" />
      <select id="filtre-type">
        <option value="">Tous les types</option>
        <option value="personnel">Personnel</option>
        <option value="formation">Formation</option>
      </select>

      <label>
        Entrée du
        <input type="date" id="filtre-debut" />
      </label>
      <label>
        au
        <input type="date" id="filtre-fin" />
      </label>

      <label>
        Sortie du
        <input type="date" id="filtre-sortie-debut" />
      </label>
      <label>
        au
        <input type="date" id="filtre-sortie-fin" />
      </label>

      <select id="filtre-tri">
        <option value="">Tri</option>
        <option value="date_desc">📅 Entrée (récent → ancien)</option>
        <option value="date_asc">📅 Entrée (ancien → récent)</option>
        <option value="nom_asc">🔤 Nom (A → Z)</option>
        <option value="nom_desc">🔤 Nom (Z → A)</option>
      </select>

      <button id="filtre-reset">🔄</button>
    `;
    section.prepend(div);
  }
}
