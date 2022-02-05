const ethers = require('ethers')
const mainAbi = require('../abi/main-abi.json')
const materialsAbi = require('../abi/materials-abi.json')
const config = require('../config.js')
const countAdventurers = require('./count-adventurers.js')
require('dotenv').config()
//
const sendMaterialsFarming = async () => {
	const provider = new ethers.providers.JsonRpcProvider(
		`https://polygon-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_POLYGON_API_KEY}`
	)
	const privateKey = process.env.PRIVATE_KEY
	const wallet = new ethers.Wallet(privateKey, provider)
	const materialsContractAddress = config.contracts.materials
	const materialsContract = new ethers.Contract(materialsContractAddress, materialsAbi, wallet)
	const allAdventurers = await countAdventurers.retrieveAdventurers()

	//check if adventurer is available for adventure
	const readyAdventurers = []
	for (let i = 0; i < allAdventurers.length; i++) {
		const blockTimestamp = (await provider.getBlock()).timestamp
		let adventurersLog = await materialsContract.adventurers_log(allAdventurers[i])
		if (blockTimestamp > adventurersLog.toNumber()) {
			readyAdventurers.push(allAdventurers[i])
		}
	}
	console.log(readyAdventurers)
	if (readyAdventurers.length > 0) {
		// for loop to send each adventurer to adventure
		for (let i = 0; i < readyAdventurers.length; i++) {
			await materialsContract.adventure(readyAdventurers[i])
		}
		return `${readyAdventurers.length} eligible adventurers were sent to farm materials.`
	}
	return 'No eligible adventurers were found.'
}
module.exports = {
	sendMaterialsFarming,
}
