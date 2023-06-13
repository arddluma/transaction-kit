# Changelog

## [0.3.0] - 2023-06-06

### Added
- Added `via` prop to `<EtherspotBatches />` component that accepts default `etherspot` provider or newly added SDK
provider `etherspot-prime` that can be used to send EIP-4337 (Account Abstraction / UserOperation) transactions
via Etherspot bundler
- Added `useWalletAddres` hook to get `etherspot`, `etherspot-prime` and connected `provider` wallet address by type
- Added deprecation warning for `useEtherspotAddresses` hook, `useWalletAddress('etherspot', chainId)` should
be used instead

### Fixes
- Fixed `batches` ordering issue that were affecting renders with few `<EtherspotBatches />` components rendered
at the same time

## [0.2.5] - 2023-06-02

### Added
- Added `useEtherspotSwaps` hook for cross chain and same chain asset swaps

## [0.2.4] - 2023-06-01

### Added
- Added `useEtherspotPrices` hook for asset prices

## [0.2.3] - 2023-05-30

### Added
- Updated `window` context to not be used within non-browser environments.

## [0.2.2] - 2023-05-30

### Added
- Updated  `@etherspot/eip1271-verification-util` to version `0.1.1`.

## [0.2.1] - 2023-05-30

### Added
- Added `rimraf` to suport developers in `Windows` environment.
- Added provider wallet transaction component `<ProviderWalletTransaction />`
- Added `useProviderWalletTransaction` hook for provider wallet transaction management

## [0.2.0] - 2023-05-12

### Added
- Added `useEtherspotBalances` hook for Etherspot/EVM related contract
- Added `useEtherspotUtils` hook for Etherspot/EVM related utils
- Added `useEtherspotHistory` hook for Etherspot account transactions history
- Added `useEtherspotNfts` hook for Etherspot account owned NFTs
- Added `CHANGELOG.md` to track library changes
- Improved Etherspot SDK session connection flows
- Added missing warning logs throughout the library

### Breaking Changes
- Removed current output of `useEtherspotAssets` and added method `getAssets: () => Promise<TokenListToken[]>` that returns a list of assets instead of putting asseets automatically into the state