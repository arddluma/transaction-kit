import { useEtherspot } from '@etherspot/react-etherspot';
import { AccountTypes, RateInfo } from 'etherspot';
import { useMemo } from 'react';

/**
 * @typedef {Object} IEtherspotPricesHook
 * @property getPrices {function} - fetches assets prices from Etherspot
 * @property getPrice {function} - fetches single asset price from Etherspot
 */
interface IEtherspotPricesHook {
  getPrice: (assetAddress: string, assetChainId?: number) => Promise<RateInfo | undefined>;
  getPrices: (assetAddresses: string[], assetsChainId?: number) => Promise<RateInfo[]>;
}

/**
 * Hook to fetch asset prices from Etherspot
 * @param chainId {number | undefined} - Chain ID
 * @returns {IEtherspotPricesHook} - hook method to fetch prices from Etherspot
 */
const useEtherspotPrices = (chainId?: number): IEtherspotPricesHook => {
  const { connect, getSdkForChainId, chainId: etherspotChainId } = useEtherspot();

  const defaultChainId = useMemo(() => {
    if (chainId) return chainId;
    return etherspotChainId;
  }, [chainId, etherspotChainId]);

  const getPrice = async (assetAddress: string, assetChainId: number = defaultChainId) => {
    const [price] = await getPrices([assetAddress], assetChainId);
    return price;
  }

  const getPrices = async (assetAddresses: string[], assetsChainId: number = defaultChainId) => {
    const sdkForChainId = getSdkForChainId(assetsChainId);
    if (!sdkForChainId) {
      console.warn(`Unable to get SDK for chain ID ${assetsChainId}`);
      return [];
    }

    if (sdkForChainId?.state?.account?.type !== AccountTypes.Contract) {
      await connect(chainId);
    }

    try {
      const result = await sdkForChainId.fetchExchangeRates({
        chainId: assetsChainId,
        tokens: assetAddresses,
      });

      if (result.errored && result.error) {
        console.warn(
          `Sorry, an error occurred whilst trying to fetch prices from Etherspot.`
          + ` Please try again. Error: ${result.error}.`
        );
        return [];
      }

      return result.items;
    } catch (e) {
      console.warn(
        `Sorry, an error occurred whilst trying to fetch prices from Etherspot.`
        + ` Please try again. Error:`,
        e,
      );
    }

    return [];
  }

  return { getPrice, getPrices };
};

export default useEtherspotPrices;
