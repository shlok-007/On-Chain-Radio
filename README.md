# PeerPlay : Decentralizing Music, Monetizing Art.

## Usage
1. Install the [Petra Aptos Wallet](https://chromewebstore.google.com/detail/petra-aptos-wallet](https://chromewebstore.google.com/detail/petra-aptos-wallet/ejjladinnckdgjemekebdpeokbikhfci)https://chromewebstore.google.com/detail/petra-aptos-wallet/ejjladinnckdgjemekebdpeokbikhfci/) browser extension.
2. Follow the steps to complete the signup, switch the network to Testnet and get yourself some APT coins(10 ideally) from the Faucet so that you can perform the transactions.
3. Now, you can either visit our deployed link [here](https://www.google.com) or run the frontend locally(explained later).
4. Additionally, you can also visit the [Aptos Explorer](https://explorer.aptoslabs.com/account/0x3ee935265adc5cb16f3fe98c486ff9c3bb472d79e217212cf70beca6fddcff12/modules/run/community?network=testnet) to interact with the backend functions directly.

### Run Locally
1. Clone the repo
2. Run the following commands:
   ```
   cd client
   npm start
   ```

## Overview
- We have used the **Move** language for backend and deployed on the Aptos Network(Testnet) through a **resource account**.
- For data storage, we have used **IPFS** via **Pinata's API**.
- For frontend, **React-Typescript** has been used with a variety of UI libraries.

## Backend Implementation
The entire backend is  divided into 4 modules(can be found in the /move folder):
- user.move
- song.move
- songStore.move
- community.move
All of the modules are deployed via a resource account
