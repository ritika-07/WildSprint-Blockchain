const Token = artifacts.require("Token");
const dBank = artifacts.require("dBank");

module.exports = async function(deployer) {
	//deploy Token
	await deployer.deploy(Token)

	//assign dBank contract into variable to get it's address
	const dbank = await dBank.deployed()
};