import hre from "hardhat";

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const SkillsRegistry = await hre.ethers.getContractFactory("SkillsRegistry");
  const registry = await SkillsRegistry.deploy();

  await registry.waitForDeployment();

  console.log("SkillsRegistry deployed to:", await registry.getAddress());

  // Add a dummy University Issuer
  const dummyIssuerAddress = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"; // Hardhat Account #1
  await registry.addIssuer(dummyIssuerAddress);
  console.log(`Authorized Issuer added: ${dummyIssuerAddress}`);
}

main().catch((error) => {
  console.error(error);
  (process as any).exit(1);
});