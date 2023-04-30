import { TranslateTextCommand,TranslateClient } from '@aws-sdk/client-translate';



const TranslateText = async (text: string, source: string, target: string) => { 
    const client = new TranslateClient({
        region:process.env.AWS_REGION
    })
    try {
        const data = await client.send(new TranslateTextCommand({
            SourceLanguageCode: source,
            TargetLanguageCode: target,
            Text: text,
        }));
        return data.TranslatedText;
    } catch (error) {
        throw error;
    }
}


export default TranslateText;
