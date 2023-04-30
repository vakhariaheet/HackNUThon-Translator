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
    const headers = new Headers();
    const amount = amt.match(/\d+/g);
    if (!amount) throw new Error('Invalid amount');
    headers.append('apiKey', 'xfoGCReVNkQYZz7IjeRr1xjyoy6eMtmy');
    const response = await axios.get<CurrencyResp>(`https://api.apilayer.com/exchangerates_data/convert?to=${to}&from=${from}&amount=${amount[ 0 ]}`, {
        headers: {
            apiKey: 'xfoGCReVNkQYZz7IjeRr1xjyoy6eMtmy'
        }
    });
    return `${response.data.result} ${to}`;
}

