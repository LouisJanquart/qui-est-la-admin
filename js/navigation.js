import { chargerHistorique } from "./historique.js";
import { chargerVisitesActives } from "./visitesActives.js";
import { chargerPersonnel } from "./personnel.js";
import { chargerFormations } from "./formations.js";

export function setupNavigation() {
  const boutons = document.querySelectorAll("nav button");

  boutons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const vue = btn.dataset.view;

      document
        .querySelectorAll("main > section")
        .forEach((sec) => sec.classList.add("hidden"));

      const section = document.getElementById(vue);
      section.classList.remove("hidden");

      boutons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      if (vue === "actives") {
        chargerVisitesActives();
      } else if (vue === "historique") {
        chargerHistorique();
      } else if (vue === "personnel") {
        chargerPersonnel();
      } else if (vue === "formations") {
        chargerFormations();
      }
    });
  });
}
