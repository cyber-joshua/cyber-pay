export const cyberTestnet = {
  id: 111557560,
  name: 'Cyber Testnet',
  network: 'Cyber Testnet',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.testnet.cyber.co'] },
    public: { http: ['https://rpc.testnet.cyber.co'] },
  },
  blockExplorers: {
    default: {
      name: 'Cyber Testnet Explorer',
      url: 'https://testnet.cyberscan.co/',
    },
  },
};

export const qrcodePrefix = 'cyberpay:';