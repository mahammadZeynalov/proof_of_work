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

This contract handles transactions related to adding workplaces from enterprises for individuals and confirming user participation.

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

## Deployment Considerations

Ensure that the approved minter addresses (`approvedMinter1`, `approvedMinter2`, `approvedMinter3`) are securely set and only controlled by trusted parties. The contract is intended for scenarios where maintaining accurate employment records without transferring ownership is essential.

## Usage Guide

1. **Register as a User**:
   - Call `register()` to be added to the list of registered users.

2. **Mint an Employment NFT**:
   - Approved minters can call `mintNFT()` with the recipient's address, status text, and event type.

3. **View Job Data**:
   - Use `getJobData()` to view employment status, with access restricted to owners and approved minters.

## Security Notes

- **Access Control**: Ensure that only approved addresses are given minting rights.
- **Non-Transferable Tokens**: The contract restricts token transfers to prevent tampering with employment records.


# IndividualFlow Component Documentation

## Overview

The `IndividualFlow` component is a React component built using the Wagmi library for Ethereum interactions, allowing users to register their addresses in a smart contract. The component displays registration status and allows users to agree to share their work experience data with HR professionals by interacting with a blockchain-based registration function.

## Key Features

- **Address Check**: Checks if the connected Ethereum address is already registered.
- **Registration**: Allows users to register their address in the smart contract.
- **Status Display**: Shows the registration status to the user.
- **Loading and Error Handling**: Provides feedback during data loading, submission, and error states.
- **Toast Notifications**: Displays toast notifications for successful and failed registration attempts.

## Dependencies

- `wagmi`: For Ethereum blockchain interaction and state management.
- `@/components/ui/button`: Custom button component used for user interactions.
- `@/components/ui/use-toast`: Custom toast notification hook for user feedback.
- `@/config/rainbowkitConfig`: Configuration for RainbowKit, used for managing Ethereum wallet connections.
- `@/lib/constants`: Contains `ABI` and `CONTRACT_ADDRESS` for the smart contract.

## Component Structure

### Hooks Used

- **`useAccount()`**: To get the currently connected Ethereum account.
- **`useReadContract()`**: To read data from the smart contract.
- **`useWriteContract()`**: To write data to the smart contract.
- **`useEffect()`**: To refetch data when the account address changes.
- **`useState()`**: To manage the loading state during form submission.

### State Variables

- **`isAlreadyAgreed`**: Boolean indicating if the user is already registered.
- **`isAlreadyAgreedLoading`**: Boolean indicating if the registration status is being loaded.
- **`isSubmitLoading`**: Boolean indicating if the registration submission is in progress.

### Functions

- **`handleSubmit()`**: Async function to handle the registration process. It writes to the blockchain using `writeContractAsync()` and waits for the transaction receipt.

### UI Components

- **`Button`**: Used for the user to submit their registration.
- **Toast Notifications**: Used for providing feedback (success or error) after an action is performed.

## Code Flow

1. **Address Check**: The `useReadContract()` hook reads from the contract to check if the user is already registered.
2. **Effect Hook**: The `useEffect()` hook refetches the registration status when the user’s address changes.
3. **Submit Function**: The `handleSubmit()` function sends a transaction to the contract to register the user, displays a loading state, and shows a toast notification upon success or failure.
4. **UI Rendering**:
   - Shows a loading message if the registration status is being fetched.
   - Displays a message if the user is already registered.
   - Shows a loading message during submission.
   - Renders a button if the user is not registered and no actions are in progress.

## How to Use

1. **Connect Wallet**: Ensure that the user’s wallet is connected through Wagmi and configured properly.
2. **Registration Check**: The component will check if the connected address is already registered.
3. **Register**: If the user is not registered, they can click the button to register their address.
4. **Feedback**: Users will see notifications indicating the success or failure of the registration process.

## Customization

- **Contract ABI and Address**: Modify `ABI` and `CONTRACT_ADDRESS` in `@/lib/constants` to use with different contracts.
- **Toast and Button Components**: Customize `@/components/ui/button` and `@/components/ui/use-toast` to fit your design system.

## Error Handling

- **Toast Notifications**: Display error messages using toast notifications if the registration fails.
- **Console Logging**: Errors are logged in the console for debugging purposes.

## License

This component is provided as-is under the MIT License. Modify as needed for your use case.


# LegalFlow Component Documentation

## Overview

