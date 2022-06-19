async function main() {

    const tokenName = "Peanuts";
    const tokenSymbol = "PNS";

    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    const weiAmount = (await deployer.getBalance()).toString();

    console.log(
        "Account balance:",
        await ethers.utils.formatEther(weiAmount)
    );

    const Token = await ethers.getContractFactory("Peanuts");
    const token = await Token.deploy(tokenName, tokenSymbol);

    console.log("Peanuts Token address:", token.address);
    
  const Vault = await ethers.getContractFactory("PeanutsVault");

  const depositFee = 0;
  const tvlCap = ethers.utils.parseEther("2000");
  const options = { gasPrice: 900000000000, gasLimit: 9000000 };

  const vault = await Vault.deploy(
    token.address,
    tokenName,
    tokenSymbol,
    depositFee,
    tvlCap,
    options
  );

  await vault.deployed();
  console.log("Vault deployed to:", vault.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
