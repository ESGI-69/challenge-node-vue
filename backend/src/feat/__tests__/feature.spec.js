import { describe, it } from 'node:test';
import { strictEqual } from 'node:assert';
import feature from '../feature.js';

describe('feature', () => {
  it('should return 3 if 1 + 2', () => {
    const result = feature(1, 2);
    strictEqual(result, 3);
  });
});
