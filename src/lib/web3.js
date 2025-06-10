import { walletFunctions } from '@/helpers/constants/wallet.utils';
import Web3 from 'web3';

const web3 = new Web3(typeof window !== 'undefined' && window.ethereum);

export const web3Functions = () => {
  /**
   * @description Checks if the user has MetaMask installed.
   * @returns {Boolean} - true if installed.
   */
  const metamaskInstallationCheck = () =>
    window?.ethereum && !!window.ethereum.isMetaMask;

  /**
   * @description Returns a list of accounts the node controls.
   * @returns {String} wallet address of the connected user.
   */
  const fetchConnectedAccounts = async () => (await web3.eth.getAccounts())[0];

  /**
   * @description Connects an application with metamask.
   * @returns {(String | Boolean)} - returns string if no error's thrown, else boolean.
   */
  const connectToMetaMask = async () => {
    const walletAddress = await fetchConnectedAccounts();
    if (walletAddress) return walletAddress;
    try {
      const walletAddressArr = await web3.currentProvider.request({
        method: 'eth_requestAccounts',
      });
      return walletAddressArr[0];
    } catch (error) {
      // TODO: Switch 'walletFunctions().checkError' to function call file.
      walletFunctions().checkError(error);
      return false;
    }
  };

  /**
   * @description Creates a confirmation asking the user to add the specified chain to the wallet application.
   * @param {Object} networkParams
   * @returns {Boolean}
   */
  const addChain = async (networkParams) => {
    try {
      await web3.currentProvider.request({
        method: 'wallet_addEthereumChain',
        params: [networkParams],
      });
      return true;
    } catch (error) {
      // TODO: Switch 'walletFunctions().checkError' to function call file.
      walletFunctions().checkError(error);
      return false;
    }
  };

  /**
   * @description - Requests that the wallet switches its active Ethereum chain.
   * @param {network} - network to which the user needs to switch
   * @returns {Boolean} true if no error's thrown and successful switch else false.
   */
  const switchChain = async (network) => {
    try {
      await web3.currentProvider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: network.chainId }],
      });
      return true;
    } catch (error) {
      if (error.code === 4902 || error.code === -32603) {
        try {
          if (await addChain(network)) {
            if (await checkNetwork(network.chainId)) return true;
          }
        } catch (error) {
          return false;
        }
      } else return false;
    }
  };

  /**
   * @description - Helps import tokens into Metamask.
   * @param {Object} tokenOptions - token options of the token to be imported into the wallet.
   * @returns {Boolean} true if no error's thrown.
   */
  const importTokenIntoMetaMask = async (tokenOptions) => {
    try {
      return await web3.currentProvider.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: tokenOptions,
        },
      });
    } catch (error) {
      // TODO: Switch 'walletFunctions().checkError' to function call file.
      walletFunctions().checkError(error);
      return false;
    }
  };

  /**
   * @description Ensures the user's on the BSC Testnet chain.
   * @param {string} - hexadecimal value of netId
   * @returns {Boolean} - true if user's on the required chain.
   */
  const checkNetwork = async (netId) => {
    return (
      parseInt(await web3.eth.getChainId()) ===
      web3UtilsGenFunc([netId], 'hexToNumber')
    );
  };

  /**
   * @description Initializes a smart contract object.
   * @param {Object} abi - smart contract's abi.
   * @param {String} contractAddress - smart contract's address.
   * @returns {Object} - contract's instance.
   */
  const initializeSmartContract = (abi, contractAddress) =>
    new web3.eth.Contract(abi, contractAddress);

  /**
   * @description Generic function to send a transaction to the smart contract.
   * @param {String} contractFunction - contract's function name.
   * @param {Object} functionInput - contract's function's array of parameters.
   * @param {Object} sendInput - array of parameters necessary to send transaction.
   * @param {Object} abi
   * @param {String} contractAddress
   * @returns {Object}
   */
  const sendSmartContract = async (
    contractFunction,
    functionInput,
    sendInput,
    abi,
    contractAddress,
  ) => {
    const contractInstance = initializeSmartContract(abi, contractAddress);
    return contractInstance.methods[contractFunction]
      .apply(null, functionInput)
      .send.apply(null, sendInput)
      .on('transactionHash', function (txHash) {
        console.log("Transaction's in process. Kindly wait.");
        return txHash;
      })
      .on('receipt', function (receipt) {
        if (receipt.status) {
          console.log("Transaction's successful.");
          return receipt;
        }
      })
      .on('error', function (error) {
        return error;
        // walletFunctions().checkError(error);
      });
  };

  /**
   * @description Generic function to call a constant method from the smart contract.
   * @param {String} contractFunction - contract's function name.
   * @param {Object} functionInputs - contract's function's array of parameters.
   * @param {Object} abi
   * @param {String} contractAddress
   * @returns {Object}
   */
  const callSmartContract = async (
    contractFunction,
    functionInputs,
    abi,
    contractAddress,
  ) => {
    const contractInstance = initializeSmartContract(abi, contractAddress);
    return contractInstance.methods[contractFunction]
      .apply(null, functionInputs)
      .call()
      .then((result) => result);
  };

  /**
   * @description Utility functions for Ethereum dapps and other web3.js packages.
   * @param {Array} functionInput - amount to be converted.
   * @param {String} utilsFunction - function to be used.
   * @returns {Boolean | String | Number | Object}
   */
  const web3UtilsGenFunc = (functionInput, utilsFunction) =>
    web3.utils[utilsFunction].apply(null, functionInput);

  return {
    metamaskInstallationCheck,
    fetchConnectedAccounts,
    connectToMetaMask,
    addChain,
    switchChain,
    importTokenIntoMetaMask,
    checkNetwork,
    initializeSmartContract,
    sendSmartContract,
    callSmartContract,
    web3UtilsGenFunc,
  };
};
