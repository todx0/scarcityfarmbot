const ethers = require('ethers')
const mainAbi = require('../abi/main-abi.json')
const config = require('../config.js')
const countAdventurers = require('./count-adventurers.js')
require('dotenv').config()
//
const sendXpQuest = async () => {
	const provider = new ethers.providers.JsonRpcProvider(
		`https://polygon-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_POLYGON_API_KEY}`
	)
	const privateKey = process.env.PRIVATE_KEY
	const wallet = new ethers.Wallet(privateKey, provider)
	const mainContractAddress = config.contracts.main
	const mainContract = new ethers.Contract(mainContractAddress, mainAbi, wallet)
	const allAdventurers = await countAdventurers.retrieveAdventurers()

	///check if adventurer is available for adventure
	const readyAdventurers = []
	for (let i = 0; i < allAdventurers.length; i++) {
		const blockTimestamp = (await provider.getBlock()).timestamp
		let adventurersLog = await mainContract.adventurers_log(allAdventurers[i])
		if (blockTimestamp > adventurersLog.toNumber()) {
			readyAdventurers.push(allAdventurers[i])
		}
	}
	// send ready adventurers for adventure + increasing gas price +10%
	if (readyAdventurers.length > 0) {
		for (let i = 0; i < readyAdventurers.length; i++) {
			let providerGasPrice = await provider.getGasPrice()
			providerGasPrice = providerGasPrice * 1.1
			let options = { gasPrice: Math.round(providerGasPrice) }
			await mainContract.adventure(readyAdventurers[i], options)
		}
		return `Found ${allAdventurers.length} adventurers... \n${readyAdventurers.length} eligible adventurers were sent to farm XP.`
	}

	return 'No eligible adventurers were found.'
}

module.exports = { sendXpQuest }
