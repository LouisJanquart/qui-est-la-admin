// formations.js
import {
  getFormateurs,
  getFormations,
  createFormation,
  updateFormation,
  deleteFormation,
} from "./api.js";

const liste = document.getElementById("formations-list");
const form = document.getElementById("ajout-formation-form");
const selectFormateur = form.querySelector("select[name='formateur_id']");

let formateursCache = [];

export async function chargerFormations() {
  try {
    formateursCache = await getFormateurs();
    await chargerListeFormations();
    remplirSelectFormateurs();
  } catch (err) {
    console.error("Erreur chargement formations:", err);
    liste.innerHTML = "<p>Erreur de chargement</p>";
  }
}

function remplirSelectFormateurs() {
  selectFormateur.innerHTML = `<option value="">-- Formateur --</option>`;
  for (const f of formateursCache) {
    const opt = document.createElement("option");
    opt.value = f.id;
    opt.textContent = `${f.prenom} ${f.nom}`;
    selectFormateur.appendChild(opt);
  }
}

async function chargerListeFormations() {
  const formations = await getFormations();
  liste.innerHTML = "";

  for (const f of formations) {
    const div = document.createElement("div");
    div.className = "carte-visite";
    div.dataset.id = f.id;

    div.innerHTML = `
      <p><strong>${f.intitule}</strong></p>
      <p>📆 ${formatDate(f.date_debut)} → ${formatDate(f.date_fin)}</p>
      <p>👨‍🏫 ${f.formateur_prenom || ""} ${f.formateur_nom || ""}</p>
      <p>📍 ${f.local}</p>
      <div class="actions">
        <button class="btn-edit">✏️</button>
        <button class="btn-suppr">❌</button>
      </div>
    `;

    liste.appendChild(div);

    div
      .querySelector(".btn-edit")
      .addEventListener("click", () => activerEdition(div, f));
    div.querySelector(".btn-suppr").addEventListener("click", async () => {
      if (confirm(`Supprimer la formation ${f.intitule} ?`)) {
        await deleteFormation(f.id);
        chargerFormations();
      }
    });
  }
}

function activerEdition(div, f) {
  if (div.dataset.editing === "true") return;
  div.dataset.editing = "true";

  const champs = {
    intitule: f.intitule,
    date_debut: f.date_debut.split("T")[0],
    date_fin: f.date_fin.split("T")[0],
    local: f.local,
  };

  div.innerHTML = `
    <input name="intitule" value="${champs.intitule}" />
    <input type="date" name="date_debut" value="${champs.date_debut}" />
    <input type="date" name="date_fin" value="${champs.date_fin}" />
    <select name="formateur_id"></select>
    <input name="local" value="${champs.local}" />
    <div class="actions"></div>
  `;

  const select = div.querySelector("select[name='formateur_id']");
  remplirSelectFormateursDans(select, f.formateur_id);

  const saveBtn = document.createElement("button");
  saveBtn.textContent = "💾";
  const cancelBtn = document.createElement("button");
  cancelBtn.textContent = "❌";

  div.querySelector(".actions").append(saveBtn, cancelBtn);

  saveBtn.addEventListener("click", async () => {
    const donnees = {
      intitule: div.querySelector("[name='intitule']").value,
      date_debut: div.querySelector("[name='date_debut']").value,
      date_fin: div.querySelector("[name='date_fin']").value,
      local: div.querySelector("[name='local']").value,
      formateur_id: div.querySelector("[name='formateur_id']").value,
    };
    await updateFormation(f.id, donnees);
    chargerFormations();
  });

  cancelBtn.addEventListener("click", () => chargerFormations());
}

function remplirSelectFormateursDans(select, selectedId = null) {
  select.innerHTML = `<option value="">-- Formateur --</option>`;
  for (const f of formateursCache) {
    const opt = document.createElement("option");
    opt.value = f.id;
    opt.textContent = `${f.prenom} ${f.nom}`;
    if (selectedId && parseInt(f.id) === parseInt(selectedId)) {
      opt.selected = true;
    }
    select.appendChild(opt);
  }
}

function formatDate(iso) {
  if (!iso) return "-";
  return new Date(iso).toLocaleDateString("fr-BE", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form));
  await createFormation(data);
  form.reset();
  chargerFormations();
});
