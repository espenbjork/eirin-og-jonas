# Bryllupsbackdrop – Eirin & Jonas, 11. juli 2026

Live backdrop for prosjektoren i Høymagasinet, med gjestehilsener i sanntid.

**Tre deler:**

| Fil | Hva | Hvem |
|---|---|---|
| `index.html` | Backdropet på prosjektoren (monogram + animasjoner + hilsener) | Toastmasterne |
| `send.html` | Mobilside der gjestene sender hilsener/emojier (via QR på skjermen) | Gjestene |
| `apps-script/Code.gs` | Backend: lagrer i Google Sheets, genererer gjestebok-doc etterpå | Google |

**Flyt:** Gjest sender hilsen → Apps Script skriver til regneark → skjermen henter nytt hvert 3. sekund → etter bryllupet kjøres `lagGjesteboken()` som lager et ferdig formatert Google-dokument til brudeparet.

---

## Oppsett

### Steg 1: Apps Script-backend (~5 min)

1. Gå til [script.google.com](https://script.google.com) → **Nytt prosjekt**
2. Slett innholdet i editoren og lim inn alt fra `apps-script/Code.gs`
3. Velg funksjonen `setup` i menylinjen → **Kjør** → godkjenn tilgangene
   (dette oppretter regnearket "Eirin & Jonas – hilsener")
4. **Deploy → New deployment → Web app:**
   - *Execute as:* **Me**
   - *Who has access:* **Anyone**  ← viktig, ellers får ikke gjestene sendt
5. Kopier web-app-URL-en (`https://script.google.com/macros/s/.../exec`)

### Steg 2: Lim URL-en inn i `config.js`

```js
const SCRIPT_URL = "https://script.google.com/macros/s/DIN-ID-HER/exec";
```

### Steg 3: Push til GitHub og skru på Pages

```bash
cd eirin-og-jonas
gh repo create eirin-og-jonas --public --source=. --push
```

Forventet output:
```
✓ Created repository espenbjork/eirin-og-jonas on GitHub
✓ Added remote https://github.com/espenbjork/eirin-og-jonas.git
✓ Pushed commits to https://github.com/espenbjork/eirin-og-jonas.git
```

Skru på GitHub Pages:
```bash
gh api repos/{owner}/eirin-og-jonas/pages -X POST -f "source[branch]=main" -f "source[path]=/"
```

Forventet output (utdrag):
```json
{
  "url": "https://api.github.com/repos/espenbjork/eirin-og-jonas/pages",
  "status": "building",
  "html_url": "https://espenbjork.github.io/eirin-og-jonas/"
}
```

Etter 1–2 minutter er siden live på `https://<brukernavn>.github.io/eirin-og-jonas/`.
QR-koden på skjermen genereres automatisk og peker til riktig `send.html`.

---

## På bryllupsdagen

- Åpne `https://<brukernavn>.github.io/eirin-og-jonas/` på PC-en koblet til prosjektoren
- **Klikk én gang** på siden → fullskjerm (wake-lock hindrer at skjermen sovner)
- Statusprikken øverst til høyre er grønn/diskret når alt virker, oransje ved nettproblemer
- Gjestene skanner QR-koden nederst til venstre på skjermen

**Test på forhånd uten backend:** åpne `index.html?demo=1` – da vises eksempelhilsener.

### Transfervindu-innslaget (Sky Sports)

«Overgangsvindu / Deadline Day»-innslaget ligger inne i backdroppen som et fullskjerms-overlay (`transfervindu.html` i samme mappe) – ingen egen URL eller nettleserbytte:

- **`T`** – toner innslaget opp over backdroppen (starter på ventebildet «SENDINGEN STARTER SNART»)
- Inne i innslaget styrer du som før: **Enter** start · **mellomrom** pause · **B** breaking · **C** spillerkort · **D** DONE DEAL · **M** lyd · **Esc** hopp over vignett / lukk overlays · **H** hjelp
- **`Q`** – avslutter innslaget: toner lyden ned, toner tilbake til den rolige backdroppen, og nullstiller innslaget til ventebildet for en ev. reprise

Gjestefeeden «SISTE FRA SALEN» i innslaget bruker samme backend som backdroppen, så hilsener som kommer inn vises begge steder.

## Etter bryllupet

I Apps Script-editoren: velg funksjonen `lagGjesteboken` → **Kjør**.
URL til det ferdige Google-dokumentet ligger i loggen (Ctrl+Enter / "Executions").
Dokumentet inneholder alle hilsener med navn og klokkeslett, pluss emoji-statistikk («Jubel fra salen»).

## Oppdatere backend-koden senere

Endringer i `Code.gs` limes inn i Apps Script-editoren, og deretter:
**Deploy → Manage deployments → ✏️ (rediger) → Version: New version → Deploy.**
Da beholdes samme URL. (Velger du "New deployment" i stedet, får du ny URL og må
oppdatere `config.js`.)

Testdata i regnearket fjernes ved å kjøre funksjonen `nullstillHilsener` i editoren.
Last inn skjermen (index.html) på nytt etterpå.

## Verdt å vite

- **Ordfilter:** enkle stygge ord avvises i backend (listen `BLOKKERTE_ORD` i `Code.gs` kan justeres). Ingen manuell moderering – alt annet går rett på skjermen.
- **Dårlig dekning:** gjestesiden køer hilsener lokalt og sender automatisk når nettet er tilbake.
- **Duplikatvern:** hver hilsen får en `clientId`, og backend hopper over meldinger den allerede har lagret. Googles svar-endepunkt feiler nemlig av og til (404) selv om meldingen ble lagret, og uten dette vernet ville køen sendt samme hilsen flere ganger.
- **Forsinkelse:** opptil ~3 sek fra sendt til synlig (polling). Ved meldingsbyger slippes de på skjermen én og én med ~2,5 sek mellomrom.
- **Historikk:** skjermen viser bare hilsener som kommer inn *etter* at den ble åpnet – en omstart spammer ikke skjermen med gamle meldinger. Alt ligger trygt i regnearket uansett.
