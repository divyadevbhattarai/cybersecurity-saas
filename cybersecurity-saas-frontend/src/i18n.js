import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      welcome: "Welcome to CyberShield",
      login: "Sign In",
      register: "Register",
      logout: "Sign Out",
      dashboard: "Dashboard",
      settings: "Settings",
      profile: "Profile",
      loading: "Loading...",
      error: "Error",
      success: "Success",
      cancel: "Cancel",
      save: "Save",
      delete: "Delete",
      confirm: "Confirm",
      search: "Search",
      noResults: "No results found",
    },
  },
  es: {
    translation: {
      welcome: "Bienvenido a CyberShield",
      login: "Iniciar Sesion",
      register: "Registrarse",
      logout: "Cerrar Sesion",
      dashboard: "Panel",
      settings: "Configuracion",
      profile: "Perfil",
      loading: "Cargando...",
      error: "Error",
      success: "Exito",
      cancel: "Cancelar",
      save: "Guardar",
      delete: "Eliminar",
      confirm: "Confirmar",
      search: "Buscar",
      noResults: "No se encontraron resultados",
    },
  },
  fr: {
    translation: {
      welcome: "Bienvenue sur CyberShield",
      login: "Connexion",
      register: "S'inscrire",
      logout: "Deconnexion",
      dashboard: "Tableau de bord",
      settings: "Parametres",
      profile: "Profil",
      loading: "Chargement...",
      error: "Erreur",
      success: "Succes",
      cancel: "Annuler",
      save: "Enregistrer",
      delete: "Supprimer",
      confirm: "Confirmer",
      search: "Rechercher",
      noResults: "Aucun resultat trouve",
    },
  },
  de: {
    translation: {
      welcome: "Willkommen bei CyberShield",
      login: "Anmelden",
      register: "Registrieren",
      logout: "Abmelden",
      dashboard: "Dashboard",
      settings: "Einstellungen",
      profile: "Profil",
      loading: "Laden...",
      error: "Fehler",
      success: "Erfolg",
      cancel: "Abbrechen",
      save: "Speichern",
      delete: "Loschen",
      confirm: "Bestatigen",
      search: "Suchen",
      noResults: "Keine Ergebnisse gefunden",
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem("language") || "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
