import lodash from 'lodash';
const isDate = (date: string): boolean => {
	return (
		new Date(date).toString() !== 'Invalid Date' &&
		!isNaN(new Date(date).getTime())
	);
};

export type CaseType =
	| 'default'
	| 'snake_case'
	| 'camelCase'
	| 'PascalCase'
	| 'kebab-case';
export const convertKeyToCase = (key: string, caseType: CaseType): string => {
	switch (caseType) {
		case 'default':
			return key;
		case 'snake_case':
			return lodash.snakeCase(key);
		case 'camelCase':
			return lodash.camelCase(key);
		case 'PascalCase':
			return lodash.upperFirst(lodash.camelCase(key));
		case 'kebab-case':
			return lodash.kebabCase(key);
		default:
			return key;
	}
};
