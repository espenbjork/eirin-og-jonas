/**
 * Eirin & Jonas – bryllupsbackdrop, backend
 * ==========================================
 * Kjøres som Google Apps Script web-app.
 *
 * OPPSETT (én gang, se README.md):
 *   1. Gå til script.google.com → Nytt prosjekt → lim inn denne filen
 *   2. Kjør funksjonen `setup` én gang (godkjenn tilgangene)
 *   3. Deploy → New deployment → Web app:
 *        - Execute as: Me
 *        - Who has access: Anyone
 *   4. Kopier web-app-URL-en inn i config.js (SCRIPT_URL)
 *
 * ETTER BRYLLUPET:
 *   Kjør funksjonen `lagGjesteboken` – da genereres et pent
 *   Google-dokument med alle hilsener, klart til brudeparet.
 */

var ARK_NAVN = "Hilsener";
var MAKS_LENGDE = 200;

// Enkelt ordfilter – meldinger som inneholder disse ordene avvises.
// Juster gjerne listen selv.
var BLOKKERTE_ORD = [
  "faen", "helvete", "fitte", "kuk", "pikk", "hore", "jævla", "jævel",
  "fuck", "shit", "bitch", "cunt", "dick", "whore", "nigger", "neger",
];

// ---------------------------------------------------------------
// Oppsett: oppretter regnearket og husker ID-en
// ---------------------------------------------------------------
function setup() {
  var props = PropertiesService.getScriptProperties();
  if (props.getProperty("SHEET_ID")) {
    Logger.log("Allerede satt opp. Regneark: " + hentRegneark().getUrl());
    return;
  }
  var ss = SpreadsheetApp.create("Eirin & Jonas – hilsener 11. juli 2026");
  var ark = ss.getActiveSheet();
  ark.setName(ARK_NAVN);
  ark.appendRow(["id", "tidspunkt", "navn", "melding", "type", "clientId"]);
  props.setProperty("SHEET_ID", ss.getId());
  Logger.log("Ferdig! Regneark opprettet: " + ss.getUrl());
}

function hentRegneark() {
  var id = PropertiesService.getScriptProperties().getProperty("SHEET_ID");
  if (!id) throw new Error("Kjør setup() først.");
  return SpreadsheetApp.openById(id);
}

// ---------------------------------------------------------------
// POST: ta imot hilsen fra gjestesiden
// ---------------------------------------------------------------
function doPost(e) {
  try {
    var navn = renskTekst(e.parameter.name || "", 40);
    var melding = renskTekst(e.parameter.message || "", MAKS_LENGDE);
    var type = e.parameter.type === "emoji" ? "emoji" : "text";
    var clientId = renskTekst(e.parameter.clientId || "", 40);

    if (!melding) return svar({ ok: false, error: "Tom melding" });
    if (type === "text" && inneholderBlokkertOrd(navn + " " + melding)) {
      return svar({ ok: false, error: "Meldingen inneholder ord som ikke passer på storskjerm 🙈" });
    }

    var lås = LockService.getScriptLock();
    lås.waitLock(10000);
    try {
      var ark = hentRegneark().getSheetByName(ARK_NAVN);
      // Duplikatvern: gjestesiden sender samme clientId på nytt hvis den
      // ikke fikk lest kvitteringen (flakete echo-endepunkt / dårlig wifi).
      // Er den allerede lagret, svarer vi bare ok igjen uten å lagre.
      if (clientId && clientId !== "undefined" && finnesClientId(ark, clientId)) {
        return svar({ ok: true, duplikat: true });
      }
      var id = ark.getLastRow(); // rad 1 er overskrift → første melding får id 1
      ark.appendRow([id, new Date(), navn, melding, type, clientId]);
    } finally {
      lås.releaseLock();
    }
    return svar({ ok: true });
  } catch (feil) {
    return svar({ ok: false, error: String(feil) });
  }
}

// ---------------------------------------------------------------
// GET: skjermen henter nye hilsener  (?since=<sist sette id>)
// ---------------------------------------------------------------
function doGet(e) {
  try {
    var since = parseInt((e.parameter && e.parameter.since) || "0", 10) || 0;
    var ark = hentRegneark().getSheetByName(ARK_NAVN);
    var sisteRad = ark.getLastRow();
    var meldinger = [];

    if (sisteRad > 1) {
      // Hent bare det som er nytt (maks 50 om gangen)
      var førsteNyeRad = Math.max(2, since + 2); // id n ligger i rad n+1
      var antall = Math.min(sisteRad - førsteNyeRad + 1, 50);
      if (antall > 0) {
        var verdier = ark.getRange(førsteNyeRad, 1, antall, 5).getValues();
        meldinger = verdier.map(function (rad) {
          return { id: rad[0], name: String(rad[2]), message: String(rad[3]), type: String(rad[4]) };
        });
      }
    }
    return svar({ ok: true, messages: meldinger });
  } catch (feil) {
    return svar({ ok: false, error: String(feil), messages: [] });
  }
}

