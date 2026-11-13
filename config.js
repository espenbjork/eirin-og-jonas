// ============================================================
// KONFIGURASJON – Eirin & Jonas bryllupsbackdrop
// ============================================================
// Lim inn URL-en du får når du deployer Apps Script som web-app
// (se README.md, steg 1). Den ser slik ut:
// https://script.google.com/macros/s/XXXXX/exec
// Apps Script-utrullingen ble arkivert 13.11.2026, og innsendingen er stengt.
const SCRIPT_URL = "";

const CONFIG = {
  brud: "Eirin",
  brudgom: "Jonas",
  dato: "11. juli 2026",
  // Hvor ofte skjermen ser etter nye meldinger (millisekunder)
  pollInterval: 3000,
  // Minste tid mellom hver melding som slippes på skjermen,
  // så en byge av meldinger ikke roter til skjermen
  minMsBetweenMessages: 2600,
  // Maks tegn i en melding (håndheves også i backend)
  maxLength: 200,
};
