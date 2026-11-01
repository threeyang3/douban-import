const { defaults: tsjPreset } = require('ts-jest/presets');
module.exports = {
	preset: 'ts-jest',
	rootDir: './',
	transform: {
		...tsjPreset.transform,
	},
	testRegex: '(/test/.*\\.(test|spec))\\.[tj]sx?$',
	moduleFileExtensions: [
		"ts",
		"tsx",
		"js",
		"jsx",
	],
	moduleNameMapper: {
		'^src/(.*)$': '<rootDir>/src/$1',
		'^obsidian$': '<rootDir>/test/mocks/obsidian.ts',
	},
	collectCoverageFrom: ['src/**/*.ts'],
};
