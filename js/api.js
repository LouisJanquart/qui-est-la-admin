// Visites
const BASE_VISITES = "http://localhost:3000/api/visites";

// Employés
const BASE_EMPLOYES = "http://localhost:3000/api/employes";

// === VISITES ===
export async function getVisitesActives() {
  const res = await fetch(`${BASE_VISITES}/actives`);
  if (!res.ok) throw new Error("Erreur chargement visites actives.");
  return await res.json();
}

export async function postSortie(visiteur_id) {
  const res = await fetch(`${BASE_VISITES}/sortie`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ visiteur_id }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Erreur sortie");
  return data;
}

// === EMPLOYES ===

export async function getEmployes() {
  const res = await fetch(BASE_EMPLOYES);
  if (!res.ok) throw new Error("Erreur chargement employés.");
  return await res.json();
}

export async function createEmploye(employe) {
  const res = await fetch(BASE_EMPLOYES, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(employe),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Erreur création employé");
  return data;
}

export async function updateEmploye(id, employe) {
  const res = await fetch(`${BASE_EMPLOYES}/${id}`, {
    method: "PUT", // ou PATCH si tu préfères
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(employe),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Erreur mise à jour employé");
  return data;
}

export async function deleteEmploye(id) {
  const res = await fetch(`${BASE_EMPLOYES}/${id}`, {
    method: "DELETE",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Erreur suppression employé");
  return data;
}

export async function getFormateurs() {
  const res = await fetch(`${BASE_EMPLOYES}/formateurs`);
  if (!res.ok) throw new Error("Erreur chargement formateurs.");
  return await res.json();
}

// === FORMATIONS ===
const BASE_FORMATIONS = "http://localhost:3000/api/formations";

export async function getFormations() {
  const res = await fetch(BASE_FORMATIONS);
  if (!res.ok) throw new Error("Erreur chargement formations.");
  return await res.json();
}

export async function createFormation(formation) {
  const res = await fetch(BASE_FORMATIONS, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formation),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Erreur création formation");
  return data;
}

export async function updateFormation(id, formation) {
  const res = await fetch(`${BASE_FORMATIONS}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formation),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Erreur mise à jour formation");
  return data;
}

export async function deleteFormation(id) {
  const res = await fetch(`${BASE_FORMATIONS}/${id}`, {
    method: "DELETE",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Erreur suppression formation");
  return data;
}
