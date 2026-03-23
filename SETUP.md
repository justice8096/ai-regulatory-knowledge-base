# AI Regulatory Knowledge Base — Setup Instructions

## Initial Setup

### 1. Create Directories

```bash
mkdir -p regulations
mkdir -p visualizations
```

### 2. Copy Regulation Files

From `D:\LLMComplianceSkill\`, copy all `AI-Regulations-*.md` files:

```bash
# Copy all regulation markdown files
cp D:\LLMComplianceSkill\AI-Regulations-*.md ./regulations/

# Copy world map visualization
cp D:\LLMComplianceSkill\AI-Regulations-World-Map.html ./visualizations/
```

### 3. Verify Files

After copying, you should have:

```
regulations/
├── AI-Regulations-Africa.md
├── AI-Regulations-Australia.md
├── AI-Regulations-Canada.md
├── AI-Regulations-China.md
├── AI-Regulations-EU.md
├── AI-Regulations-Global-Overview.md
├── AI-Regulations-India-Singapore-ASEAN.md
├── AI-Regulations-Japan-SouthKorea.md
├── AI-Regulations-Mexico-LatinAmerica.md
├── AI-Regulations-NewZealand.md
├── AI-Regulations-UK.md
└── AI-Regulations-UnitedStates.md

visualizations/
└── AI-Regulations-World-Map.html
```

## Using the Knowledge Base

### Node.js API

```javascript
import KB from './src/index.js';

// List available jurisdictions
const jurisdictions = KB.listJurisdictions();
// ["Africa", "Australia", "Canada", "China", "EU", ...]

// Get regulation for a jurisdiction
const euReg = KB.getRegulation('EU');

// Search across all regulations
const results = KB.searchRegulations('transparency');

// Compare multiple jurisdictions
const comparison = KB.compareJurisdictions(['EU', 'US', 'China']);

// Get summary
const summary = KB.getRegulationSummary('EU');

// Get world map visualization
const mapHtml = KB.getWorldMapHtml();

// Get full index
const index = KB.getIndex();
```

### CLI Usage (from other projects)

Can be imported by:
- Compliance Assessment Tools (reference regulations while taking assessments)
- Compliance Deadline Tracker (link deadlines to applicable regulations)
- Compliance Autofill (pre-populate regulatory references)

## Jurisdictions Covered

### 13 Major Jurisdictions

1. **EU** — European Union AI Act, GDPR, existing regulations
2. **US** — Federal and state regulations (California, Colorado, Texas, New York, Illinois, Utah)
3. **UK** — Online Safety Bill, DUA Act, sector-specific regulations
4. **China** — GenAI Interim Measures, Content Labeling, Cybersecurity Law
5. **Japan** — AI governance frameworks and voluntary guidelines
6. **South Korea** — AI Basic Act and data protection regulations
7. **Canada** — AIDA (Artificial Intelligence and Data Act)
8. **Australia** — Privacy Act amendments, voluntary AI governance
9. **New Zealand** — GDPR-style regulations, AI governance
10. **India** — DPIIT guidelines, sector-specific AI rules
11. **Singapore** — AI governance, data protection framework
12. **Africa** — Continental and country-level approaches
13. **Latin America** — Mexico, Brazil, Peru regional regulations

### Plus Global Overview

- Cross-cutting international standards
- Industry frameworks (NIST, ISO, etc.)
- Best practices across jurisdictions

## File Structure

```
ai-regulatory-knowledge-base/
├── src/
│   └── index.js                    # Main API
├── regulations/                    # Markdown regulation files
│   └── AI-Regulations-*.md         # (copied from LLMComplianceSkill)
├── visualizations/
│   └── AI-Regulations-World-Map.html  # D3 world map
├── package.json
├── README.md
├── SETUP.md                        # This file
└── LICENSE
```

## Integration with Other Projects

### With Compliance Assessment Tools

Tools can reference the knowledge base:
```javascript
import KB from '../ai-regulatory-knowledge-base/src/index.js';

// In tool context, show relevant regulation
const jurisdiction = getUserJurisdiction();
const regulation = KB.getRegulation(jurisdiction);
```

### With Compliance Deadline Tracker

Deadlines can link to regulations:
```javascript
{
  jurisdiction: 'EU',
  deadline: '2026-08-02',
  regulation: 'AI Act - Full applicability',
  link: 'regulations/AI-Regulations-EU.md'
}
```

### With Compliance Autofill

Templates can reference regulation requirements:
```javascript
const euReg = KB.getRegulation('EU');
const relevant = KB.searchRegulations('transparency', 'EU');
// Auto-populate with regulation quotes
```

## Search Examples

```javascript
// Find all transparency requirements
KB.searchRegulations('transparency');

// Find EU-specific bias requirements
KB.searchRegulations('bias', 'EU');

// Find consent-related rules across all jurisdictions
KB.searchRegulations('consent');

// Find high-risk AI definitions
KB.searchRegulations('high-risk');
```

## API Reference

### `listJurisdictions()`
Returns: `string[]`
All available jurisdiction names, sorted alphabetically.

### `getRegulation(jurisdiction)`
Returns: `string` (markdown content)
Full regulation text for a jurisdiction. Throws if not found.

### `getWorldMapHtml()`
Returns: `string` (HTML)
Interactive D3 world map showing regulation status by country.

### `searchRegulations(keyword, jurisdiction?)`
Returns: `object[]` with {jurisdiction, line, content, matches}
Case-insensitive search across regulations.

### `getRegulationSummary(jurisdiction)`
Returns: `object` with {jurisdiction, summary, keyTopics}
Brief summary and key topics for a jurisdiction.

### `compareJurisdictions(jurisdictions)`
Returns: `object` with comparison across multiple jurisdictions
Useful for cross-border analysis.

### `getIndex()`
Returns: `string` (markdown)
Markdown index of all available regulations and usage examples.

## Next Steps

1. Install dependencies: `npm install` (if needed)
2. Copy regulation files using commands above
3. Test access: `node -e "import KB from './src/index.js'; console.log(KB.listJurisdictions());"`
4. Integrate with other compliance projects
5. Use world map in presentations and documentation
