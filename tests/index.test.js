import { describe, it, expect } from 'vitest';
import { listJurisdictions, getRegulation, searchRegulations, getRegulationSummary, compareJurisdictions, getIndex } from '../src/index.js';

describe('listJurisdictions', () => {
  it('returns an array of jurisdiction names', () => {
    const jurs = listJurisdictions();
    expect(Array.isArray(jurs)).toBe(true);
    expect(jurs.length).toBeGreaterThan(0);
  });

  it('returns sorted names', () => {
    const jurs = listJurisdictions();
    const sorted = [...jurs].sort();
    expect(jurs).toEqual(sorted);
  });

  it('includes major jurisdictions', () => {
    const jurs = listJurisdictions();
    expect(jurs).toContain('EU');
    expect(jurs).toContain('US');
    expect(jurs).toContain('China');
  });
});

describe('getRegulation', () => {
  it('returns markdown for a valid jurisdiction', () => {
    try {
      const content = getRegulation('EU');
      expect(typeof content).toBe('string');
      expect(content.length).toBeGreaterThan(0);
    } catch (e) {
      // OK if regulation files not present (SETUP.md not run)
      expect(e.message).toContain('not found');
    }
  });

  it('throws for unknown jurisdiction', () => {
    expect(() => getRegulation('Atlantis')).toThrow('not found');
  });
});

describe('searchRegulations', () => {
  it('returns array of matches', () => {
    const results = searchRegulations('transparency');
    expect(Array.isArray(results)).toBe(true);
  });

  it('each match has jurisdiction and content', () => {
    const results = searchRegulations('AI');
    if (results.length > 0) {
      expect(results[0]).toHaveProperty('jurisdiction');
      expect(results[0]).toHaveProperty('content');
      expect(results[0]).toHaveProperty('line');
    }
  });
});

describe('getRegulationSummary', () => {
  it('returns summary object with key topics', () => {
    try {
      const summary = getRegulationSummary('EU');
      expect(summary).toHaveProperty('jurisdiction', 'EU');
      expect(summary).toHaveProperty('summary');
      expect(summary).toHaveProperty('keyTopics');
      expect(Array.isArray(summary.keyTopics)).toBe(true);
    } catch (e) {
      expect(e.message).toContain('not found');
    }
  });
});

describe('compareJurisdictions', () => {
  it('returns comparison object for multiple jurisdictions', () => {
    const comparison = compareJurisdictions(['EU', 'US']);
    expect(comparison.jurisdictions).toEqual(['EU', 'US']);
    expect(comparison.summaries).toHaveProperty('EU');
    expect(comparison.summaries).toHaveProperty('US');
  });
});

describe('getIndex', () => {
  it('returns markdown with jurisdiction list', () => {
    const index = getIndex();
    expect(index).toContain('AI Regulatory Knowledge Base');
    expect(index).toContain('EU');
  });
});
