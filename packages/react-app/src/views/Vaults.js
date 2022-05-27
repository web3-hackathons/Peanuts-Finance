

export const vaultName = "name";
export const vaultDeposited = "deposited";
export const vaultAddress = "addr";
export const vaultTokenAddr = "tokAddr"
export const vaultImages = "img"


// Peanuts Token address: 0x5FbDB2315678afecb367f032d93F642f64180aa3
// Vault deployed to: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512

export let vaults = [
    {
        [vaultName]: "ETH/BTC/USDC" ,
        [vaultAddress]: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512,
        [vaultTokenAddr]: 0x5FbDB2315678afecb367f032d93F642f64180aa3,
        [vaultImages]:[
            "/ethereum-eth.svg",
            "/bitcoin-btc-logo.svg",
            "/usd-coin-usdc-logo.svg"
        ]
    }
]
// https://stackoverflow.com/questions/882727/is-there-a-way-to-use-variable-keys-in-a-javascript-object-literal