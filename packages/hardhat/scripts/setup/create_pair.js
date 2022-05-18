// This script is used to create a mock pair on spookyswap
// const hre = require("hardhat");
// const { ethers } = require("ethers");

async function main() {
  const SPOOKY_ROUTER_ADDRESS = "0xa6AD18C2aC47803E193F75c3677b14BF19B94883";
  const SPOOKY_FACTORY_ADDRESS = "0xEE4bC42157cf65291Ba2FE839AE127e3Cc76f741";

  const PeanutToken = "0xE1744C795B920852DC786Cc356Cd3A0842E74345";

  const amountTokenDesired = ethers.utils.parseEther("0.1"); // 5 tokens
  const amountETH = 1; // 0.05 ETH
  const amountTokenMin = 0;
  const minAmountOutETH = 0;
  const deadline = new Date().getTime() + 120;

  const factoryAbi = require("./spooky_factory_abi.json");
  const routerAbi = require("./spooky_router_abi.json");

  const [deployer] = await hre.ethers.getSigners();

  const router = new ethers.Contract(
    SPOOKY_ROUTER_ADDRESS,
    routerAbi,
    deployer
  );
  const factory = new ethers.Contract(
    SPOOKY_FACTORY_ADDRESS,
    factoryAbi,
    deployer
  );
    
    const peanuts = await hre.ethers.getContractAt("Peanuts", PeanutToken);
  //   router = await hre.ethers.getContractAt(routerAbi,
  //     "UniswapV2Router02",
  //     SPOOKY_ROUTER_ADDRESS
  //   );

  //   factory = await hre.ethers.getContractAt(
  //     factoryAbi,
  //     "UniswapV2Factory",
  //     SPOOKY_FACTORY_ADDRESS
  //   );

  console.log("Address loaded");
  console.log(deployer.address);

  await peanuts.approve(router.address, ethers.utils.parseEther("100"));
  console.log("Approved");

  const depositTokenReceipt = await router.addLiquidityETH(
    peanuts.address,
    amountTokenDesired,
    amountTokenMin,
    minAmountOutETH,
    deployer.address,
    deadline,
    {
      value: ethers.utils.parseEther("1")
    //   gasLimit: 1000000,
    //   from: deployer.address,
    }
  );
  await depositTokenReceipt.wait();

  console.log("Contract deployed at" + depositTokenReceipt);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
