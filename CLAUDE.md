# AI Regulatory Knowledge Base

## Purpose
Comprehensive, structured coverage of AI regulations across 12+ jurisdictions. Includes jurisdiction-specific guidance files, cross-jurisdiction comparison matrix, compliance timeline, and an interactive D3.js world map visualization.

## Tools & Stack
- **Markdown** for regulation files
- **D3.js** for world map visualization
- **Node.js** (ESM) for query API

## Directory Structure
```
regulations/
  AI-Regulations-Global-Overview.md
  AI-Regulations-EU.md
  AI-Regulations-UK.md
  AI-Regulations-UnitedStates.md
  AI-Regulations-Canada.md
  AI-Regulations-China.md
  AI-Regulations-Japan-SouthKorea.md
  AI-Regulations-India-Singapore-ASEAN.md
  AI-Regulations-Australia.md
  AI-Regulations-NewZealand.md
  AI-Regulations-Mexico-LatinAmerica.md
  AI-Regulations-Africa.md
visualizations/
  AI-Regulations-World-Map.html
src/
  index.js               — Query API
```

## Key Functions
- `listJurisdictions()` — Available jurisdictions
- `getRegulation(jurisdiction)` — Full markdown content
- `searchRegulations(keyword)` — Search across all files
- `getWorldMapHtml()` — D3.js interactive map

## Conventions
- All dates are absolute (not relative) for accuracy over time
- "Last Updated" header in each file indicates research freshness
- Consistent structure: Overview → Key Legislation → Existing Laws → What This Means for Developers → Resources
- World map uses four-tier classification: enacted, active-sector, proposed, voluntary

## Technical Notes
- Regulation files use metadata headers: session number, upload date, author, laws covered
- Always distinguish enacted/binding law from voluntary/proposed frameworks
- Includes a disclaimer that this is research, not legal advice
