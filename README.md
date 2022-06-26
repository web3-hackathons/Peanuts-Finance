# Peanuts Finance | Dollar Cost Autocompounding for Da Normies

![image](https://user-images.githubusercontent.com/46377366/170250482-564c275e-ae17-49b0-9465-52eca1f7f1b0.png)

Users who do not have time to keep up with the crypto market might find it hard to dollar cost average into a basket of cryptocurrencies.
Existing solutions for dollar cost averaging while they allow users to purchase basket of cryptocurrencies, they do not allow users to easily earn interest on those cryptocurrencies.

Peanuts allows user to dollar cost average into a pool of cryptocurrencies and earn interest on those cryptocurrencies.

The user can choose to have their dollar cost average automatically compounded every day, weekly, or monthly.

On withdrawal, user can choose to withdraw their tokens either in the tokens of their strategy or in a stablecoin (USDC).

The idea is that users can enjoy the benefits of exposure to a basket of crypto of their choosing and at the same time earn interest on those cryptocurrencies in native USDC.

### User Story
E.g you got 1k usdc on Avalanche

- you put into this vault, and you can set a custom strategy for it
- every month or epoch the vault uses your money to purchase a basket of 3-5 tokens. 
- The vault will then use the tokens to earn interest on the tokens and sells the interest into stable coin to replenish the vault.
- when you withdraw, you can choose to withdraw your share of tokens in the vault as USDC or in the coins that you initially chose
![image](https://user-images.githubusercontent.com/46377366/170250579-cdccba1b-164e-4396-8b1e-70972d88b820.png)


### Architecture
![image](https://user-images.githubusercontent.com/46377366/170250717-31afd948-115a-4826-b0c8-c9925c2af170.png)

![image](https://user-images.githubusercontent.com/46377366/170250766-325fc096-b377-424a-8c17-8970242e33e5.png)


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

**Frontend:**

📝 Edit the targetNetwork in App.jsx (in packages/react-app/src) to be the public network where you deployed your smart contract.

📦 Run yarn build to package up your frontend.

💽 Upload your app to surge with `yarn surge` (you could also yarn s3 or maybe even yarn ipfs?)


**Smart contracts:**

📡 Edit the `defaultNetwork` to your choice of public EVM networks in packages/hardhat/hardhat.config.js

👩‍🚀 You will want to run `yarn account` to see if you have a deployer address

🔐 If you don't have one, run `yarn generate` to create a mnemonic and save it locally for deploying.


You will need to send ETH to your deployer address with your wallet.

🚀 Run `yarn deploy` to deploy your smart contract to a public network (selected in hardhat.config.js)

### Contract Verification

Update the api-key in packages/hardhat/package.json file.

Now you are ready to run the `yarn verify --network your_network command` to verify your contracts on etherscan 🛰



**Smart contracts Deployment:**
1. Deploy the strategy contract 
2. Deploy the staking contract with the strategy contract address

Local Deployment
```
cd packages/hardhat
npx hardhat compile
npx hardhat run --network localhost scripts/setup/deploy_vault_test.js
```
Testnet:` npx hardhat run --network fantom_testnet scripts/setup/deploy_vault_test.js`

**Tests:**
`npx hardhat test`


#### Running Forked Blockchain
`npx hardhat node --network hardhat`


#### 📜 Contract Verification
Update the api-key in packages/hardhat/package.json file. You can get your key [here](https://etherscan.io/myapikey).

![](https://user-images.githubusercontent.com/9419140/144075208-c50b70aa-345f-4e36-81d6-becaa5f74857.png)

Now you are ready to run the yarn verify --network your_network command to verify your contracts on etherscan 🛰

### TODO left:
- Auto compounding Vault
    - Deposit USDC
    
#### Misc
prettier : `npx prettier --write 'contracts/**/*.sol'`
docstring formatting : <https://docs.soliditylang.org/en/develop/natspec-format.html>