The `LegalFlow` component is a React component for managing and displaying job-related NFT data on the blockchain. It provides two main functionalities:
1. **Search**: Users can search for job data associated with a candidate's wallet.
2. **Add Work Experience**: Authorized users can mint new job-related NFTs for a given wallet address.

## Key Features

- **NFT Search**: Retrieves and displays job-related NFTs associated with a wallet address.
- **Minting Functionality**: Allows authorized users to mint new NFTs with career event information.
- **Custom UI Components**: Utilizes custom `Button`, `Input`, `Card`, `Select`, `Tabs`, and `Loader` components for a rich user interface.
- **Image Mapping**: Displays images corresponding to different career events (e.g., hired, promoted, terminated).
- **Responsive Design**: The layout is styled to be user-friendly and adaptable.

## Dependencies

- **Wagmi**: For Ethereum interactions and state management.
- **Date-fns**: For date formatting.
- **Custom Components**: `@/components/ui/button`, `@/components/ui/input`, `@/components/ui/card`, `@/components/ui/select`, `@/components/ui/tabs`, and `@/components/ui/loader`.
- **Images**: Career event images (e.g., `newHireImg`, `promotionImg`, `firedImg`).

## Component Structure

### State Variables

- **`searchValue`**: Stores the input value for the candidate wallet address.
- **`nfts`**: Holds the list of job-related NFTs retrieved from the blockchain.
- **`isNftsLoading`**: Indicates if NFTs are currently being loaded.
- **`isMintLoading`**: Indicates if a mint operation is in progress.
- **`nftsIds`**: Number of NFTs associated with the searched wallet address.
- **`isNftsIdsLoading`**: Indicates if the NFT ID retrieval process is loading.
- **`jobText`**: Stores the description for a new job entry.
- **`jobCareerEvent`**: Stores the selected career event type.
- **`candidateWalletAddress`**: Stores the wallet address for minting a new job entry.

### Functions

#### Main Functions

- **`useEffect`**: Fetches job-related data when `nftsIds` changes.
- **`mapNftImage`**: Maps career event types to corresponding images.
- **`mapEventToText`**: Maps career event types to user-friendly text.
- **`mintJob`**: Handles the minting of new NFTs and updates the state accordingly.
- **`handleSearch`**: Refetches the NFT IDs for the provided wallet address.

### UI Components

- **Tabs**: Two main tabs: 
  - **Search**: For searching and displaying job-related NFTs.
  - **Work**: For adding new career information.
- **Card**: Displays job-related NFT information, including career event type, description, timestamp, and an image.
- **Input Fields**: Used for entering wallet addresses and job descriptions.
- **Select Dropdown**: Used for selecting career event types.
- **Button**: For initiating search and mint operations.
- **Loader**: Indicates loading states for search and submission processes.

## Code Flow

1. **Search Functionality**:
   - User enters a wallet address and clicks "Search".
   - The `handleSearch` function triggers `refetchNftsIds()` to fetch the number of NFTs.
   - `useEffect` runs `fetchJobs()` to fetch and display job data based on `nftsIds`.

2. **Minting Functionality**:
   - User fills out candidate wallet address, job description, and selects a career event.
   - Clicking "Submit" triggers `mintJob()`, which writes to the blockchain and waits for transaction confirmation.
   - On success, the new job entry is added to `nfts`, and a success toast is shown.
   - On failure, an error toast is shown.

3. **Mapping Functions**:
   - `mapNftImage` and `mapEventToText` ensure the correct images and text are displayed for each career event type.

## How to Use

1. **Search for Job Data**:
   - Navigate to the **Search** tab.
   - Enter a wallet address and click "Search".
   - The NFTs associated with the wallet will be displayed in a grid layout.

2. **Add Work Experience**:
   - Navigate to the **Work** tab.
   - Enter the candidate's wallet address, job description, and select a career event.
   - Click "Submit" to mint a new job entry NFT.

## Customization

- **Contract ABI and Address**: Ensure `ABI` and `CONTRACT_ADDRESS` in `@/lib/constants` point to the correct smart contract.
- **Job Items**: Modify `JOB_ITEMS` if necessary to represent job data for testing or mock purposes.

## Error Handling

- **Error Handling During Search and Minting**: Catches and logs errors, displaying a toast notification for the user.
- **Loading Indicators**: The `Loader` component is displayed during data fetching and minting processes.
