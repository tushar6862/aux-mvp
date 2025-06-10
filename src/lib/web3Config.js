import { createWeb3Modal } from '@web3modal/wagmi';
import { baseSepolia } from 'viem/chains';
import { createConfig, http } from 'wagmi';
import { coinbaseWallet, walletConnect } from 'wagmi/connectors';
import { AuthProvider } from '@arcana/auth';
import { ArcanaConnector } from '@arcana/auth-wagmi';

let auth;

export const getAuthProvider = () => {
  if (!auth)
    auth = new AuthProvider(
      // TODO: Store below string in env with a variable name of ARCANA_PROJECT_ID
      'xar_test_a172dd880a009777c0078d350c8134768a2f7a58',
    );

  return auth;
};

const projectId = 'cfa2d1a6e06bde6554aa7a8d7f944756';

if (!projectId) throw new Error('Project ID is not defined');
const metadata = {
  name: 'Web3Modal',
  description: 'Web3Modal Example',
  url: 'https://web3modal.com',
  icons: ['https://avatars.githubusercontent.com/u/37784886'],
};

const chains = [baseSepolia];

export const wagmiConfig = createConfig({
  chains,
  transports: {
    [baseSepolia.id]: http(),
  },
  connectors: [
    ArcanaConnector({
      auth: getAuthProvider(),
    }),
    walletConnect({ projectId, metadata, showQrModal: false }),
    coinbaseWallet({
      appName: metadata.name,
      appLogoUrl: metadata.icons[0],
    }),
  ],
});

const web3Modal = createWeb3Modal({
  wagmiConfig,
  projectId,
  includeWalletIds: [
    'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96',
    '4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0',
    'e7c4d26541a7fd84dbdfa9922d3ad21e936e13a7a0e44385d44f006139e44d3b',
  ],
});

export const openWalletModal = async () => {
  try {
    web3Modal.open();
  } catch (error) {
    console.error('Failed to open:', error);
    throw error;
  }
};
