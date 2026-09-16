// PharmaDrug Offline Database
// Educational data based on standard pharmacology knowledge.
// Not a substitute for official prescribing information.

const builtInDrugs = [
  {
    id: "furosemide",
    genericName: "Furosemide",
    brandNames: ["Lasix", "Furosemide"],
    drugClass: "Loop Diuretic",
    therapeuticClass: "Diuretic / Antihypertensive",
    mechanismOfAction: "Furosemide inhibits the Na-K-2Cl cotransporter (NKCC2) in the thick ascending limb of the loop of Henle. This prevents reabsorption of sodium, potassium, and chloride, leading to increased excretion of these ions and water (diuresis). It also increases excretion of calcium and magnesium.",
    mechanismFlow: ["Drug", "NKCC2 transporter (thick ascending limb)", "Blocks Na+/K+/2Cl- reabsorption", "Increased urinary excretion of Na, K, Cl, water", "Diuresis and reduced blood volume"],
    pharmacokinetics: {
      absorption: "Oral bioavailability approximately 60-70%. Rapidly absorbed. Onset of action oral: 30-60 min; IV: within 5 min.",
      distribution: "Protein binding ~98%. Volume of distribution moderate. Crosses placenta.",
      metabolism: "Partially metabolized in liver to glucuronide conjugate.",
      excretion: "Primarily renal excretion of unchanged drug and metabolites. Half-life 0.5-2 hours (prolonged in renal impairment)."
    },
    indications: [
      "Edema associated with congestive heart failure",
      "Hepatic cirrhosis with ascites",
      "Renal disease (including nephrotic syndrome)",
      "Acute pulmonary edema",
      "Hypertension (adjunctive)",
      "Hypercalcemia"
    ],
    dosage: {
      routes: ["Oral", "Intravenous", "Intramuscular"],
      adult: "Edema: 20-80 mg oral once or twice daily; may increase. IV: 20-40 mg. Hypertension: 40 mg twice daily. Refer to authoritative sources for precise dosing.",
      pediatric: "1-2 mg/kg/dose oral or IV. Maximum typically 6 mg/kg/day. Refer to pediatric references.",
      notes: "Educational information only. Dose adjustment required in renal impairment. Monitor electrolytes closely."
    },
    adverseEffects: {
      common: ["Hypokalemia", "Hyponatremia", "Dehydration", "Hypotension", "Hyperuricemia", "Hyperglycemia", "Ototoxicity (high doses)"],
      serious: ["Severe electrolyte imbalance", "Ototoxicity (especially with rapid IV)", "Acute kidney injury", "Hypersensitivity reactions"],
      important: ["Loop diuretics can cause profound diuresis leading to dehydration and electrolyte depletion."]
    },
    contraindications: [
      "Anuria",
      "Known hypersensitivity to sulfonamides (cross-reactivity possible)",
      "Hepatic coma",
      "Severe electrolyte depletion"
    ],
    interactions: [
      { drug: "Aminoglycosides", interaction: "Increased risk of ototoxicity", significance: "HIGH" },
      { drug: "NSAIDs", interaction: "May reduce diuretic and antihypertensive effect", significance: "MODERATE" },
      { drug: "Lithium", interaction: "Reduced lithium clearance, increased toxicity risk", significance: "HIGH" },
      { drug: "Digoxin", interaction: "Hypokalemia increases digoxin toxicity risk", significance: "HIGH" },
      { drug: "Corticosteroids", interaction: "Increased potassium loss", significance: "MODERATE" }
    ],
    monitoring: ["Serum electrolytes (K+, Na+, Mg2+, Ca2+)", "Renal function (BUN, creatinine)", "Blood pressure", "Fluid status / weight", "Hearing (high-dose IV)"],
    patientCounseling: [
      "Take in the morning to avoid nighttime urination.",
      "May cause increased urination; stay near a bathroom after dosing.",
      "Report muscle cramps, weakness, or irregular heartbeat (possible low potassium).",
      "Stand up slowly to avoid dizziness from low blood pressure.",
      "Maintain adequate fluid intake unless restricted by your doctor.",
      "Regular blood tests may be needed to check electrolytes and kidney function."
    ],
    specialPopulations: {
      pregnancy: "Category C. Use only if benefit outweighs risk. Crosses placenta.",
      breastfeeding: "Excreted in breast milk; caution advised.",
      pediatric: "Safe when dosed appropriately; monitor growth and electrolytes.",
      elderly: "Increased risk of dehydration and electrolyte imbalance; start low.",
      renal: "May require higher doses in severe impairment; risk of accumulation.",
      hepatic: "Use caution in cirrhosis; risk of hepatic encephalopathy."
    },
    storage: "Store at room temperature, protect from light and moisture.",
    references: ["Standard pharmacology textbooks (e.g., Lippincott Illustrated Reviews: Pharmacology)", "Authoritative prescribing information"]
  },
  {
    id: "hydrochlorothiazide",
    genericName: "Hydrochlorothiazide",
    brandNames: ["Microzide", "HydroDIURIL", "Esidrix"],
    drugClass: "Thiazide Diuretic",
    therapeuticClass: "Diuretic / Antihypertensive",
    mechanismOfAction: "Inhibits the Na-Cl cotransporter (NCC) in the distal convoluted tubule. This reduces sodium and chloride reabsorption, leading to mild diuresis. Also causes potassium and magnesium loss and reduces calcium excretion.",
    mechanismFlow: ["Drug", "NCC transporter (DCT)", "Blocks Na+/Cl- reabsorption", "Increased Na and water excretion", "Mild diuresis + antihypertensive effect"],
    pharmacokinetics: {
      absorption: "Well absorbed orally (~70%). Onset 2 hours, peak 4-6 hours.",
      distribution: "Protein binding ~40-68%. Crosses placenta.",
      metabolism: "Not significantly metabolized.",
      excretion: "Primarily unchanged in urine. Half-life 6-15 hours."
    },
    indications: [
      "Hypertension (first-line in many guidelines)",
      "Edema due to heart failure, liver, or renal disease",
      "Nephrogenic diabetes insipidus",
      "Prevention of calcium-containing kidney stones"
    ],
    dosage: {
      routes: ["Oral"],
      adult: "Hypertension: 12.5-50 mg once daily. Edema: 25-100 mg daily. Refer to current guidelines.",
      pediatric: "1-2 mg/kg/day. Refer to pediatric dosing references.",
      notes: "Educational only. Lower doses preferred for hypertension to minimize side effects."
    },
    adverseEffects: {
      common: ["Hypokalemia", "Hyponatremia", "Hyperuricemia", "Hyperglycemia", "Hyperlipidemia", "Photosensitivity"],
      serious: ["Severe hyponatremia", "Acute angle-closure glaucoma (rare)", "Stevens-Johnson syndrome (rare)"],
      important: ["Thiazides can unmask or worsen diabetes and gout."]
    },
    contraindications: [
      "Anuria",
      "Hypersensitivity to sulfonamide-derived drugs",
      "Severe renal impairment (GFR <30 mL/min generally ineffective)"
    ],
    interactions: [
      { drug: "Lithium", interaction: "Decreased lithium clearance", significance: "HIGH" },
      { drug: "NSAIDs", interaction: "Reduced antihypertensive effect", significance: "MODERATE" },
      { drug: "Digoxin", interaction: "Hypokalemia increases toxicity", significance: "HIGH" },
      { drug: "Corticosteroids", interaction: "Enhanced potassium loss", significance: "MODERATE" }
    ],
    monitoring: ["Electrolytes", "Blood pressure", "Renal function", "Blood glucose", "Uric acid", "Lipids"],
    patientCounseling: [
      "Take in the morning.",
      "May increase sensitivity to sunlight; use sunscreen.",
      "Report excessive thirst, muscle weakness, or irregular heartbeat.",
      "Regular monitoring of blood pressure and blood tests is important."
    ],
    specialPopulations: {
      pregnancy: "Category B/C. Generally avoided in pregnancy for hypertension; used for edema if needed.",
      breastfeeding: "Excreted in milk; usually compatible at low doses.",
      pediatric: "Used; monitor electrolytes.",
      elderly: "Higher risk of hyponatremia; start low.",
      renal: "Less effective when GFR <30 mL/min.",
      hepatic: "Use caution."
    },
    storage: "Store at controlled room temperature; protect from moisture.",
    references: ["Standard pharmacology references"]
  },
  {
    id: "spironolactone",
    genericName: "Spironolactone",
    brandNames: ["Aldactone", "CaroSpir"],
    drugClass: "Potassium-Sparing Diuretic / Aldosterone Antagonist",
    therapeuticClass: "Diuretic / Heart Failure / Antiandrogen",
    mechanismOfAction: "Competitive antagonist of aldosterone at mineralocorticoid receptors in the collecting duct. Inhibits sodium reabsorption and potassium excretion mediated by aldosterone. Also has antiandrogenic effects.",
    mechanismFlow: ["Drug", "Mineralocorticoid receptor (collecting duct)", "Blocks aldosterone action", "Decreased Na reabsorption / K excretion", "Mild diuresis + potassium retention"],
    pharmacokinetics: {
      absorption: "Well absorbed; bioavailability increased with food. Onset slow (days for full effect).",
      distribution: "Highly protein bound. Active metabolites.",
      metabolism: "Extensively metabolized to canrenone and other active metabolites.",
      excretion: "Metabolites excreted in urine and bile. Half-life of parent ~1.5 h; active metabolites longer."
    },
    indications: [
      "Heart failure with reduced ejection fraction (HFrEF)",
      "Primary hyperaldosteronism",
      "Edema (cirrhosis, nephrotic syndrome)",
      "Hypertension (adjunctive)",
      "Hypokalemia",
      "Hirsutism / acne (off-label antiandrogen use)"
    ],
    dosage: {
      routes: ["Oral"],
      adult: "Heart failure: 12.5-50 mg daily. Hypertension/edema: 25-100 mg daily. Refer to guidelines.",
      pediatric: "1-3.3 mg/kg/day. Refer to pediatric sources.",
      notes: "Educational only. Monitor potassium closely, especially with ACE inhibitors/ARBs."
    },
    adverseEffects: {
      common: ["Hyperkalemia", "Gynecomastia", "Menstrual irregularities", "Breast tenderness", "Gastrointestinal upset"],
      serious: ["Severe hyperkalemia", "Metabolic acidosis (rare)"],
      important: ["Risk of hyperkalemia is significant, especially in renal impairment or with potassium supplements/ACEIs."]
    },
    contraindications: [
      "Hyperkalemia",
      "Addison’s disease",
      "Concomitant use with eplerenone",
      "Severe renal impairment"
    ],
    interactions: [
      { drug: "ACE inhibitors / ARBs", interaction: "Increased hyperkalemia risk", significance: "HIGH" },
      { drug: "Potassium supplements", interaction: "Severe hyperkalemia risk", significance: "HIGH" },
      { drug: "NSAIDs", interaction: "Reduced diuretic effect + hyperkalemia risk", significance: "MODERATE" },
      { drug: "Digoxin", interaction: "May increase digoxin levels", significance: "MODERATE" }
    ],
    monitoring: ["Serum potassium", "Renal function", "Blood pressure", "Signs of gynecomastia"],
    patientCounseling: [
      "Take with food if stomach upset occurs.",
      "Avoid potassium supplements and salt substitutes unless directed.",
      "Report muscle weakness, irregular heartbeat, or breast changes.",
      "Regular blood tests for potassium are essential."
    ],
    specialPopulations: {
      pregnancy: "Category C. Antiandrogenic effects; generally avoided.",
      breastfeeding: "Metabolites excreted; usually considered compatible.",
      pediatric: "Used in certain conditions with monitoring.",
      elderly: "Higher risk of hyperkalemia.",
      renal: "Contraindicated in severe impairment; high risk of hyperkalemia.",
      hepatic: "Used in cirrhosis with ascites; monitor carefully."
    },
    storage: "Store at room temperature.",
    references: ["Standard pharmacology references"]
  },
  {
    id: "mannitol",
    genericName: "Mannitol",
    brandNames: ["Osmitrol"],
    drugClass: "Osmotic Diuretic",
    therapeuticClass: "Diuretic / Intracranial Pressure Reduction",
    mechanismOfAction: "Freely filtered at the glomerulus but poorly reabsorbed. Creates an osmotic gradient that holds water in the tubular lumen, producing diuresis. Also reduces intracranial and intraocular pressure by osmotic effect.",
    mechanismFlow: ["Drug", "Glomerular filtrate (osmotically active)", "Holds water in tubule", "Increased urine volume", "Diuresis + reduced ICP/IOP"],
    pharmacokinetics: {
      absorption: "Not absorbed orally; given IV only.",
      distribution: "Distributes to extracellular fluid. Does not cross intact blood-brain barrier significantly.",
      metabolism: "Minimally metabolized.",
      excretion: "Almost entirely excreted unchanged by kidneys. Half-life ~100 minutes."
    },
    indications: [
      "Reduction of intracranial pressure",
      "Reduction of intraocular pressure",
      "Promotion of diuresis in oliguric renal failure (selected cases)",
      "Promotion of urinary excretion of toxic substances"
    ],
    dosage: {
      routes: ["Intravenous"],
      adult: "Typical 0.25-2 g/kg IV over 30-60 min for ICP. Refer to institutional protocols.",
      pediatric: "Similar weight-based dosing. Refer to pediatric critical care sources.",
      notes: "Educational only. Requires careful monitoring of fluid and electrolyte balance. Use filtered IV set."
    },
    adverseEffects: {
      common: ["Fluid and electrolyte imbalance", "Dehydration", "Headache", "Nausea"],
      serious: ["Pulmonary edema (in heart failure)", "Rebound increase in ICP", "Acute kidney injury", "Hyperosmolarity"],
      important: ["Can expand intravascular volume initially; caution in heart failure."]
    },
    contraindications: [
      "Anuria",
      "Severe pulmonary congestion or active intracranial bleeding (except during craniotomy)",
      "Severe dehydration",
      "Progressive heart failure"
    ],
    interactions: [
      { drug: "Other diuretics", interaction: "Additive effects", significance: "MODERATE" },
      { drug: "Nephrotoxic drugs", interaction: "Increased renal risk", significance: "MODERATE" }
    ],
    monitoring: ["Serum osmolality", "Electrolytes", "Renal function", "Fluid balance", "Intracranial pressure (if applicable)", "Cardiac status"],
    patientCounseling: [
      "This medication is given in hospital by IV infusion.",
      "You will be monitored closely for fluid and electrolyte changes."
    ],
    specialPopulations: {
      pregnancy: "Category C.",
      breastfeeding: "Unknown; caution.",
      pediatric: "Used in critical care settings.",
      elderly: "Higher risk of fluid shifts.",
      renal: "Contraindicated in anuria; use caution.",
      hepatic: "No specific adjustment."
    },
    storage: "Store at room temperature. Solutions may crystallize; warm to dissolve if needed. Use filtered administration set.",
    references: ["Standard pharmacology and critical care references"]
  },
  {
    id: "acetazolamide",
    genericName: "Acetazolamide",
    brandNames: ["Diamox"],
    drugClass: "Carbonic Anhydrase Inhibitor",
    therapeuticClass: "Diuretic / Antiglaucoma / Altitude Sickness",
    mechanismOfAction: "Inhibits carbonic anhydrase in the proximal convoluted tubule. This reduces formation of H+ and HCO3-, decreasing Na+/H+ exchange and bicarbonate reabsorption, leading to bicarbonate diuresis (alkaline urine) and mild metabolic acidosis.",
    mechanismFlow: ["Drug", "Carbonic anhydrase (PCT)", "Decreased HCO3- reabsorption", "Bicarbonate and Na loss in urine", "Mild diuresis + metabolic acidosis"],
    pharmacokinetics: {
      absorption: "Well absorbed orally.",
      distribution: "Distributes widely; concentrates in RBCs and tissues with high CA activity.",
      metabolism: "Not significantly metabolized.",
      excretion: "Excreted unchanged in urine. Half-life 3-9 hours."
    },
    indications: [
      "Glaucoma (reduces aqueous humor production)",
      "Altitude sickness prophylaxis and treatment",
      "Edema (adjunctive, limited use)",
      "Epilepsy (adjunctive in some cases)",
      "Metabolic alkalosis"
    ],
    dosage: {
      routes: ["Oral", "Intravenous"],
      adult: "Glaucoma: 250 mg 1-4 times daily. Altitude sickness: 125-250 mg twice daily. Refer to specific indications.",
      pediatric: "Weight-based; refer to pediatric references.",
      notes: "Educational only. Not a potent diuretic for edema."
    },
    adverseEffects: {
      common: ["Paresthesias", "Taste alteration (carbonated beverages)", "Fatigue", "Polyuria", "Metabolic acidosis"],
      serious: ["Severe metabolic acidosis", "Stevens-Johnson syndrome", "Blood dyscrasias (rare)", "Kidney stones"],
      important: ["Causes alkaline urine which can lead to calcium phosphate stones."]
    },
    contraindications: [
      "Severe liver disease",
      "Severe renal disease",
      "Hyperchloremic acidosis",
      "Hypokalemia / hyponatremia",
      "Long-term use in chronic non-congestive angle-closure glaucoma"
    ],
    interactions: [
      { drug: "Aspirin (high dose)", interaction: "Increased risk of acidosis and CNS toxicity", significance: "HIGH" },
      { drug: "Other diuretics", interaction: "Additive electrolyte effects", significance: "MODERATE" },
      { drug: "Lithium", interaction: "May increase lithium excretion", significance: "LOW" }
    ],
    monitoring: ["Electrolytes", "Acid-base status", "Renal function", "CBC (long-term)", "Intraocular pressure (glaucoma)"],
    patientCounseling: [
      "May cause tingling in fingers/toes or altered taste of soda.",
      "Drink plenty of fluids unless restricted.",
      "Report unusual tiredness, shortness of breath, or severe tingling.",
      "For altitude sickness, start before ascent as directed."
    ],
    specialPopulations: {
      pregnancy: "Category C.",
      breastfeeding: "Excreted; caution.",
      pediatric: "Used for specific indications.",
      elderly: "Higher risk of acidosis and electrolyte issues.",
      renal: "Dose adjustment or avoidance in severe impairment.",
      hepatic: "Avoid in severe disease (risk of encephalopathy)."
    },
    storage: "Store at room temperature.",
    references: ["Standard pharmacology references"]
  },
  {
    id: "metformin",
    genericName: "Metformin",
    brandNames: ["Glucophage", "Fortamet", "Glumetza", "Riomet"],
    drugClass: "Biguanide",
    therapeuticClass: "Antidiabetic / Oral Hypoglycemic",
    mechanismOfAction: "Decreases hepatic glucose production (mainly by inhibiting gluconeogenesis), decreases intestinal absorption of glucose, and improves insulin sensitivity by increasing peripheral glucose uptake and utilization. Does not stimulate insulin secretion.",
    mechanismFlow: ["Drug", "Mitochondrial complex I / AMPK activation", "Reduced hepatic gluconeogenesis", "Improved insulin sensitivity", "Lower blood glucose"],
    pharmacokinetics: {
      absorption: "Incomplete oral absorption (~50-60%). Food decreases extent and delays absorption. Extended-release formulations available.",
      distribution: "Negligible protein binding. Distributes into erythrocytes.",
      metabolism: "Not metabolized by the liver.",
      excretion: "Excreted unchanged in urine via tubular secretion. Half-life ~6 hours (plasma); longer in blood."
    },
    indications: [
      "Type 2 diabetes mellitus (first-line in most guidelines)",
      "Prediabetes (selected patients)",
      "Polycystic ovary syndrome (off-label)",
      "Weight management adjunct in some cases"
    ],
    dosage: {
      routes: ["Oral"],
      adult: "Immediate-release: start 500 mg once or twice daily with meals; titrate to 1500-2000 mg/day. Extended-release: 500-2000 mg once daily. Max usually 2550 mg/day. Refer to product labeling.",
      pediatric: "Approved ≥10 years; similar titration. Refer to pediatric endocrinology sources.",
      notes: "Educational only. Contraindicated in significant renal impairment. Hold before contrast procedures."
    },
    adverseEffects: {
      common: ["Gastrointestinal upset (diarrhea, nausea, flatulence)", "Metallic taste", "Vitamin B12 deficiency (long-term)"],
      serious: ["Lactic acidosis (rare but serious)", "Severe hypoglycemia (only if combined with other agents)"],
      important: ["GI side effects often improve with slow titration and taking with food."]
    },
    contraindications: [
      "Severe renal impairment (eGFR <30 mL/min/1.73m²)",
      "Acute or chronic metabolic acidosis including diabetic ketoacidosis",
      "Hypersensitivity to metformin"
    ],
    interactions: [
      { drug: "Iodinated contrast", interaction: "Risk of lactic acidosis; hold metformin around procedure", significance: "HIGH" },
      { drug: "Alcohol", interaction: "Increases lactic acidosis risk", significance: "HIGH" },
      { drug: "Cimetidine", interaction: "May increase metformin levels", significance: "MODERATE" },
      { drug: "Other antidiabetics", interaction: "Additive hypoglycemia risk", significance: "MODERATE" }
    ],
    monitoring: ["Blood glucose / HbA1c", "Renal function (eGFR)", "Vitamin B12 (periodic)", "Signs of lactic acidosis (rare)"],
    patientCounseling: [
      "Take with meals to reduce stomach upset.",
      "Do not crush or chew extended-release tablets.",
      "Report unusual muscle pain, difficulty breathing, or severe drowsiness (possible lactic acidosis).",
      "Avoid excessive alcohol.",
      "Regular blood tests for kidney function and blood sugar are needed."
    ],
    specialPopulations: {
      pregnancy: "Category B. Increasingly used; discuss with specialist.",
      breastfeeding: "Generally considered compatible.",
      pediatric: "Approved for type 2 diabetes ≥10 years.",
      elderly: "Assess renal function carefully; start low.",
      renal: "Dose adjust or avoid based on eGFR.",
      hepatic: "Avoid in significant hepatic disease (lactic acidosis risk)."
    },
    storage: "Store at room temperature; protect from moisture.",
    references: ["Standard pharmacology and diabetes guidelines"]
  },
  {
    id: "amoxicillin",
    genericName: "Amoxicillin",
    brandNames: ["Amoxil", "Moxatag", "Trimox"],
    drugClass: "Aminopenicillin / Beta-lactam Antibiotic",
    therapeuticClass: "Antibiotic",
    mechanismOfAction: "Inhibits bacterial cell wall synthesis by binding to penicillin-binding proteins (PBPs). This prevents cross-linking of peptidoglycan, leading to cell lysis and death (bactericidal). Spectrum includes many gram-positive and some gram-negative organisms.",
    mechanismFlow: ["Drug", "Penicillin-binding proteins", "Inhibits peptidoglycan cross-linking", "Weakened cell wall", "Bacterial lysis"],
    pharmacokinetics: {
      absorption: "Well absorbed orally (~70-90%). Food does not significantly affect absorption of most formulations.",
      distribution: "Widely distributed; good tissue penetration. Crosses placenta. Low CSF penetration unless meninges inflamed.",
      metabolism: "Partially metabolized.",
      excretion: "Primarily renal (tubular secretion). Half-life ~1-1.5 hours (prolonged in renal impairment)."
    },
    indications: [
      "Otitis media",
      "Streptococcal pharyngitis",
      "Sinusitis",
      "Uncomplicated urinary tract infections",
      "Community-acquired pneumonia (selected)",
      "Helicobacter pylori eradication (combination)",
      "Skin and soft tissue infections (selected)"
    ],
    dosage: {
      routes: ["Oral"],
      adult: "Typical 250-500 mg every 8 hours or 500-875 mg every 12 hours depending on infection. Higher doses for some indications. Refer to guidelines.",
      pediatric: "20-90 mg/kg/day divided. Refer to pediatric infectious disease dosing.",
      notes: "Educational only. Complete the full course. Dose adjust in renal impairment."
    },
    adverseEffects: {
      common: ["Diarrhea", "Nausea", "Rash", "Vomiting"],
      serious: ["Severe allergic reactions (anaphylaxis)", "Clostridioides difficile-associated diarrhea", "Stevens-Johnson syndrome (rare)"],
      important: ["Rash may occur in patients with infectious mononucleosis."]
    },
    contraindications: [
      "History of serious hypersensitivity reaction to amoxicillin or other beta-lactams",
      "History of cholestatic jaundice/hepatic dysfunction associated with amoxicillin-clavulanate"
    ],
    interactions: [
      { drug: "Probenecid", interaction: "Decreases renal excretion of amoxicillin", significance: "MODERATE" },
      { drug: "Oral contraceptives", interaction: "Possible reduced efficacy (limited evidence)", significance: "LOW" },
      { drug: "Allopurinol", interaction: "Increased risk of rash", significance: "MODERATE" },
      { drug: "Warfarin", interaction: "Possible potentiation of anticoagulant effect", significance: "MODERATE" }
    ],
    monitoring: ["Clinical response", "Signs of allergy", "Renal function (high doses or prolonged use)", "Hepatic function (rare)"],
    patientCounseling: [
      "Take the full prescribed course even if you feel better.",
      "Can be taken with or without food.",
      "Report severe diarrhea, rash, or difficulty breathing immediately.",
      "Shake suspension well and store as directed (often refrigerated)."
    ],
    specialPopulations: {
      pregnancy: "Category B. Commonly used.",
      breastfeeding: "Compatible; monitor infant for diarrhea/rash.",
      pediatric: "Widely used.",
      elderly: "Dose adjust for renal function.",
      renal: "Extend interval or reduce dose in impairment.",
      hepatic: "No specific adjustment usually needed."
    },
    storage: "Capsules/tablets: room temperature. Suspension: often refrigerated; discard after specified days.",
    references: ["Standard infectious disease and pharmacology references"]
  },
  {
    id: "omeprazole",
    genericName: "Omeprazole",
    brandNames: ["Prilosec", "Losec"],
    drugClass: "Proton Pump Inhibitor (PPI)",
    therapeuticClass: "Antiulcer / Antisecretory",
    mechanismOfAction: "Irreversibly inhibits the H+/K+-ATPase (proton pump) on the gastric parietal cell. This blocks the final step of acid secretion, suppressing both basal and stimulated acid production.",
    mechanismFlow: ["Drug (prodrug)", "Activated in acidic canaliculus", "Binds H+/K+-ATPase", "Irreversible inhibition of acid secretion", "Reduced gastric acidity"],
    pharmacokinetics: {
      absorption: "Acid-labile; enteric-coated formulations. Bioavailability ~30-40% (increases with repeated dosing). Food delays absorption.",
      distribution: "Protein binding ~95%.",
      metabolism: "Extensively metabolized by CYP2C19 and CYP3A4. Genetic polymorphism in CYP2C19 affects exposure.",
      excretion: "Metabolites excreted in urine (~80%) and feces. Half-life ~0.5-1 hour; duration of effect much longer due to irreversible binding."
    },
    indications: [
      "Gastroesophageal reflux disease (GERD)",
      "Peptic ulcer disease",
      "Eradication of H. pylori (combination therapy)",
      "Zollinger-Ellison syndrome",
      "Prevention of NSAID-induced ulcers",
      "Erosive esophagitis"
    ],
    dosage: {
      routes: ["Oral", "Intravenous (selected products)"],
      adult: "Typical 20-40 mg once daily. Higher for hypersecretory conditions. Refer to indication-specific dosing.",
      pediatric: "Weight-based; available for certain ages. Refer to pediatric GI sources.",
      notes: "Educational only. Take before meals. Long-term use associated with certain risks."
    },
    adverseEffects: {
      common: ["Headache", "Diarrhea", "Abdominal pain", "Nausea"],
      serious: ["Clostridioides difficile infection risk", "Hypomagnesemia (long-term)", "Vitamin B12 deficiency (long-term)", "Increased fracture risk (long-term)", "Acute interstitial nephritis"],
      important: ["Rebound acid hypersecretion can occur after stopping long-term therapy."]
    },
    contraindications: [
      "Hypersensitivity to omeprazole or other PPIs",
      "Concomitant use with rilpivirine-containing products"
    ],
    interactions: [
      { drug: "Clopidogrel", interaction: "May reduce activation of clopidogrel (CYP2C19)", significance: "HIGH" },
      { drug: "Warfarin", interaction: "May increase INR", significance: "MODERATE" },
      { drug: "Methotrexate", interaction: "May increase methotrexate levels", significance: "MODERATE" },
      { drug: "Drugs requiring acidic pH for absorption (e.g., ketoconazole, iron)", interaction: "Reduced absorption", significance: "MODERATE" }
    ],
    monitoring: ["Symptom control", "Magnesium (long-term)", "Vitamin B12 (long-term)", "Bone health considerations"],
    patientCounseling: [
      "Take before a meal, preferably in the morning.",
      "Swallow capsules whole; do not crush delayed-release formulations.",
      "Do not stop suddenly after long-term use without medical advice.",
      "Report severe diarrhea, muscle spasms, or irregular heartbeat."
    ],
    specialPopulations: {
      pregnancy: "Category C. Generally considered acceptable when needed.",
      breastfeeding: "Excreted in small amounts; usually compatible.",
      pediatric: "Approved for certain ages and indications.",
      elderly: "No major dose adjustment; monitor for interactions.",
      renal: "No adjustment usually needed.",
      hepatic: "Dose reduction may be considered in severe impairment."
    },
    storage: "Store at room temperature; protect from moisture and light.",
    references: ["Standard gastroenterology and pharmacology references"]
  },
  {
    id: "amlodipine",
    genericName: "Amlodipine",
    brandNames: ["Norvasc", "Katerzia"],
    drugClass: "Dihydropyridine Calcium Channel Blocker",
    therapeuticClass: "Antihypertensive / Antianginal",
    mechanismOfAction: "Inhibits calcium influx into vascular smooth muscle and cardiac muscle via L-type calcium channels. Preferential effect on vascular smooth muscle leads to peripheral arterial vasodilation and reduced blood pressure. Also reduces coronary vasospasm.",
    mechanismFlow: ["Drug", "L-type Ca2+ channels (vascular smooth muscle)", "Decreased Ca2+ influx", "Vasodilation", "Reduced peripheral resistance and BP"],
    pharmacokinetics: {
      absorption: "Well absorbed; bioavailability 60-65%. Peak 6-12 hours.",
      distribution: "Highly protein bound (~93%).",
      metabolism: "Extensively metabolized by CYP3A4 to inactive metabolites.",
      excretion: "Metabolites excreted in urine (60%) and feces. Half-life 30-50 hours (allows once-daily dosing)."
    },
    indications: [
      "Hypertension",
      "Chronic stable angina",
      "Vasospastic (Prinzmetal) angina",
      "Coronary artery disease"
    ],
    dosage: {
      routes: ["Oral"],
      adult: "Hypertension/angina: start 5 mg once daily; usual 5-10 mg daily. Elderly or hepatic impairment: start 2.5 mg. Refer to labeling.",
      pediatric: "Approved ≥6 years for hypertension: 2.5-5 mg daily.",
      notes: "Educational only. Titrate slowly. Long half-life provides smooth control."
    },
    adverseEffects: {
      common: ["Peripheral edema", "Flushing", "Headache", "Dizziness", "Fatigue"],
      serious: ["Severe hypotension", "Worsening angina (rare, especially at initiation)", "Allergic reactions"],
      important: ["Dose-related peripheral edema is common and often limits dose."]
    },
    contraindications: [
      "Hypersensitivity to amlodipine",
      "Severe hypotension",
      "Cardiogenic shock",
      "Obstruction of the left ventricular outflow tract (e.g., high-grade aortic stenosis)"
    ],
    interactions: [
      { drug: "CYP3A4 inhibitors (e.g., ketoconazole, grapefruit)", interaction: "Increased amlodipine levels", significance: "MODERATE" },
      { drug: "Simvastatin", interaction: "Increased simvastatin exposure; limit simvastatin dose", significance: "MODERATE" },
      { drug: "Other antihypertensives", interaction: "Additive blood pressure lowering", significance: "MODERATE" }
    ],
    monitoring: ["Blood pressure", "Heart rate", "Peripheral edema", "Angina symptoms"],
    patientCounseling: [
      "Take once daily at the same time each day.",
      "May cause ankle swelling; elevate legs and report if bothersome.",
      "Rise slowly from sitting/lying to avoid dizziness.",
      "Do not stop suddenly without medical advice."
    ],
    specialPopulations: {
      pregnancy: "Category C.",
      breastfeeding: "Present in milk; discuss risks/benefits.",
      pediatric: "Approved for hypertension ≥6 years.",
      elderly: "Start at lower dose.",
      renal: "No adjustment needed.",
      hepatic: "Start at 2.5 mg; titrate carefully."
    },
    storage: "Store at room temperature.",
    references: ["Standard cardiology and pharmacology references"]
  },
  {
    id: "lisinopril",
    genericName: "Lisinopril",
    brandNames: ["Prinivil", "Zestril", "Qbrelis"],
    drugClass: "Angiotensin-Converting Enzyme (ACE) Inhibitor",
    therapeuticClass: "Antihypertensive / Heart Failure",
    mechanismOfAction: "Inhibits angiotensin-converting enzyme, preventing conversion of angiotensin I to angiotensin II. This leads to reduced vasoconstriction, reduced aldosterone secretion, and decreased sodium and water retention. Also increases bradykinin levels.",
    mechanismFlow: ["Drug", "ACE enzyme", "Decreased angiotensin II / increased bradykinin", "Vasodilation + reduced aldosterone", "Lower blood pressure + reduced afterload"],
    pharmacokinetics: {
      absorption: "Oral bioavailability ~25%. Not affected by food.",
      distribution: "Does not cross blood-brain barrier significantly. Low protein binding.",
      metabolism: "Not metabolized; excreted unchanged.",
      excretion: "Entirely renal. Half-life ~12 hours."
    },
    indications: [
      "Hypertension",
      "Heart failure with reduced ejection fraction",
      "Post-myocardial infarction",
      "Diabetic nephropathy (selected)"
    ],
    dosage: {
      routes: ["Oral"],
      adult: "Hypertension: start 10 mg daily (lower if on diuretic). Heart failure: start 2.5-5 mg. Target doses higher per guidelines. Refer to current recommendations.",
      pediatric: "Approved ≥6 years for hypertension. Weight-based.",
      notes: "Educational only. Monitor renal function and potassium. Black patients may have reduced response as monotherapy."
    },
    adverseEffects: {
      common: ["Dry cough", "Dizziness", "Headache", "Hyperkalemia", "Fatigue"],
      serious: ["Angioedema", "Severe hypotension", "Acute kidney injury", "Hyperkalemia"],
      important: ["Cough is common and may require switching to ARB."]
    },
    contraindications: [
      "History of angioedema related to previous ACE inhibitor",
      "Hereditary or idiopathic angioedema",
      "Concomitant use with aliskiren in diabetes",
      "Pregnancy"
    ],
    interactions: [
      { drug: "Potassium-sparing diuretics / supplements", interaction: "Increased hyperkalemia risk", significance: "HIGH" },
      { drug: "NSAIDs", interaction: "Reduced antihypertensive effect; increased renal risk", significance: "MODERATE" },
      { drug: "Lithium", interaction: "Increased lithium levels", significance: "HIGH" },
      { drug: "ARBs or aliskiren", interaction: "Dual blockade increases adverse effects", significance: "HIGH" }
    ],
    monitoring: ["Blood pressure", "Serum potassium", "Renal function (creatinine)", "Signs of angioedema"],
    patientCounseling: [
      "May cause a dry, persistent cough; report if bothersome.",
      "Report swelling of face, lips, tongue, or difficulty breathing immediately (angioedema).",
      "Rise slowly to avoid dizziness.",
      "Regular blood tests for kidney function and potassium are needed.",
      "Do not use if pregnant or planning pregnancy."
    ],
    specialPopulations: {
      pregnancy: "Category D / Boxed warning. Discontinue as soon as pregnancy detected.",
      breastfeeding: "Limited data; alternative preferred.",
      pediatric: "Approved for hypertension ≥6 years.",
      elderly: "Start low; monitor renal function.",
      renal: "Dose adjustment required; risk of further deterioration.",
      hepatic: "No specific adjustment."
    },
    storage: "Store at room temperature.",
    references: ["Standard cardiology guidelines and pharmacology references"]
  },
  {
    id: "losartan",
    genericName: "Losartan",
    brandNames: ["Cozaar"],
    drugClass: "Angiotensin II Receptor Blocker (ARB)",
    therapeuticClass: "Antihypertensive / Heart Failure / Nephroprotective",
    mechanismOfAction: "Selectively blocks the AT1 receptor for angiotensin II. This prevents angiotensin II-mediated vasoconstriction, aldosterone release, and sodium retention without affecting bradykinin (less cough than ACEIs).",
    mechanismFlow: ["Drug", "AT1 receptor", "Blocks angiotensin II effects", "Vasodilation + reduced aldosterone", "Lower BP + renal protection"],
    pharmacokinetics: {
      absorption: "Well absorbed; bioavailability ~33%. Extensive first-pass metabolism.",
      distribution: "Highly protein bound.",
      metabolism: "Converted by CYP2C9 and CYP3A4 to active metabolite E-3174 (more potent).",
      excretion: "Biliary and renal. Half-life of parent ~2 h; active metabolite 6-9 h."
    },
    indications: [
      "Hypertension",
      "Diabetic nephropathy in type 2 diabetes",
      "Stroke risk reduction in hypertension with left ventricular hypertrophy",
      "Heart failure (alternative to ACEI)"
    ],
    dosage: {
      routes: ["Oral"],
      adult: "Hypertension: 25-100 mg daily. Diabetic nephropathy: 50-100 mg daily. Refer to labeling.",
      pediatric: "Approved ≥6 years. Weight-based.",
      notes: "Educational only. Can be used in patients who develop cough on ACE inhibitors."
    },
    adverseEffects: {
      common: ["Dizziness", "Upper respiratory infection", "Nasal congestion", "Back pain"],
      serious: ["Hyperkalemia", "Angioedema (rare)", "Acute kidney injury", "Hypotension"],
      important: ["Lower incidence of cough compared with ACE inhibitors."]
    },
    contraindications: [
      "Hypersensitivity to losartan",
      "Concomitant use with aliskiren in diabetes",
      "Pregnancy"
    ],
    interactions: [
      { drug: "Potassium-sparing agents", interaction: "Hyperkalemia risk", significance: "HIGH" },
      { drug: "NSAIDs", interaction: "Reduced effect; renal risk", significance: "MODERATE" },
      { drug: "Lithium", interaction: "Increased lithium levels", significance: "HIGH" },
      { drug: "CYP2C9 inhibitors", interaction: "May affect active metabolite", significance: "MODERATE" }
    ],
    monitoring: ["Blood pressure", "Serum potassium", "Renal function"],
    patientCounseling: [
      "Can be taken with or without food.",
      "Report swelling of face/lips/tongue or difficulty breathing.",
      "Regular monitoring of kidney function and potassium is important.",
      "Do not use if pregnant."
    ],
    specialPopulations: {
      pregnancy: "Category D. Discontinue when pregnancy detected.",
      breastfeeding: "Not recommended.",
      pediatric: "Approved ≥6 years for hypertension.",
      elderly: "No major adjustment; monitor.",
      renal: "No initial adjustment for mild-moderate; monitor closely.",
      hepatic: "Start at lower dose in hepatic impairment."
    },
    storage: "Store at room temperature; protect from light.",
    references: ["Standard cardiology and pharmacology references"]
  },
  {
    id: "atenolol",
    genericName: "Atenolol",
    brandNames: ["Tenormin"],
    drugClass: "Selective Beta-1 Adrenergic Blocker",
    therapeuticClass: "Antihypertensive / Antianginal / Antiarrhythmic",
    mechanismOfAction: "Selectively blocks beta-1 adrenergic receptors in the heart. Reduces heart rate, contractility, and cardiac output. Also reduces renin release. At higher doses may lose selectivity.",
    mechanismFlow: ["Drug", "Beta-1 receptors (heart)", "Decreased HR and contractility", "Reduced cardiac output / renin", "Lower blood pressure and myocardial oxygen demand"],
    pharmacokinetics: {
      absorption: "Oral bioavailability ~50%. Peak 2-4 hours.",
      distribution: "Low protein binding (~6-16%). Does not cross blood-brain barrier significantly (hydrophilic).",
      metabolism: "Minimal hepatic metabolism.",
      excretion: "Primarily renal excretion of unchanged drug. Half-life 6-7 hours."
    },
    indications: [
      "Hypertension",
      "Angina pectoris",
      "Post-myocardial infarction",
      "Arrhythmias (selected)"
    ],
    dosage: {
      routes: ["Oral", "Intravenous (acute settings)"],
      adult: "Hypertension/angina: 25-100 mg once daily. Post-MI: specific protocols. Refer to guidelines.",
      pediatric: "Not first-line; specialist use.",
      notes: "Educational only. Do not stop abruptly (risk of rebound). Dose adjust in renal impairment."
    },
    adverseEffects: {
      common: ["Bradycardia", "Fatigue", "Cold extremities", "Dizziness", "Depression", "Sexual dysfunction"],
      serious: ["Severe bradycardia", "Heart block", "Heart failure exacerbation", "Bronchospasm (less than non-selective)"],
      important: ["Abrupt withdrawal can cause rebound hypertension or angina."]
    },
    contraindications: [
      "Sinus bradycardia",
      "Heart block greater than first degree",
      "Cardiogenic shock",
      "Overt cardiac failure",
      "Hypersensitivity"
    ],
    interactions: [
      { drug: "Non-dihydropyridine calcium channel blockers (verapamil, diltiazem)", interaction: "Increased risk of bradycardia/heart block", significance: "HIGH" },
      { drug: "Clonidine", interaction: "Rebound hypertension if clonidine stopped while on beta-blocker", significance: "HIGH" },
      { drug: "Insulin / oral hypoglycemics", interaction: "May mask hypoglycemia symptoms", significance: "MODERATE" },
      { drug: "NSAIDs", interaction: "May reduce antihypertensive effect", significance: "MODERATE" }
    ],
    monitoring: ["Heart rate", "Blood pressure", "Signs of heart failure", "Blood glucose in diabetics"],
    patientCounseling: [
      "Take at the same time each day.",
      "Do not stop taking suddenly; dose must be tapered.",
      "May cause tiredness or cold hands/feet.",
      "Report very slow heartbeat, shortness of breath, or swelling.",
      "Can mask symptoms of low blood sugar."
    ],
    specialPopulations: {
      pregnancy: "Category D. Fetal risks; use only if clearly needed.",
      breastfeeding: "Excreted; monitor infant.",
      pediatric: "Limited data.",
      elderly: "Start low; increased sensitivity.",
      renal: "Dose reduction required in impairment.",
      hepatic: "No major adjustment."
    },
    storage: "Store at room temperature; protect from light and moisture.",
    references: ["Standard cardiology references"]
  },
  {
    id: "propranolol",
    genericName: "Propranolol",
    brandNames: ["Inderal", "Inderal LA", "Innopran XL"],
    drugClass: "Non-selective Beta-Adrenergic Blocker",
    therapeuticClass: "Antihypertensive / Antianginal / Antiarrhythmic / Migraine Prophylaxis",
    mechanismOfAction: "Non-selectively blocks beta-1 and beta-2 adrenergic receptors. Reduces heart rate, contractility, and cardiac output. Also has membrane-stabilizing effects and reduces renin. Blocks peripheral beta-2 receptors (can cause bronchoconstriction).",
    mechanismFlow: ["Drug", "Beta-1 and Beta-2 receptors", "Decreased HR/contractility + peripheral effects", "Reduced cardiac output", "Lower BP and reduced oxygen demand"],
    pharmacokinetics: {
      absorption: "Almost complete; extensive first-pass metabolism. Bioavailability ~25%.",
      distribution: "Highly protein bound (~90%). Crosses blood-brain barrier (lipophilic).",
      metabolism: "Extensive hepatic metabolism (CYP2D6, others). Active metabolite 4-hydroxypropranolol.",
      excretion: "Metabolites excreted in urine. Half-life 3-6 hours (longer for sustained-release)."
    },
    indications: [
      "Hypertension",
      "Angina",
      "Arrhythmias",
      "Post-MI",
      "Migraine prophylaxis",
      "Essential tremor",
      "Performance anxiety (off-label)",
      "Thyrotoxicosis (adjunctive)"
    ],
    dosage: {
      routes: ["Oral", "Intravenous"],
      adult: "Highly variable by indication. Hypertension: 40-160 mg twice daily or sustained-release. Migraine: 80-240 mg/day. Refer to specific dosing.",
      pediatric: "Used for certain indications (e.g., infantile hemangioma with specific formulations).",
      notes: "Educational only. Multiple formulations. Do not stop abruptly."
    },
    adverseEffects: {
      common: ["Fatigue", "Bradycardia", "Cold extremities", "Sleep disturbances / nightmares", "Sexual dysfunction"],
      serious: ["Severe bradycardia / heart block", "Bronchospasm", "Heart failure exacerbation", "Depression", "Masking of hypoglycemia"],
      important: ["Contraindicated in asthma due to beta-2 blockade."]
    },
    contraindications: [
      "Asthma / severe COPD",
      "Sinus bradycardia",
      "Heart block > first degree",
      "Cardiogenic shock",
      "Decompensated heart failure"
    ],
    interactions: [
      { drug: "Verapamil / diltiazem", interaction: "Severe bradycardia / heart block risk", significance: "HIGH" },
      { drug: "CYP2D6 inhibitors", interaction: "Increased propranolol levels", significance: "MODERATE" },
      { drug: "Insulin", interaction: "Masks hypoglycemia; prolonged recovery", significance: "HIGH" },
      { drug: "Clonidine", interaction: "Rebound hypertension risk", significance: "HIGH" }
    ],
    monitoring: ["Heart rate", "Blood pressure", "Respiratory status", "Blood glucose", "Mood changes"],
    patientCounseling: [
      "Take consistently with regard to meals.",
      "Do not discontinue abruptly.",
      "May cause vivid dreams or tiredness.",
      "Report wheezing, very slow pulse, or depression.",
      "Can hide signs of low blood sugar."
    ],
    specialPopulations: {
      pregnancy: "Category C/D. Risks to fetus; specialist decision.",
      breastfeeding: "Excreted; monitor infant.",
      pediatric: "Specific uses (hemangioma).",
      elderly: "Increased sensitivity; start low.",
      renal: "No major adjustment.",
      hepatic: "Reduce dose in impairment (extensive metabolism)."
    },
    storage: "Store at room temperature; protect from light.",
    references: ["Standard pharmacology and cardiology references"]
  },
  {
    id: "azithromycin",
    genericName: "Azithromycin",
    brandNames: ["Zithromax", "Z-Pak", "Azasite"],
    drugClass: "Macrolide Antibiotic",
    therapeuticClass: "Antibiotic",
    mechanismOfAction: "Binds to the 50S subunit of the bacterial ribosome, inhibiting translocation steps of protein synthesis. Bacteriostatic (bactericidal against some organisms at higher concentrations). Concentrates intracellularly.",
    mechanismFlow: ["Drug", "50S ribosomal subunit", "Inhibits protein synthesis", "Stops bacterial growth", "Therapeutic antibacterial effect"],
    pharmacokinetics: {
      absorption: "Rapidly absorbed; bioavailability ~37%. Food can reduce absorption of some formulations.",
      distribution: "Extensive tissue distribution and high intracellular concentrations. Long tissue half-life.",
      metabolism: "Hepatic; demethylation.",
      excretion: "Primarily biliary. Half-life ~68 hours (allows short courses)."
    },
    indications: [
      "Community-acquired pneumonia",
      "Acute bacterial sinusitis",
      "Pharyngitis / tonsillitis",
      "Uncomplicated skin infections",
      "Chlamydia trachomatis infections",
      "Mycobacterium avium complex (prophylaxis/treatment in selected patients)",
      "Traveler’s diarrhea (selected)"
    ],
    dosage: {
      routes: ["Oral", "Intravenous"],
      adult: "Common Z-Pak: 500 mg day 1, then 250 mg days 2-5. Other regimens vary by indication. Refer to guidelines.",
      pediatric: "Weight-based (typically 10 mg/kg day 1, then 5 mg/kg). Refer to pediatric sources.",
      notes: "Educational only. Complete the course. Caution in patients with QT prolongation risk."
    },
    adverseEffects: {
      common: ["Diarrhea", "Nausea", "Abdominal pain", "Vomiting"],
      serious: ["QT prolongation / torsades de pointes", "Hepatotoxicity", "Clostridioides difficile diarrhea", "Severe allergic reactions", "Hearing loss (rare, high dose)"],
      important: ["Associated with increased cardiovascular death risk in some studies; use judiciously."]
    },
    contraindications: [
      "Hypersensitivity to azithromycin or other macrolides",
      "History of cholestatic jaundice/hepatic dysfunction with prior azithromycin use"
    ],
    interactions: [
      { drug: "Drugs that prolong QT (e.g., certain antiarrhythmics, antipsychotics)", interaction: "Additive QT prolongation", significance: "HIGH" },
      { drug: "Warfarin", interaction: "Possible increased anticoagulant effect", significance: "MODERATE" },
      { drug: "Digoxin", interaction: "May increase digoxin levels", significance: "MODERATE" },
      { drug: "Nelfinavir", interaction: "Increased azithromycin levels", significance: "MODERATE" }
    ],
    monitoring: ["Clinical response", "Liver function (if prolonged use)", "ECG if QT risk factors", "Hearing (high-dose prolonged)"],
    patientCounseling: [
      "Take the full course.",
      "Can be taken with or without food (check specific product).",
      "Report severe diarrhea, irregular heartbeat, or yellowing of skin/eyes.",
      "Antacids may reduce absorption; separate dosing."
    ],
    specialPopulations: {
      pregnancy: "Category B.",
      breastfeeding: "Compatible; monitor infant.",
      pediatric: "Widely used.",
      elderly: "Higher risk of QT effects.",
      renal: "No adjustment for mild-moderate; caution in severe.",
      hepatic: "Use caution; contraindicated if prior hepatic injury from drug."
    },
    storage: "Store at room temperature. Suspension: follow product instructions (often room temp after mixing).",
    references: ["Standard infectious disease references"]
  },
  {
    id: "ciprofloxacin",
    genericName: "Ciprofloxacin",
    brandNames: ["Cipro", "Cipro XR"],
    drugClass: "Fluoroquinolone Antibiotic",
    therapeuticClass: "Antibiotic",
    mechanismOfAction: "Inhibits bacterial DNA gyrase (topoisomerase II) and topoisomerase IV, enzymes essential for DNA replication, transcription, and repair. Bactericidal.",
    mechanismFlow: ["Drug", "DNA gyrase / topoisomerase IV", "Inhibits DNA replication", "Bacterial cell death", "Antibacterial effect"],
    pharmacokinetics: {
      absorption: "Well absorbed orally (~70%). Food delays but does not reduce extent significantly. Divalent cations reduce absorption.",
      distribution: "Wide distribution including prostate, bone, and CSF (moderate).",
      metabolism: "Partial hepatic metabolism.",
      excretion: "Renal and fecal. Half-life ~4 hours."
    },
    indications: [
      "Complicated urinary tract infections",
      "Pyelonephritis",
      "Bone and joint infections",
      "Infectious diarrhea (selected pathogens)",
      "Anthrax (post-exposure)",
      "Certain gram-negative infections",
      "Note: Restricted use due to adverse effect profile"
    ],
    dosage: {
      routes: ["Oral", "Intravenous"],
      adult: "Typical 250-750 mg every 12 hours oral depending on infection. Refer to current guidelines and resistance patterns.",
      pediatric: "Generally avoided due to cartilage concerns except specific indications (e.g., anthrax, complicated UTI).",
      notes: "Educational only. Reserve for appropriate indications. Avoid with dairy/antacids."
    },
    adverseEffects: {
      common: ["Nausea", "Diarrhea", "Headache", "Dizziness"],
      serious: ["Tendinitis / tendon rupture", "Peripheral neuropathy", "CNS effects (seizures, psychosis)", "QT prolongation", "Aortic aneurysm/dissection risk", "Clostridioides difficile", "Dysglycemia"],
      important: ["Black box warnings for tendon, neuropathy, CNS, and exacerbation of myasthenia gravis."]
    },
    contraindications: [
      "Hypersensitivity to ciprofloxacin or other quinolones",
      "Concomitant tizanidine",
      "Myasthenia gravis (exacerbation risk)"
    ],
    interactions: [
      { drug: "Antacids / iron / calcium / dairy", interaction: "Markedly reduced absorption", significance: "HIGH" },
      { drug: "Theophylline", interaction: "Increased theophylline levels", significance: "HIGH" },
      { drug: "Warfarin", interaction: "Increased anticoagulant effect", significance: "MODERATE" },
      { drug: "QT-prolonging drugs", interaction: "Additive risk", significance: "HIGH" },
      { drug: "Tizanidine", interaction: "Contraindicated; large increase in tizanidine levels", significance: "HIGH" }
    ],
    monitoring: ["Clinical response", "Tendon symptoms", "CNS effects", "Blood glucose", "QT if risk factors", "Renal function"],
    patientCounseling: [
      "Take 2 hours before or 6 hours after antacids, iron, calcium, or dairy.",
      "Drink plenty of fluids.",
      "Avoid excessive sun exposure.",
      "Report tendon pain/swelling, numbness, mood changes, or irregular heartbeat immediately.",
      "Complete the full course."
    ],
    specialPopulations: {
      pregnancy: "Category C. Generally avoided.",
      breastfeeding: "Excreted; alternative preferred.",
      pediatric: "Restricted use due to musculoskeletal concerns.",
      elderly: "Higher risk of tendon rupture and aortic events.",
      renal: "Dose adjustment required.",
      hepatic: "No major adjustment usually."
    },
    storage: "Store at room temperature. Protect from light and moisture.",
    references: ["Standard infectious disease references; FDA safety communications"]
  },
  {
    id: "doxycycline",
    genericName: "Doxycycline",
    brandNames: ["Vibramycin", "Doryx", "Oracea", "Acticlate"],
    drugClass: "Tetracycline Antibiotic",
    therapeuticClass: "Antibiotic / Anti-inflammatory (selected uses)",
    mechanismOfAction: "Binds to the 30S ribosomal subunit, preventing attachment of aminoacyl-tRNA and thus inhibiting protein synthesis. Bacteriostatic. Also has anti-inflammatory properties useful in certain dermatologic conditions.",
    mechanismFlow: ["Drug", "30S ribosomal subunit", "Inhibits protein synthesis", "Stops bacterial growth", "Antibacterial / anti-inflammatory effect"],
    pharmacokinetics: {
      absorption: "Almost completely absorbed. Food and dairy reduce absorption somewhat but less than older tetracyclines.",
      distribution: "Wide distribution; good tissue and intracellular penetration. Crosses placenta.",
      metabolism: "Minimal.",
      excretion: "Primarily fecal (biliary); some renal. Half-life 16-22 hours (allows once/twice daily)."
    },
    indications: [
      "Respiratory tract infections (selected)",
      "Acne vulgaris",
      "Rosacea",
      "Chlamydia infections",
      "Lyme disease",
      "Rocky Mountain spotted fever / other rickettsial diseases",
      "Malaria prophylaxis (selected)",
      "Anthrax",
      "Periodontitis (subantimicrobial doses)"
    ],
    dosage: {
      routes: ["Oral", "Intravenous"],
      adult: "Typical 100 mg every 12 hours on day 1, then 100 mg daily or every 12 hours. Acne regimens vary. Refer to indication.",
      pediatric: "Avoid in children <8 years if possible (tooth staining). Weight-based when used.",
      notes: "Educational only. Take with adequate fluid; remain upright."
    },
    adverseEffects: {
      common: ["Nausea", "Vomiting", "Diarrhea", "Photosensitivity", "Esophagitis / esophageal ulceration"],
      serious: ["Severe photosensitivity", "Intracranial hypertension", "Clostridioides difficile", "Hepatotoxicity (rare)", "Tooth discoloration (children)"],
      important: ["Can cause permanent tooth staining if given during tooth development."]
    },
    contraindications: [
      "Hypersensitivity to tetracyclines",
      "Last half of pregnancy",
      "Infancy and childhood up to age 8 years (tooth development)",
      "Severe hepatic impairment (relative)"
    ],
    interactions: [
      { drug: "Antacids / iron / calcium / dairy", interaction: "Reduced absorption", significance: "HIGH" },
      { drug: "Warfarin", interaction: "May enhance anticoagulant effect", significance: "MODERATE" },
      { drug: "Oral contraceptives", interaction: "Possible reduced efficacy", significance: "LOW" },
      { drug: "Retinoids", interaction: "Increased intracranial hypertension risk", significance: "HIGH" }
    ],
    monitoring: ["Clinical response", "Signs of photosensitivity", "Hepatic function (prolonged use)", "Intracranial pressure symptoms"],
    patientCounseling: [
      "Take with a full glass of water and remain upright for at least 30 minutes.",
      "Avoid taking with dairy, antacids, or iron supplements (separate by 2 hours).",
      "Use strong sunscreen; medication increases sun sensitivity.",
      "Do not use if pregnant or in young children unless specifically directed.",
      "Complete the course."
    ],
    specialPopulations: {
      pregnancy: "Category D. Tooth and bone effects on fetus.",
      breastfeeding: "Excreted; short-term use may be acceptable; avoid prolonged.",
      pediatric: "Avoid <8 years when possible.",
      elderly: "Generally well tolerated; watch renal function.",
      renal: "Preferred tetracycline in renal impairment (less accumulation).",
      hepatic: "Use caution."
    },
    storage: "Store at room temperature; protect from light and moisture. Discard outdated product (Fanconi syndrome risk with degraded tetracyclines).",
    references: ["Standard infectious disease and dermatology references"]
  },
  {
    id: "metronidazole",
    genericName: "Metronidazole",
    brandNames: ["Flagyl", "MetroGel", "Noritate"],
    drugClass: "Nitroimidazole Antibiotic / Antiprotozoal",
    therapeuticClass: "Antibiotic / Antiprotozoal",
    mechanismOfAction: "Enters the cell under anaerobic conditions and is reduced to reactive intermediates that damage DNA and other macromolecules, leading to cell death. Active against anaerobic bacteria and certain protozoa.",
    mechanismFlow: ["Drug", "Anaerobic reduction to toxic intermediates", "DNA damage", "Cell death", "Antimicrobial effect"],
    pharmacokinetics: {
      absorption: "Well absorbed orally. Topical and vaginal formulations also available.",
      distribution: "Wide distribution including CSF, bone, abscesses. Crosses placenta.",
      metabolism: "Hepatic (oxidation and glucuronidation).",
      excretion: "Urine and feces. Half-life ~8 hours."
    },
    indications: [
      "Anaerobic bacterial infections",
      "Bacterial vaginosis",
      "Trichomoniasis",
      "Amebiasis",
      "Giardiasis",
      "Clostridioides difficile infection (selected regimens)",
      "H. pylori eradication (combination)",
      "Rosacea (topical)"
    ],
    dosage: {
      routes: ["Oral", "Intravenous", "Topical", "Vaginal"],
      adult: "Varies widely by indication (e.g., 250-750 mg every 8 hours oral). Refer to specific infection guidelines.",
      pediatric: "Weight-based. Refer to pediatric infectious disease sources.",
      notes: "Educational only. Avoid alcohol during and for 48-72 hours after treatment."
    },
    adverseEffects: {
      common: ["Nausea", "Metallic taste", "Headache", "Dry mouth", "Dark urine"],
      serious: ["Peripheral neuropathy (prolonged use)", "Seizures", "Encephalopathy", "Severe cutaneous reactions", "Disulfiram-like reaction with alcohol"],
      important: ["Alcohol can cause severe nausea, vomiting, flushing (disulfiram-like)."]
    },
    contraindications: [
      "Hypersensitivity to metronidazole or other nitroimidazoles",
      "First trimester of pregnancy for trichomoniasis (historical; current guidance may differ by indication)",
      "Use of disulfiram within 2 weeks",
      "Alcohol use during therapy"
    ],
    interactions: [
      { drug: "Alcohol", interaction: "Disulfiram-like reaction", significance: "HIGH" },
      { drug: "Warfarin", interaction: "Increased anticoagulant effect", significance: "HIGH" },
      { drug: "Lithium", interaction: "Increased lithium toxicity risk", significance: "MODERATE" },
      { drug: "CYP3A4 substrates", interaction: "May affect levels of some drugs", significance: "MODERATE" }
    ],
    monitoring: ["Clinical response", "Neurologic symptoms (prolonged therapy)", "Liver function (rare)", "CBC (prolonged)"],
    patientCounseling: [
      "Do not drink alcohol during treatment and for at least 3 days after finishing.",
      "May cause metallic taste and dark urine (harmless).",
      "Report numbness, tingling, or seizures.",
      "Complete the full course.",
      "For vaginal gel: follow application instructions."
    ],
    specialPopulations: {
      pregnancy: "Category B. Avoid in first trimester when possible for certain indications.",
      breastfeeding: "Excreted; may cause infant GI upset; pump and discard for high-dose short courses sometimes recommended.",
      pediatric: "Used for specific indications.",
      elderly: "Higher risk of neuropathy with prolonged use.",
      renal: "No major adjustment; metabolites may accumulate in severe impairment.",
      hepatic: "Dose reduction in severe impairment."
    },
    storage: "Store at room temperature; protect from light.",
    references: ["Standard infectious disease references"]
  },
  {
    id: "paracetamol",
    genericName: "Paracetamol (Acetaminophen)",
    brandNames: ["Tylenol", "Panadol", "Ofirmev"],
    drugClass: "Analgesic / Antipyretic",
    therapeuticClass: "Pain Reliever / Fever Reducer",
    mechanismOfAction: "Primarily central inhibition of prostaglandin synthesis via effects on COX enzymes (particularly a COX-2 variant) in the CNS. Also may involve the serotonergic pathways and endocannabinoid system. Minimal anti-inflammatory effect at usual doses.",
    mechanismFlow: ["Drug", "Central COX inhibition / other central pathways", "Reduced prostaglandin synthesis in CNS", "Decreased pain signal transmission and fever", "Analgesia and antipyresis"],
    pharmacokinetics: {
      absorption: "Rapid and almost complete oral absorption. Peak 30-60 min.",
      distribution: "Low protein binding. Widely distributed.",
      metabolism: "Hepatic: mainly glucuronidation and sulfation; small amount via CYP2E1 to toxic NAPQI (normally detoxified by glutathione).",
      excretion: "Metabolites in urine. Half-life 1-3 hours."
    },
    indications: [
      "Mild to moderate pain",
      "Fever",
      "Osteoarthritis (symptom relief)",
      "Adjunct in multimodal analgesia"
    ],
    dosage: {
      routes: ["Oral", "Rectal", "Intravenous"],
      adult: "325-1000 mg every 4-6 hours as needed. Maximum 3-4 g/day depending on guidelines and risk factors. Refer to current recommendations.",
      pediatric: "10-15 mg/kg every 4-6 hours. Do not exceed recommended daily maximum.",
      notes: "Educational only. Overdose can cause severe hepatotoxicity. Account for all sources of acetaminophen."
    },
    adverseEffects: {
      common: ["Generally well tolerated at recommended doses", "Rare rash"],
      serious: ["Acute liver failure (overdose)", "Severe cutaneous reactions (rare)", "Anaphylaxis (rare)"],
      important: ["Leading cause of acute liver failure in many countries when taken in overdose."]
    },
    contraindications: [
      "Severe hepatic impairment / active liver disease",
      "Hypersensitivity to acetaminophen"
    ],
    interactions: [
      { drug: "Alcohol (chronic)", interaction: "Increased hepatotoxicity risk", significance: "HIGH" },
      { drug: "Warfarin", interaction: "High doses may increase INR", significance: "MODERATE" },
      { drug: "CYP2E1 inducers (e.g., isoniazid, chronic alcohol)", interaction: "Increased toxic metabolite", significance: "HIGH" },
      { drug: "Carbamazepine / phenytoin", interaction: "Possible increased hepatotoxicity risk", significance: "MODERATE" }
    ],
    monitoring: ["Total daily dose from all sources", "Liver function if prolonged high-dose use or overdose risk", "Pain/fever response"],
    patientCounseling: [
      "Do not exceed the maximum recommended daily dose.",
      "Check all medications (including cold remedies) for acetaminophen content.",
      "Avoid or limit alcohol.",
      "Seek immediate medical help if overdose is suspected, even if feeling well.",
      "Safe in pregnancy when used as directed."
    ],
    specialPopulations: {
      pregnancy: "Category B. Preferred analgesic/antipyretic.",
      breastfeeding: "Compatible.",
      pediatric: "Widely used; careful dosing by weight.",
      elderly: "Generally safe; consider lower maximum in frailty.",
      renal: "No major adjustment for occasional use.",
      hepatic: "Avoid or use lowest effective dose with extreme caution."
    },
    storage: "Store at room temperature.",
    references: ["Standard pharmacology and toxicology references"]
  },
  {
    id: "ibuprofen",
    genericName: "Ibuprofen",
    brandNames: ["Advil", "Motrin", "Nurofen"],
    drugClass: "Nonsteroidal Anti-Inflammatory Drug (NSAID) – Propionic Acid Derivative",
    therapeuticClass: "Analgesic / Anti-inflammatory / Antipyretic",
    mechanismOfAction: "Non-selective inhibitor of cyclooxygenase (COX-1 and COX-2), reducing synthesis of prostaglandins involved in inflammation, pain, and fever. Also affects other mediators.",
    mechanismFlow: ["Drug", "COX-1 and COX-2 enzymes", "Decreased prostaglandin synthesis", "Reduced inflammation, pain, fever", "Therapeutic effect"],
    pharmacokinetics: {
      absorption: "Rapidly and well absorbed. Peak 1-2 hours. Food delays absorption.",
      distribution: "Highly protein bound (>98%).",
      metabolism: "Hepatic oxidation and conjugation.",
      excretion: "Metabolites in urine. Half-life 2-4 hours."
    },
    indications: [
      "Mild to moderate pain",
      "Inflammation (arthritis, soft tissue)",
      "Fever",
      "Dysmenorrhea",
      "Migraine (selected)",
      "Patent ductus arteriosus closure (IV neonatal formulation)"
    ],
    dosage: {
      routes: ["Oral", "Intravenous", "Topical"],
      adult: "200-400 mg every 4-6 hours as needed. Maximum OTC usually 1200 mg/day; prescription higher under supervision. Refer to labeling.",
      pediatric: "5-10 mg/kg every 6-8 hours. Refer to pediatric dosing.",
      notes: "Educational only. Use lowest effective dose for shortest duration. GI and cardiovascular risks."
    },
    adverseEffects: {
      common: ["Dyspepsia", "Nausea", "Abdominal pain", "Headache", "Dizziness"],
      serious: ["GI bleeding / ulceration", "Myocardial infarction / stroke risk", "Acute kidney injury", "Severe skin reactions", "Anaphylaxis", "Heart failure exacerbation"],
      important: ["Black box warning for cardiovascular and GI risk."]
    },
    contraindications: [
      "History of asthma, urticaria, or allergic reaction to aspirin or other NSAIDs",
      "Perioperative pain in CABG surgery",
      "Third trimester of pregnancy (ductus arteriosus closure risk)",
      "Active GI bleeding"
    ],
    interactions: [
      { drug: "Aspirin (low-dose)", interaction: "May interfere with antiplatelet effect; increased GI risk", significance: "MODERATE" },
      { drug: "Anticoagulants / antiplatelets", interaction: "Increased bleeding risk", significance: "HIGH" },
      { drug: "ACE inhibitors / ARBs / diuretics", interaction: "Reduced antihypertensive effect; increased renal risk", significance: "HIGH" },
      { drug: "Lithium", interaction: "Increased lithium levels", significance: "HIGH" },
      { drug: "Methotrexate", interaction: "Increased methotrexate toxicity", significance: "HIGH" }
    ],
    monitoring: ["Pain/inflammation response", "Blood pressure", "Renal function", "Signs of GI bleeding", "Cardiovascular symptoms"],
    patientCounseling: [
      "Take with food or milk to reduce stomach upset.",
      "Use the lowest effective dose for the shortest time.",
      "Report black stools, severe stomach pain, chest pain, or swelling.",
      "Avoid if you have had allergic reactions to aspirin or other NSAIDs.",
      "Do not use in late pregnancy unless directed."
    ],
    specialPopulations: {
      pregnancy: "Avoid in third trimester. Category C earlier.",
      breastfeeding: "Compatible at usual doses.",
      pediatric: "Widely used; careful dosing.",
      elderly: "Higher risk of GI, renal, and CV adverse effects; use caution.",
      renal: "Avoid in significant impairment.",
      hepatic: "Use caution."
    },
    storage: "Store at room temperature.",
    references: ["Standard pharmacology and pain management references"]
  },
  {
    id: "naproxen",
    genericName: "Naproxen",
    brandNames: ["Naprosyn", "Aleve", "Anaprox"],
    drugClass: "Nonsteroidal Anti-Inflammatory Drug (NSAID) – Propionic Acid Derivative",
    therapeuticClass: "Analgesic / Anti-inflammatory / Antipyretic",
    mechanismOfAction: "Non-selective COX-1 and COX-2 inhibitor. Reduces prostaglandin synthesis, thereby decreasing inflammation, pain, and fever. Longer half-life than ibuprofen allows less frequent dosing.",
    mechanismFlow: ["Drug", "COX enzymes", "Decreased prostaglandins", "Reduced inflammation and pain", "Therapeutic effect"],
    pharmacokinetics: {
      absorption: "Well absorbed. Peak 1-4 hours depending on formulation.",
      distribution: "Highly protein bound (>99%).",
      metabolism: "Hepatic.",
      excretion: "Primarily urine as metabolites. Half-life 12-17 hours."
    },
    indications: [
      "Rheumatoid arthritis",
      "Osteoarthritis",
      "Ankylosing spondylitis",
      "Juvenile arthritis",
      "Tendinitis / bursitis",
      "Dysmenorrhea",
      "Acute gout",
      "Mild to moderate pain / fever"
    ],
    dosage: {
      routes: ["Oral"],
      adult: "250-500 mg twice daily. OTC: 220 mg every 8-12 hours. Maximum varies by product. Refer to labeling.",
      pediatric: "Weight-based for juvenile arthritis. Refer to pediatric sources.",
      notes: "Educational only. Longer duration than ibuprofen. Same class warnings apply."
    },
    adverseEffects: {
      common: ["Dyspepsia", "Heartburn", "Nausea", "Headache", "Drowsiness"],
      serious: ["GI ulceration/bleeding", "Cardiovascular events", "Renal impairment", "Severe skin reactions", "Anaphylaxis"],
      important: ["Same black box warnings as other non-selective NSAIDs."]
    },
    contraindications: [
      "Hypersensitivity to naproxen or other NSAIDs",
      "History of asthma/urticaria with aspirin/NSAIDs",
      "Perioperative CABG pain",
      "Third trimester pregnancy"
    ],
    interactions: [
      { drug: "Anticoagulants", interaction: "Increased bleeding risk", significance: "HIGH" },
      { drug: "ACEIs / ARBs / diuretics", interaction: "Reduced efficacy; renal risk", significance: "HIGH" },
      { drug: "Lithium", interaction: "Increased levels", significance: "HIGH" },
      { drug: "Methotrexate", interaction: "Increased toxicity", significance: "HIGH" },
      { drug: "Aspirin", interaction: "Increased GI risk; possible interference with antiplatelet effect", significance: "MODERATE" }
    ],
    monitoring: ["Symptom control", "BP", "Renal function", "GI symptoms", "CV symptoms"],
    patientCounseling: [
      "Take with food.",
      "Do not exceed recommended dose.",
      "Report stomach pain, black stools, swelling, or chest pain.",
      "Longer-acting than some other OTC pain relievers."
    ],
    specialPopulations: {
      pregnancy: "Avoid in third trimester.",
      breastfeeding: "Compatible.",
      pediatric: "Approved for certain ages/indications.",
      elderly: "Increased adverse effect risk.",
      renal: "Avoid in significant impairment.",
      hepatic: "Use caution."
    },
    storage: "Store at room temperature.",
    references: ["Standard pharmacology references"]
  },
  {
    id: "pantoprazole",
    genericName: "Pantoprazole",
    brandNames: ["Protonix"],
    drugClass: "Proton Pump Inhibitor (PPI)",
    therapeuticClass: "Antiulcer / Antisecretory",
    mechanismOfAction: "Irreversibly inhibits the gastric H+/K+-ATPase (proton pump) in parietal cells, suppressing acid secretion. More stable in acid than some other PPIs.",
    mechanismFlow: ["Drug", "Activated in parietal cell canaliculus", "Binds proton pump", "Inhibits acid secretion", "Reduced gastric acidity"],
    pharmacokinetics: {
      absorption: "Enteric-coated; bioavailability ~77%. Food delays absorption slightly.",
      distribution: "Protein binding ~98%.",
      metabolism: "Hepatic via CYP2C19 and CYP3A4. Less dependent on CYP2C19 than omeprazole.",
      excretion: "Metabolites in urine (~70%) and feces. Half-life ~1 hour; prolonged effect."
    },
    indications: [
      "Erosive esophagitis",
      "GERD",
      "Zollinger-Ellison syndrome",
      "Prevention of NSAID-associated ulcers (selected)",
      "H. pylori eradication (combination)"
    ],
    dosage: {
      routes: ["Oral", "Intravenous"],
      adult: "Typical 40 mg once daily. Higher for hypersecretory states. Refer to indication.",
      pediatric: "Approved for certain ages. Weight-based.",
      notes: "Educational only. IV available for patients unable to take oral."
    },
    adverseEffects: {
      common: ["Headache", "Diarrhea", "Nausea", "Abdominal pain", "Flatulence"],
      serious: ["C. difficile risk", "Hypomagnesemia", "B12 deficiency", "Fracture risk", "Acute interstitial nephritis", "Fundic gland polyps"],
      important: ["Similar long-term risks as other PPIs."]
    },
    contraindications: [
      "Hypersensitivity to pantoprazole or other PPIs",
      "Concomitant rilpivirine"
    ],
    interactions: [
      { drug: "Drugs requiring acid for absorption", interaction: "Reduced absorption", significance: "MODERATE" },
      { drug: "Warfarin", interaction: "Possible INR increase", significance: "MODERATE" },
      { drug: "Methotrexate", interaction: "May increase levels", significance: "MODERATE" },
      { drug: "Clopidogrel", interaction: "Less interaction than omeprazole (still caution)", significance: "LOW-MODERATE" }
    ],
    monitoring: ["Symptom control", "Magnesium (long-term)", "B12", "Bone health"],
    patientCounseling: [
      "Swallow tablets whole; do not crush.",
      "Can be taken with or without food.",
      "Report severe diarrhea or muscle symptoms.",
      "Long-term use should be reviewed periodically."
    ],
    specialPopulations: {
      pregnancy: "Category B.",
      breastfeeding: "Limited data; probably compatible.",
      pediatric: "Approved for specific indications/ages.",
      elderly: "No major adjustment.",
      renal: "No adjustment.",
      hepatic: "No adjustment for mild-moderate; caution in severe."
    },
    storage: "Store at room temperature.",
    references: ["Standard GI pharmacology references"]
  },
  {
    id: "metoclopramide",
    genericName: "Metoclopramide",
    brandNames: ["Reglan", "Metozolv"],
    drugClass: "Dopamine D2 Receptor Antagonist / Prokinetic",
    therapeuticClass: "Antiemetic / Gastroprokinetic",
    mechanismOfAction: "Blocks dopamine D2 receptors in the chemoreceptor trigger zone (antiemetic) and in the GI tract (prokinetic). Enhances acetylcholine response in GI smooth muscle, increasing motility and accelerating gastric emptying. Also has some 5-HT4 agonist activity.",
    mechanismFlow: ["Drug", "D2 receptors (CTZ and GI)", "Antiemetic + increased GI motility", "Reduced nausea + faster gastric emptying", "Therapeutic effect"],
    pharmacokinetics: {
      absorption: "Rapidly absorbed orally. Bioavailability ~80%.",
      distribution: "Low protein binding. Crosses blood-brain barrier and placenta.",
      metabolism: "Hepatic.",
      excretion: "Primarily urine. Half-life 5-6 hours."
    },
    indications: [
      "Nausea and vomiting (including chemotherapy-related, postoperative)",
      "Diabetic gastroparesis",
      "Gastroesophageal reflux (short-term)",
      "Facilitation of small bowel intubation",
      "Radiologic examination of GI tract"
    ],
    dosage: {
      routes: ["Oral", "Intravenous", "Intramuscular"],
      adult: "Typical 5-10 mg up to 4 times daily. Maximum duration usually 12 weeks due to tardive dyskinesia risk. Refer to labeling.",
      pediatric: "Use with extreme caution; higher risk of extrapyramidal effects.",
      notes: "Educational only. Black box warning for tardive dyskinesia. Limit duration."
    },
    adverseEffects: {
      common: ["Restlessness", "Drowsiness", "Fatigue", "Diarrhea"],
      serious: ["Tardive dyskinesia (may be irreversible)", "Extrapyramidal symptoms / acute dystonia", "Neuroleptic malignant syndrome", "Depression", "Hyperprolactinemia"],
      important: ["Risk of tardive dyskinesia increases with duration and total dose; avoid prolonged use."]
    },
    contraindications: [
      "History of tardive dyskinesia or dystonic reaction to metoclopramide",
      "Pheochromocytoma",
      "Seizure disorder (relative)",
      "GI hemorrhage, mechanical obstruction, or perforation",
      "Hypersensitivity"
    ],
    interactions: [
      { drug: "Antipsychotics", interaction: "Increased extrapyramidal and NMS risk", significance: "HIGH" },
      { drug: "CNS depressants", interaction: "Additive sedation", significance: "MODERATE" },
      { drug: "Strong CYP2D6 inhibitors", interaction: "Increased metoclopramide exposure", significance: "MODERATE" },
      { drug: "Levodopa", interaction: "Antagonism of effects", significance: "HIGH" }
    ],
    monitoring: ["Symptom control", "Extrapyramidal symptoms", "Mood changes", "Duration of therapy"],
    patientCounseling: [
      "Take 30 minutes before meals and at bedtime.",
      "Report any involuntary movements, muscle spasms, or restlessness immediately.",
      "May cause drowsiness; use caution with driving.",
      "Do not use for longer than prescribed (usually ≤12 weeks)."
    ],
    specialPopulations: {
      pregnancy: "Category B.",
      breastfeeding: "Excreted; may increase prolactin; caution.",
      pediatric: "Higher EPS risk; avoid if possible.",
      elderly: "Higher risk of tardive dyskinesia; use lowest dose shortest time.",
      renal: "Dose reduction in impairment.",
      hepatic: "Use caution."
    },
    storage: "Store at room temperature; protect from light.",
    references: ["Standard GI and pharmacology references; FDA boxed warning"]
  },
  {
    id: "glibenclamide",
    genericName: "Glibenclamide (Glyburide)",
    brandNames: ["Diabeta", "Micronase", "Glynase"],
    drugClass: "Second-Generation Sulfonylurea",
    therapeuticClass: "Antidiabetic / Oral Hypoglycemic",
    mechanismOfAction: "Binds to the SUR1 subunit of the ATP-sensitive potassium channel on pancreatic beta cells, causing channel closure, membrane depolarization, calcium influx, and insulin secretion. Also has some extrapancreatic effects.",
    mechanismFlow: ["Drug", "SUR1 / K-ATP channel (beta cell)", "Channel closure → depolarization", "Ca2+ influx → insulin release", "Lower blood glucose"],
    pharmacokinetics: {
      absorption: "Well absorbed. Micronized formulations have better bioavailability.",
      distribution: "Highly protein bound.",
      metabolism: "Hepatic to weakly active metabolites.",
      excretion: "Biliary and renal. Half-life ~10 hours (longer biological effect)."
    },
    indications: [
      "Type 2 diabetes mellitus (when diet and exercise insufficient)"
    ],
    dosage: {
      routes: ["Oral"],
      adult: "Usual 1.25-20 mg daily (regular) or micronized 0.75-12 mg. Start low. Refer to product labeling.",
      pediatric: "Not typically used.",
      notes: "Educational only. High risk of hypoglycemia compared with newer agents. Not preferred in elderly or renal impairment."
    },
    adverseEffects: {
      common: ["Hypoglycemia", "Weight gain", "Nausea", "Heartburn"],
      serious: ["Severe hypoglycemia", "Cholestatic jaundice", "Blood dyscrasias (rare)", "SIADH (rare)"],
      important: ["Long-acting; hypoglycemia can be prolonged and severe."]
    },
    contraindications: [
      "Type 1 diabetes",
      "Diabetic ketoacidosis",
      "Hypersensitivity to sulfonylureas or sulfonamides",
      "Severe renal or hepatic impairment"
    ],
    interactions: [
      { drug: "Other antidiabetics / insulin", interaction: "Additive hypoglycemia", significance: "HIGH" },
      { drug: "Alcohol", interaction: "Disulfiram-like reaction possible; hypoglycemia risk", significance: "MODERATE" },
      { drug: "CYP inhibitors / protein-bound drugs", interaction: "May increase effect", significance: "MODERATE" },
      { drug: "Beta-blockers", interaction: "Mask hypoglycemia symptoms", significance: "MODERATE" }
    ],
    monitoring: ["Blood glucose / HbA1c", "Signs of hypoglycemia", "Liver function", "Weight"],
    patientCounseling: [
      "Take with breakfast or the first main meal.",
      "Recognize and treat hypoglycemia promptly (sweating, shakiness, confusion).",
      "Carry a source of fast-acting sugar.",
      "Avoid skipping meals.",
      "Regular blood sugar monitoring is essential."
    ],
    specialPopulations: {
      pregnancy: "Category C. Insulin preferred.",
      breastfeeding: "Not recommended.",
      pediatric: "Not indicated.",
      elderly: "High hypoglycemia risk; generally avoid.",
      renal: "Avoid in significant impairment (active metabolites).",
      hepatic: "Avoid in significant impairment."
    },
    storage: "Store at room temperature.",
    references: ["Standard diabetes and pharmacology references"]
  },
  {
    id: "insulin",
    genericName: "Insulin (Human / Analogs)",
    brandNames: ["Various: Humulin, Novolin, Lantus, Humalog, NovoLog, Levemir, Tresiba, etc."],
    drugClass: "Insulin / Insulin Analog",
    therapeuticClass: "Antidiabetic / Hormone",
    mechanismOfAction: "Binds to insulin receptors, activating tyrosine kinase signaling pathways that promote glucose uptake (especially via GLUT4 translocation in muscle and fat), inhibit hepatic glucose production, and regulate lipid and protein metabolism.",
    mechanismFlow: ["Insulin", "Insulin receptor", "Signaling cascade", "GLUT4 translocation + metabolic effects", "Lower blood glucose"],
    pharmacokinetics: {
      absorption: "Depends on formulation: rapid-acting (lispro, aspart), short-acting (regular), intermediate (NPH), long-acting (glargine, detemir, degludec). Subcutaneous most common.",
      distribution: "Does not cross placenta significantly in usual doses.",
      metabolism: "Degraded in liver, kidney, and muscle.",
      excretion: "Minimal unchanged. Half-life varies greatly by type."
    },
    indications: [
      "Type 1 diabetes mellitus",
      "Type 2 diabetes mellitus (when oral agents insufficient or contraindicated)",
      "Diabetic ketoacidosis / hyperosmolar states",
      "Gestational diabetes (selected)",
      "Hyperkalemia (with glucose)"
    ],
    dosage: {
      routes: ["Subcutaneous", "Intravenous (regular insulin)", "Inhaled (selected products)"],
      adult: "Highly individualized based on glucose monitoring, carbohydrate intake, activity, and insulin sensitivity. Basal-bolus or other regimens. Refer to diabetes guidelines and product labeling.",
      pediatric: "Individualized; specialist management.",
      notes: "Educational only. Never share pens or vials. Rotate injection sites."
    },
    adverseEffects: {
      common: ["Hypoglycemia", "Injection site reactions", "Weight gain", "Lipodystrophy"],
      serious: ["Severe hypoglycemia", "Hypokalemia", "Allergic reactions", "Edema"],
      important: ["Hypoglycemia is the most common and serious adverse effect."]
    },
    contraindications: [
      "Hypoglycemia",
      "Hypersensitivity to the specific insulin product"
    ],
    interactions: [
      { drug: "Other antidiabetics", interaction: "Additive hypoglycemia risk", significance: "HIGH" },
      { drug: "Beta-blockers", interaction: "Mask hypoglycemia symptoms", significance: "MODERATE" },
      { drug: "Corticosteroids / thiazides / atypical antipsychotics", interaction: "Increase insulin requirements", significance: "MODERATE" },
      { drug: "ACE inhibitors", interaction: "May increase hypoglycemia risk", significance: "MODERATE" }
    ],
    monitoring: ["Blood glucose (frequent)", "HbA1c", "Injection sites", "Weight", "Potassium (IV use)", "Hypoglycemia symptoms"],
    patientCounseling: [
      "Learn proper injection technique and site rotation.",
      "Recognize and treat hypoglycemia immediately.",
      "Never share insulin pens or needles.",
      "Store unopened vials/pens in refrigerator; in-use according to product instructions.",
      "Carry identification and fast-acting carbohydrate.",
      "Dose adjustments may be needed with illness, exercise, or diet changes."
    ],
    specialPopulations: {
      pregnancy: "Category B/C depending on product. Preferred agent in pregnancy.",
      breastfeeding: "Compatible.",
      pediatric: "Essential for type 1; used in type 2 when needed.",
      elderly: "Higher hypoglycemia risk; simplified regimens preferred.",
      renal: "May need dose reduction (reduced clearance).",
      hepatic: "May need dose adjustment."
    },
    storage: "Unopened: refrigerate. In-use: follow specific product instructions (often room temperature for limited days). Protect from extreme heat/freezing.",
    references: ["American Diabetes Association guidelines; product prescribing information"]
  },
  {
    id: "chlorthalidone",
    genericName: "Chlorthalidone",
    brandNames: ["Thalitone", "Hygroton"],
    drugClass: "Thiazide-like Diuretic",
    therapeuticClass: "Diuretic / Antihypertensive",
    mechanismOfAction: "Inhibits the Na-Cl cotransporter in the distal convoluted tubule, similar to thiazides. Longer duration of action than hydrochlorothiazide. Reduces blood volume and has direct vascular effects.",
    mechanismFlow: ["Drug", "NCC in DCT", "Blocks NaCl reabsorption", "Increased Na/water excretion", "Diuresis + BP reduction"],
    pharmacokinetics: {
      absorption: "Well absorbed.",
      distribution: "Concentrates in erythrocytes; highly bound to carbonic anhydrase in RBCs.",
      metabolism: "Limited.",
      excretion: "Primarily renal. Half-life 40-60 hours (long)."
    },
    indications: [
      "Hypertension (often preferred thiazide-like agent in guidelines)",
      "Edema"
    ],
    dosage: {
      routes: ["Oral"],
      adult: "Hypertension: 12.5-25 mg once daily. Edema: higher. Refer to guidelines.",
      pediatric: "Limited data.",
      notes: "Educational only. More potent and longer-acting than HCTZ at equivalent doses."
    },
    adverseEffects: {
      common: ["Hypokalemia", "Hyponatremia", "Hyperuricemia", "Hyperglycemia", "Hyperlipidemia"],
      serious: ["Severe electrolyte imbalance", "Acute kidney injury"],
      important: ["Longer half-life may increase risk of electrolyte disturbances."]
    },
    contraindications: [
      "Anuria",
      "Hypersensitivity to chlorthalidone or sulfonamides",
      "Severe renal failure"
    ],
    interactions: [
      { drug: "Lithium", interaction: "Reduced clearance", significance: "HIGH" },
      { drug: "NSAIDs", interaction: "Reduced diuretic effect", significance: "MODERATE" },
      { drug: "Digoxin", interaction: "Hypokalemia increases toxicity", significance: "HIGH" }
    ],
    monitoring: ["Electrolytes", "Renal function", "BP", "Glucose", "Uric acid"],
    patientCounseling: [
      "Take in the morning.",
      "Report muscle cramps or irregular heartbeat.",
      "Regular blood tests needed."
    ],
    specialPopulations: {
      pregnancy: "Category B.",
      breastfeeding: "Excreted; caution.",
      pediatric: "Limited use.",
      elderly: "Higher hyponatremia risk.",
      renal: "Less effective in severe impairment.",
      hepatic: "Caution."
    },
    storage: "Store at room temperature.",
    references: ["Hypertension guidelines; pharmacology references"]
  },
  {
    id: "eplerenone",
    genericName: "Eplerenone",
    brandNames: ["Inspra"],
    drugClass: "Selective Aldosterone Antagonist / Potassium-Sparing Diuretic",
    therapeuticClass: "Heart Failure / Antihypertensive",
    mechanismOfAction: "Selective mineralocorticoid receptor antagonist. Blocks aldosterone effects in the kidney (and heart/vessels), reducing sodium retention and potassium excretion. More selective than spironolactone (less endocrine side effects).",
    mechanismFlow: ["Drug", "Mineralocorticoid receptor", "Blocks aldosterone", "Reduced Na reabsorption / K excretion", "Diuresis + cardiac benefits"],
    pharmacokinetics: {
      absorption: "Well absorbed; bioavailability increased with food slightly.",
      distribution: "Protein binding ~50%.",
      metabolism: "Primarily CYP3A4.",
      excretion: "Metabolites in urine and feces. Half-life 4-6 hours."
    },
    indications: [
      "Heart failure with reduced ejection fraction (post-MI or chronic)",
      "Hypertension"
    ],
    dosage: {
      routes: ["Oral"],
      adult: "Heart failure: start 25 mg daily, target 50 mg. Hypertension: 50 mg daily. Adjust for potassium and renal function. Refer to labeling.",
      pediatric: "Not established.",
      notes: "Educational only. Monitor potassium closely."
    },
    adverseEffects: {
      common: ["Hyperkalemia", "Dizziness", "Fatigue", "Diarrhea"],
      serious: ["Severe hyperkalemia", "Increased creatinine"],
      important: ["Lower incidence of gynecomastia than spironolactone."]
    },
    contraindications: [
      "Serum potassium >5.5 mEq/L at initiation",
      "Strong CYP3A4 inhibitors",
      "Type 2 diabetes with microalbuminuria (for hypertension indication in some labels)",
      "Severe renal impairment"
    ],
    interactions: [
      { drug: "Strong CYP3A4 inhibitors (ketoconazole, etc.)", interaction: "Contraindicated; large increase in levels", significance: "HIGH" },
      { drug: "ACEIs / ARBs / potassium supplements", interaction: "Hyperkalemia risk", significance: "HIGH" },
      { drug: "NSAIDs", interaction: "Reduced effect + renal/hyperkalemia risk", significance: "MODERATE" }
    ],
    monitoring: ["Serum potassium", "Renal function", "Blood pressure"],
    patientCounseling: [
      "Avoid potassium supplements and salt substitutes.",
      "Regular blood tests for potassium are essential.",
      "Report muscle weakness or irregular heartbeat."
    ],
    specialPopulations: {
      pregnancy: "Category B.",
      breastfeeding: "Unknown.",
      pediatric: "Not established.",
      elderly: "Higher hyperkalemia risk.",
      renal: "Contraindicated in severe impairment; dose adjust otherwise.",
      hepatic: "No major adjustment."
    },
    storage: "Store at room temperature.",
    references: ["Heart failure guidelines; pharmacology references"]
  },
  {
    id: "amiloride",
    genericName: "Amiloride",
    brandNames: ["Midamor"],
    drugClass: "Potassium-Sparing Diuretic (ENaC Blocker)",
    therapeuticClass: "Diuretic",
    mechanismOfAction: "Directly blocks the epithelial sodium channel (ENaC) in the collecting duct principal cells. This reduces sodium reabsorption and decreases the electrochemical gradient that drives potassium (and hydrogen) secretion.",
    mechanismFlow: ["Drug", "ENaC (collecting duct)", "Blocks Na entry", "Reduced Na reabsorption + reduced K secretion", "Mild diuresis + potassium retention"],
    pharmacokinetics: {
      absorption: "Incomplete (~50%).",
      distribution: "Not significantly protein bound.",
      metabolism: "Not metabolized.",
      excretion: "Unchanged in urine. Half-life 6-9 hours."
    },
    indications: [
      "Hypertension or edema (usually in combination with other diuretics to prevent hypokalemia)",
      "Prevention of hypokalemia",
      "Lithium-induced polyuria (off-label)",
      "Liddle syndrome (selected)"
    ],
    dosage: {
      routes: ["Oral"],
      adult: "Typical 5-10 mg daily. Refer to labeling.",
      pediatric: "Limited data.",
      notes: "Educational only. Weak diuretic when used alone."
    },
    adverseEffects: {
      common: ["Hyperkalemia", "Nausea", "Diarrhea", "Headache", "Rash"],
      serious: ["Severe hyperkalemia"],
      important: ["Hyperkalemia risk especially with ACEIs, ARBs, or renal impairment."]
    },
    contraindications: [
      "Hyperkalemia",
      "Concomitant potassium-sparing agents or supplements",
      "Severe renal impairment",
      "Hypersensitivity"
    ],
    interactions: [
      { drug: "ACEIs / ARBs / spironolactone / eplerenone", interaction: "Severe hyperkalemia risk", significance: "HIGH" },
      { drug: "Potassium supplements", interaction: "Hyperkalemia", significance: "HIGH" },
      { drug: "NSAIDs", interaction: "Reduced diuretic effect + hyperkalemia", significance: "MODERATE" },
      { drug: "Lithium", interaction: "May increase lithium levels", significance: "MODERATE" }
    ],
    monitoring: ["Serum potassium", "Renal function", "Blood pressure"],
    patientCounseling: [
      "Avoid potassium supplements and salt substitutes.",
      "Report muscle weakness or irregular heartbeat.",
      "Regular blood tests required."
    ],
    specialPopulations: {
      pregnancy: "Category B.",
      breastfeeding: "Unknown.",
      pediatric: "Limited data.",
      elderly: "Higher hyperkalemia risk.",
      renal: "Avoid in significant impairment.",
      hepatic: "Caution."
    },
    storage: "Store at room temperature.",
    references: ["Standard pharmacology references"]
  },
  {
    id: "triamterene",
    genericName: "Triamterene",
    brandNames: ["Dyrenium"],
    drugClass: "Potassium-Sparing Diuretic (ENaC Blocker)",
    therapeuticClass: "Diuretic",
    mechanismOfAction: "Blocks the epithelial sodium channel (ENaC) in the late distal tubule and collecting duct, reducing sodium reabsorption and potassium excretion. Weak natriuretic effect when used alone.",
    mechanismFlow: ["Drug", "ENaC", "Blocks sodium reabsorption", "Reduced K secretion", "Mild diuresis + K retention"],
    pharmacokinetics: {
      absorption: "Rapid but variable.",
      distribution: "Protein binding ~50-70%.",
      metabolism: "Hepatic to active metabolite.",
      excretion: "Urine. Half-life 1.5-2.5 hours (metabolite longer)."
    },
    indications: [
      "Edema / hypertension (usually combined with thiazide to counteract potassium loss)",
      "Prevention of hypokalemia"
    ],
    dosage: {
      routes: ["Oral"],
      adult: "Typical 50-100 mg twice daily (alone) or lower in combination products. Refer to labeling.",
      pediatric: "Limited data.",
      notes: "Educational only. Often used in fixed-dose combinations."
    },
    adverseEffects: {
      common: ["Hyperkalemia", "Nausea", "Vomiting", "Dizziness", "Leg cramps"],
      serious: ["Severe hyperkalemia", "Kidney stones (triamterene is relatively insoluble)", "Megaloblastic anemia (rare, folate antagonism)"],
      important: ["Can form renal calculi; maintain hydration."]
    },
    contraindications: [
      "Hyperkalemia",
      "Severe renal impairment",
      "Concomitant other potassium-sparing agents",
      "Severe hepatic disease"
    ],
    interactions: [
      { drug: "ACEIs / ARBs / potassium agents", interaction: "Hyperkalemia", significance: "HIGH" },
      { drug: "NSAIDs", interaction: "Reduced effect + renal risk", significance: "MODERATE" },
      { drug: "Lithium", interaction: "Increased lithium levels", significance: "MODERATE" },
      { drug: "Indomethacin", interaction: "Increased risk of renal failure", significance: "HIGH" }
    ],
    monitoring: ["Serum potassium", "Renal function", "CBC (rare)", "Urine for crystals if prolonged"],
    patientCounseling: [
      "Avoid potassium supplements.",
      "Drink adequate fluids.",
      "Report muscle weakness or irregular heartbeat.",
      "Regular blood tests needed."
    ],
    specialPopulations: {
      pregnancy: "Category C.",
      breastfeeding: "Excreted; caution.",
      pediatric: "Limited data.",
      elderly: "Higher risk of hyperkalemia and stones.",
      renal: "Avoid in impairment.",
      hepatic: "Caution; active metabolite."
    },
    storage: "Store at room temperature; protect from light.",
    references: ["Standard pharmacology references"]
  },
  // ========== AUTONOMIC NERVOUS SYSTEM ==========
  {
    id: "atropine",
    genericName: "Atropine",
    brandNames: ["Atropen", "Sal-Tropine"],
    drugClass: "Antimuscarinic / Anticholinergic",
    therapeuticClass: "Antispasmodic / Antidote / Preanesthetic",
    mechanismOfAction: "Competitive antagonist at muscarinic acetylcholine receptors. Blocks parasympathetic effects, leading to increased heart rate, decreased secretions, mydriasis, and bronchodilation.",
    mechanismFlow: ["Drug", "Muscarinic receptors (M1-M5)", "Competitive blockade of ACh", "Inhibition of parasympathetic tone", "Increased HR, decreased secretions, mydriasis"],
    pharmacokinetics: {
      absorption: "Well absorbed from GI tract, mucous membranes, and IM sites.",
      distribution: "Widely distributed; crosses blood-brain barrier and placenta.",
      metabolism: "Hepatic hydrolysis.",
      excretion: "Urine. Half-life ~2-3 hours."
    },
    indications: ["Bradycardia", "Organophosphate / nerve agent poisoning", "Preoperative reduction of secretions", "Mydriasis / cycloplegia for eye exams", "GI hypermotility"],
    dosage: { routes: ["IV", "IM", "Oral", "Ophthalmic"], adult: "Bradycardia: 0.5-1 mg IV. Poisoning: higher repeated doses. Refer to protocols.", pediatric: "Weight-based. Refer to pediatric emergency references.", notes: "Educational only. Monitor for anticholinergic toxicity." },
    adverseEffects: { common: ["Dry mouth", "Blurred vision", "Photophobia", "Tachycardia", "Constipation", "Urinary retention"], serious: ["Confusion / delirium (especially elderly)", "Hyperthermia", "Severe tachycardia", "Acute angle-closure glaucoma"], important: ["Classic anticholinergic toxidrome in overdose."] },
    contraindications: ["Narrow-angle glaucoma", "Obstructive uropathy", "Myasthenia gravis (relative)", "Severe ulcerative colitis"],
    interactions: [{ drug: "Other anticholinergics", interaction: "Additive effects", significance: "MODERATE" }, { drug: "Potassium chloride (oral)", interaction: "Increased GI ulcer risk", significance: "MODERATE" }],
    monitoring: ["Heart rate", "Mental status", "Urinary output", "Temperature"],
    patientCounseling: ["May cause dry mouth and blurred vision.", "Avoid driving if vision is affected.", "Report confusion or difficulty urinating."],
    specialPopulations: { pregnancy: "Category C.", breastfeeding: "Excreted; caution.", pediatric: "Used carefully.", elderly: "High risk of confusion and urinary retention.", renal: "No major adjustment.", hepatic: "Caution." },
    storage: "Store at room temperature; protect from light.",
    references: ["Standard pharmacology references"]
  },
  {
    id: "epinephrine",
    genericName: "Epinephrine",
    brandNames: ["Adrenalin", "EpiPen", "Auvi-Q"],
    drugClass: "Non-selective Adrenergic Agonist",
    therapeuticClass: "Vasopressor / Bronchodilator / Anaphylaxis Treatment",
    mechanismOfAction: "Stimulates α1, α2, β1, and β2 adrenergic receptors. Causes vasoconstriction (α1), increased heart rate and contractility (β1), and bronchodilation (β2).",
    mechanismFlow: ["Drug", "α and β adrenergic receptors", "Vasoconstriction + cardiac stimulation + bronchodilation", "Increased BP, HR, bronchodilation", "Reversal of anaphylaxis / support of circulation"],
    pharmacokinetics: {
      absorption: "Not effective orally (destroyed in GI). Rapid absorption from IM / subcutaneous.",
      distribution: "Does not cross blood-brain barrier significantly.",
      metabolism: "Rapidly metabolized by MAO and COMT.",
      excretion: "Inactive metabolites in urine. Very short half-life (~2-3 min IV)."
    },
    indications: ["Anaphylaxis", "Cardiac arrest", "Severe asthma / bronchospasm", "Local anesthesia prolongation", "Hypotension / shock (selected)"],
    dosage: { routes: ["IM", "IV", "Subcutaneous", "Inhalation", "Endotracheal"], adult: "Anaphylaxis: 0.3-0.5 mg IM (1:1000). Cardiac arrest: 1 mg IV (1:10000). Refer to ACLS / anaphylaxis protocols.", pediatric: "0.01 mg/kg IM for anaphylaxis. Refer to PALS.", notes: "Educational only. Different concentrations for different routes — critical safety issue." },
    adverseEffects: { common: ["Anxiety", "Tremor", "Palpitations", "Headache", "Hypertension"], serious: ["Arrhythmias", "Myocardial ischemia", "Cerebral hemorrhage", "Pulmonary edema"], important: ["Concentration confusion is a major source of medication errors."] },
    contraindications: ["No absolute contraindications in anaphylaxis or cardiac arrest.", "Relative: narrow-angle glaucoma, cardiovascular disease (when used for other indications)"],
    interactions: [{ drug: "Beta-blockers", interaction: "May lead to unopposed α effects (severe hypertension)", significance: "HIGH" }, { drug: "MAO inhibitors / TCAs", interaction: "Potentiated effects", significance: "HIGH" }],
    monitoring: ["Heart rate / rhythm", "Blood pressure", "Respiratory status", "Site of injection"],
    patientCounseling: ["For auto-injector: inject into outer thigh, hold 3-10 seconds, seek emergency care immediately after use.", "May cause rapid heartbeat and shakiness."],
    specialPopulations: { pregnancy: "Category C. Used when clearly needed (anaphylaxis).", breastfeeding: "Caution.", pediatric: "Essential for anaphylaxis.", elderly: "Higher risk of adverse cardiac effects.", renal: "No adjustment.", hepatic: "No adjustment." },
    storage: "Protect from light. Auto-injectors have specific storage requirements (avoid extreme temperatures).",
    references: ["ACLS / PALS guidelines; standard pharmacology references"]
  },
  {
    id: "albuterol",
    genericName: "Albuterol (Salbutamol)",
    brandNames: ["ProAir", "Ventolin", "Proventil"],
    drugClass: "Short-Acting β2-Adrenergic Agonist (SABA)",
    therapeuticClass: "Bronchodilator",
    mechanismOfAction: "Selective agonist at β2-adrenergic receptors on bronchial smooth muscle. Activates adenylate cyclase → increases cAMP → relaxation of bronchial smooth muscle and bronchodilation. Also inhibits mediator release from mast cells.",
    mechanismFlow: ["Drug", "β2 receptors (airway smooth muscle)", "↑ cAMP", "Smooth muscle relaxation", "Bronchodilation"],
    pharmacokinetics: {
      absorption: "Minimal systemic absorption with proper inhaler technique. Oral bioavailability moderate.",
      distribution: "Local action preferred.",
      metabolism: "Hepatic and GI (oral).",
      excretion: "Urine. Half-life ~4-6 hours."
    },
    indications: ["Acute asthma symptoms / exacerbations", "Exercise-induced bronchospasm", "COPD symptom relief", "Hyperkalemia (nebulized, off-label)"],
    dosage: { routes: ["Inhalation (MDI, nebulizer)", "Oral"], adult: "MDI: 1-2 puffs every 4-6 hours as needed. Nebulizer: 2.5 mg. Refer to asthma guidelines.", pediatric: "Age/weight-based. Refer to pediatric asthma guidelines.", notes: "Educational only. Overuse indicates poor asthma control." },
    adverseEffects: { common: ["Tremor", "Nervousness", "Tachycardia", "Palpitations", "Headache"], serious: ["Paradoxical bronchospasm", "Severe hypokalemia", "Arrhythmias (high dose)"], important: ["Frequent use signals need for better controller therapy."] },
    contraindications: ["Hypersensitivity to albuterol"],
    interactions: [{ drug: "Beta-blockers (non-selective)", interaction: "Antagonize bronchodilator effect", significance: "HIGH" }, { drug: "Diuretics / digoxin", interaction: "Hypokalemia risk / digoxin toxicity", significance: "MODERATE" }, { drug: "MAOIs / TCAs", interaction: "Potentiated cardiovascular effects", significance: "MODERATE" }],
    monitoring: ["Respiratory status / peak flow", "Heart rate", "Frequency of use", "Potassium (high-dose or continuous)"],
    patientCounseling: ["Use as needed for symptoms; if using >2 days/week, contact clinician.", "Prime inhaler if new or not used recently.", "Rinse mouth after use if using with steroid inhaler.", "Proper technique is essential."],
    specialPopulations: { pregnancy: "Category C. Preferred short-acting agent when needed.", breastfeeding: "Compatible.", pediatric: "Widely used.", elderly: "Monitor for cardiac effects.", renal: "No major adjustment.", hepatic: "No major adjustment." },
    storage: "Store inhalers at room temperature; protect from extreme heat.",
    references: ["Asthma / COPD guidelines; standard pharmacology references"]
  },
  {
    id: "clonidine",
    genericName: "Clonidine",
    brandNames: ["Catapres", "Kapvay", "Nexiclon"],
    drugClass: "Central α2-Adrenergic Agonist",
    therapeuticClass: "Antihypertensive / ADHD / Opioid Withdrawal Adjunct",
    mechanismOfAction: "Stimulates presynaptic α2 receptors in the brainstem, reducing sympathetic outflow. This decreases peripheral resistance, heart rate, and blood pressure. Also used for its effects on attention and withdrawal symptoms.",
    mechanismFlow: ["Drug", "Central α2 receptors", "↓ Sympathetic outflow", "↓ Peripheral resistance & HR", "Lower blood pressure"],
    pharmacokinetics: {
      absorption: "Well absorbed orally. Transdermal available.",
      distribution: "Widely distributed; crosses blood-brain barrier.",
      metabolism: "Hepatic (~50%).",
      excretion: "Urine (unchanged + metabolites). Half-life 12-16 hours."
    },
    indications: ["Hypertension", "ADHD (extended-release)", "Opioid / nicotine / alcohol withdrawal (adjunct)", "Hot flashes (off-label)", "Pain (epidural, selected)"],
    dosage: { routes: ["Oral", "Transdermal", "Epidural"], adult: "Hypertension: 0.1-0.3 mg twice daily or patch weekly. Refer to labeling.", pediatric: "ADHD dosing is weight/age specific. Refer to product labeling.", notes: "Educational only. Do not stop abruptly — risk of rebound hypertension." },
    adverseEffects: { common: ["Dry mouth", "Sedation / drowsiness", "Dizziness", "Constipation", "Bradycardia"], serious: ["Rebound hypertension on abrupt withdrawal", "Severe bradycardia", "Depression", "AV block"], important: ["Must taper when discontinuing."] },
    contraindications: ["Hypersensitivity", "Epidural: injection site infection, concurrent anticoagulant therapy (for epidural use)"],
    interactions: [{ drug: "Beta-blockers", interaction: "Exaggerated rebound hypertension if clonidine stopped first", significance: "HIGH" }, { drug: "CNS depressants", interaction: "Additive sedation", significance: "MODERATE" }, { drug: "Tricyclic antidepressants", interaction: "May reduce antihypertensive effect", significance: "MODERATE" }],
    monitoring: ["Blood pressure", "Heart rate", "Mental status", "Rebound symptoms if stopped"],
    patientCounseling: ["Do not stop suddenly; dose must be tapered.", "May cause drowsiness — caution with driving.", "Dry mouth is common.", "Apply patch to clean, hairless skin; rotate sites."],
    specialPopulations: { pregnancy: "Category C.", breastfeeding: "Excreted; caution.", pediatric: "Used for ADHD.", elderly: "Start low; increased sedation risk.", renal: "Dose reduction in impairment.", hepatic: "Caution." },
    storage: "Store at room temperature.",
    references: ["Standard pharmacology and hypertension references"]
  },
  {
    id: "prazosin",
    genericName: "Prazosin",
    brandNames: ["Minipress"],
    drugClass: "Selective α1-Adrenergic Antagonist",
    therapeuticClass: "Antihypertensive / BPH / PTSD Nightmares",
    mechanismOfAction: "Selective blockade of postsynaptic α1-adrenergic receptors, causing vasodilation of arteries and veins and reduced peripheral resistance. Also relaxes smooth muscle in prostate and bladder neck.",
    mechanismFlow: ["Drug", "α1 receptors (vascular / prostate)", "Blockade → vasodilation", "↓ Peripheral resistance", "Lower BP + improved urine flow"],
    pharmacokinetics: {
      absorption: "Well absorbed; bioavailability variable due to first-pass.",
      distribution: "Highly protein bound.",
      metabolism: "Extensive hepatic.",
      excretion: "Primarily bile/feces. Half-life 2-3 hours."
    },
    indications: ["Hypertension", "Benign prostatic hyperplasia (off-label / alternative)", "PTSD-associated nightmares (off-label)", "Raynaud phenomenon (selected)"],
    dosage: { routes: ["Oral"], adult: "Hypertension: start 1 mg at bedtime, titrate. Typical 2-20 mg/day in divided doses. Refer to labeling.", pediatric: "Limited data.", notes: "Educational only. First-dose hypotension / syncope risk — start low at bedtime." },
    adverseEffects: { common: ["First-dose syncope / orthostatic hypotension", "Dizziness", "Headache", "Drowsiness", "Palpitations"], serious: ["Severe hypotension", "Priapism (rare)"], important: ["First-dose effect can be significant."] },
    contraindications: ["Hypersensitivity to quinazolines"],
    interactions: [{ drug: "Other antihypertensives / PDE5 inhibitors", interaction: "Additive hypotension", significance: "HIGH" }, { drug: "NSAIDs", interaction: "May reduce antihypertensive effect", significance: "MODERATE" }],
    monitoring: ["Blood pressure (including orthostatic)", "Heart rate", "Urinary symptoms (if used for BPH)"],
    patientCounseling: ["Take first dose at bedtime to reduce dizziness/fainting risk.", "Rise slowly from sitting or lying.", "Avoid alcohol initially.", "Report prolonged erection."],
    specialPopulations: { pregnancy: "Category C.", breastfeeding: "Unknown.", pediatric: "Limited data.", elderly: "Higher orthostatic risk.", renal: "No major adjustment.", hepatic: "Caution (extensive metabolism)." },
    storage: "Store at room temperature; protect from light and moisture.",
    references: ["Standard pharmacology references"]
  },
  // ========== CNS ==========
  {
    id: "levodopa-carbidopa",
    genericName: "Levodopa / Carbidopa",
    brandNames: ["Sinemet", "Rytary", "Duopa"],
    drugClass: "Dopamine Precursor + DOPA Decarboxylase Inhibitor",
    therapeuticClass: "Antiparkinsonian",
    mechanismOfAction: "Levodopa crosses the blood-brain barrier and is converted to dopamine in the CNS, replenishing depleted dopamine in the substantia nigra/striatum. Carbidopa inhibits peripheral DOPA decarboxylase, increasing the amount of levodopa available to the brain and reducing peripheral side effects.",
    mechanismFlow: ["Levodopa + Carbidopa", "Peripheral decarboxylase inhibition + CNS conversion", "↑ Brain dopamine", "Improved nigrostriatal transmission", "Reduction of parkinsonian symptoms"],
    pharmacokinetics: {
      absorption: "Absorbed from small intestine. Competition with dietary amino acids.",
      distribution: "Levodopa crosses BBB; carbidopa does not.",
      metabolism: "Decarboxylation and other pathways.",
      excretion: "Urine. Half-life of levodopa ~1.5 hours (prolonged by carbidopa)."
    },
    indications: ["Parkinson disease", "Parkinsonism"],
    dosage: { routes: ["Oral", "Enteral suspension"], adult: "Highly individualized. Start low (e.g., 25/100 mg three times daily) and titrate. Refer to neurology guidance.", pediatric: "Not typical.", notes: "Educational only. Timing with meals and protein intake important." },
    adverseEffects: { common: ["Nausea", "Orthostatic hypotension", "Dyskinesias", "Hallucinations", "Confusion", "Sleep disturbance"], serious: ["Severe dyskinesias", "Psychosis", "Impulse control disorders", "Melanoma risk (monitor)"], important: ["Motor fluctuations and dyskinesias increase with long-term use."] },
    contraindications: ["Narrow-angle glaucoma", "Concurrent non-selective MAOI use", "History of melanoma (relative)", "Undiagnosed skin lesions"],
    interactions: [{ drug: "Non-selective MAOIs", interaction: "Hypertensive crisis risk", significance: "HIGH" }, { drug: "Antipsychotics", interaction: "Antagonize antiparkinsonian effect", significance: "HIGH" }, { drug: "High-protein meals", interaction: "Reduced absorption / effect", significance: "MODERATE" }],
    monitoring: ["Motor symptoms / 'on-off'", "Mental status", "Orthostatic BP", "Skin examination", "Impulse control behaviors"],
    patientCounseling: ["Take consistently with regard to meals; high protein may reduce effect.", "Rise slowly.", "Report uncontrolled movements, hallucinations, or unusual urges.", "Do not stop suddenly."],
    specialPopulations: { pregnancy: "Category C.", breastfeeding: "Not recommended.", pediatric: "Rarely used.", elderly: "Higher risk of confusion and hallucinations.", renal: "Caution.", hepatic: "Caution." },
    storage: "Store at room temperature; protect from light and moisture.",
    references: ["Parkinson disease guidelines; standard pharmacology references"]
  },
  {
    id: "diazepam",
    genericName: "Diazepam",
    brandNames: ["Valium", "Diastat", "Valtoco"],
    drugClass: "Benzodiazepine",
    therapeuticClass: "Anxiolytic / Anticonvulsant / Muscle Relaxant / Sedative",
    mechanismOfAction: "Enhances the effect of GABA at the GABAA receptor by increasing the frequency of chloride channel opening, leading to hyperpolarization and reduced neuronal excitability.",
    mechanismFlow: ["Drug", "GABAA receptor (BZD site)", "↑ GABA effect → ↑ Cl− influx", "Neuronal hyperpolarization", "Anxiolysis, sedation, anticonvulsant, muscle relaxation"],
    pharmacokinetics: {
      absorption: "Rapid and complete oral absorption. Rectal and nasal formulations available.",
      distribution: "Highly lipophilic; rapid CNS entry. Highly protein bound. Redistribution important.",
      metabolism: "Hepatic (CYP3A4, CYP2C19) to active metabolites (desmethyldiazepam, oxazepam).",
      excretion: "Urine. Long half-life (parent + metabolites 20-100 hours)."
    },
    indications: ["Anxiety disorders", "Acute alcohol withdrawal", "Muscle spasm", "Status epilepticus / acute seizures", "Preoperative sedation", "Sedation for procedures"],
    dosage: { routes: ["Oral", "IV", "IM", "Rectal", "Nasal"], adult: "Highly variable by indication (e.g., anxiety 2-10 mg 2-4 times daily). Status epilepticus: specific IV protocols. Refer to guidelines.", pediatric: "Weight-based; rectal gel for seizures. Refer to pediatric references.", notes: "Educational only. Risk of dependence and withdrawal. Avoid abrupt cessation." },
    adverseEffects: { common: ["Drowsiness", "Fatigue", "Ataxia", "Confusion", "Anterograde amnesia"], serious: ["Respiratory depression (especially with opioids/alcohol)", "Dependence / withdrawal seizures", "Paradoxical excitation", "Falls in elderly"], important: ["Boxed warning with opioids for profound sedation and respiratory depression."] },
    contraindications: ["Hypersensitivity", "Acute narrow-angle glaucoma", "Severe respiratory impairment", "Myasthenia gravis (relative)", "Sleep apnea (relative)"],
    interactions: [{ drug: "Opioids / alcohol / CNS depressants", interaction: "Profound sedation, respiratory depression", significance: "HIGH" }, { drug: "CYP3A4 / CYP2C19 inhibitors", interaction: "Increased levels", significance: "MODERATE" }, { drug: "Strong inducers", interaction: "Decreased effect", significance: "MODERATE" }],
    monitoring: ["Sedation level", "Respiratory rate", "Seizure control", "Signs of misuse / dependence"],
    patientCounseling: ["Do not drive or operate machinery until effects are known.", "Avoid alcohol and other sedatives.", "Do not stop suddenly after regular use.", "Risk of dependence with prolonged use."],
    specialPopulations: { pregnancy: "Category D. Risk of neonatal withdrawal / floppy infant.", breastfeeding: "Excreted; avoid if possible.", pediatric: "Used for seizures; paradoxical reactions possible.", elderly: "High fall and confusion risk; use lowest dose.", renal: "Caution.", hepatic: "Dose reduction; active metabolites accumulate." },
    storage: "Store at room temperature; protect from light.",
    references: ["Standard pharmacology and epilepsy / anxiety guidelines"]
  },
  {
    id: "fluoxetine",
    genericName: "Fluoxetine",
    brandNames: ["Prozac", "Sarafem", "Selfemra"],
    drugClass: "Selective Serotonin Reuptake Inhibitor (SSRI)",
    therapeuticClass: "Antidepressant / Anxiolytic",
    mechanismOfAction: "Selectively inhibits the reuptake of serotonin (5-HT) into presynaptic neurons by blocking the serotonin transporter (SERT), increasing synaptic serotonin levels and enhancing serotonergic neurotransmission.",
    mechanismFlow: ["Drug", "Serotonin transporter (SERT)", "Blocks 5-HT reuptake", "↑ Synaptic serotonin", "Antidepressant / anxiolytic effect"],
    pharmacokinetics: {
      absorption: "Well absorbed; bioavailability not significantly affected by food.",
      distribution: "Highly protein bound. Large volume of distribution.",
      metabolism: "Hepatic CYP2D6 (and others) to active metabolite norfluoxetine. Strong CYP2D6 inhibitor.",
      excretion: "Urine. Very long half-life (parent 4-6 days; norfluoxetine 4-16 days)."
    },
    indications: ["Major depressive disorder", "Obsessive-compulsive disorder", "Bulimia nervosa", "Panic disorder", "Premenstrual dysphoric disorder", "Treatment-resistant depression (with olanzapine)"],
    dosage: { routes: ["Oral"], adult: "Depression: start 20 mg daily; usual 20-60 mg. OCD may require higher. Refer to labeling and guidelines.", pediatric: "Approved for certain ages/indications. Start low. Refer to pediatric psych references.", notes: "Educational only. Long half-life means long washout before MAOI." },
    adverseEffects: { common: ["Nausea", "Insomnia or somnolence", "Headache", "Sexual dysfunction", "Anxiety / nervousness", "Dry mouth"], serious: ["Suicidal ideation (boxed warning in young people)", "Serotonin syndrome", "QT prolongation (rare)", "Hyponatremia", "Abnormal bleeding", "Mania switch"], important: ["Black box warning for suicidality in children, adolescents, and young adults."] },
    contraindications: ["Concurrent MAOI / linezolid / IV methylene blue", "Hypersensitivity", "Concurrent pimozide or thioridazine"],
    interactions: [{ drug: "MAOIs", interaction: "Serotonin syndrome — contraindicated", significance: "HIGH" }, { drug: "Other serotonergic drugs", interaction: "Serotonin syndrome risk", significance: "HIGH" }, { drug: "CYP2D6 substrates (e.g., some antipsychotics, tamoxifen)", interaction: "Increased levels of substrate", significance: "HIGH" }, { drug: "NSAIDs / anticoagulants", interaction: "Increased bleeding risk", significance: "MODERATE" }],
    monitoring: ["Mood / suicidal ideation (especially early)", "Sexual function", "Sodium (elderly)", "Signs of serotonin syndrome", "Mania symptoms"],
    patientCounseling: ["May take 4-6 weeks for full effect.", "Report worsening depression or suicidal thoughts immediately.", "Do not stop abruptly (though long half-life reduces discontinuation symptoms).", "Avoid alcohol.", "Inform provider of all medications due to interaction potential."],
    specialPopulations: { pregnancy: "Category C. Possible neonatal adaptation syndrome; discuss risks/benefits.", breastfeeding: "Excreted; generally considered acceptable with monitoring.", pediatric: "Approved for some indications; monitor closely for suicidality.", elderly: "Start low; hyponatremia risk.", renal: "No major adjustment.", hepatic: "Lower dose or less frequent dosing." },
    storage: "Store at room temperature.",
    references: ["Depression / anxiety guidelines; standard pharmacology references"]
  },
  {
    id: "haloperidol",
    genericName: "Haloperidol",
    brandNames: ["Haldol"],
    drugClass: "First-Generation (Typical) Antipsychotic — Butyrophenone",
    therapeuticClass: "Antipsychotic / Antiemetic",
    mechanismOfAction: "High-potency antagonist primarily at dopamine D2 receptors in the mesolimbic pathway (therapeutic) and nigrostriatal pathway (extrapyramidal side effects). Also has some alpha-adrenergic and minimal anticholinergic activity.",
    mechanismFlow: ["Drug", "Dopamine D2 receptors", "Blockade in mesolimbic pathway", "↓ Positive psychotic symptoms", "Antipsychotic effect"],
    pharmacokinetics: {
      absorption: "Well absorbed orally; IM available (including depot).",
      distribution: "Highly protein bound. Crosses BBB.",
      metabolism: "Hepatic.",
      excretion: "Urine and bile. Half-life ~18 hours (oral); longer for depot."
    },
    indications: ["Schizophrenia", "Acute psychosis", "Tourette syndrome", "Severe behavioral problems", "Nausea/vomiting (selected)", "Delirium (selected, short-term)"],
    dosage: { routes: ["Oral", "IM", "IV (off-label / caution)"], adult: "Highly individualized. Acute: 0.5-5 mg. Maintenance lower. Depot available. Refer to psychiatry guidance.", pediatric: "Used in selected cases; specialist dosing.", notes: "Educational only. High risk of extrapyramidal symptoms and QT prolongation." },
    adverseEffects: { common: ["Extrapyramidal symptoms (dystonia, akathisia, parkinsonism)", "Sedation", "Dry mouth", "Constipation"], serious: ["Tardive dyskinesia", "Neuroleptic malignant syndrome", "QT prolongation / torsades", "Severe dystonia", "Agranulocytosis (rare)"], important: ["Highest risk of EPS among common antipsychotics; lowest metabolic risk."] },
    contraindications: ["Parkinson disease", "Severe CNS depression", "Coma", "Hypersensitivity", "Significant QT prolongation"],
    interactions: [{ drug: "Other QT-prolonging drugs", interaction: "Additive QT risk", significance: "HIGH" }, { drug: "CNS depressants", interaction: "Additive sedation", significance: "MODERATE" }, { drug: "Anticholinergics", interaction: "May reduce EPS but increase other side effects", significance: "MODERATE" }, { drug: "Lithium", interaction: "Increased neurotoxicity risk", significance: "MODERATE" }],
    monitoring: ["Mental status / psychosis symptoms", "EPS / AIMS scale", "ECG (QT)", "Temperature (NMS)", "CBC (rare)"],
    patientCounseling: ["Report muscle stiffness, restlessness, or involuntary movements.", "Rise slowly.", "Avoid alcohol.", "Do not stop suddenly without medical advice.", "Sun sensitivity possible."],
    specialPopulations: { pregnancy: "Category C. Neonatal EPS / withdrawal possible.", breastfeeding: "Excreted; caution.", pediatric: "Used selectively.", elderly: "Increased mortality in dementia-related psychosis (boxed warning).", renal: "Caution.", hepatic: "Caution." },
    storage: "Store at room temperature; protect from light.",
    references: ["Psychiatry guidelines; standard pharmacology references"]
  },
  {
    id: "phenytoin",
    genericName: "Phenytoin",
    brandNames: ["Dilantin", "Phenytek"],
    drugClass: "Hydantoin Anticonvulsant",
    therapeuticClass: "Antiepileptic",
    mechanismOfAction: "Blocks voltage-gated sodium channels in a use-dependent manner, stabilizing neuronal membranes and preventing the spread of seizure activity.",
    mechanismFlow: ["Drug", "Voltage-gated Na+ channels", "Use-dependent blockade", "Stabilized neuronal membrane", "Seizure control"],
    pharmacokinetics: {
      absorption: "Slow and variable oral absorption. IV available (fosphenytoin preferred for many acute uses).",
      distribution: "Highly protein bound (~90%). Displaced by other drugs / low albumin states.",
      metabolism: "Hepatic CYP2C9 / CYP2C19. Saturable (zero-order) kinetics at higher concentrations.",
      excretion: "Urine (metabolites). Half-life variable (12-36 hours); increases with concentration."
    },
    indications: ["Focal (partial) seizures", "Generalized tonic-clonic seizures", "Status epilepticus (IV)", "Seizure prophylaxis (neurosurgery)"],
    dosage: { routes: ["Oral", "IV"], adult: "Loading and maintenance highly individualized; therapeutic level typically 10-20 mcg/mL. Refer to epilepsy guidelines and levels.", pediatric: "Weight-based. Refer to pediatric neurology.", notes: "Educational only. Narrow therapeutic index; monitor levels. Zero-order kinetics." },
    adverseEffects: { common: ["Gingival hyperplasia", "Hirsutism", "Acne", "Nystagmus", "Ataxia", "Drowsiness"], serious: ["Stevens-Johnson syndrome / TEN", "Hepatotoxicity", "Blood dyscrasias", "Purple glove syndrome (IV)", "Cardiac arrhythmias (rapid IV)", "Osteomalacia / bone loss (long-term)"], important: ["Saturable metabolism — small dose increases can cause large level rises."] },
    contraindications: ["Hypersensitivity to hydantoins", "Sinus bradycardia / heart block (IV)", "Prior acute hepatotoxicity with phenytoin"],
    interactions: [{ drug: "Many CYP substrates / inducers / inhibitors", interaction: "Complex bidirectional interactions", significance: "HIGH" }, { drug: "Warfarin", interaction: "Variable effect on INR", significance: "HIGH" }, { drug: "Oral contraceptives", interaction: "Reduced contraceptive efficacy", significance: "HIGH" }, { drug: "Valproate", interaction: "Displacement + metabolism changes", significance: "HIGH" }],
    monitoring: ["Serum phenytoin level (total and free if hypoalbuminemia)", "CBC", "LFTs", "Dental health", "Bone health (long-term)", "Suicidality"],
    patientCounseling: ["Do not stop suddenly — risk of status epilepticus.", "Maintain good dental hygiene.", "Report rash immediately.", "May reduce effectiveness of birth control.", "Avoid alcohol."],
    specialPopulations: { pregnancy: "Category D. Fetal hydantoin syndrome risk. Use only if benefit outweighs risk.", breastfeeding: "Excreted; usually compatible with monitoring.", pediatric: "Widely used; monitor levels and growth.", elderly: "Lower doses often needed; fall risk.", renal: "Free level monitoring if low albumin.", hepatic: "Reduce dose; risk of toxicity." },
    storage: "Store at room temperature; protect from light and moisture.",
    references: ["Epilepsy guidelines; standard pharmacology references"]
  },
  {
    id: "valproic-acid",
    genericName: "Valproic Acid / Divalproex",
    brandNames: ["Depakote", "Depakene", "Depacon"],
    drugClass: "Anticonvulsant — Fatty Acid Derivative",
    therapeuticClass: "Antiepileptic / Mood Stabilizer",
    mechanismOfAction: "Multiple mechanisms: enhances GABA effects (increases synthesis, decreases degradation), blocks voltage-gated sodium channels, and modulates T-type calcium channels. Broad-spectrum activity.",
    mechanismFlow: ["Drug", "GABA system + Na+ / Ca2+ channels", "↑ GABA + membrane stabilization", "Reduced neuronal excitability", "Seizure control / mood stabilization"],
    pharmacokinetics: {
      absorption: "Well absorbed. Different formulations (immediate, delayed, extended-release) have different profiles.",
      distribution: "Highly protein bound (concentration-dependent).",
      metabolism: "Extensive hepatic (glucuronidation, beta-oxidation, CYP).",
      excretion: "Urine. Half-life 9-16 hours."
    },
    indications: ["Broad-spectrum epilepsy (including absence, myoclonic, tonic-clonic, focal)", "Bipolar disorder (mania, maintenance)", "Migraine prophylaxis"],
    dosage: { routes: ["Oral", "IV"], adult: "Highly individualized; therapeutic range roughly 50-100 mcg/mL for epilepsy. Refer to guidelines and levels.", pediatric: "Weight-based; higher mg/kg often needed. Refer to pediatric neurology.", notes: "Educational only. Multiple boxed warnings." },
    adverseEffects: { common: ["Nausea", "Tremor", "Weight gain", "Hair loss", "Somnolence", "Thrombocytopenia"], serious: ["Hepatotoxicity (boxed warning)", "Pancreatitis (boxed warning)", "Teratogenicity / neural tube defects (boxed warning)", "Hyperammonemia", "Suicidality", "PCOS / reproductive effects"], important: ["Highest teratogenic risk among common AEDs; avoid in pregnancy if possible."] },
    contraindications: ["Hepatic disease / significant impairment", "Urea cycle disorders", "Known mitochondrial disorders (POLG)", "Hypersensitivity", "Pregnancy (for migraine prophylaxis)"],
    interactions: [{ drug: "Lamotrigine", interaction: "Significantly increases lamotrigine levels (rash risk)", significance: "HIGH" }, { drug: "Carbapenems", interaction: "Dramatically decrease valproate levels", significance: "HIGH" }, { drug: "Phenytoin / carbamazepine", interaction: "Complex bidirectional interactions", significance: "HIGH" }, { drug: "Aspirin", interaction: "Displacement / increased free fraction", significance: "MODERATE" }],
    monitoring: ["Serum level", "LFTs (baseline and frequent early)", "CBC / platelets", "Ammonia (if altered mental status)", "Pregnancy test / counseling", "Suicidality"],
    patientCounseling: ["Do not stop suddenly.", "Report abdominal pain, nausea, dark urine, or yellowing of skin immediately.", "Use effective contraception; high risk of birth defects.", "May cause weight gain and tremor.", "Regular blood tests required."],
    specialPopulations: { pregnancy: "Category D/X (indication-dependent). Major teratogen. Avoid if possible.", breastfeeding: "Excreted; generally considered compatible with monitoring.", pediatric: "Higher risk of hepatotoxicity in young children, especially <2 years on polytherapy.", elderly: "Increased sensitivity; lower doses.", renal: "No major adjustment.", hepatic: "Contraindicated in significant disease." },
    storage: "Store at room temperature.",
    references: ["Epilepsy and bipolar guidelines; standard pharmacology references"]
  },
  {
    id: "morphine",
    genericName: "Morphine",
    brandNames: ["MS Contin", "Kadian", "Duramorph", "Infumorph"],
    drugClass: "Opioid Agonist (Prototype)",
    therapeuticClass: "Analgesic / Opioid",
    mechanismOfAction: "Full agonist at mu-opioid receptors in the CNS and periphery. Activates descending inhibitory pathways, alters pain perception and response, and produces euphoria, sedation, and respiratory depression.",
    mechanismFlow: ["Drug", "Mu-opioid receptors", "Activation of inhibitory pathways", "Altered pain perception + CNS depression", "Analgesia + side effects"],
    pharmacokinetics: {
      absorption: "Variable oral bioavailability due to first-pass. Multiple routes available.",
      distribution: "Wide; crosses placenta. Moderate protein binding.",
      metabolism: "Hepatic glucuronidation to morphine-6-glucuronide (active, more potent) and morphine-3-glucuronide.",
      excretion: "Urine (metabolites). Half-life ~2-4 hours (immediate-release)."
    },
    indications: ["Moderate to severe acute and chronic pain", "Pain associated with myocardial infarction", "Pulmonary edema (selected)", "Palliative care / end-of-life"],
    dosage: { routes: ["Oral", "IV", "IM", "Subcutaneous", "Epidural", "Intrathecal", "Rectal"], adult: "Highly individualized. Opioid-naïve starting doses are low (e.g., 2-10 mg IV). Titrate to effect. Refer to pain guidelines.", pediatric: "Weight-based; specialist supervision.", notes: "Educational only. High risk of respiratory depression, dependence, and overdose. Use lowest effective dose." },
    adverseEffects: { common: ["Constipation", "Nausea", "Sedation", "Pruritus", "Urinary retention", "Miosis"], serious: ["Respiratory depression", "Hypotension", "Addiction / misuse / overdose", "Serotonin syndrome (with serotonergic drugs)", "Adrenal insufficiency (long-term)", "Androgen deficiency (long-term)"], important: ["Boxed warnings for addiction, abuse, misuse, respiratory depression, neonatal opioid withdrawal, and interactions with benzodiazepines."] },
    contraindications: ["Significant respiratory depression", "Acute or severe asthma", "Paralytic ileus", "Hypersensitivity", "Concurrent MAOI use (some formulations)"],
    interactions: [{ drug: "Benzodiazepines / alcohol / CNS depressants", interaction: "Profound sedation, respiratory depression, death", significance: "HIGH" }, { drug: "MAOIs", interaction: "Severe reactions", significance: "HIGH" }, { drug: "Other opioids", interaction: "Additive effects", significance: "HIGH" }, { drug: "Serotonergic drugs", interaction: "Serotonin syndrome risk", significance: "MODERATE" }],
    monitoring: ["Pain relief", "Respiratory rate / sedation", "Bowel function", "Signs of misuse", "Blood pressure"],
    patientCounseling: ["Take exactly as prescribed; do not share.", "Risk of addiction and overdose.", "Do not combine with alcohol or sedatives.", "Constipation is expected — use stool softeners / laxatives as advised.", "Store securely.", "Seek emergency help for slow/shallow breathing."],
    specialPopulations: { pregnancy: "Category C. Prolonged use → neonatal opioid withdrawal syndrome.", breastfeeding: "Excreted; caution; prefer alternatives if possible.", pediatric: "Used with careful dosing.", elderly: "Increased sensitivity; start very low.", renal: "Active metabolite accumulates — reduce dose / extend interval.", hepatic: "Reduce dose." },
    storage: "Store securely at room temperature; protect from theft.",
    references: ["Pain management guidelines; standard pharmacology references"]
  },
  {
    id: "naloxone",
    genericName: "Naloxone",
    brandNames: ["Narcan", "Evzio", "Kloxxado"],
    drugClass: "Opioid Antagonist",
    therapeuticClass: "Opioid Overdose Reversal",
    mechanismOfAction: "Competitive antagonist at mu, kappa, and delta opioid receptors with highest affinity for mu receptors. Rapidly reverses opioid-induced respiratory depression and sedation.",
    mechanismFlow: ["Drug", "Opioid receptors", "Competitive displacement of opioid agonists", "Reversal of opioid effects", "Restoration of respiration"],
    pharmacokinetics: {
      absorption: "Not effective orally (high first-pass). Given IV, IM, subcutaneous, intranasal.",
      distribution: "Rapidly distributed.",
      metabolism: "Hepatic.",
      excretion: "Urine. Very short half-life (~30-90 minutes) — shorter than many opioids."
    },
    indications: ["Known or suspected opioid overdose", "Reversal of opioid effects postoperatively", "Opioid-induced pruritus (selected routes/doses)"],
    dosage: { routes: ["IV", "IM", "Subcutaneous", "Intranasal"], adult: "Overdose: 0.4-2 mg IV/IM/IN; repeat as needed. Higher doses may be required for potent synthetic opioids. Refer to emergency protocols.", pediatric: "Weight-based. Refer to pediatric emergency references.", notes: "Educational only. Effect may wear off before the opioid — continued monitoring essential." },
    adverseEffects: { common: ["Precipitation of acute withdrawal (agitation, nausea, vomiting, sweating, tachycardia)", "Hypertension or hypotension"], serious: ["Severe withdrawal", "Pulmonary edema (rare)", "Cardiac arrhythmias (rare)", "Seizures (rare)"], important: ["Short duration — patients can renarcotize."] },
    contraindications: ["Hypersensitivity (rare)"],
    interactions: [{ drug: "Opioids", interaction: "Antagonism — intended effect", significance: "HIGH" }],
    monitoring: ["Respiratory rate / oxygenation", "Level of consciousness", "Signs of withdrawal", "Need for repeat doses", "Cardiac status"],
    patientCounseling: ["For take-home kits: call emergency services immediately after administration.", "May need multiple doses.", "Person may become agitated when reversed.", "Not a substitute for emergency medical care."],
    specialPopulations: { pregnancy: "Category B/C. Used when needed for overdose.", breastfeeding: "Caution.", pediatric: "Used in overdose.", elderly: "Used as needed.", renal: "No adjustment.", hepatic: "No adjustment." },
    storage: "Store according to product (many at room temperature); check expiration.",
    references: ["Emergency medicine / toxicology guidelines; standard pharmacology references"]
  },
  {
    id: "lithium",
    genericName: "Lithium",
    brandNames: ["Lithobid", "Eskalith"],
    drugClass: "Mood Stabilizer",
    therapeuticClass: "Antimanic / Mood Stabilizer",
    mechanismOfAction: "Not fully elucidated. Inhibits inositol monophosphatase and glycogen synthase kinase-3 (GSK-3), modulates neurotransmitter release, and may enhance serotonin and reduce dopamine/norepinephrine signaling. Stabilizes mood.",
    mechanismFlow: ["Drug", "Intracellular signaling (inositol, GSK-3)", "Modulation of neurotransmission", "Stabilization of neuronal activity", "Mood stabilization"],
    pharmacokinetics: {
      absorption: "Almost complete oral absorption.",
      distribution: "Widely distributed in total body water. No protein binding.",
      metabolism: "Not metabolized.",
      excretion: "Almost entirely renal. Half-life ~18-36 hours. Clearance closely tied to sodium and fluid balance."
    },
    indications: ["Bipolar disorder (acute mania and maintenance)", "Augmentation in unipolar depression (selected)", "Schizoaffective disorder (selected)"],
    dosage: { routes: ["Oral"], adult: "Individualized to serum level (typical maintenance 0.6-1.0 mEq/L; acute mania higher). Refer to psychiatry guidelines.", pediatric: "Specialist use; levels required.", notes: "Educational only. Narrow therapeutic index. Levels mandatory." },
    adverseEffects: { common: ["Tremor", "Polyuria / polydipsia", "Weight gain", "Nausea", "Cognitive slowing", "Acne / psoriasis flare"], serious: ["Lithium toxicity (tremor, ataxia, diarrhea, confusion, seizures, coma)", "Nephrogenic diabetes insipidus", "Chronic kidney disease", "Hypothyroidism", "Ebstein anomaly (teratogenic)", "Serotonin syndrome (rare)"], important: ["Toxicity can occur at levels close to therapeutic; dehydration and sodium loss precipitate toxicity."] },
    contraindications: ["Significant renal impairment", "Sodium depletion / dehydration", "Significant cardiovascular disease (relative)", "Pregnancy (first trimester especially — relative/absolute depending on circumstance)"],
    interactions: [{ drug: "NSAIDs / ACEIs / ARBs / thiazides", interaction: "Increase lithium levels — toxicity risk", significance: "HIGH" }, { drug: "Osmotic diuretics / theophylline / caffeine", interaction: "May decrease levels", significance: "MODERATE" }, { drug: "Serotonergic drugs", interaction: "Serotonin syndrome risk", significance: "MODERATE" }],
    monitoring: ["Serum lithium level (trough)", "Renal function", "Thyroid function", "Electrolytes", "CBC", "Pregnancy test", "ECG (selected)", "Weight"],
    patientCounseling: ["Maintain consistent salt and fluid intake.", "Avoid dehydration (sweating, vomiting, diarrhea).", "Do not take NSAIDs without advice.", "Report severe tremor, vomiting, diarrhea, or confusion immediately.", "Regular blood tests are essential.", "Effective contraception recommended."],
    specialPopulations: { pregnancy: "Category D. Ebstein anomaly risk. Specialist management if continued.", breastfeeding: "Excreted; generally avoided.", pediatric: "Specialist only.", elderly: "Lower doses; higher toxicity risk.", renal: "Contraindicated or extreme caution with frequent levels.", hepatic: "No major adjustment." },
    storage: "Store at room temperature.",
    references: ["Bipolar disorder guidelines; standard pharmacology references"]
  },
  // ========== CARDIOVASCULAR ADDITIONS ==========
  {
    id: "digoxin",
    genericName: "Digoxin",
    brandNames: ["Lanoxin"],
    drugClass: "Cardiac Glycoside",
    therapeuticClass: "Positive Inotrope / Rate Control",
    mechanismOfAction: "Inhibits Na+/K+-ATPase in cardiac myocytes, increasing intracellular sodium, which reduces calcium extrusion via NCX, leading to increased intracellular calcium and stronger contractions (positive inotropy). Also increases vagal tone, slowing AV nodal conduction.",
    mechanismFlow: ["Drug", "Na+/K+-ATPase", "↑ Intracellular Na+ → ↑ Ca2+", "Stronger contraction + ↑ vagal tone", "Improved contractility + rate control"],
    pharmacokinetics: {
      absorption: "Variable (60-80% tablets). Elixir and IV available.",
      distribution: "Wide; concentrates in tissues. Large Vd.",
      metabolism: "Minimal; some bacterial metabolism in gut.",
      excretion: "Primarily renal (unchanged). Half-life ~36-48 hours (longer in renal impairment)."
    },
    indications: ["Heart failure with reduced ejection fraction (selected patients)", "Rate control in atrial fibrillation"],
    dosage: { routes: ["Oral", "IV"], adult: "Loading and maintenance highly individualized; typical maintenance 0.125-0.25 mg daily. Therapeutic level roughly 0.5-0.9 ng/mL for HF. Refer to guidelines.", pediatric: "Weight-based; specialist use.", notes: "Educational only. Narrow therapeutic index. Levels and renal function critical." },
    adverseEffects: { common: ["Nausea", "Vomiting", "Anorexia", "Fatigue", "Visual disturbances (yellow/green halos)", "Arrhythmias"], serious: ["Life-threatening arrhythmias (ventricular, AV block)", "Severe toxicity", "Gynecomastia (chronic)"], important: ["Hypokalemia dramatically increases toxicity risk."] },
    contraindications: ["Ventricular fibrillation", "Known hypersensitivity", "Serious AV block / sick sinus without pacemaker", "Hypertrophic cardiomyopathy with outflow obstruction (relative)"],
    interactions: [{ drug: "Amiodarone / verapamil / quinidine / clarithromycin", interaction: "Increase digoxin levels significantly", significance: "HIGH" }, { drug: "Diuretics (K+-losing)", interaction: "Hypokalemia → toxicity", significance: "HIGH" }, { drug: "Cholestyramine / antacids", interaction: "May decrease absorption", significance: "MODERATE" }],
    monitoring: ["Serum digoxin level", "Electrolytes (especially K+, Mg2+)", "Renal function", "Heart rate / rhythm", "Symptoms of toxicity"],
    patientCounseling: ["Take at the same time each day.", "Report nausea, visual changes, or irregular heartbeat immediately.", "Maintain consistent potassium intake.", "Do not double doses.", "Regular blood tests required."],
    specialPopulations: { pregnancy: "Category C.", breastfeeding: "Compatible.", pediatric: "Used; careful dosing.", elderly: "Lower doses; higher toxicity risk.", renal: "Major dose reduction required.", hepatic: "No major adjustment." },
    storage: "Store at room temperature; protect from light.",
    references: ["Heart failure guidelines; standard pharmacology references"]
  },
  {
    id: "amiodarone",
    genericName: "Amiodarone",
    brandNames: ["Cordarone", "Pacerone", "Nexterone"],
    drugClass: "Class III Antiarrhythmic (with multi-class effects)",
    therapeuticClass: "Antiarrhythmic",
    mechanismOfAction: "Primarily prolongs phase 3 of the action potential by blocking potassium channels (Class III). Also has Class I (Na channel block), Class II (beta-blockade), and Class IV (calcium channel block) activity, plus alpha-blocking effects.",
    mechanismFlow: ["Drug", "K+ channels (+ Na, β, Ca effects)", "Prolonged repolarization", "Increased refractory period", "Suppression of arrhythmias"],
    pharmacokinetics: {
      absorption: "Variable oral bioavailability (30-70%).",
      distribution: "Enormous volume of distribution; accumulates in many tissues.",
      metabolism: "Hepatic CYP3A4 to active metabolite (desethylamiodarone).",
      excretion: "Primarily biliary. Extremely long half-life (weeks to months)."
    },
    indications: ["Ventricular arrhythmias (life-threatening)", "Atrial fibrillation (rhythm control, selected)", "ACLS protocols for certain arrest rhythms"],
    dosage: { routes: ["Oral", "IV"], adult: "Loading regimens are complex (e.g., 800-1600 mg/day oral initially, then taper). IV protocols specific. Refer to cardiology / ACLS.", pediatric: "Specialist use.", notes: "Educational only. Many serious toxicities; requires baseline and ongoing monitoring." },
    adverseEffects: { common: ["Corneal microdeposits", "Photosensitivity", "Nausea", "Constipation", "Tremor", "Sleep disturbance"], serious: ["Pulmonary toxicity / fibrosis", "Hepatotoxicity", "Thyroid dysfunction (hypo or hyper)", "Bradycardia / AV block", "QT prolongation / torsades (less than other Class III)", "Optic neuropathy", "Blue-gray skin discoloration"], important: ["Requires baseline CXR, PFTs, LFTs, TFT, ECG and regular follow-up."] },
    contraindications: ["Cardiogenic shock", "Severe sinus node dysfunction / AV block without pacemaker", "Known hypersensitivity (including iodine)", "Significant thyroid disease (relative)"],
    interactions: [{ drug: "Warfarin", interaction: "Potentiates anticoagulant effect markedly", significance: "HIGH" }, { drug: "Digoxin", interaction: "Increases digoxin levels ~2-fold", significance: "HIGH" }, { drug: "Other QT-prolonging drugs", interaction: "Additive risk", significance: "HIGH" }, { drug: "Simvastatin / lovastatin", interaction: "Increased myopathy risk; limit statin dose", significance: "HIGH" }, { drug: "Beta-blockers / non-DHP CCBs", interaction: "Additive bradycardia / AV block", significance: "HIGH" }],
    monitoring: ["ECG", "Thyroid function", "Liver function", "Chest X-ray / pulmonary symptoms", "Ophthalmologic exam", "Digoxin / INR if co-administered"],
    patientCounseling: ["Regular blood tests and eye exams are required.", "Use strong sun protection.", "Report shortness of breath, cough, vision changes, or extreme fatigue.", "Many drug interactions — inform all providers.", "Effects persist long after stopping."],
    specialPopulations: { pregnancy: "Category D. Avoid if possible.", breastfeeding: "Not recommended.", pediatric: "Specialist only.", elderly: "Higher risk of toxicity; lower doses.", renal: "No major adjustment.", hepatic: "Caution; monitor closely." },
    storage: "Store at room temperature; protect from light.",
    references: ["Arrhythmia guidelines; standard pharmacology references"]
  },
  {
    id: "warfarin",
    genericName: "Warfarin",
    brandNames: ["Coumadin", "Jantoven"],
    drugClass: "Vitamin K Antagonist",
    therapeuticClass: "Oral Anticoagulant",
    mechanismOfAction: "Inhibits vitamin K epoxide reductase (VKORC1), preventing regeneration of active vitamin K. This impairs hepatic synthesis of vitamin K-dependent clotting factors (II, VII, IX, X) and anticoagulant proteins C and S.",
    mechanismFlow: ["Drug", "VKORC1", "↓ Active vitamin K", "↓ Factors II, VII, IX, X", "Anticoagulation"],
    pharmacokinetics: {
      absorption: "Rapid and complete.",
      distribution: "Highly protein bound (~99%).",
      metabolism: "Hepatic CYP2C9 (major), CYP3A4, CYP1A2. Genetic variation important (CYP2C9, VKORC1).",
      excretion: "Urine and feces (metabolites). Half-life ~40 hours (variable)."
    },
    indications: ["Prevention/treatment of venous thromboembolism", "Stroke prevention in atrial fibrillation", "Mechanical heart valves", "Secondary prevention after MI (selected)"],
    dosage: { routes: ["Oral"], adult: "Highly individualized to INR target (usually 2-3 or 2.5-3.5 for mechanical valves). Typical start 2-5 mg daily. Refer to anticoagulation guidelines.", pediatric: "Specialist dosing.", notes: "Educational only. Narrow therapeutic index. INR monitoring mandatory. Many interactions." },
    adverseEffects: { common: ["Bleeding (minor)", "Bruising", "GI upset"], serious: ["Major / fatal bleeding", "Skin necrosis (protein C deficiency)", "Purple toe syndrome", "Teratogenicity", "Drug interactions leading to over/under anticoagulation"], important: ["Dietary vitamin K consistency is critical."] },
    contraindications: ["Active major bleeding", "Severe thrombocytopenia", "Pregnancy (except mechanical valves in some cases)", "Unsupervised patients with high bleeding risk", "Recent major surgery / invasive procedures (timing-dependent)"],
    interactions: [{ drug: "Many antibiotics, antifungals, amiodarone, statins, etc.", interaction: "Increase INR", significance: "HIGH" }, { drug: "Vitamin K-rich foods / supplements", interaction: "Decrease INR", significance: "HIGH" }, { drug: "NSAIDs / antiplatelets", interaction: "Increased bleeding risk", significance: "HIGH" }, { drug: "Rifampin / carbamazepine / St. John’s wort", interaction: "Decrease INR", significance: "HIGH" }],
    monitoring: ["INR (frequent especially initially and with changes)", "CBC", "Signs of bleeding", "Dietary changes", "New medications"],
    patientCounseling: ["Keep vitamin K intake consistent (leafy greens).", "Report unusual bleeding or bruising.", "Inform all providers and dentists you take warfarin.", "Avoid drastic diet changes and new OTC drugs without checking.", "Regular INR blood tests are essential.", "Use reliable contraception."],
    specialPopulations: { pregnancy: "Category X (except selected mechanical valve cases under specialist care).", breastfeeding: "Compatible.", pediatric: "Specialist only.", elderly: "Higher bleeding risk; lower doses often needed.", renal: "No major adjustment but higher overall risk.", hepatic: "Impaired synthesis of factors — caution / lower doses." },
    storage: "Store at room temperature; protect from light and moisture.",
    references: ["Anticoagulation guidelines; standard pharmacology references"]
  },
  {
    id: "heparin",
    genericName: "Unfractionated Heparin",
    brandNames: ["Various"],
    drugClass: "Indirect Thrombin / Factor Xa Inhibitor",
    therapeuticClass: "Parenteral Anticoagulant",
    mechanismOfAction: "Binds to antithrombin III, markedly accelerating its inhibition of thrombin (factor IIa) and factor Xa (and other serine proteases). Prevents fibrin formation.",
    mechanismFlow: ["Drug", "Antithrombin III", "Accelerated inhibition of thrombin & Xa", "↓ Fibrin formation", "Anticoagulation"],
    pharmacokinetics: {
      absorption: "Not absorbed orally. Given IV or subcutaneous.",
      distribution: "Binds to many plasma proteins and cells; variable effect.",
      metabolism: "Cleared by reticuloendothelial system and endothelium.",
      excretion: "Non-renal primarily. Half-life dose-dependent (~30-90 min)."
    },
    indications: ["Acute coronary syndromes", "Venous thromboembolism treatment / prophylaxis", "Cardiopulmonary bypass", "Bridge to warfarin", "Dialysis anticoagulation"],
    dosage: { routes: ["IV", "Subcutaneous"], adult: "Weight-based protocols for treatment (bolus + infusion). Prophylaxis: fixed low doses SC. Refer to institutional protocols and guidelines.", pediatric: "Weight-based protocols.", notes: "Educational only. aPTT or anti-Xa monitoring for therapeutic dosing." },
    adverseEffects: { common: ["Bleeding", "Injection site reactions", "Mild thrombocytopenia"], serious: ["Major bleeding", "Heparin-induced thrombocytopenia (HIT)", "Osteoporosis (long-term)", "Hyperkalemia", "Anaphylaxis (rare)"], important: ["HIT is an immune-mediated prothrombotic complication — monitor platelets."] },
    contraindications: ["Known HIT (current or past)", "Active major bleeding", "Severe thrombocytopenia", "Hypersensitivity"],
    interactions: [{ drug: "Other anticoagulants / antiplatelets / thrombolytics", interaction: "Increased bleeding", significance: "HIGH" }, { drug: "NSAIDs", interaction: "Increased bleeding risk", significance: "MODERATE" }],
    monitoring: ["aPTT or anti-Xa (therapeutic dosing)", "Platelet count (HIT surveillance)", "Hemoglobin / signs of bleeding", "Potassium (selected)"],
    patientCounseling: ["This medication is given in hospital or under close supervision.", "Report any unusual bleeding or bruising.", "Avoid injury-prone activities while anticoagulated."],
    specialPopulations: { pregnancy: "Category C. Does not cross placenta; preferred anticoagulant in pregnancy when needed.", breastfeeding: "Compatible.", pediatric: "Used with protocols.", elderly: "Higher bleeding risk.", renal: "Preferred over LMWH in severe renal impairment for some indications.", hepatic: "Caution." },
    storage: "Store at room temperature.",
    references: ["Anticoagulation guidelines; standard pharmacology references"]
  },
  {
    id: "atorvastatin",
    genericName: "Atorvastatin",
    brandNames: ["Lipitor"],
    drugClass: "HMG-CoA Reductase Inhibitor (Statin)",
    therapeuticClass: "Antihyperlipidemic / Cardiovascular Risk Reduction",
    mechanismOfAction: "Competitively inhibits HMG-CoA reductase, the rate-limiting enzyme in cholesterol synthesis in the liver. This upregulates LDL receptors, increasing clearance of LDL from blood. Also has pleiotropic effects (plaque stabilization, anti-inflammatory).",
    mechanismFlow: ["Drug", "HMG-CoA reductase", "↓ Hepatic cholesterol synthesis", "↑ LDL receptors → ↑ LDL clearance", "Lower LDL-C + CV risk reduction"],
    pharmacokinetics: {
      absorption: "Rapidly absorbed; extensive first-pass. Bioavailability low (~14%).",
      distribution: "Highly protein bound.",
      metabolism: "Hepatic CYP3A4 to active metabolites.",
      excretion: "Primarily bile. Half-life ~14 hours (activity longer due to metabolites)."
    },
    indications: ["Hypercholesterolemia", "Mixed dyslipidemia", "Primary prevention of cardiovascular disease", "Secondary prevention after ASCVD events", "Familial hypercholesterolemia"],
    dosage: { routes: ["Oral"], adult: "10-80 mg once daily. High-intensity: 40-80 mg. Refer to cholesterol guidelines.", pediatric: "Approved for certain ages/familial hypercholesterolemia. Refer to labeling.", notes: "Educational only. Take any time of day. Check baseline LFTs and CK if indicated." },
    adverseEffects: { common: ["Myalgia", "GI upset", "Headache", "Elevated liver enzymes (mild)"], serious: ["Myopathy / rhabdomyolysis", "Immune-mediated necrotizing myopathy", "Hepatotoxicity (rare)", "New-onset diabetes (small risk)", "Hemorrhagic stroke (very small risk at high intensity)"], important: ["Report unexplained muscle pain, tenderness, or weakness."] },
    contraindications: ["Active liver disease", "Unexplained persistent elevations of transaminases", "Pregnancy", "Breastfeeding", "Hypersensitivity"],
    interactions: [{ drug: "Strong CYP3A4 inhibitors (clarithromycin, itraconazole, ritonavir, etc.)", interaction: "Increased myopathy risk", significance: "HIGH" }, { drug: "Gemfibrozil / other fibrates", interaction: "Increased myopathy risk", significance: "HIGH" }, { drug: "Cyclosporine", interaction: "Increased levels / myopathy", significance: "HIGH" }, { drug: "Grapefruit juice (large amounts)", interaction: "Increased levels", significance: "MODERATE" }],
    monitoring: ["Lipid panel", "Liver enzymes (baseline; as clinically indicated)", "CK if muscle symptoms", "HbA1c / glucose (selected)"],
    patientCounseling: ["Can be taken any time of day, with or without food.", "Report unexplained muscle pain or dark urine immediately.", "Limit large amounts of grapefruit juice.", "Lifestyle measures remain important.", "Not safe in pregnancy."],
    specialPopulations: { pregnancy: "Category X. Contraindicated.", breastfeeding: "Contraindicated.", pediatric: "Approved for specific indications/ages.", elderly: "No major adjustment; monitor for interactions.", renal: "No adjustment needed.", hepatic: "Contraindicated in active disease." },
    storage: "Store at room temperature.",
    references: ["Cholesterol guidelines (ACC/AHA); standard pharmacology references"]
  },
  {
    id: "nitroglycerin",
    genericName: "Nitroglycerin",
    brandNames: ["Nitrostat", "Nitro-Dur", "Nitro-Bid", "Nitronal"],
    drugClass: "Organic Nitrate",
    therapeuticClass: "Antianginal / Vasodilator",
    mechanismOfAction: "Converted to nitric oxide (NO) in vascular smooth muscle, which activates guanylate cyclase, increases cGMP, and causes dephosphorylation of myosin light chains → smooth muscle relaxation. Preferential venodilation at low doses reduces preload; higher doses also dilate arteries.",
    mechanismFlow: ["Drug", "Nitric oxide formation", "↑ cGMP", "Venodilation (↓ preload) ± arterial dilation", "Reduced myocardial oxygen demand / improved supply"],
    pharmacokinetics: {
      absorption: "Sublingual: rapid. Oral: extensive first-pass. Transdermal / ointment: sustained. IV: immediate.",
      distribution: "Wide.",
      metabolism: "Hepatic and vascular (rapid).",
      excretion: "Urine. Very short half-life (1-4 minutes)."
    },
    indications: ["Acute angina pectoris", "Angina prophylaxis", "Acute coronary syndromes", "Hypertensive emergencies (selected)", "Heart failure / volume overload (selected)", "Anal fissure (topical)"],
    dosage: { routes: ["Sublingual", "Transdermal", "Topical ointment", "IV", "Oral spray"], adult: "SL: 0.3-0.6 mg every 5 min × 3 as needed. Prophylaxis and IV dosing per protocols. Refer to guidelines.", pediatric: "Limited use; specialist.", notes: "Educational only. Nitrate-free interval needed to prevent tolerance with continuous use." },
    adverseEffects: { common: ["Headache", "Flushing", "Hypotension", "Dizziness", "Reflex tachycardia"], serious: ["Severe hypotension", "Syncope", "Methemoglobinemia (rare, high dose)", "Rebound angina"], important: ["Contraindicated with PDE5 inhibitors — life-threatening hypotension."] },
    contraindications: ["Concurrent use of PDE5 inhibitors (sildenafil, tadalafil, etc.) or riociguat", "Severe hypotension / shock", "Right ventricular infarction (relative — caution)", "Increased intracranial pressure", "Severe anemia", "Allergy to nitrates (rare)"],
    interactions: [{ drug: "PDE5 inhibitors / riociguat", interaction: "Profound hypotension — contraindicated", significance: "HIGH" }, { drug: "Other antihypertensives / alcohol", interaction: "Additive hypotension", significance: "MODERATE" }, { drug: "Ergot derivatives", interaction: "Antagonism / coronary vasoconstriction", significance: "MODERATE" }],
    monitoring: ["Blood pressure", "Heart rate", "Angina frequency / severity", "Headache"],
    patientCounseling: ["For chest pain: sit down, take one SL tablet; if pain persists after 5 min call emergency services; may take up to 3.", "Store SL tablets in original glass bottle, tightly closed; replace after opening per product advice.", "Headache is common and often improves.", "Do not use with erectile dysfunction drugs.", "Allow nitrate-free period with patches/ointment as directed."],
    specialPopulations: { pregnancy: "Category C.", breastfeeding: "Caution.", pediatric: "Limited.", elderly: "Increased hypotension risk.", renal: "No major adjustment.", hepatic: "Caution." },
    storage: "SL tablets: original container, room temperature, protect from moisture and light. Follow product-specific guidance.",
    references: ["Stable ischemic heart disease / ACS guidelines; standard pharmacology references"]
  },
  // ========== ENDOCRINE / OTHER ==========
  {
    id: "levothyroxine",
    genericName: "Levothyroxine",
    brandNames: ["Synthroid", "Levoxyl", "Tirosint", "Euthyrox"],
    drugClass: "Synthetic Thyroid Hormone (T4)",
    therapeuticClass: "Thyroid Hormone Replacement",
    mechanismOfAction: "Synthetic thyroxine (T4) that is converted peripherally to active T3. Binds to thyroid hormone receptors in the nucleus, regulating gene expression critical for metabolism, growth, and development.",
    mechanismFlow: ["Drug (T4)", "Peripheral conversion to T3", "Nuclear thyroid receptors", "Regulation of gene expression", "Restoration of euthyroid state"],
    pharmacokinetics: {
      absorption: "Variable (40-80%); best on empty stomach. Decreased by food, calcium, iron, etc.",
      distribution: "Highly protein bound (TBG, transthyretin, albumin).",
      metabolism: "Deiodination to T3 and reverse T3; further metabolism in liver/kidney.",
      excretion: "Bile and urine. Half-life ~7 days (allows daily dosing)."
    },
    indications: ["Hypothyroidism", "TSH suppression in thyroid cancer / nodules (selected)", "Myxedema coma (IV)"],
    dosage: { routes: ["Oral", "IV"], adult: "Typical full replacement ~1.6 mcg/kg/day; start lower in elderly or cardiac disease. Titrate to TSH. Refer to guidelines.", pediatric: "Higher mcg/kg requirements. Refer to pediatric endocrinology.", notes: "Educational only. Take on empty stomach consistently. Brand consistency preferred by many experts." },
    adverseEffects: { common: ["Symptoms of hyperthyroidism if over-replaced (palpitations, tremor, weight loss, insomnia)", "Hair loss (transient early)"], serious: ["Atrial fibrillation", "Osteoporosis (chronic over-replacement)", "Angina / MI in susceptible patients", "Adrenal crisis if given before corticosteroids in central hypothyroidism with adrenal insufficiency"], important: ["Do not use for weight loss — dangerous in euthyroid individuals."] },
    contraindications: ["Uncorrected adrenal insufficiency", "Acute MI (relative — caution)", "Thyrotoxicosis", "Hypersensitivity to components"],
    interactions: [{ drug: "Calcium / iron / antacids / bile acid sequestrants / PPIs", interaction: "Reduced absorption — separate by 4 hours", significance: "HIGH" }, { drug: "Warfarin", interaction: "May potentiate anticoagulant effect", significance: "MODERATE" }, { drug: "Estrogens / pregnancy", interaction: "Increased TBG → may need higher dose", significance: "MODERATE" }, { drug: "Amiodarone / lithium", interaction: "Affect thyroid function", significance: "MODERATE" }],
    monitoring: ["TSH (primary)", "Free T4", "Symptoms", "Heart rate", "Bone density (selected long-term over-replacement)"],
    patientCounseling: ["Take on an empty stomach, 30-60 minutes before breakfast or at bedtime ≥3 hours after last meal.", "Be consistent with brand/formulation.", "Separate from calcium, iron, and antacids by at least 4 hours.", "Do not stop without medical advice.", "Regular blood tests needed."],
    specialPopulations: { pregnancy: "Category A. Increased requirements; monitor closely. Critical for fetal brain development.", breastfeeding: "Compatible.", pediatric: "Essential for growth and development; higher doses per kg.", elderly: "Start low (e.g., 25-50 mcg); increase slowly.", renal: "No major adjustment.", hepatic: "No major adjustment." },
    storage: "Store at room temperature; protect from light and moisture.",
    references: ["Thyroid guidelines (ATA); standard pharmacology references"]
  },
  {
    id: "prednisone",
    genericName: "Prednisone",
    brandNames: ["Deltasone", "Rayos"],
    drugClass: "Glucocorticoid",
    therapeuticClass: "Anti-inflammatory / Immunosuppressant",
    mechanismOfAction: "Converted to prednisolone. Binds glucocorticoid receptors, translocates to nucleus, and modulates gene transcription (increases anti-inflammatory proteins, decreases pro-inflammatory cytokines, inhibits phospholipase A2 via lipocortin). Also has metabolic and immunosuppressive effects.",
    mechanismFlow: ["Drug → Prednisolone", "Glucocorticoid receptor", "Gene transcription modulation", "↓ Inflammation & immune response", "Therapeutic anti-inflammatory effect"],
    pharmacokinetics: {
      absorption: "Well absorbed orally.",
      distribution: "Protein bound.",
      metabolism: "Hepatic conversion to active prednisolone; further metabolism.",
      excretion: "Urine. Half-life of prednisolone ~3-4 hours; biological effect longer."
    },
    indications: ["Inflammatory and autoimmune conditions (asthma exacerbations, COPD, rheumatoid arthritis, lupus, IBD, allergic reactions, etc.)", "Replacement in adrenal insufficiency (with mineralocorticoid if needed)", "Oncology protocols", "Prevention of transplant rejection (selected)"],
    dosage: { routes: ["Oral"], adult: "Highly variable by indication (e.g., 5-60 mg daily or more). Taper often required. Refer to specific disease guidelines.", pediatric: "Weight-based; specialist guidance for long-term use.", notes: "Educational only. Use lowest effective dose for shortest duration. Taper after prolonged use." },
    adverseEffects: { common: ["Increased appetite / weight gain", "Insomnia", "Mood changes", "Hyperglycemia", "Dyspepsia", "Fluid retention", "Acne"], serious: ["Adrenal suppression", "Osteoporosis / fractures", "Increased infection risk", "Avascular necrosis", "Cataracts / glaucoma", "Peptic ulcer", "Growth suppression (children)", "Psychiatric effects (psychosis, severe mood disorders)"], important: ["Never stop abruptly after prolonged therapy — risk of adrenal crisis."] },
    contraindications: ["Systemic fungal infections", "Live vaccines (with immunosuppressive doses)", "Hypersensitivity"],
    interactions: [{ drug: "NSAIDs", interaction: "Increased GI ulcer risk", significance: "HIGH" }, { drug: "Warfarin", interaction: "Variable effect on INR", significance: "MODERATE" }, { drug: "Diabetes medications", interaction: "Hyperglycemia — may need adjustment", significance: "MODERATE" }, { drug: "CYP3A4 inducers / inhibitors", interaction: "Altered steroid levels", significance: "MODERATE" }, { drug: "Diuretics", interaction: "Enhanced potassium loss", significance: "MODERATE" }],
    monitoring: ["Blood glucose", "Blood pressure", "Weight", "Bone density (long-term)", "Ophthalmologic exam (long-term)", "Growth (children)", "Signs of infection", "Mood"],
    patientCounseling: ["Take with food to reduce stomach upset.", "Do not stop suddenly if used more than a few weeks — taper as directed.", "Report signs of infection, unusual mood changes, or vision changes.", "May increase blood sugar.", "Carry medical identification if on long-term therapy.", "Avoid live vaccines while on significant doses."],
    specialPopulations: { pregnancy: "Category C/D. Used when benefit outweighs risk; possible fetal adrenal suppression.", breastfeeding: "Compatible at moderate doses; higher doses — time feeds or discuss.", pediatric: "Growth suppression risk with long-term use.", elderly: "Higher risk of osteoporosis, diabetes, hypertension, infection.", renal: "No major adjustment.", hepatic: "Impaired conversion of prednisone to prednisolone — prefer prednisolone." },
    storage: "Store at room temperature; protect from moisture.",
    references: ["Standard pharmacology and disease-specific guidelines"]
  },
  {
    id: "alendronate",
    genericName: "Alendronate",
    brandNames: ["Fosamax", "Binosto"],
    drugClass: "Bisphosphonate",
    therapeuticClass: "Anti-Osteoporotic / Bone Resorption Inhibitor",
    mechanismOfAction: "Binds to hydroxyapatite in bone and inhibits farnesyl pyrophosphate synthase in the mevalonate pathway in osteoclasts. This leads to osteoclast apoptosis and reduced bone resorption, increasing bone mineral density.",
    mechanismFlow: ["Drug", "Osteoclasts (mevalonate pathway)", "Inhibition of farnesyl pyrophosphate synthase", "Osteoclast apoptosis", "↓ Bone resorption → ↑ BMD"],
    pharmacokinetics: {
      absorption: "Very poor oral absorption (<1%); further reduced by food, calcium, etc.",
      distribution: "Rapidly taken up by bone or excreted.",
      metabolism: "Not metabolized.",
      excretion: "Urine (unabsorbed drug in feces). Long skeletal half-life (years)."
    },
    indications: ["Osteoporosis treatment and prevention (postmenopausal, men, glucocorticoid-induced)", "Paget disease of bone"],
    dosage: { routes: ["Oral"], adult: "Osteoporosis treatment: 70 mg once weekly or 10 mg daily. Prevention: lower. Refer to labeling and bone guidelines.", pediatric: "Not typically used.", notes: "Educational only. Strict administration instructions critical for absorption and to avoid esophagitis." },
    adverseEffects: { common: ["Esophagitis / heartburn", "Abdominal pain", "Musculoskeletal pain", "Headache"], serious: ["Osteonecrosis of the jaw", "Atypical femoral fractures", "Severe esophagitis / esophageal ulcer / stricture", "Hypocalcemia", "Uveitis / scleritis (rare)"], important: ["Dental evaluation recommended before starting long-term therapy."] },
    contraindications: ["Esophageal abnormalities delaying emptying", "Inability to stand or sit upright for at least 30 minutes", "Hypocalcemia", "Hypersensitivity", "Severe renal impairment (CrCl <35 mL/min)"],
    interactions: [{ drug: "Calcium / iron / antacids / food / coffee / juice", interaction: "Markedly reduce absorption — separate", significance: "HIGH" }, { drug: "NSAIDs", interaction: "Possible increased GI risk", significance: "MODERATE" }],
    monitoring: ["Bone mineral density", "Calcium / vitamin D status", "Renal function", "Dental health", "Height / back pain (vertebral fractures)"],
    patientCounseling: ["Take first thing in the morning with a full glass of plain water only.", "Remain upright (sitting or standing) for at least 30 minutes and until after first food of the day.", "Do not take with other beverages, food, or medications.", "Ensure adequate calcium and vitamin D intake (separated in time).", "Report new thigh/groin pain or dental problems.", "Dental work should be planned carefully."],
    specialPopulations: { pregnancy: "Category C. Not generally used.", breastfeeding: "Not recommended.", pediatric: "Not indicated for typical osteoporosis.", elderly: "Widely used; ensure renal function adequate.", renal: "Avoid if CrCl <35 mL/min.", hepatic: "No adjustment." },
    storage: "Store at room temperature.",
    references: ["Osteoporosis guidelines; standard pharmacology references"]
  },
  {
    id: "sildenafil",
    genericName: "Sildenafil",
    brandNames: ["Viagra", "Revatio"],
    drugClass: "Phosphodiesterase Type 5 (PDE5) Inhibitor",
    therapeuticClass: "Erectile Dysfunction / Pulmonary Arterial Hypertension",
    mechanismOfAction: "Inhibits PDE5, preventing breakdown of cGMP in smooth muscle of the corpus cavernosum (and pulmonary vasculature). Increased cGMP leads to smooth muscle relaxation, increased blood flow, and erection (in the presence of sexual stimulation) or pulmonary vasodilation.",
    mechanismFlow: ["Drug", "PDE5 enzyme", "↑ cGMP", "Smooth muscle relaxation", "Increased penile blood flow / pulmonary vasodilation"],
    pharmacokinetics: {
      absorption: "Rapidly absorbed; bioavailability ~40%. High-fat meals delay absorption.",
      distribution: "Protein bound ~96%.",
      metabolism: "Hepatic CYP3A4 (major) and CYP2C9.",
      excretion: "Feces (major) and urine. Half-life ~4 hours."
    },
    indications: ["Erectile dysfunction", "Pulmonary arterial hypertension (Revatio)", "Altitude sickness (off-label, selected)"],
    dosage: { routes: ["Oral"], adult: "ED: 50 mg (range 25-100 mg) as needed ~1 hour before activity. PAH: 20 mg three times daily. Refer to labeling.", pediatric: "PAH dosing exists for certain ages. Refer to specialist.", notes: "Educational only. Absolute contraindication with nitrates." },
    adverseEffects: { common: ["Headache", "Flushing", "Dyspepsia", "Nasal congestion", "Visual changes (blue tinge, brightness)", "Back pain"], serious: ["Priapism", "Sudden vision loss (NAION)", "Sudden hearing loss", "Severe hypotension (with nitrates)", "Myocardial infarction (in high-risk patients during sex)"], important: ["Never combine with nitrates — life-threatening hypotension."] },
    contraindications: ["Concurrent nitrates or riociguat", "Hypersensitivity", "Severe hepatic impairment (for some uses)", "Recent stroke/MI or unstable angina (relative for ED use)", "Retinitis pigmentosa (relative)"],
    interactions: [{ drug: "Nitrates / riociguat", interaction: "Profound hypotension — contraindicated", significance: "HIGH" }, { drug: "Strong CYP3A4 inhibitors", interaction: "Increased sildenafil levels — reduce dose", significance: "HIGH" }, { drug: "Alpha-blockers", interaction: "Additive hypotension — caution / separate dosing", significance: "MODERATE" }, { drug: "Other antihypertensives", interaction: "Additive BP lowering", significance: "MODERATE" }],
    monitoring: ["Blood pressure", "Efficacy / side effects", "Vision / hearing changes", "Cardiovascular status"],
    patientCounseling: ["Take as needed for ED approximately 1 hour before sexual activity.", "Do not take more than once daily.", "Seek emergency care for erection lasting >4 hours.", "Report sudden vision or hearing loss immediately.", "Absolutely do not use with any nitrate medication.", "High-fat meals may delay effect."],
    specialPopulations: { pregnancy: "Category B (PAH use). Not indicated for ED in women.", breastfeeding: "Caution (PAH).", pediatric: "Approved for PAH in certain ages.", elderly: "Start with lower dose for ED.", renal: "Dose reduction in severe impairment.", hepatic: "Dose reduction in impairment." },
    storage: "Store at room temperature.",
    references: ["ED and PAH guidelines; standard pharmacology references"]
  },
  {
    id: "ondansetron",
    genericName: "Ondansetron",
    brandNames: ["Zofran", "Zuplenz"],
    drugClass: "5-HT3 Receptor Antagonist",
    therapeuticClass: "Antiemetic",
    mechanismOfAction: "Selective antagonist of serotonin 5-HT3 receptors in the chemoreceptor trigger zone and on vagal afferents in the GI tract. Blocks serotonin-mediated nausea and vomiting signals.",
    mechanismFlow: ["Drug", "5-HT3 receptors (CTZ + vagal)", "Blockade of serotonin signaling", "Reduced nausea/vomiting signals", "Antiemetic effect"],
    pharmacokinetics: {
      absorption: "Well absorbed orally; bioavailability ~60% due to first-pass.",
      distribution: "Moderate protein binding.",
      metabolism: "Hepatic (CYP3A4, CYP1A2, CYP2D6).",
      excretion: "Urine and feces. Half-life ~3-6 hours."
    },
    indications: ["Chemotherapy-induced nausea and vomiting", "Radiotherapy-induced nausea and vomiting", "Postoperative nausea and vomiting", "Off-label: gastroenteritis, pregnancy (selected)"],
    dosage: { routes: ["Oral", "IV", "IM", "Oral dissolving"], adult: "Varies by indication (e.g., 8 mg oral for CINV; 4 mg IV for PONV). Refer to guidelines.", pediatric: "Weight/age-based. Refer to pediatric references.", notes: "Educational only. QT prolongation risk — caution with other QT drugs." },
    adverseEffects: { common: ["Headache", "Constipation", "Fatigue", "Malaise"], serious: ["QT prolongation / torsades", "Serotonin syndrome (with other serotonergic drugs)", "Hypersensitivity / anaphylaxis", "Extrapyramidal reactions (rare)", "Masking of progressive ileus"], important: ["Dose-dependent QT prolongation; ECG monitoring in high-risk patients."] },
    contraindications: ["Concurrent apomorphine", "Hypersensitivity to ondansetron or other 5-HT3 antagonists", "Congenital long QT syndrome (relative)"],
    interactions: [{ drug: "Other QT-prolonging drugs", interaction: "Additive QT risk", significance: "HIGH" }, { drug: "Serotonergic drugs (SSRIs, SNRIs, tramadol, etc.)", interaction: "Serotonin syndrome risk", significance: "MODERATE" }, { drug: "Apomorphine", interaction: "Profound hypotension — contraindicated", significance: "HIGH" }],
    monitoring: ["Nausea/vomiting control", "ECG / electrolytes in high-risk patients", "Bowel function", "Signs of serotonin syndrome"],
    patientCounseling: ["Can be taken with or without food.", "Oral dissolving tablet: allow to dissolve on tongue; do not chew.", "Report headache, constipation, or irregular heartbeat.", "Tell provider about all other medications."],
    specialPopulations: { pregnancy: "Category B. Commonly used when needed.", breastfeeding: "Caution; limited data.", pediatric: "Widely used.", elderly: "No major adjustment; monitor QT risk.", renal: "No adjustment.", hepatic: "Maximum dose limits in severe impairment." },
    storage: "Store at room temperature; protect from light.",
    references: ["Antiemetic guidelines; standard pharmacology references"]
  },
  {
    id: "diphenhydramine",
    genericName: "Diphenhydramine",
    brandNames: ["Benadryl", "Nytol", "Sominex", "Banophen"],
    drugClass: "First-Generation H1 Antihistamine",
    therapeuticClass: "Antihistamine / Sedative / Antiemetic / Antitussive",
    mechanismOfAction: "Competitive antagonist at H1 histamine receptors. Also has significant anticholinergic (muscarinic) and sedative effects due to CNS penetration. Crosses blood-brain barrier readily.",
    mechanismFlow: ["Drug", "H1 receptors (+ muscarinic)", "Blockade of histamine effects", "↓ Allergic symptoms + sedation + anticholinergic effects", "Therapeutic + side effects"],
    pharmacokinetics: {
      absorption: "Well absorbed orally.",
      distribution: "Widely distributed; extensive CNS penetration.",
      metabolism: "Hepatic.",
      excretion: "Urine. Half-life ~4-8 hours."
    },
    indications: ["Allergic reactions / allergic rhinitis / urticaria", "Insomnia (short-term)", "Motion sickness / nausea", "Parkinsonian symptoms / extrapyramidal reactions (selected)", "Cough (combination products)"],
    dosage: { routes: ["Oral", "IV", "IM", "Topical"], adult: "25-50 mg every 4-6 hours as needed. Max typically 300 mg/day. Refer to labeling.", pediatric: "Weight-based; avoid in young children for sleep. Refer to pediatric references.", notes: "Educational only. Paradoxical excitation in some children. Avoid in elderly when possible." },
    adverseEffects: { common: ["Sedation / drowsiness", "Dry mouth", "Dizziness", "Urinary retention", "Constipation", "Blurred vision"], serious: ["Delirium (especially elderly)", "Narrow-angle glaucoma precipitation", "Severe anticholinergic toxicity", "QT prolongation (rare)", "Impaired driving / falls"], important: ["Beers Criteria: avoid in older adults for most uses."] },
    contraindications: ["Neonates / premature infants", "Nursing mothers (for some uses)", "Hypersensitivity", "Narrow-angle glaucoma (relative)", "Asthma / COPD (relative — thickening of secretions)", "BPH with obstruction (relative)"],
    interactions: [{ drug: "Alcohol / CNS depressants", interaction: "Additive sedation", significance: "HIGH" }, { drug: "Other anticholinergics", interaction: "Additive anticholinergic effects", significance: "MODERATE" }, { drug: "MAOIs", interaction: "Prolonged anticholinergic effects", significance: "MODERATE" }],
    monitoring: ["Sedation level", "Anticholinergic effects", "Fall risk", "Mental status (elderly)"],
    patientCounseling: ["Causes drowsiness — do not drive or operate machinery.", "Avoid alcohol.", "May cause dry mouth and difficulty urinating.", "Not recommended for sleep in older adults.", "Keep away from children (toxicity risk)."],
    specialPopulations: { pregnancy: "Category B. Generally considered acceptable when needed.", breastfeeding: "Excreted; may cause sedation in infant; caution.", pediatric: "Paradoxical excitation possible; dosing careful.", elderly: "High risk of delirium, falls, anticholinergic effects — avoid when possible.", renal: "Caution.", hepatic: "Caution." },
    storage: "Store at room temperature.",
    references: ["Standard pharmacology and allergy references"]
  },
  {
    id: "vancomycin",
    genericName: "Vancomycin",
    brandNames: ["Vancocin", "Firvanq"],
    drugClass: "Glycopeptide Antibiotic",
    therapeuticClass: "Antibiotic (primarily Gram-positive)",
    mechanismOfAction: "Binds to D-Ala-D-Ala terminus of peptidoglycan precursors, inhibiting cell wall synthesis in Gram-positive bacteria. Bactericidal against most susceptible organisms.",
    mechanismFlow: ["Drug", "D-Ala-D-Ala of peptidoglycan", "Inhibits cell wall cross-linking", "Weakened cell wall", "Bacterial death"],
    pharmacokinetics: {
      absorption: "Not absorbed orally (used orally only for C. difficile colitis). IV for systemic infections.",
      distribution: "Wide; good tissue penetration except CSF (unless inflamed).",
      metabolism: "Minimal.",
      excretion: "Almost entirely renal (unchanged). Half-life 4-6 hours (much longer in renal impairment)."
    },
    indications: ["Serious Gram-positive infections (MRSA, coagulase-negative staphylococci, enterococci)", "Clostridioides difficile colitis (oral)", "Surgical prophylaxis (selected)", "Endocarditis / osteomyelitis / pneumonia caused by susceptible organisms"],
    dosage: { routes: ["IV", "Oral"], adult: "IV: weight-based (typically 15-20 mg/kg); interval adjusted by renal function and levels. Oral for C. diff: 125 mg four times daily. Refer to guidelines and TDM.", pediatric: "Weight-based; levels used.", notes: "Educational only. Therapeutic drug monitoring essential for IV therapy." },
    adverseEffects: { common: ["'Red man syndrome' (infusion-related flushing, histamine release)", "Nephrotoxicity", "Phlebitis"], serious: ["Severe nephrotoxicity", "Ototoxicity", "Neutropenia", "Severe skin reactions (rare)", "Anaphylaxis"], important: ["Infuse slowly (≥60 min for usual doses) to reduce red man syndrome."] },
    contraindications: ["Hypersensitivity to vancomycin"],
    interactions: [{ drug: "Other nephrotoxic drugs (aminoglycosides, piperacillin-tazobactam, NSAIDs, etc.)", interaction: "Increased nephrotoxicity risk", significance: "HIGH" }, { drug: "Other ototoxic drugs", interaction: "Increased ototoxicity risk", significance: "MODERATE" }, { drug: "Anesthetics", interaction: "Enhanced neuromuscular blockade / red man risk", significance: "MODERATE" }],
    monitoring: ["Trough (or AUC) vancomycin levels", "Renal function", "CBC (prolonged therapy)", "Hearing (high risk / prolonged)", "Infusion reactions"],
    patientCounseling: ["IV form is given in healthcare settings.", "Oral form is for intestinal infection only — not for other infections.", "Report reduced urine output, hearing changes, or severe rash.", "Complete the full course."],
    specialPopulations: { pregnancy: "Category C. Used when clearly needed.", breastfeeding: "Compatible; monitor infant.", pediatric: "Widely used with monitoring.", elderly: "Higher nephrotoxicity risk; adjust for renal function.", renal: "Major dose/interval adjustment required.", hepatic: "No major adjustment." },
    storage: "Store vials according to product; reconstituted solutions have limited stability.",
    references: ["IDSA guidelines; standard pharmacology references"]
  },
  {
    id: "isoniazid",
    genericName: "Isoniazid (INH)",
    brandNames: ["Nydrazid", "Various"],
    drugClass: "Antimycobacterial — Isonicotinic Acid Hydrazide",
    therapeuticClass: "Antitubercular",
    mechanismOfAction: "Prodrug activated by mycobacterial catalase-peroxidase (KatG). Inhibits synthesis of mycolic acids (essential components of the mycobacterial cell wall) by blocking enoyl-ACP reductase (InhA).",
    mechanismFlow: ["Drug (prodrug)", "Activated by KatG", "Inhibits mycolic acid synthesis", "Disrupted cell wall", "Bactericidal against M. tuberculosis"],
    pharmacokinetics: {
      absorption: "Well absorbed orally.",
      distribution: "Wide, including CSF.",
      metabolism: "Hepatic acetylation (NAT2) — genetic polymorphism (fast/slow acetylators).",
      excretion: "Urine. Half-life 0.5-1.5 h (fast) to 2-4 h (slow acetylators)."
    },
    indications: ["Active tuberculosis (combination therapy)", "Latent tuberculosis infection", "Meningitis prophylaxis (selected contacts)"],
    dosage: { routes: ["Oral", "IM"], adult: "5 mg/kg (usual 300 mg) daily for active TB as part of multi-drug regimen. Latent: various regimens. Refer to TB guidelines.", pediatric: "10-15 mg/kg daily. Refer to pediatric TB guidelines.", notes: "Educational only. Always use in combination for active TB. Pyridoxine co-administration often recommended." },
    adverseEffects: { common: ["Peripheral neuropathy", "Elevated liver enzymes", "GI upset", "Rash"], serious: ["Hepatitis / hepatic failure", "Severe peripheral neuropathy", "Seizures", "Lupus-like syndrome", "Optic neuritis (rare)", "Psychosis (rare)"], important: ["Hepatotoxicity risk increases with age, alcohol, and underlying liver disease. Pyridoxine (B6) reduces neuropathy risk."] },
    contraindications: ["Acute liver disease / prior INH-induced hepatic injury", "Severe hypersensitivity", "Acute gout (relative)"],
    interactions: [{ drug: "Alcohol", interaction: "Increased hepatotoxicity risk", significance: "HIGH" }, { drug: "Acetaminophen / other hepatotoxins", interaction: "Increased liver injury risk", significance: "MODERATE" }, { drug: "Carbamazepine / phenytoin", interaction: "Increased levels of these drugs", significance: "MODERATE" }, { drug: "Rifampin", interaction: "Increased hepatotoxicity risk (still used together)", significance: "MODERATE" }],
    monitoring: ["LFTs (baseline and as indicated)", "Symptoms of hepatitis", "Neurologic symptoms", "Adherence"],
    patientCounseling: ["Take on an empty stomach if possible.", "Report fatigue, anorexia, dark urine, jaundice, or tingling in hands/feet immediately.", "Avoid alcohol.", "Take pyridoxine if prescribed.", "Complete the full course — critical for cure and preventing resistance.", "May cause false-positive urine glucose tests (older methods)."],
    specialPopulations: { pregnancy: "Category C. Used when indicated for TB; give pyridoxine.", breastfeeding: "Compatible; give infant pyridoxine if mother on INH.", pediatric: "Essential component of regimens; higher mg/kg.", elderly: "Higher hepatitis risk.", renal: "No major adjustment for daily dosing.", hepatic: "Use with extreme caution or avoid if significant disease." },
    storage: "Store at room temperature; protect from light and moisture.",
    references: ["CDC / WHO TB guidelines; standard pharmacology references"]
  },
  {
    id: "rifampin",
    genericName: "Rifampin (Rifampicin)",
    brandNames: ["Rifadin", "Rimactane"],
    drugClass: "Rifamycin Antibiotic",
    therapeuticClass: "Antitubercular / Antibacterial",
    mechanismOfAction: "Inhibits DNA-dependent RNA polymerase in mycobacteria and other susceptible bacteria by binding to the beta subunit, blocking RNA synthesis. Bactericidal.",
    mechanismFlow: ["Drug", "Bacterial RNA polymerase", "Inhibits RNA synthesis", "Blocked transcription", "Bacterial death"],
    pharmacokinetics: {
      absorption: "Well absorbed orally; food may delay.",
      distribution: "Wide, including CSF (better with inflammation).",
      metabolism: "Hepatic; autoinduction of its own metabolism.",
      excretion: "Bile and urine (orange-red discoloration). Half-life 3-4 hours (shortens with continued use)."
    },
    indications: ["Active tuberculosis (combination)", "Latent TB (selected regimens)", "Meningococcal prophylaxis", "Staphylococcal infections (adjunct in selected cases, e.g., prosthetic material)", "Haemophilus influenzae prophylaxis (selected)"],
    dosage: { routes: ["Oral", "IV"], adult: "10 mg/kg (usual 600 mg) daily for TB. Refer to TB and infection guidelines.", pediatric: "10-20 mg/kg. Refer to guidelines.", notes: "Educational only. Potent CYP inducer — many drug interactions." },
    adverseEffects: { common: ["Orange-red discoloration of urine, sweat, tears, contact lenses", "GI upset", "Rash", "Flu-like syndrome (intermittent dosing)"], serious: ["Hepatotoxicity", "Severe cutaneous reactions", "Thrombocytopenia", "Interstitial nephritis", "Anaphylaxis"], important: ["Warn patients about body fluid discoloration. Major enzyme inducer."] },
    contraindications: ["Hypersensitivity to rifamycins", "Concurrent use with certain HIV protease inhibitors / other critical narrow-therapeutic-index drugs that are strongly induced (situation-dependent)"],
    interactions: [{ drug: "Warfarin / oral contraceptives / many antiretrovirals / azoles / many others", interaction: "Strong induction → reduced efficacy of other drugs", significance: "HIGH" }, { drug: "Isoniazid / pyrazinamide", interaction: "Increased hepatotoxicity risk", significance: "MODERATE" }, { drug: "Alcohol", interaction: "Increased liver risk", significance: "MODERATE" }],
    monitoring: ["LFTs", "CBC", "Symptoms of hepatitis", "Drug interaction review", "Adherence"],
    patientCounseling: ["Urine, sweat, tears, and contact lenses may turn orange-red — this is expected.", "Take on an empty stomach if possible.", "Report yellowing of skin/eyes, dark urine, or unusual fatigue.", "Reduces effectiveness of birth control pills — use additional contraception.", "Inform all providers you take this drug because of many interactions.", "Complete the full course."],
    specialPopulations: { pregnancy: "Category C. Used when indicated for TB.", breastfeeding: "Compatible; may discolor milk.", pediatric: "Essential in regimens.", elderly: "Monitor liver function.", renal: "No major adjustment for usual doses.", hepatic: "Caution; monitor closely." },
    storage: "Store at room temperature; protect from light.",
    references: ["CDC / WHO TB guidelines; standard pharmacology references"]
  },
  {
    id: "fluconazole",
    genericName: "Fluconazole",
    brandNames: ["Diflucan"],
    drugClass: "Triazole Antifungal",
    therapeuticClass: "Antifungal",
    mechanismOfAction: "Inhibits fungal cytochrome P450 enzyme 14α-demethylase, blocking conversion of lanosterol to ergosterol. This disrupts fungal cell membrane integrity. Selective for fungal vs human CYP to a useful degree.",
    mechanismFlow: ["Drug", "Fungal 14α-demethylase", "↓ Ergosterol synthesis", "Defective cell membrane", "Fungistatic / fungicidal effect"],
    pharmacokinetics: {
      absorption: "Excellent oral bioavailability (>90%); IV also available.",
      distribution: "Wide, including CSF, urine, and ocular fluids.",
      metabolism: "Minimal; mostly excreted unchanged.",
      excretion: "Primarily renal (unchanged). Half-life ~30 hours."
    },
    indications: ["Candidiasis (oropharyngeal, esophageal, vaginal, systemic)", "Cryptococcal meningitis", "Prophylaxis in selected immunocompromised patients", "Coccidioidomycosis (selected)"],
    dosage: { routes: ["Oral", "IV"], adult: "Varies widely by indication (e.g., 150 mg single dose for vaginal candidiasis; 400 mg daily for systemic). Refer to ID guidelines.", pediatric: "Weight-based. Refer to pediatric ID.", notes: "Educational only. Dose adjust in renal impairment. CYP interactions important." },
    adverseEffects: { common: ["Headache", "Nausea", "Abdominal pain", "Rash", "Diarrhea"], serious: ["Hepatotoxicity", "Severe cutaneous reactions (SJS/TEN)", "QT prolongation", "Anaphylaxis", "Adrenal insufficiency (rare, high dose)"], important: ["Many CYP-mediated drug interactions."] },
    contraindications: ["Hypersensitivity to fluconazole or other azoles", "Concurrent terfenadine / some other QT drugs (historical / specific)", "Pregnancy (high-dose / first trimester — relative/absolute depending on situation)"],
    interactions: [{ drug: "Warfarin", interaction: "Increased INR", significance: "HIGH" }, { drug: "Phenytoin / cyclosporine / tacrolimus / many others", interaction: "Increased levels of these drugs", significance: "HIGH" }, { drug: "Rifampin", interaction: "Decreased fluconazole levels", significance: "MODERATE" }, { drug: "QT-prolonging drugs", interaction: "Additive risk", significance: "MODERATE" }],
    monitoring: ["Clinical response", "LFTs (prolonged / high-dose)", "QT / electrolytes if risk factors", "Drug interaction review", "Renal function (for dosing)"],
    patientCounseling: ["Can be taken with or without food.", "Report unusual fatigue, dark urine, yellowing of skin, or severe rash.", "Tell provider about all medications due to interaction potential.", "Single-dose therapy is common for vaginal yeast infections.", "Complete the prescribed course for other infections."],
    specialPopulations: { pregnancy: "Category C/D (dose and trimester dependent). Avoid high-dose in first trimester if possible.", breastfeeding: "Compatible.", pediatric: "Widely used.", elderly: "Adjust for renal function.", renal: "Dose adjustment required.", hepatic: "Caution; monitor." },
    storage: "Store at room temperature.",
    references: ["IDSA antifungal guidelines; standard pharmacology references"]
  },
  {
    id: "acyclovir",
    genericName: "Acyclovir",
    brandNames: ["Zovirax", "Sitavig"],
    drugClass: "Nucleoside Analogue Antiviral",
    therapeuticClass: "Antiviral (Herpesviruses)",
    mechanismOfAction: "Guanosine analogue that is selectively phosphorylated by viral thymidine kinase, then by cellular enzymes to acyclovir triphosphate. This inhibits viral DNA polymerase and causes chain termination when incorporated into viral DNA.",
    mechanismFlow: ["Drug", "Viral thymidine kinase activation", "Inhibits viral DNA polymerase + chain termination", "Blocked viral DNA synthesis", "Antiviral effect"],
    pharmacokinetics: {
      absorption: "Poor oral bioavailability (~15-30%). IV and topical available.",
      distribution: "Wide, including CSF.",
      metabolism: "Minimal.",
      excretion: "Primarily renal (glomerular filtration and tubular secretion). Half-life ~2.5-3.5 hours."
    },
    indications: ["Herpes simplex virus (HSV) infections (genital, orolabial, encephalitis, neonatal)", "Varicella-zoster virus (chickenpox, shingles)", "Prophylaxis in immunocompromised patients"],
    dosage: { routes: ["Oral", "IV", "Topical"], adult: "Varies by indication and host immune status (e.g., 400 mg three times daily for genital HSV; higher for zoster or IV for severe disease). Refer to guidelines.", pediatric: "Weight-based. Refer to pediatric ID.", notes: "Educational only. Maintain hydration, especially with IV therapy, to prevent crystalluria." },
    adverseEffects: { common: ["Nausea", "Diarrhea", "Headache", "Malaise", "Phlebitis (IV)"], serious: ["Reversible nephrotoxicity (crystalline nephropathy)", "Neurotoxicity (confusion, tremors, seizures — especially in renal impairment)", "Thrombotic thrombocytopenic purpura / HUS (rare, high-dose in immunocompromised)", "Severe local inflammation if extravasation"], important: ["Dose adjust in renal impairment. Hydrate well."] },
    contraindications: ["Hypersensitivity to acyclovir or valacyclovir"],
    interactions: [{ drug: "Nephrotoxic drugs", interaction: "Increased nephrotoxicity risk", significance: "MODERATE" }, { drug: "Probenecid / cimetidine", interaction: "Increase acyclovir levels", significance: "MODERATE" }],
    monitoring: ["Renal function", "Hydration status", "Neurologic symptoms", "Clinical response of lesions"],
    patientCounseling: ["Start as early as possible after symptom onset for best effect.", "Maintain good fluid intake.", "Does not cure herpes; may reduce severity and frequency of outbreaks.", "Continue to use safer-sex practices.", "Report reduced urine output or confusion.", "For topical: apply with finger cot or glove to avoid autoinoculation."],
    specialPopulations: { pregnancy: "Category B. Used when indicated.", breastfeeding: "Compatible.", pediatric: "Widely used, including neonatal HSV.", elderly: "Adjust for renal function; higher neurotoxicity risk.", renal: "Major dose adjustment required.", hepatic: "No major adjustment." },
    storage: "Store at room temperature; protect from moisture. IV solutions have specific stability.",
    references: ["CDC STD guidelines; IDSA; standard pharmacology references"]
  },
  {
    id: "methotrexate",
    genericName: "Methotrexate",
    brandNames: ["Trexall", "Otrexup", "Rasuvo", "Rheumatrex"],
    drugClass: "Antimetabolite — Folate Antagonist",
    therapeuticClass: "Antineoplastic / Disease-Modifying Antirheumatic / Immunosuppressant",
    mechanismOfAction: "Inhibits dihydrofolate reductase (DHFR), preventing regeneration of tetrahydrofolate. This depletes one-carbon donors needed for synthesis of thymidylate and purines, thereby inhibiting DNA/RNA synthesis. Effects are most pronounced in rapidly dividing cells. Also has anti-inflammatory effects at low doses (mechanism involves adenosine release).",
    mechanismFlow: ["Drug", "Dihydrofolate reductase", "↓ Tetrahydrofolate", "Impaired DNA/RNA synthesis", "Antiproliferative + anti-inflammatory effects"],
    pharmacokinetics: {
      absorption: "Dose-dependent oral absorption (good at low doses). Parenteral available.",
      distribution: "Moderate protein binding. Polyglutamated intracellularly (retains drug).",
      metabolism: "Partially hepatic; also intracellular polyglutamation.",
      excretion: "Primarily renal. Half-life ~3-10 hours (longer for polyglutamates)."
    },
    indications: ["Rheumatoid arthritis", "Psoriasis / psoriatic arthritis", "Crohn’s disease (selected)", "Many cancers (leukemias, lymphomas, breast, osteosarcoma, etc.)", "Ectopic pregnancy (selected)", "Gestational trophoblastic disease"],
    dosage: { routes: ["Oral", "Subcutaneous", "IM", "IV", "Intrathecal"], adult: "RA/psoriasis: typically 7.5-25 mg once weekly (critical: weekly, not daily). Oncology: highly variable protocol-based. Refer to specific guidelines.", pediatric: "Protocol-based for oncology and JIA.", notes: "Educational only. Dosing errors (daily vs weekly) can be fatal. Folic acid supplementation common in non-oncology use." },
    adverseEffects: { common: ["Nausea", "Mucositis / stomatitis", "Fatigue", "Elevated liver enzymes", "Alopecia (higher doses)"], serious: ["Myelosuppression", "Hepatotoxicity / fibrosis / cirrhosis", "Pneumonitis", "Severe mucositis", "Nephrotoxicity (high dose)", "Opportunistic infections", "Teratogenicity / embryotoxicity", "Secondary malignancies (rare)"], important: ["Black box warnings for multiple serious toxicities. Once-weekly dosing for RA is critical."] },
    contraindications: ["Pregnancy (non-oncology use)", "Breastfeeding", "Alcoholism / chronic liver disease", "Pre-existing blood dyscrasias", "Immunodeficiency syndromes", "Hypersensitivity"],
    interactions: [{ drug: "NSAIDs / penicillins / probenecid", interaction: "Reduced renal clearance → toxicity", significance: "HIGH" }, { drug: "Trimethoprim-sulfamethoxazole", interaction: "Increased myelosuppression", significance: "HIGH" }, { drug: "Alcohol", interaction: "Increased hepatotoxicity", significance: "HIGH" }, { drug: "Live vaccines", interaction: "Risk of infection", significance: "HIGH" }, { drug: "Folic acid", interaction: "May reduce efficacy slightly but reduces toxicity (commonly co-prescribed)", significance: "MODERATE" }],
    monitoring: ["CBC", "LFTs", "Renal function", "Chest X-ray (baseline)", "Pregnancy test", "Signs of infection / mucositis", "PFTs if pulmonary symptoms"],
    patientCounseling: ["For RA/psoriasis: take ONCE WEEKLY only — daily dosing can be fatal.", "Take folic acid as prescribed.", "Report fever, sore throat, mouth sores, unusual bleeding, shortness of breath, or dark urine immediately.", "Avoid alcohol.", "Effective contraception required for both men and women.", "Stay well hydrated (especially high-dose).", "Do not take extra doses for missed doses without advice."],
    specialPopulations: { pregnancy: "Category X (non-oncology). Potent teratogen / abortifacient.", breastfeeding: "Contraindicated.", pediatric: "Used in JIA and oncology with protocols.", elderly: "Higher toxicity risk; monitor closely.", renal: "Dose adjustment or avoidance required.", hepatic: "Avoid in significant disease." },
    storage: "Store at room temperature; protect from light. Injectables may have specific requirements.",
    references: ["Rheumatology and oncology guidelines; standard pharmacology references"]
  },
  {
    id: "cyclosporine",
    genericName: "Cyclosporine",
    brandNames: ["Neoral", "Gengraf", "Sandimmune", "Restasis"],
    drugClass: "Calcineurin Inhibitor",
    therapeuticClass: "Immunosuppressant",
    mechanismOfAction: "Binds to cyclophilin; the complex inhibits calcineurin, preventing dephosphorylation and activation of NFAT. This blocks IL-2 transcription and T-cell activation/proliferation.",
    mechanismFlow: ["Drug", "Cyclophilin → inhibits calcineurin", "↓ NFAT activation", "↓ IL-2 production", "Suppressed T-cell response"],
    pharmacokinetics: {
      absorption: "Variable and incomplete; formulation-dependent (modified vs non-modified are not bioequivalent).",
      distribution: "Highly protein bound; concentrates in erythrocytes.",
      metabolism: "Extensive hepatic CYP3A4.",
      excretion: "Bile. Half-life variable (5-18 hours)."
    },
    indications: ["Solid organ transplant rejection prophylaxis", "Rheumatoid arthritis (selected)", "Psoriasis (selected)", "Nephrotic syndrome (selected)", "Dry eye (topical emulsion)"],
    dosage: { routes: ["Oral", "IV", "Ophthalmic"], adult: "Highly individualized by indication, levels, and formulation. Transplant protocols are complex. Refer to transplant / specialty guidance.", pediatric: "Used in transplant and selected conditions; specialist dosing.", notes: "Educational only. Therapeutic drug monitoring essential. Formulations are not interchangeable." },
    adverseEffects: { common: ["Nephrotoxicity", "Hypertension", "Tremor", "Hirsutism", "Gingival hyperplasia", "Hyperlipidemia", "Hyperuricemia"], serious: ["Chronic kidney disease", "Serious infections", "Malignancy (including lymphoma and skin cancer)", "Neurotoxicity", "Thrombotic microangiopathy", "Anaphylaxis (IV)"], important: ["Narrow therapeutic index; many CYP3A4 interactions."] },
    contraindications: ["Hypersensitivity", "Uncontrolled hypertension (relative)", "Significant renal impairment (for non-transplant uses)", "Concurrent uncontrolled infection", "Malignancy (for some non-transplant uses)"],
    interactions: [{ drug: "Strong CYP3A4 inhibitors (azole antifungals, macrolides, diltiazem, grapefruit)", interaction: "Increased cyclosporine levels / toxicity", significance: "HIGH" }, { drug: "Strong CYP3A4 inducers (rifampin, carbamazepine, St. John’s wort)", interaction: "Decreased levels / rejection risk", significance: "HIGH" }, { drug: "Nephrotoxic drugs (NSAIDs, aminoglycosides, amphotericin)", interaction: "Additive nephrotoxicity", significance: "HIGH" }, { drug: "Statins", interaction: "Increased myopathy risk", significance: "MODERATE" }],
    monitoring: ["Cyclosporine trough levels", "Renal function", "Blood pressure", "Lipids", "LFTs", "Electrolytes (K+, Mg2+)", "Signs of infection / malignancy", "Dental health"],
    patientCounseling: ["Take consistently with regard to time and meals; do not switch formulations without supervision.", "Avoid grapefruit and grapefruit juice.", "Report reduced urine output, tremor, high blood pressure, or signs of infection.", "Regular blood tests are essential.", "Use sun protection (increased skin cancer risk).", "Effective contraception recommended."],
    specialPopulations: { pregnancy: "Category C. Used in transplant when needed; risks vs benefits.", breastfeeding: "Not recommended.", pediatric: "Used in transplant.", elderly: "Higher risk of renal and other toxicities.", renal: "Nephrotoxic — careful monitoring / adjustment.", hepatic: "Dose adjustment may be needed." },
    storage: "Store according to formulation; some require protection from light. Do not refrigerate oral solutions of some brands (check label).",
    references: ["Transplant and rheumatology guidelines; standard pharmacology references"]
  }
];

// Make available globally
if (typeof window !== 'undefined') {
  window.builtInDrugs = builtInDrugs;
}
