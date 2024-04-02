import CoinGecko from 'coingecko-api';
import createDebounced from './createDebounced';

const CoinGeckoClient = new CoinGecko();
const fetchFiatPrice = async () => {
  const response = await CoinGeckoClient.simple.price({
    ids: 'monero',
    vs_currencies: 'eur',
  });

  if (!response.success) {
    console.log(`fetchFiatPrice failed: ${JSON.stringify(response.data)}`);
    return;
  }

  const result = response.data?.monero;

  if (!result || !result.eur) {
    console.log('fetchFiatPrice failed: result is false');
    return;
  }

  return result.eur;
};

const REMEMBER_FOR = 1000 * 60 * 90;
export default createDebounced(fetchFiatPrice, REMEMBER_FOR);
