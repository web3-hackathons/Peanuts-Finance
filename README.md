# Peanuts Staking

The goal of this Contract is to create a Staking dApp that will allow public users to stack some ETH if some conditions are met. If those conditions are not met they will be able to withdraw their funds.

Frontend:
https://peanuts-profit.surge.sh/

Smart Contract Deployment:
<https://goerli.etherscan.io/address/0x12d5dbc3c34d966b5e9e4527b62fecd0ffe84175#code>



## Setup 


### Installation
```
yarn install
```

### Starting environment
```
yarn start
yarn chain
yarn deploy
```


### Deployment 

Frontend:

📝 Edit the targetNetwork in App.jsx (in packages/react-app/src) to be the public network where you deployed your smart contract.

📦 Run yarn build to package up your frontend.

💽 Upload your app to surge with `yarn surge` (you could also yarn s3 or maybe even yarn ipfs?)


Snart contracts:

📡 Edit the `defaultNetwork` to your choice of public EVM networks in packages/hardhat/hardhat.config.js

👩‍🚀 You will want to run `yarn account` to see if you have a deployer address

🔐 If you don't have one, run `yarn generate` to create a mnemonic and save it locally for deploying.


You will need to send ETH to your deployer address with your wallet.

🚀 Run `yarn deploy` to deploy your smart contract to a public network (selected in hardhat.config.js)

### Contract Verification

Update the api-key in packages/hardhat/package.json file.

Now you are ready to run the `yarn verify --network your_network command` to verify your contracts on etherscan 🛰

