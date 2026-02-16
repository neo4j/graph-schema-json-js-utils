import { describe, it, expect } from 'vitest';
import pkg from '../package.json';
import { PACKAGE_VERSION } from '../dist/index.js';

describe('build artifact', () => {
  it('should export the expected package version', () => {
    const expectedPackageVersion = pkg.version;
    expect(PACKAGE_VERSION).toBe(expectedPackageVersion);
  });
});
