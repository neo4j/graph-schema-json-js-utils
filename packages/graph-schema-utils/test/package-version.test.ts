import { describe, it, expect } from 'vitest';
// @ts-ignore
import pkg from '../package.json';
// @ts-ignore
import { PACKAGE_VERSION } from '../dist/index.js';

describe('build artifact', () => {
  it('should export the expected package version', () => {
    const expectedPackageVersion = pkg.version;
    expect(PACKAGE_VERSION).toBe(expectedPackageVersion);
  });
});