// ---------------------------------------------------------------
// Etter bryllupet: generer gjesteboken som Google-dokument
// ---------------------------------------------------------------
function lagGjesteboken() {
  var ark = hentRegneark().getSheetByName(ARK_NAVN);
  var sisteRad = ark.getLastRow();
  var doc = DocumentApp.create("Gjestebok – Eirin & Jonas, 11. juli 2026");
  var body = doc.getBody();

  var tittel = body.appendParagraph("Eirin & Jonas");
  tittel.setHeading(DocumentApp.ParagraphHeading.TITLE)
        .setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  body.appendParagraph("Hilsener fra gjestene · 11. juli 2026 · Høymagasinet")
      .setHeading(DocumentApp.ParagraphHeading.SUBTITLE)
      .setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  body.appendHorizontalRule();

  if (sisteRad <= 1) {
    body.appendParagraph("Ingen hilsener registrert.");
  } else {
    var verdier = ark.getRange(2, 1, sisteRad - 1, 5).getValues();
    var emojiTelling = {};

    verdier.forEach(function (rad) {
      var tid = rad[1], navn = rad[2], melding = rad[3], type = rad[4];
      if (type === "emoji") {
        emojiTelling[melding] = (emojiTelling[melding] || 0) + 1;
        return;
      }
      var klokke = Utilities.formatDate(new Date(tid), "Europe/Oslo", "HH:mm");
      var p = body.appendParagraph("«" + melding + "»");
      p.setFontSize(13);
      var meta = body.appendParagraph("— " + (navn || "Ukjent gjest") + ", kl. " + klokke);
      meta.setItalic(true).setFontSize(10).setForegroundColor("#7d977d");
      body.appendParagraph("");
    });

    var emojier = Object.keys(emojiTelling);
    if (emojier.length > 0) {
      body.appendHorizontalRule();
      body.appendParagraph("Jubel fra salen").setHeading(DocumentApp.ParagraphHeading.HEADING2);
      var linje = emojier
        .sort(function (a, b) { return emojiTelling[b] - emojiTelling[a]; })
        .map(function (e) { return e + " × " + emojiTelling[e]; })
        .join("    ");
      body.appendParagraph(linje).setFontSize(14);
    }
  }

  Logger.log("Gjesteboken er klar: " + doc.getUrl());
  return doc.getUrl();
}

// ---------------------------------------------------------------
// Vedlikehold: tøm alle hilsener (f.eks. testdata før bryllupet).
// Kjøres manuelt fra editoren. Overskriftsraden beholdes.
// ---------------------------------------------------------------
function nullstillHilsener() {
  var ark = hentRegneark().getSheetByName(ARK_NAVN);
  var sisteRad = ark.getLastRow();
  if (sisteRad > 1) {
    ark.deleteRows(2, sisteRad - 1);
  }
  ark.getRange(1, 6).setValue("clientId"); // sørg for at kolonneoverskriften finnes
  Logger.log("Slettet " + Math.max(0, sisteRad - 1) + " rader. Arket er klart.");
}

// ---------------------------------------------------------------
// Hjelpere
// ---------------------------------------------------------------
function finnesClientId(ark, clientId) {
  var sisteRad = ark.getLastRow();
  if (sisteRad < 2) return false;
  // Det holder å sjekke de siste radene - en retry kommer alltid
  // kort tid etter originalen.
  var antall = Math.min(sisteRad - 1, 200);
  var verdier = ark.getRange(sisteRad - antall + 1, 6, antall, 1).getValues();
  for (var i = 0; i < verdier.length; i++) {
    if (String(verdier[i][0]) === clientId) return true;
  }
  return false;
}

function renskTekst(t, maksLengde) {
  return String(t).replace(/\s+/g, " ").trim().substring(0, maksLengde);
}

function inneholderBlokkertOrd(tekst) {
  var lav = tekst.toLowerCase();
  return BLOKKERTE_ORD.some(function (ord) { return lav.indexOf(ord) !== -1; });
}

function svar(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
