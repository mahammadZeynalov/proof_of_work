### Project Overview: Proof of Work

**Created Using**: [Rootstock Wagmi Starter Kit](https://dev.rootstock.io/developers/quickstart/wagmi/)

**Tech Stack**:
- **Frontend**: React
- **Blockchain**: Solidity smart contract
- **Sponsor Integration**: [Rootstock](https://dev.rootstock.io/)

### Problem Statement

Jobseekers sometimes falsify information on their CVs to appear more experienced, leading to hiring decisions based on inaccurate or exaggerated work histories. This undermines trust in the recruitment process and poses risks to companies relying on genuine expertise. To solve this, there is a need for a global platform that provides recruiters with verified, blockchain-based data on jobseekers’ work experiences. Such a platform would ensure recruiters access reliable, immutable records of employment history, making the hiring process fairer and more trustworthy.

### Solution: Proof of Work

**Proof of Work** is a decentralized platform designed to allow jobseekers to securely share verified work history with recruiters through blockchain technology. This solution addresses the issue of falsified experience by enabling only authorized companies to update and verify jobseekers' employment records. Recruiters benefit from access to tamper-proof, trustworthy work histories, fostering a more transparent and reliable hiring process.

--- 

# ProofOfWork Smart Contract

### Contract Address for Workplace Management on Rootstock Testnet

This contract handles transactions related to Candidate Flow (candidate confirm to share this information with enterprises) and Enterprise Flow (authorized enterpises can check candidates work history and add modify employee data).

- **Contract Address**: [`0x6df8d97a2dac7484ceeeabe519753b04951372b4`](https://explorer.testnet.rootstock.io/address/0x6df8d97a2dac7484ceeeabe519753b04951372b4)
- **Network**: Rootstock Testnet

This contract facilitates the following:
- Enterprises can add workplaces for individuals.
- Users can confirm their association with the added workplaces.

## Overview

The `ProofOfWork` smart contract is an ERC-721 compliant NFT contract designed for managing employment status through blockchain-based tokens. The contract allows only approved minters to mint tokens representing various career events for registered users. Each token contains a unique status with details such as event type and timestamp.

## Features

- **ERC-721 Compliant**: Inherits from OpenZeppelin's `ERC721` contract for standard NFT functionality.
- **Approved Minters Only**: Ensures only specific, approved addresses can mint new tokens.
- **Employment Status Management**: Tokens minted are linked with detailed job status, including event type and timestamp.
- **Registration System**: Users need to register before they can receive an NFT.
- **Transfer Restrictions**: Token transfers are disabled to maintain the integrity of the employment record.

## Smart Contract Details

### Constructor

- **Name**: `ProofOfWork`
- **Symbol**: `POW`

Initializes the NFT contract with the given name and symbol.

### Modifiers

- **`onlyApprovedMinters`**: Restricts function access to approved minter addresses.
- **`onlyOwnerOrApproved`**: Restricts access to job data to either the token owner or approved minters.

### State Variables

- **`approvedMinter1`, `approvedMinter2`, `approvedMinter3`**: Predefined addresses with minting privileges.
- **`registeredAddresses`**: Array that stores the addresses of registered users.
- **`isRegistered`**: Mapping that checks if an address is registered.
- **`TokenId`**: Counter to track the next token ID.
- **`JobData`**: Mapping from token ID to `Status` struct, which holds job details.
- **`tokenToOwner`**: Maps each token ID to its owner's address for access control.

### Data Structures

#### `Status` Struct

- **`TokenId`**: The unique identifier of the token.
- **`text`**: A description of the employment status.
- **`careerEvent`**: Enum value representing the type of career event (`Hired`, `Promoted`, `Terminated`).
- **`timestamp`**: The timestamp when the token was minted.

### Enums

- **`careerEventOptions`**: Represents career events (`Hired`, `Promoted`, `Terminated`).

### Functions

#### Public Functions

- **`mintNFT(address recipient, string memory text, careerEventOptions careerEvent)`**
  - Mints an NFT for a registered recipient with the provided status details.
  - **Modifiers**: `onlyApprovedMinters`
  - **Requires**: `recipient` must be registered.

- **`register()`**
  - Allows users to register their addresses to be eligible for receiving NFTs.
  - **Requires**: Caller must not be already registered.

- **`checkRegistration(address _user) returns (bool)`**
  - Checks if a given address is registered.

- **`getJobData(uint256 tokenId) returns (Status memory)`**
  - Retrieves the employment status associated with a specific token ID.
  - **Modifiers**: `onlyOwnerOrApproved(tokenId)`
  - **Requires**: Token ID must exist.

#### Internal Functions

- **`_beforeTokenTransfer(address from, address to, uint256 tokenId)`**
  - Overrides default ERC-721 behavior to prevent transfers.
  - **Allows**: Minting (from `0x0`) but disallows standard transfers.
