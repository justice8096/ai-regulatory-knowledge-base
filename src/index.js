/**
 * AI Regulatory Knowledge Base
 * 
 * Simple API to load, query, and explore AI regulations across 13 jurisdictions
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const KB_ROOT = path.join(__dirname, '..');

// Map of jurisdictions to regulation file names
const JURISDICTIONS = {
  'EU': 'AI-Regulations-EU.md',
  'US': 'AI-Regulations-UnitedStates.md',
  'UK': 'AI-Regulations-UK.md',
  'China': 'AI-Regulations-China.md',
  'Japan': 'AI-Regulations-Japan-SouthKorea.md',
  'South Korea': 'AI-Regulations-Japan-SouthKorea.md',
  'Canada': 'AI-Regulations-Canada.md',
  'Australia': 'AI-Regulations-Australia.md',
  'New Zealand': 'AI-Regulations-NewZealand.md',
  'India': 'AI-Regulations-India-Singapore-ASEAN.md',
  'Singapore': 'AI-Regulations-India-Singapore-ASEAN.md',
  'Africa': 'AI-Regulations-Africa.md',
  'Latin America': 'AI-Regulations-Mexico-LatinAmerica.md',
  'Global': 'AI-Regulations-Global-Overview.md'
};

/**
 * List all available jurisdictions
 * @returns {string[]} Array of jurisdiction names
 */
export function listJurisdictions() {
  return Object.keys(JURISDICTIONS).sort();
}

/**
 * Get regulation markdown for a specific jurisdiction
 * @param {string} jurisdiction - Jurisdiction name (e.g., 'EU', 'US', 'China')
 * @returns {string} Markdown content of regulation
 * @throws {Error} If jurisdiction not found
 */
export function getRegulation(jurisdiction) {
  const normalized = jurisdiction.trim();
  
  if (!JURISDICTIONS[normalized]) {
    const available = Object.keys(JURISDICTIONS).join(', ');
    throw new Error(
      `Jurisdiction "${jurisdiction}" not found. Available: ${available}`
    );
  }
  
  const filename = JURISDICTIONS[normalized];
  const filePath = path.join(KB_ROOT, 'regulations', filename);
  
  if (!fs.existsSync(filePath)) {
    throw new Error(
      `Regulation file not found: ${filePath}. ` +
      `Did you run setup to copy files from LLMComplianceSkill?`
    );
  }
  
  return fs.readFileSync(filePath, 'utf8');
}

/**
 * Get the world map HTML visualization
 * @returns {string} HTML content of world map
 * @throws {Error} If map file not found
 */
export function getWorldMapHtml() {
  const mapPath = path.join(KB_ROOT, 'visualizations', 'AI-Regulations-World-Map.html');
  
  if (!fs.existsSync(mapPath)) {
    throw new Error(
      `World map not found: ${mapPath}. ` +
      `Did you run setup to copy files from LLMComplianceSkill?`
    );
  }
  
  return fs.readFileSync(mapPath, 'utf8');
}

/**
 * Search for keyword in all regulations
 * @param {string} keyword - Search term (case-insensitive)
 * @param {string|null} jurisdiction - Optional: limit to specific jurisdiction
 * @returns {object[]} Array of matches with {jurisdiction, content, lineNumber}
 */
export function searchRegulations(keyword, jurisdiction = null) {
  const results = [];
  const regex = new RegExp(keyword, 'gi');
  
  const jurToSearch = jurisdiction ? [jurisdiction] : listJurisdictions();
  
  jurToSearch.forEach(jur => {
    try {
      const content = getRegulation(jur);
      const lines = content.split('\n');
      
      lines.forEach((line, idx) => {
        if (regex.test(line)) {
          results.push({
            jurisdiction: jur,
            line: idx + 1,
            content: line.trim(),
            matches: (line.match(regex) || []).length
          });
        }
      });
    } catch (err) {
      // Skip jurisdictions that fail to load
      console.warn(`Warning: Could not search ${jur}: ${err.message}`);
    }
  });
  
  return results;
}

/**
 * Get regulation summary for a jurisdiction (first 5 lines + key topics)
 * @param {string} jurisdiction - Jurisdiction name
 * @returns {object} {jurisdiction, summary, keyTopics}
 */
export function getRegulationSummary(jurisdiction) {
  const content = getRegulation(jurisdiction);
  const lines = content.split('\n');
  
  // Extract summary (first section)
  const summary = lines
    .slice(0, 10)
    .filter(l => l.trim())
    .join('\n');
  
  // Extract headings as key topics
  const keyTopics = lines
    .filter(l => l.startsWith('##') || l.startsWith('###'))
    .slice(0, 8)
    .map(l => l.replace(/^#+\s*/, '').trim());
  
  return {
    jurisdiction,
    summary,
    keyTopics
  };
}

/**
 * Compare regulations across multiple jurisdictions
 * @param {string[]} jurisdictions - Array of jurisdiction names
 * @returns {object} Comparative analysis object
 */
export function compareJurisdictions(jurisdictions) {
  const comparison = {
    jurisdictions: jurisdictions,
    summaries: {}
  };
  
  jurisdictions.forEach(jur => {
    try {
      comparison.summaries[jur] = getRegulationSummary(jur);
    } catch (err) {
      comparison.summaries[jur] = {
        error: err.message
      };
    }
  });
  
  return comparison;
}

/**
 * Get markdown index of all available regulations
 * @returns {string} Markdown index
 */
export function getIndex() {
  const jurisdictions = listJurisdictions();
  let index = '# AI Regulatory Knowledge Base Index\n\n';
  index += `## Available Jurisdictions (${jurisdictions.length})\n\n`;
  
  jurisdictions.forEach(jur => {
    index += `- **${jur}**\n`;
  });
  
  index += '\n## How to Use\n\n';
  index += '```javascript\n';
  index += "import { getRegulation, listJurisdictions, searchRegulations } from './index.js';\n\n";
  index += "// List all jurisdictions\n";
  index += 'const jurs = listJurisdictions();\n\n';
  index += "// Get EU regulation\n";
  index += "const euReg = getRegulation('EU');\n\n";
  index += "// Search across all jurisdictions\n";
  index += "const results = searchRegulations('transparency');\n";
  index += '```\n';
  
  return index;
}

// Default export
export default {
  listJurisdictions,
  getRegulation,
  getWorldMapHtml,
  searchRegulations,
  getRegulationSummary,
  compareJurisdictions,
  getIndex
};
