import { verifierConnexion } from "./auth.js";
import { setupNavigation } from "./navigation.js";
import { chargerVisitesActives } from "./visitesActives.js";
import { chargerHistorique } from "./historique.js";
import { chargerPersonnel } from "./personnel.js";
import { chargerFormations } from "./formations.js";

// Vérifie que l’admin est connecté avant de charger la page
await verifierConnexion();

setupNavigation();

// Vue par défaut = visites actives
chargerVisitesActives();
