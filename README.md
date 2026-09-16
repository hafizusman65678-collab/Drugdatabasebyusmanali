# PharmaDrug — Drug Pharmacology Database

An offline-first, fully client-side pharmacology drug information website for pharmacy and medical students.

## Features

- Search by generic name, brand name, drug class, or indication
- Detailed drug profiles (mechanism, ADME, indications, dosing notes, adverse effects, interactions, monitoring, counseling, special populations)
- Favorites, recently viewed, personal notes
- Drug comparison (2–4 drugs)
- Interactive nephron diagram for diuretics
- Classification browser
- Quick study quiz mode
- Add / edit / delete custom drugs
- Dark / light mode
- Export / import backup (JSON)
- Print-friendly drug profiles
- Fully responsive and accessible
- No backend, no login, no external APIs

## How to Run

1. Download or copy the entire `PharmaDrug` folder.
2. Open `index.html` in any modern web browser (Chrome, Firefox, Edge, Safari).
3. That is all — no installation or server required.

Works completely offline after the first load.

## Project Structure

```
PharmaDrug/
├── index.html          # Main page
├── style.css           # Styles (including dark mode & print)
├── app.js              # Application logic
├── data/
│   └── drugs.js        # Built-in drug database
└── README.md
```

## How to Add More Drugs

### Option A — In the browser
1. Click **Add Drug** in the navigation.
2. Fill in the form and save.
3. The drug is stored in `localStorage` and appears in search immediately.

### Option B — Edit the source database
1. Open `data/drugs.js`.
2. Copy an existing drug object as a template.
3. Add a new object to the `builtInDrugs` array with a unique `id`.
4. Save the file and refresh the browser.

### Data shape (simplified)

```js
{
  id: "unique-id",
  genericName: "Drug Name",
  brandNames: ["Brand1", "Brand2"],
  drugClass: "Class",
  therapeuticClass: "Therapeutic Class",
  mechanismOfAction: "Description...",
  mechanismFlow: ["Drug", "Target", "Mechanism", "Effect", "Therapeutic effect"],
  pharmacokinetics: {
    absorption: "...",
    distribution: "...",
    metabolism: "...",
    excretion: "..."
  },
  indications: ["Indication 1", "Indication 2"],
  dosage: {
    routes: ["Oral", "IV"],
    adult: "Educational dosing note...",
    pediatric: "...",
    notes: "Refer to authoritative sources..."
  },
  adverseEffects: {
    common: [],
    serious: [],
    important: []
  },
  contraindications: [],
  interactions: [
    { drug: "Other drug", interaction: "Description", significance: "HIGH|MODERATE|LOW" }
  ],
  monitoring: [],
  patientCounseling: [],
  specialPopulations: {
    pregnancy: "",
    breastfeeding: "",
    pediatric: "",
    elderly: "",
    renal: "",
    hepatic: ""
  },
  storage: "",
  references: []
}
```

## Export / Import

- Go to **Backup**.
- **Export Database** downloads a JSON file containing user-added drugs, favorites, notes, and settings.
- **Import Database** restores a previously exported file.
- Invalid files are rejected safely.

## Important Disclaimer

This application is for **educational use only**. It is not a substitute for official prescribing information, clinical guidelines, or the advice of a qualified healthcare professional. Always verify doses and clinical recommendations with authoritative current sources.

## License / Attribution

Educational project. Drug information is compiled from standard pharmacology educational knowledge and structured for study purposes. Not affiliated with any textbook publisher.


## Data storage (local only)

There is **no account login** (no Google, Facebook, Instagram, or profile name/PIN).

Favorites, notes, custom drugs, and settings are stored in the browser’s **localStorage** on this device.

To move data to another device or browser:
1. Open **Backup**
2. **Export Database** (JSON file)
3. On the other device: **Import Database**


## One-click install (Android / Windows)

Do **not** only double-click `index.html` if you want Install App.

**Windows (easiest)**  
1. Double-click `start-windows.bat`  
2. Browser opens automatically  
3. Click **Install App**

**Mac / Linux**  
```bash
chmod +x start-android-or-mac.sh
./start-android-or-mac.sh
```
Then click **Install App** in the browser.

After install, PharmaDrug opens like a normal app and works offline.
