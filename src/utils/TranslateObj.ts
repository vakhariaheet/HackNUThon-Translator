import TranslateText from './TranslateText';
import { TemplateType } from '../Models/Template';
import { DateTime } from 'luxon';
import { convertCurrency } from './CurrencyConversion';
import { convertKeyToCase } from './utils';
const TranslateObj = async (obj: any, template: TemplateType) => {
	const maiObj: {
		[key: string]: any;
	} = obj;
	const keys = Object.keys(maiObj);

	const newObj: any = {};
	for (let key of keys) {
		if (typeof maiObj[key] === 'object') {
			newObj[convertKeyToCase(key, template.variableConversion)] =
				await TranslateObj(maiObj[key], template);
		} else {
			if (typeof maiObj[key] === 'number') {
				continue;
			}
			if (template.dateKeywords.find(([k]) => k === key)) {
				const dateFormat = template.dateKeywords.find(([k]) => k === key)![1];
				if (dateFormat === 'timestamp') {
					newObj[convertKeyToCase(key, template.variableConversion)] =
						DateTime.fromMillis(maiObj[key], {
							zone: template.input.timezone,
						});
					continue;
				}
				if (dateFormat === 'iso') {
					const date = DateTime.fromISO(maiObj[key], {
						zone: template.input.timezone,
					});
					newObj[convertKeyToCase(key, template.variableConversion)] =
						date.setZone(template.output.timezone).toISO();
					continue;
				}

				const date = DateTime.fromFormat(maiObj[key], dateFormat, {
					zone: template.input.timezone,
				});
				
				newObj[convertKeyToCase(key, template.variableConversion)] =
					date.toFormat(dateFormat, { locale: template.output.lang });
				continue;
			}
			if (template.currencyKeywords.includes(key)) {
				newObj[convertKeyToCase(key, template.variableConversion)] =
					await convertCurrency(
						maiObj[key],
						template.input.currency,
						template.output.currency,
					);
				continue;
			}
			if (maiObj[key] === null) continue;
			if (maiObj[key] === undefined) continue;
			if (maiObj[key] === '') continue;

			if (typeof maiObj[key] === 'string') {
				newObj[convertKeyToCase(key, template.variableConversion)] =
					await TranslateText(
						maiObj[key],
						template.input.lang,
						template.output.lang,
					);
				continue;
			}
			newObj[convertKeyToCase(key, template.variableConversion)] = maiObj[key];
		}
	}

	return newObj;
};


export default TranslateObj;
