import { model, Schema } from 'mongoose';
import { CaseType } from '../utils/utils';

export interface TemplateType {
    label: string;
	clientID: string;
	input: {
		lang: string;
		countryISO: string;
		currency: string;
		timezone: string;
	};
	output: {
		lang: string;
		countryISO: string;
		currency: string;
		timezone: string;
	};
	variableConversion: CaseType;
	dateKeywords: [string, DateFormats][];
	currencyKeywords: string[];
}

export type DateFormats = 'iso' | 'timestamp' | string;

const TemplateSchema = new Schema({
	clientID: {
		type: Schema.Types.ObjectId,
		ref: 'Client',
	},

	input: {
		lang: String,
		countryISO: String,
		currency: String,
		timezone: String,
	},
	variableConversion: {
		type: String,
		enum: ['default', 'snake_case', 'camelCase', 'PascalCase', 'kebab-case'],
	},
	output: {
		lang: String,
		countryISO: String,
		currency: String,
		timezone: String,
	},
    label: String,
	dateKeywords: [{ type: [String, String] }],
	currencyKeywords: [{ type: String }],
},{timestamps: true});
const Template = model('Template', TemplateSchema);
export default Template;
