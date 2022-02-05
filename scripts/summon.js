const ethers = require('ethers')
const mainAbi = require('../abi/main-abi.json')
const attributesAbi = require('../abi/attributes-abi.json')
const config = require('../config.js')
require('dotenv').config()
const classNumber = 5 // <-- change to summon a different class
//
const summonAdventurer = async () => {
	const provider = new ethers.providers.JsonRpcProvider(
		`https://polygon-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_POLYGON_API_KEY}`
	)
	const privateKey = process.env.PRIVATE_KEY
	const wallet = new ethers.Wallet(privateKey, provider)
	const mainContractAddress = config.contracts.main
	const mainContract = new ethers.Contract(mainContractAddress, mainAbi, wallet)
	const attributesContractAddress = config.contracts.attributes
	const attributesContract = new ethers.Contract(attributesContractAddress, attributesAbi, wallet)
	// summon a new adventurer
	const tx = await mainContract.summon(classNumber)
	const res = await tx.wait()
	// get adventurer's id
	const adventurerId = ethers.BigNumber.from(res.logs[0].topics[3]).toString()
	// get adventurer's class
	const adventurerClass = await mainContract.classes(classNumber)
	// assign adventurer's default attribute points (str, dex, const, int, wis, char)
	await attributesContract.point_buy(adventurerId, 18, 8, 18, 8, 8, 8)

	return `Adventurer ${adventurerId} summoned with class ${adventurerClass}.`
}

module.exports = { summonAdventurer }
