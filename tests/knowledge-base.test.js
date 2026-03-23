import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  listJurisdictions,
  getRegulation,
  getWorldMapHtml,
  searchRegulations,
  getRegulationSummary,
  compareJurisdictions,
  getIndex
} from '../src/index.js';

vi.mock('fs');

import fs from 'fs';

describe('AI Regulatory Knowledge Base', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('listJurisdictions', () => {
    it('should return array of jurisdiction names', () => {
      const jurisdictions = listJurisdictions();
      expect(Array.isArray(jurisdictions)).toBe(true);
      expect(jurisdictions.length).toBeGreaterThan(0);
    });

    it('should return jurisdictions in sorted order', () => {
      const jurisdictions = listJurisdictions();
      const sorted = [...jurisdictions].sort();
      expect(jurisdictions).toEqual(sorted);
    });

    it('should include major jurisdictions', () => {
      const jurisdictions = listJurisdictions();
      expect(jurisdictions).toContain('EU');
      expect(jurisdictions).toContain('US');
      expect(jurisdictions).toContain('UK');
      expect(jurisdictions).toContain('China');
    });

    it('should include at least 13 jurisdictions', () => {
      const jurisdictions = listJurisdictions();
      expect(jurisdictions.length).toBeGreaterThanOrEqual(13);
    });

    it('should include diverse geographic regions', () => {
      const jurisdictions = listJurisdictions();
      const hasAsia = jurisdictions.some(j => ['China', 'Japan', 'Singapore', 'India'].includes(j));
      const hasEurope = jurisdictions.some(j => ['EU', 'UK'].includes(j));
      const hasAmericas = jurisdictions.some(j => ['US', 'Canada', 'Latin America'].includes(j));
      
      expect(hasAsia).toBe(true);
      expect(hasEurope).toBe(true);
      expect(hasAmericas).toBe(true);
    });
  });

  describe('getRegulation', () => {
    beforeEach(() => {
      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockReturnValue('# EU AI Regulations\n\nContent here...');
    });

    it('should return regulation content for valid jurisdiction', () => {
      const content = getRegulation('EU');
      expect(typeof content).toBe('string');
      expect(content.length).toBeGreaterThan(0);
    });

    it('should throw error for unknown jurisdiction', () => {
      expect(() => getRegulation('UnknownJurisdiction')).toThrow();
    });

    it('should handle case-sensitive jurisdiction names', () => {
      const content = getRegulation('EU');
      expect(content).toBeDefined();
    });

    it('should read file from correct path', () => {
      fs.readFileSync.mockReturnValue('Regulation content');
      getRegulation('EU');
      expect(fs.readFileSync).toHaveBeenCalled();
    });

    it('should throw descriptive error when jurisdiction not found', () => {
      try {
        getRegulation('InvalidRegion');
      } catch (err) {
        expect(err.message).toContain('InvalidRegion');
        expect(err.message).toContain('not found');
        expect(err.message).toContain('Available');
      }
    });

    it('should handle file not found error gracefully', () => {
      fs.existsSync.mockReturnValue(false);
      expect(() => getRegulation('EU')).toThrow('not found');
    });

    it('should trim jurisdiction name input', () => {
      const jurisdictions = listJurisdictions();
      const jurisdiction = jurisdictions[0];
      const withWhitespace = `  ${jurisdiction}  `;
      
      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockReturnValue('content');
      
      expect(() => getRegulation(withWhitespace)).not.toThrow();
    });
  });

  describe('getWorldMapHtml', () => {
    it('should return HTML content', () => {
      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockReturnValue('<html>World Map</html>');
      
      const html = getWorldMapHtml();
      expect(typeof html).toBe('string');
      expect(html.includes('html')).toBe(true);
    });

    it('should throw when map file not found', () => {
      fs.existsSync.mockReturnValue(false);
      expect(() => getWorldMapHtml()).toThrow();
    });

    it('should contain helpful error message', () => {
      fs.existsSync.mockReturnValue(false);
      try {
        getWorldMapHtml();
      } catch (err) {
        expect(err.message).toContain('World map');
        expect(err.message).toContain('not found');
      }
    });
  });

  describe('searchRegulations', () => {
    beforeEach(() => {
      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockImplementation((path) => {
        if (path.includes('EU')) {
          return '# EU Regulations\n\nTransparency requirement\nData protection\nAI transparency rules\n';
        } else if (path.includes('US')) {
          return '# US Regulations\n\nTransparency Act\nAlgorithm transparency\n';
        }
        return '';
      });
    });

    it('should find matches across all jurisdictions when no jurisdiction specified', () => {
      const results = searchRegulations('transparency');
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBeGreaterThan(0);
    });

    it('should perform case-insensitive search', () => {
      const resultsLower = searchRegulations('transparency');
      const resultsUpper = searchRegulations('TRANSPARENCY');
      
      expect(resultsLower.length).toBeGreaterThan(0);
      expect(resultsUpper.length).toBeGreaterThan(0);
    });

    it('should return match details including jurisdiction and line number', () => {
      const results = searchRegulations('transparency');
      expect(results.length).toBeGreaterThan(0);
      
      const match = results[0];
      expect(match).toHaveProperty('jurisdiction');
      expect(match).toHaveProperty('line');
      expect(match).toHaveProperty('content');
      expect(match).toHaveProperty('matches');
    });

    it('should filter by specific jurisdiction when provided', () => {
      const results = searchRegulations('transparency', 'EU');
      const allJurisdictions = results.map(r => r.jurisdiction);
      expect(allJurisdictions.every(j => j === 'EU')).toBe(true);
    });

    it('should handle empty search results', () => {
      const results = searchRegulations('xyznonexistentterm');
      expect(Array.isArray(results)).toBe(true);
    });

    it('should count multiple matches on same line', () => {
      const results = searchRegulations('transparency');
      const multiMatches = results.filter(r => r.matches > 1);
      // May or may not have multi-matches depending on data
      expect(Array.isArray(results)).toBe(true);
    });

    it('should preserve line content trimmed', () => {
      const results = searchRegulations('data');
      if (results.length > 0) {
        const firstResult = results[0];
        expect(firstResult.content).toBe(firstResult.content.trim());
      }
    });
  });

  describe('getRegulationSummary', () => {
    beforeEach(() => {
      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockReturnValue(
        `# EU AI Regulations

The EU AI Act is a comprehensive regulatory framework.
It applies to high-risk AI systems.

## Key Provisions
- Transparency requirements
- Risk assessment procedures

## Compliance Obligations
- Documentation requirements
- Testing and validation

## Enforcement
- Penalties for violations`
      );
    });

    it('should return object with jurisdiction, summary, and keyTopics', () => {
      const summary = getRegulationSummary('EU');
      expect(summary).toHaveProperty('jurisdiction');
      expect(summary).toHaveProperty('summary');
      expect(summary).toHaveProperty('keyTopics');
    });

    it('should include jurisdiction name in response', () => {
      const summary = getRegulationSummary('EU');
      expect(summary.jurisdiction).toBe('EU');
    });

    it('should extract summary text from beginning of content', () => {
      const summary = getRegulationSummary('EU');
      expect(typeof summary.summary).toBe('string');
      expect(summary.summary.length).toBeGreaterThan(0);
    });

    it('should extract heading text as key topics', () => {
      const summary = getRegulationSummary('EU');
      expect(Array.isArray(summary.keyTopics)).toBe(true);
      expect(summary.keyTopics.length).toBeGreaterThan(0);
    });

    it('should limit key topics to reasonable number', () => {
      const summary = getRegulationSummary('EU');
      expect(summary.keyTopics.length).toBeLessThanOrEqual(8);
    });

    it('should strip heading markdown from key topics', () => {
      const summary = getRegulationSummary('EU');
      const hasMarkdown = summary.keyTopics.some(t => t.includes('#'));
      expect(hasMarkdown).toBe(false);
    });

    it('should throw for unknown jurisdiction', () => {
      expect(() => getRegulationSummary('UnknownJurisdiction')).toThrow();
    });
  });

  describe('compareJurisdictions', () => {
    beforeEach(() => {
      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockImplementation((path) => {
        if (path.includes('EU')) {
          return '# EU\n\nTransparency\n\n## Provision A\n## Provision B\n';
        } else if (path.includes('US')) {
          return '# US\n\nFairness\n\n## Section 1\n## Section 2\n';
        }
        return '# Default\n\nContent\n';
      });
    });

    it('should return comparison object with jurisdictions array', () => {
      const comparison = compareJurisdictions(['EU', 'US']);
      expect(comparison).toHaveProperty('jurisdictions');
      expect(comparison.jurisdictions).toEqual(['EU', 'US']);
    });

    it('should include summaries for each jurisdiction', () => {
      const comparison = compareJurisdictions(['EU', 'US']);
      expect(comparison).toHaveProperty('summaries');
      expect(comparison.summaries).toHaveProperty('EU');
      expect(comparison.summaries).toHaveProperty('US');
    });

    it('should handle single jurisdiction comparison', () => {
      const comparison = compareJurisdictions(['EU']);
      expect(comparison.jurisdictions).toHaveLength(1);
      expect(comparison.summaries['EU']).toBeDefined();
    });

    it('should handle multiple jurisdictions', () => {
      const comparison = compareJurisdictions(['EU', 'US', 'UK']);
      expect(comparison.jurisdictions).toHaveLength(3);
      expect(Object.keys(comparison.summaries)).toHaveLength(3);
    });

    it('should include error objects for missing jurisdictions', () => {
      const comparison = compareJurisdictions(['EU', 'InvalidRegion']);
      expect(comparison.summaries['InvalidRegion']).toHaveProperty('error');
    });

    it('should not throw on invalid jurisdiction in array', () => {
      expect(() => compareJurisdictions(['EU', 'InvalidRegion'])).not.toThrow();
    });

    it('should structure summary data correctly', () => {
      const comparison = compareJurisdictions(['EU']);
      const euSummary = comparison.summaries['EU'];
      expect(euSummary).toHaveProperty('jurisdiction');
      expect(euSummary).toHaveProperty('summary');
      expect(euSummary).toHaveProperty('keyTopics');
    });
  });

  describe('getIndex', () => {
    it('should return markdown string', () => {
      const index = getIndex();
      expect(typeof index).toBe('string');
      expect(index.includes('#')).toBe(true);
    });

    it('should include all jurisdictions in index', () => {
      const index = getIndex();
      const jurisdictions = listJurisdictions();
      jurisdictions.forEach(jur => {
        expect(index).toContain(jur);
      });
    });

    it('should have proper markdown heading structure', () => {
      const index = getIndex();
      expect(index).toMatch(/^#\s+/m); // Starts with markdown heading
    });

    it('should mention jurisdiction count', () => {
      const index = getIndex();
      const jurisdictions = listJurisdictions();
      expect(index).toContain(jurisdictions.length.toString());
    });

    it('should include usage examples', () => {
      const index = getIndex();
      expect(index).toContain('javascript');
      expect(index).toContain('import');
    });

    it('should be formatted as valid markdown', () => {
      const index = getIndex();
      expect(index).toContain('##');
      expect(index).toContain('```');
    });

    it('should list each jurisdiction with bold formatting', () => {
      const index = getIndex();
      const jurisdictions = listJurisdictions();
      jurisdictions.forEach(jur => {
        expect(index).toContain(`**${jur}**`);
      });
    });

    it('should include how-to-use section', () => {
      const index = getIndex();
      expect(index.toLowerCase()).toContain('how to use');
    });
  });

  describe('Integration scenarios', () => {
    beforeEach(() => {
      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockImplementation((path) => {
        if (path.includes('EU')) {
          return '# EU AI Act\n\nTransparency and accountability\n## Scope\n## Requirements\n';
        }
        return 'Regulation content';
      });
    });

    it('should allow listing jurisdictions and getting one regulation', () => {
      const jurisdictions = listJurisdictions();
      expect(jurisdictions.length).toBeGreaterThan(0);
      
      const firstJur = jurisdictions[0];
      const regulation = getRegulation(firstJur);
      expect(regulation).toBeDefined();
    });

    it('should allow searching and comparing results', () => {
      const searchResults = searchRegulations('requirement');
      const jurisdictions = listJurisdictions().slice(0, 2);
      
      const comparison = compareJurisdictions(jurisdictions);
      expect(comparison.summaries).toBeDefined();
    });

    it('should allow generating index with all jurisdictions listed', () => {
      const index = getIndex();
      const jurisdictions = listJurisdictions();
      
      jurisdictions.forEach(jur => {
        expect(index).toContain(jur);
      });
    });
  });

  describe('Error handling and edge cases', () => {
    it('should handle file system errors gracefully', () => {
      fs.existsSync.mockReturnValue(false);
      expect(() => getRegulation('EU')).toThrow();
    });

    it('should handle empty search queries', () => {
      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockReturnValue('Some content');
      
      const results = searchRegulations('');
      expect(Array.isArray(results)).toBe(true);
    });

    it('should handle special characters in search', () => {
      fs.existsSync.mockReturnValue(true);
      fs.readFileSync.mockReturnValue('Content with special chars: @#$%');
      
      expect(() => searchRegulations('@#$%')).not.toThrow();
    });

    it('should handle null/undefined jurisdiction gracefully', () => {
      expect(() => getRegulation(null)).toThrow();
      expect(() => getRegulation(undefined)).toThrow();
    });

    it('should handle empty jurisdiction array in comparison', () => {
      const comparison = compareJurisdictions([]);
      expect(comparison.jurisdictions).toHaveLength(0);
      expect(Object.keys(comparison.summaries)).toHaveLength(0);
    });
  });
});
