import { WagmiProvider } from 'wagmi';
import { wagmiConfig } from '@/lib/web3Config';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

/**
 * `WagmiProviders` component sets up providers for the Wagmi library
 * (used for interacting with web3) and React Query (used for handling
 * data fetching and caching in React applications).
 *
 * This component ensures that the entire React tree has access to web3
 * functionality and query caching features.
 *
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The child components to be wrapped by the providers.
 *
 * @returns {JSX.Element} - The `WagmiProvider` and `QueryClientProvider` wrapped around the children.
 *
 * ## Usage Example:
 *
 * ```tsx
 * <WagmiProviders>
 *   <App /> // your application wrapped inside these providers
 * </WagmiProviders>
 * ```
 */

const WagmiProviders = ({ children }) => {
  // Initialize a new instance of QueryClient from React Query
  const queryClient = new QueryClient();
  return (
    // Provide wagmiConfig to the WagmiProvider for web3 functionality
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
};

export default WagmiProviders;
