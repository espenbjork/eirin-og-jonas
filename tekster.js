// ============================================================
// TEKSTER – Overgangsvindu-innslaget (Eirin & Jonas)
// ============================================================
// ALT av redigerbar tekst ligger i denne fila. Endre det du vil,
// lagre, og last siden på nytt – ferdig.
//
// Regler:
//  - Behold anførselstegnene rundt tekstene: "slik".
//  - Behold kommaene mellom linjene i listene.
//  - Emoji kan brukes fritt.
//  - Blir siden svart/tom etter en endring: sjekk at du ikke
//    mangler et anførselstegn eller komma.
// ============================================================

const TEKSTER = {

  // ---------- Nedtellingen ----------
  // Antall minutter klokka teller ned fra
  nedtellingMinutter: 5,
  // Teksten som vises i klokka når den når null
  klokkeFerdig: "FULL TID",

  // ---------- Toppen av skjermen ----------
  overskriftLiten: "Overgangsvindu",
  overskriftStor: "ÅPENT",
  klokkeEtikett: "DEADLINE DAY",

  // ---------- Ventebildet (før sendestart) ----------
  ventebilde: {
    kicker: "DEADLINE DAY · 11. JULI 2026",
    tittel: "SENDINGEN STARTER SNART",
    startknapp: "▶ START SENDINGEN",
  },

  // ---------- Sendestart-vignetten ----------
  vignett: {
    ord1: "DEADLINE",                        // animeres bokstav for bokstav
    ord2: "DAY",                             // stemples etterpå
    undertekst: "EIRIN & JONAS · 11. JULI 2026",
  },

  // ---------- Spillerkortet (tast C) ----------
  spillerkort: {
    ovr: "99",                               // tallet øverst
    pos: "EKT",                              // "posisjon" under tallet
    navn: "SJØEN",
    flagg: "🇳🇴",
    emblem: "💍",
    // Stats: [forkortelse, tall] – seks stykker ser best ut
    stats: [
      ["KJÆ", "99"],
      ["LOJ", "99"],
      ["MAT", "95"],
      ["HUM", "69"],
      ["DAN", "72"],
      ["TOE", "9"],
    ],
    verdi: "💰 Verdi: En flaske Romanée-Conti-vin fra 1945",
  },

  // ---------- BREAKING-banneret (tast B) ----------
  // Vises i rekkefølge, én om gangen. Klokka utløser dem også
  // selv ved 0:30 / 0:20 / 0:10.
  breakingEtikett: "⚡ BREAKING",
  breaking: [
    "Sjøen til legesjekk – er ryktene sanne? 🍆",
    "Cruz Atlético bekrefter: personlige vilkår avtalt. Kun signaturen gjenstår ✍️",
    "Toppkilde: Sjøen har takket nei til alle andre tilbud – «hun er den eneste» 💘",
    "Forloverne i hektisk møte – ryktes å forberede et innslag ingen glemmer 🎤",
    "Dansegulvet åpent til 03:00! Eksperter advarer mot Sjøens moves 🕺",
    "Bryllupsreisen utsettes: Norges prestasjoner holder brudeparet i Oslo 🇳🇴",
  ],

  // ---------- DONE DEAL (tast D, eller når klokka når null) ----------
  doneDeal: {
    tittel1: "DONE",
    tittel2: "DEAL!",                        // vises i gult etter tittel1
    undertekst: "Sjøen har signert for Cruz Atlético 💍",
  },

  // ---------- Nyhetsbåndet nederst ----------
  tickerEtikett: "OVERGANGSNYTT",
  // Hver tweet: h = brukernavn, v = blå hake (true/false),
  // c = avatarfarge, src = kilde-tekst i gult, t = selve teksten
  tweets: [
    {h:"@FabrizioRomano", v:true,  c:"#1d9bf0", src:"⭐⭐⭐⭐⭐", t:"🚨 HER ER DEN! Jonas → Eirin, here we go! ✅ Kontrakt signert til år 2096 (livsvarig). Medisinsk sjekk bestått. #11Juli"},
    {h:"@OvergangsEksperten", v:false, c:"#e2002a", src:"ifølge svigermor", t:"Forstår at Cruz Atlético har vunnet kampen om Jonas etter flere års forhandlinger. Klubbene er enige – ringen er personlig vilkår. 💍"},
    {h:"@SkySportsNews", v:true, c:"#0a3aff", src:"⭐⭐⭐⭐", t:"OFFISIELT: Jonas forlater Ungkar FC på gratis overgang. Ingen tilbakekjøpsklausul i kontrakten. 🤵"},
    {h:"@RyktebørsenNO", v:false, c:"#ff8a00", src:"⭐⭐", t:"Kilder: Jonas har bestått den medisinske. Eneste bekymring fra teamet – formen på dansegulvet etter kl. 22:00. 🕺"},
    {h:"@ToastmasterTV", v:true, c:"#16a34a", src:"offisiell kanal", t:"Espen & Fredrik bekrefter pressekonferanse på Høymagasinet kl. 14:30. Bobler garantert til de frammøtte. 🥂"},
    {h:"@DeadlineDayNO", v:false, c:"#7c3aed", src:"⭐⭐⭐", t:"BREAKING: Avsløringen skjer i Gamle Aker kirke kl. 13:00. Begge leire ventes til stede. Full enighet. 🔔"},
    {h:"@LønnsLekkasjen", v:false, c:"#0891b2", src:"⭐", t:"Lønnsdetaljer: ubegrenset kjærlighet + 50 % av fjernkontrollen. Bonus utbetales ved oppvask. 😅"},
    {h:"@FotballPåBryllup", v:true, c:"#db2777", src:"⭐⭐⭐⭐", t:"Eirin om signeringen: «Vi har fulgt ham lenge. Han passer perfekt inn i systemet vårt.» ❤️"},
    {h:"@TaktikkProffen", v:false, c:"#ca8a04", src:"⭐⭐", t:"Analyse: Jonas ventes i en mer defensiv rolle hjemme, men med full frihet til å angripe grillen i helgene. 🔥"},
  ],

  // ---------- Gjestefeeden + QR-boksen ----------
  feedEtikett: "SISTE FRA SALEN",
  qrTittel: "SEND HILSEN TIL PARET",
  qrUndertekst: "skann med mobilen 💌",

  // ---------- Demomodus (?demo=1 i adressen) ----------
  // Testmeldinger som mater gjestefeeden uten backend
  demoMeldinger: [
    {type:"text", name:"Tante Randi", message:"Tidenes signering! Gratulerer, Eirin og Jonas! 🥂"},
    {type:"emoji", message:"💍"},
    {type:"text", name:"Fredrik", message:"Her var det full klaff mellom klubb og spiller. Skål!"},
    {type:"text", name:"Kollegene til Jonas", message:"Endelig en overgang han ikke trengte betenkningstid på 😄"},
    {type:"emoji", message:"❤️"},
    {type:"text", name:"Mormor", message:"Lykke til på ferden, kjære dere. Dette blir fint!"},
  ],
};
