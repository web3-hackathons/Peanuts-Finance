// This script is to upgrade the strategy contract to the new version.

async function main() {
  const stratFactory = await ethers.getContractFactory('ReaperAutoCompoundSolidexFarmer'); // new strategy
  const stratContract = await hre.upgrades.upgradeProxy('0x3630a380F320EA77284Ed03D09B4C73D1351C41e', stratFactory, {
    call: {fn: 'postUpgradeLP0Allowance'},
    timeout: 0,
  }); // upgrade the strategy contract to the new version
  console.log('Strategy upgraded!');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
