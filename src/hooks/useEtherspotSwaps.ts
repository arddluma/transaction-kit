import { AccountTypes, StepTransaction } from 'etherspot';
import { useEtherspot } from '@etherspot/react-etherspot';
import { BigNumber } from 'ethers';
import { Route } from '@lifi/sdk';

// types
import { ICrossChainSwapOffers, ISameChainSwapOffers } from '../types/EtherspotTransactionKit';

/**
 * @typedef {Object} IEtherspotSwapsHook
 * @property getOffers {function} - fetches Etherspot aggregated offers for same-chain and cross-chain swaps
 * @property prepareCrossChainOfferTransactions {function} - fetches Etherspot cross-chain offer transactions
 */
interface IEtherspotSwapsHook {
  getOffers: (
    fromAmount: BigNumber,
    fromTokenAddress: string,
    toTokenAddress: string,
    toChainId?: number,
  ) => Promise<ISameChainSwapOffers | ICrossChainSwapOffers | undefined>;
  prepareCrossChainOfferTransactions: (offer: Route) => Promise<StepTransaction[] | undefined>;
}

/**
 * Hook to fetch Etherspot aggregated offers for same-chain and cross-chain swaps
 * @param chainId {number} - Source Chain ID
 * @returns {IEtherspotSwapsHook} - hook method to fetch Etherspot aggregated offers for same-chain and cross-chain swaps
 */
const useEtherspotSwaps = (chainId: number = 1): IEtherspotSwapsHook => {
  const { connect, getSdkForChainId } = useEtherspot();

  const prepareCrossChainOfferTransactions = async (offer: Route): Promise<StepTransaction[] | undefined> => {
    const sdkForChainId = getSdkForChainId(chainId);
    if (!sdkForChainId) {
      console.warn(`Unable to get SDK for chain ID ${chainId}`);
      return;
    }

    if (sdkForChainId?.state?.account?.type !== AccountTypes.Contract) {
      await connect(chainId);
    }

    try {
      const { items } = await sdkForChainId.getStepTransaction({ route: offer });
      return items;
    } catch (e) {
      console.warn(
        `Sorry, an error occurred whilst trying to fetch cross-chain offer transactions.`
        + ` Please try again. Error:`,
        e,
      );
    }
  }

  const getOffers = async (
    fromAmount: BigNumber,
    fromTokenAddress: string,
    toTokenAddress: string,
    toChainId?: number,
  ): Promise<ISameChainSwapOffers | ICrossChainSwapOffers | undefined> => {
    const sdkForChainId = getSdkForChainId(chainId);
    if (!sdkForChainId) {
      console.warn(`Unable to get SDK for chain ID ${chainId}`);
      return;
    }

    if (sdkForChainId?.state?.account?.type !== AccountTypes.Contract) {
      await connect(chainId);
    }

    if (toChainId && toChainId !== chainId) {
      try {
        const { items: offers } = await sdkForChainId.getAdvanceRoutesLiFi({
          fromChainId: chainId,
          toChainId,
          fromAmount,
          fromTokenAddress,
          toTokenAddress,
        });
        return { type: 'cross-chain', offers };
      } catch (e) {
        console.warn(
          `Sorry, an error occurred whilst trying to fetch cross-chain offers.`
          + ` Please try again. Error:`,
          e,
        );
      }
      return;
    }

    try {
      const offers = await sdkForChainId.getExchangeOffers({
        fromAmount,
        fromTokenAddress,
        toTokenAddress,
      });
      return { type: 'same-chain', offers };
    } catch (e) {
      console.warn(
        `Sorry, an error occurred whilst trying to fetch same-chain offers.`
        + ` Please try again. Error:`,
        e,
      );
    }
  };

  return ({
    getOffers,
    prepareCrossChainOfferTransactions,
  });
};

export default useEtherspotSwaps;