import { s, type SkillDef } from "../types";

export const BLOCKCHAIN: SkillDef[] = [
  // ── Blockchain Networks & Protocols ──
  s("blockchain-architecture", "Blockchain Architecture & Distributed Ledgers", "blockchain-core", ["blockchain", "blockchain technology", "distributed ledger technology dlt", "consensus mechanisms", "proof of work pow", "proof of stake pos", "byzantine fault tolerance bft"], ["high-demand", "core"]),
  s("ethereum", "Ethereum Network & EVM", "blockchain-platform", ["eth", "ethereum", "ethereum virtual machine evm", "eip standards", "erc-20", "erc-721", "erc-1155", "erc-4337 account abstraction"], ["high-demand", "core"]),
  s("solana-blockchain", "Solana Network", "blockchain-platform", ["solana", "sol", "solana program development", "anchor framework solana", "proof of history poh", "sealevel parallel runtime"], ["trending", "high-demand"]),
  s("polygon-network", "Polygon (PoS & zkEVM)", "layer-2", ["polygon", "matic", "polygon pos", "polygon zkevm", "polygon cdk"]),
  s("arbitrum", "Arbitrum (Optimistic Rollup)", "layer-2", ["arbitrum one", "arbitrum nitro", "arbitrum orbit", "l2 rollup"]),
  s("optimism-op", "Optimism / OP Stack", "layer-2", ["optimism", "op mainnet", "op stack", "superchain", "optimistic rollups"]),
  s("base-l2", "Base (Coinbase L2)", "layer-2", ["base network", "base l2", "coinbase base blockchain"]),
  s("avalanche-avax", "Avalanche (AVAX)", "blockchain-platform", ["avalanche", "avax", "avalanche subnets", "c-chain"]),
  s("cosmos-network", "Cosmos Network & Tendermint", "blockchain-platform", ["cosmos", "atom", "cosmos sdk", "ibc inter-blockchain communication", "tendermint bft"]),
  s("polkadot", "Polkadot & Substrate", "blockchain-platform", ["polkadot", "dot", "substrate framework", "parachains polkadot", "rust substrate"]),
  s("near-protocol", "NEAR Protocol", "blockchain-platform", ["near", "near protocol smart contracts", "rust near"]),
  s("bitcoin-network", "Bitcoin Network & Protocols", "blockchain-platform", ["btc", "bitcoin", "bitcoin script", "lightning network", "ordinals", "runes bitcoin"]),
  s("hyperledger-fabric", "Hyperledger Fabric (Enterprise Blockchain)", "enterprise-blockchain", ["hyperledger", "hyperledger fabric", "chaincode", "permissioned blockchain"]),

  // ── Smart Contract Development & Tooling ──
  s("smart-contracts", "Smart Contract Engineering", "smart-contracts", ["smart contracts", "smart contract development", "smart contract security", "reentrancy attack prevention", "gas optimization smart contracts"], ["high-demand", "core"]),
  s("foundry-toolkit", "Foundry (Ethereum Development Toolkit)", "blockchain-tooling", ["foundry", "forge foundry", "cast foundry", "anvil foundry", "solidity testing foundry"], ["trending", "high-demand"]),
  s("hardhat", "Hardhat Development Environment", "blockchain-tooling", ["hardhat", "hardhat testing", "hardhat network", "nomicfoundation hardhat", "hardhat ethers"], ["high-demand", "core"]),
  s("truffle-suite", "Truffle & Ganache", "blockchain-tooling", ["truffle suite", "ganache local blockchain", "truffle contracts"]),
  s("openzeppelin", "OpenZeppelin Contracts", "smart-contract-library", ["openzeppelin", "openzeppelin contracts", "erc standards openzeppelin", "upgradeable contracts openzeppelin", "uups proxy pattern"]),
  s("anchor-framework", "Anchor Framework (Solana)", "smart-contract-library", ["anchor solana", "anchor rust", "solana anchor idl"]),

  // ── Web3 Client Libraries & Indexing ──
  s("ethers-js", "Ethers.js", "web3-client", ["ethers", "ethers.js", "ethers js v6", "ethers contracts", "ethers providers"]),
  s("viem-library", "viem", "web3-client", ["viem", "viem typescript", "lightweight typescript interface for ethereum"], ["trending", "high-demand"]),
  s("wagmi-hooks", "wagmi React Hooks for Web3", "web3-client", ["wagmi", "wagmi hooks", "connect wallet wagmi"]),
  s("web3js", "Web3.js", "web3-client", ["web3.js", "web3 js", "ethereum web3 library"]),
  s("the-graph-indexing", "The Graph Protocol (Subgraphs)", "blockchain-indexing", ["the graph", "subgraph development", "graph node", "graphql indexing blockchain"]),
  s("alchemy-sdk", "Alchemy Web3 APIs & Node Infrastructure", "blockchain-infra", ["alchemy", "alchemy sdk", "supernode alchemy", "alchemy enhanced apis"]),
  s("infura", "Infura (ConsenSys)", "blockchain-infra", ["infura rpc", "infura ethereum nodes"]),
  s("quicknode", "QuickNode", "blockchain-infra", ["quicknode rpc", "blockchain node hosting"]),
  s("web3modal", "AppKit / Web3Modal (WalletConnect)", "web3-client", ["web3modal", "walletconnect", "reown appkit", "wallet connection ui"]),

  // ── DeFi, NFTs, ZK-Proofs & Cryptography ──
  s("defi-protocols", "Decentralized Finance (DeFi)", "defi", ["defi", "amm automated market maker", "uniswap v2 v3 v4", "liquidity pools", "yield farming", "flash loans", "lending protocols aave compound"]),
  s("nft-engineering", "NFT Engineering (ERC-721 / ERC-1155)", "nft", ["nft", "non fungible tokens", "nft minting contract", "metadata ipfs nft", "royalty standards"]),
  s("zero-knowledge-proofs", "Zero-Knowledge Proofs (ZKPs / zk-SNARKs / zk-STARKs)", "cryptography-zk", ["zk-snarks", "zk-starks", "circom", "snarkjs", "halo2", "zk rollups", "zero knowledge cryptography"], ["trending", "high-demand"]),
  s("account-abstraction", "Account Abstraction (ERC-4337)", "blockchain-concept", ["erc-4337", "smart contract wallets", "paymasters", "bundlers account abstraction", "session keys"]),
  s("ipfs-storage", "IPFS & Decentralized Storage", "decentralized-storage", ["ipfs", "interplanetary file system", "filecoin", "arweave", "pinata ipfs"]),
  s("smart-contract-auditing", "Smart Contract Security Auditing", "security-audit", ["smart contract audit", "slither static analysis", "echidna fuzzing", "mythril", "certora formal verification", "reentrancy flash loan exploits"], ["high-demand"]),
];
