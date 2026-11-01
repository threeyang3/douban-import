import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const readJson = (name) => JSON.parse(readFileSync(new URL(`../${name}`, import.meta.url), 'utf8'));
const manifest = readJson('manifest.json');
const pkg = readJson('package.json');
const lock = readJson('package-lock.json');
const versions = readJson('versions.json');

assert.equal(manifest.id, 'douban-import', 'Plugin ID must remain stable for installed vaults');
assert.equal(manifest.name, 'Douban Import');
assert.match(manifest.version, /^\d+\.\d+\.\d+$/, 'Use a numeric x.y.z release version');
assert.match(manifest.minAppVersion, /^\d+\.\d+\.\d+$/);
assert.equal(manifest.isDesktopOnly, false, 'Keep desktop and mobile support');
assert.equal(pkg.name, manifest.id);
assert.equal(pkg.version, manifest.version);
assert.equal(lock.version, pkg.version);
assert.equal(lock.packages[''].version, pkg.version);
assert.equal(lock.packages[''].name, pkg.name);
assert.equal(versions[manifest.version], manifest.minAppVersion);
assert.equal(pkg.license, 'GPL-3.0-only');
assert.equal(pkg.repository.url, 'git+https://github.com/threeyang3/douban-import.git');

if (process.env.GITHUB_REF_TYPE === 'tag') {
	assert.equal(process.env.GITHUB_REF_NAME, manifest.version, 'Release tag must match manifest version, without a v prefix');
}

console.log(`${manifest.name} ${manifest.version}: manifest, package, lockfile and compatibility versions agree.`);
