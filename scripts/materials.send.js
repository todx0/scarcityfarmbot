const ethers = require('ethers')
const mainAbi = require('../abi/main.abi.json')
const materialsAbi = require('../abi/materials.abi.json')
const config = require('../config.js')

require('dotenv').config()
//
;(async () => {
	const provider = new ethers.providers.JsonRpcProvider(
		`https://polygon-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_POLYGON_API_KEY}`
	)
	const privateKey = process.env.PRIVATE_KEY
	const wallet = new ethers.Wallet(privateKey, provider)
	const mainContractAddress = config.contracts.main
	const materialsContractAddress = config.contracts.materials
	const mainContract = new ethers.Contract(mainContractAddress, mainAbi, wallet)
	const materialsContract = new ethers.Contract(materialsContractAddress, materialsAbi, wallet)
	const callAdventurerBalance = await mainContract.balanceOf(wallet.address)
	const adventurerNumber = callAdventurerBalance.toNumber()

	// count how many adventurers are in account
	const allAdventurers = []
	for (let i = 0; i < adventurerNumber; i++) {
		const adventurerId = await mainContract.tokenOfOwnerByIndex(wallet.address, i)
		allAdventurers.push(adventurerId.toNumber())
	}
	console.log(allAdventurers)

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

	// for loop to send each adventurer to adventure
	for (let i = 0; i < readyAdventurers.length; i++) {
		await materialsContract.adventure(readyAdventurers[i])
	}
})().catch((err) => {
	console.error(err)
})
