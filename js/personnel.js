// personnel.js
import {
  getEmployes,
  createEmploye,
  updateEmploye,
  deleteEmploye,
} from "./api.js";

const list = document.getElementById("personnel-list");
const form = document.getElementById("ajout-employe-form");

export async function chargerPersonnel() {
  try {
    const data = await getEmployes();
    afficherEmployes(data);
  } catch (err) {
    console.error("Erreur chargement personnel:", err);
    list.innerHTML = "<p>Erreur de chargement</p>";
  }
}

function afficherEmployes(employes) {
  list.innerHTML = "";

  for (const e of employes) {
    const div = document.createElement("div");
    div.className = "carte-visite";
    div.dataset.id = e.id;

    div.innerHTML = `
      <p><strong>${e.prenom} ${e.nom}</strong></p>
      <p>Email: <span class="champ" data-champ="email">${e.email}</span></p>
      <p>Tél: <span class="champ" data-champ="telephone">${e.telephone}</span></p>
      <p>Fonction: <span class="champ" data-champ="fonction">${e.fonction}</span></p>
      <p>Local: <span class="champ" data-champ="local">${e.local}</span></p>
      <div class="actions">
        <button class="btn-edit">✏️</button>
        <button class="btn-suppr">❌</button>
      </div>
    `;

    list.appendChild(div);

    div
      .querySelector(".btn-edit")
      .addEventListener("click", () => activerEdition(div, e));

    div.querySelector(".btn-suppr").addEventListener("click", async () => {
      if (confirm(`Supprimer ${e.prenom} ${e.nom} ?`)) {
        await deleteEmploye(e.id);
        chargerPersonnel();
      }
    });
  }
}

function activerEdition(div, e) {
  // Éviter les éditions multiples
  if (div.dataset.editing === "true") return;
  div.dataset.editing = "true";

  const inputs = {};
  div.querySelectorAll(".champ").forEach((el) => {
    const champ = el.dataset.champ;
    let input;

    if (champ === "fonction") {
      input = document.createElement("select");
      input.name = champ;

      const options = ["formateur", "administratif"];
      options.forEach((val) => {
        const opt = document.createElement("option");
        opt.value = val;
        opt.textContent = val.charAt(0).toUpperCase() + val.slice(1);
        if (val === e[champ]) opt.selected = true;
        input.appendChild(opt);
      });
    } else {
      input = document.createElement("input");
      input.name = champ;
      input.value = e[champ];
      input.placeholder = champ;
    }

    el.replaceWith(input);
    inputs[champ] = input;
  });

  const actions = div.querySelector(".actions");
  actions.innerHTML = ""; // Vider les anciens boutons

  const saveBtn = document.createElement("button");
  saveBtn.textContent = "💾";
  saveBtn.classList.add("save");

  const cancelBtn = document.createElement("button");
  cancelBtn.textContent = "❌";
  cancelBtn.classList.add("cancel");

  actions.appendChild(saveBtn);
  actions.appendChild(cancelBtn);

  saveBtn.addEventListener("click", async () => {
    const donnees = {
      prenom: e.prenom,
      nom: e.nom,
      email: inputs.email.value,
      telephone: inputs.telephone.value,
      fonction: inputs.fonction.value,
      local: inputs.local.value,
    };
    await updateEmploye(e.id, donnees);
    chargerPersonnel();
  });

  cancelBtn.addEventListener("click", () => {
    chargerPersonnel();
  });
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form));
  await createEmploye(data);
  form.reset();
  chargerPersonnel();
});
