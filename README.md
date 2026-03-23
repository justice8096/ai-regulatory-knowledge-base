# AI Regulatory Knowledge Base

Comprehensive AI regulatory database covering 13 major jurisdictions plus global standards. Easy API for programmatic access, includes interactive world map visualization.

## Overview

Complete regulatory landscape for:

- **EU** — AI Act, GDPR, ePrivacy Directive
- **United States** — Federal, state, and sector regulations
- **UK** — Online Safety Bill, DUA Act, ASJC
- **China** — GenAI Interim Measures, Cybersecurity Law
- **Japan & South Korea** — AI governance frameworks
- **Canada, Australia, New Zealand** — Privacy and AI regulations
- **India & Singapore** — Emerging AI governance
- **Africa & Latin America** — Regional approaches
- **Global Standards** — NIST, ISO, industry frameworks

## Quick Start

```javascript
import KB from 'ai-regulatory-knowledge-base';

// List all jurisdictions
const jurisdictions = KB.listJurisdictions();
// ["Africa", "Australia", "Canada", "China", "EU", ...]

// Get EU regulation
const euReg = KB.getRegulation('EU');

// Search for 'transparency' across all jurisdictions
const results = KB.searchRegulations('transparency');

// Get interactive world map
const mapHtml = KB.getWorldMapHtml();
```

## Features

### Complete Regulation Coverage

- **13 Major Jurisdictions** with detailed markdown documents
- **Global Overview** of cross-cutting standards and frameworks
- **Interactive World Map** showing regulation status by country
- **Full-Text Search** across all regulations

### Simple API

```javascript
// List available jurisdictions
listJurisdictions()

// Get regulation for jurisdiction
getRegulation('EU')

// Search regulations
searchRegulations('transparency', 'EU')

// Get summary and key topics
getRegulationSummary('China')

// Compare across jurisdictions
compareJurisdictions(['EU', 'US', 'China'])

// Get world map visualization
getWorldMapHtml()
```

### Easy Integration

Works as Node.js module:
```javascript
import KB from 'ai-regulatory-knowledge-base';
```

Can be embedded in:
- Web applications
- CLI tools
- Compliance management systems
- Knowledge portals
- Assessment tools

## Jurisdictions

### Tier 1: Comprehensive Regulation
- **EU** — Most detailed, AI Act with implementation timeline
- **China** — Fast-moving regulatory environment
- **UK** — Post-Brexit regulatory approach
- **US** — Multi-level (federal + state) framework

### Tier 2: Active Development
- **Japan** — AI governance guidelines
- **South Korea** — AI Basic Act
- **Canada** — AIDA (In progress)
- **Australia** — AI governance principles

### Tier 3: Emerging
- **India** — Sector-specific approaches
- **Singapore** — Innovation-friendly framework
- **New Zealand** — Privacy-first approach
- **Africa** — Continental standards
- **Latin America** — Regional regulations

## Use Cases

### For Compliance Teams
- Reference regulations during compliance assessments
- Search for specific requirements across jurisdictions
- Create jurisdiction-specific compliance checklists
- Compare requirements across markets

### For AI Developers
- Understand regulatory requirements for target markets
- Check multi-jurisdiction applicability of AI systems
- Reference current regulations during design reviews
- Plan for regulatory changes

### For Legal/Policy
- Research latest regulatory developments
- Create briefing materials
- Support client advisory work
- Monitor cross-jurisdictional trends

### For Assessment Tools
- Embed regulations in compliance wizards
- Reference applicable laws in guidance text
- Link assessment findings to specific regulations
- Generate regulation-aware recommendations

## Data Format

Each jurisdiction file is markdown with structure:
- Overview and key timeline
- Regulatory framework and key laws
- AI system definitions and scope
- Key requirements and obligations
- Enforcement and penalties
- Resources and links

## Search Examples

```javascript
// Find transparency requirements
KB.searchRegulations('transparency');

// Find EU-specific prohibitions
KB.searchRegulations('prohibited', 'EU');

// Find high-risk AI definitions across all regions
KB.searchRegulations('high-risk');

// Find consent requirements in US regulations
KB.searchRegulations('consent', 'US');
```

## World Map Visualization

Interactive D3 world map showing:
- Regulation status per country (enacted, proposed, voluntary)
- Color coding by regulation tier
- Clickable countries linking to regulations
- Timeline of regulatory changes

Access via:
```javascript
const mapHtml = KB.getWorldMapHtml();
// Serve as HTML page or embed in iframe
```

## Setup

See `SETUP.md` for detailed setup instructions:
1. Create `regulations/` and `visualizations/` directories
2. Copy files from `D:\LLMComplianceSkill\`
3. Test with included examples
4. Integrate with your projects

## API Reference

### `listJurisdictions()`
Returns all available jurisdictions as sorted array.

### `getRegulation(jurisdiction)`
Get full markdown regulation text. Throws if not found.

### `searchRegulations(keyword, jurisdiction?)`
Search across regulations. Returns matches with line numbers and context.

### `getRegulationSummary(jurisdiction)`
Get brief summary and key topics for a jurisdiction.

### `compareJurisdictions(jurisdictions)`
Compare regulations across multiple jurisdictions.

### `getWorldMapHtml()`
Get interactive world map visualization HTML.

### `getIndex()`
Get markdown index and usage guide.

## Performance

- **Size** — ~2 MB of regulation markdown
- **Search Speed** — <100ms across all jurisdictions
- **Load Time** — Instant (synchronous file reads)
- **Memory** — Minimal (loads on-demand)

## License

MIT License © 2026 Justice

Regulation content is compiled from publicly available sources and included for reference and educational purposes.
