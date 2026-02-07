import { describe, it, expect } from 'vitest';

describe('shared-contracts', () => {
  it('should export types', async () => {
    const mod = await import('../src/index.js');
    expect(mod).toBeDefined();
  });
});
