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
	const crafterId = config.crafterId
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

	// count every adventurer with materials
	const usefullAdventurers = {}
	for (let i = 0; i < adventurerNumber; i++) {
		const getBalance = await materialsContract.balanceOf(allAdventurers[i])
		if (getBalance.toNumber() > 0 && allAdventurers[i] != crafterId) {
			usefullAdventurers[allAdventurers[i]] = getBalance.toNumber()
		}
	}
	console.log(usefullAdventurers)

	// send materials to crafting account
	for (var prop in usefullAdventurers) {
		await materialsContract.transfer(prop, crafterId, usefullAdventurers[prop])
	}
})().catch((err) => {
	console.error(err)
})
