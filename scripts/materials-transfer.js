const ethers = require('ethers')
const mainAbi = require('../abi/main-abi.json')
const materialsAbi = require('../abi/materials-abi.json')
const config = require('../config.js')
const countAdventurers = require('./count-adventurers.js')
require('dotenv').config()
//
const transferMaterials = async () => {
	const provider = new ethers.providers.JsonRpcProvider(
		`https://polygon-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_POLYGON_API_KEY}`
	)
	const privateKey = process.env.PRIVATE_KEY
	const crafterId = process.env.CRAFTER_ID
	const wallet = new ethers.Wallet(privateKey, provider)
	const mainContractAddress = config.contracts.main
	const materialsContractAddress = config.contracts.materials
	const mainContract = new ethers.Contract(mainContractAddress, mainAbi, wallet)
	const materialsContract = new ethers.Contract(materialsContractAddress, materialsAbi, wallet)
	const callAdventurerBalance = await mainContract.balanceOf(wallet.address)
	const adventurerNumber = callAdventurerBalance.toNumber()
	const allAdventurers = await countAdventurers.retrieveAdventurers()

	// count every adventurer with materials
	const usefullAdventurers = {}
	for (let i = 0; i < adventurerNumber; i++) {
		const getBalance = await materialsContract.balanceOf(allAdventurers[i])
		if (getBalance.toNumber() > 0 && allAdventurers[i] != crafterId) {
			usefullAdventurers[allAdventurers[i]] = getBalance.toNumber()
		}
	}
	console.log(usefullAdventurers)
	if (Object.keys(usefullAdventurers).length > 0) {
		// count total materials
		materials = []
		for (let prop in usefullAdventurers) {
			materials.push(usefullAdventurers[prop])
		}
		const totalMaterials = materials.reduce((a, b) => a + b, 0)

		// send materials to crafting account
		for (let prop in usefullAdventurers) {
			await materialsContract.transfer(prop, crafterId, usefullAdventurers[prop])
		}
		return `${
			Object.keys(usefullAdventurers).length
		} adventurers transfered ${totalMaterials} materials to crafter.`
	}
	return 'No materials available for transfer.'
}
module.exports = { transferMaterials }
