import axios from 'axios';
interface CurrencyResp {
  date: string;
  historical: string;
  info: Info;
  query: Query;
  result: number;
  success: boolean;
}

interface Query {
  amount: number;
  from: string;
  to: string;
}

interface Info {
  rate: number;
  timestamp: number;
}
export const convertCurrency = async (amt: string, from: string, to: string) => {

    const amount = amt.match(/\d+/g);
    if (!amount) throw new Error('Invalid amount');
    const response = await axios.get<CurrencyResp>(`https://api.apilayer.com/exchangerates_data/convert?to=${to}&from=${from}&amount=${amount[ 0 ]}`, {
        headers: {
            apiKey: process.env.CURRENCY_API_KEY,
        }
    });
    return `${response.data.result} ${to}`;
}

