const ethers = require('ethers')
const mainAbi = require('../abi/main-abi.json')
const config = require('../config.js')
const fs = require('fs')
const path = require('path')
require('dotenv').config()
//
const provider = new ethers.providers.JsonRpcProvider(
	`https://polygon-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_POLYGON_API_KEY}`
)
const privateKey = process.env.PRIVATE_KEY
const wallet = new ethers.Wallet(privateKey, provider)
const mainContractAddress = config.contracts.main
const mainContract = new ethers.Contract(mainContractAddress, mainAbi, wallet)
const filePath = path.join(__dirname, 'adventurer-id.json')

//
const countAdventurers = async () => {
	const callAdventurerBalance = await mainContract.balanceOf(wallet.address)
	const adventurerNumber = callAdventurerBalance.toNumber()

	// checks if json file exists
	fs.unlink(filePath, (err) => {})
	fs.closeSync(fs.openSync(filePath, 'a'))
	let allAdventurers = []
	// if json is empty –– queries the block to get adventurers data
	console.log('Querying the blockchain for all adventurers...')
	for (let i = 0; i < adventurerNumber; i++) {
		const adventurerId = await mainContract.tokenOfOwnerByIndex(wallet.address, i)
		allAdventurers.push(adventurerId.toNumber())
	}
	fs.writeFile(filePath, JSON.stringify({ allAdventurers }), (err) => {
		err ? console.log(err) : console.log('adventurer-id.json file updated.')
	})

	return `Finished counting adventurers. ${adventurerNumber} adventurers found.`
}

const retrieveAdventurers = async () => {
	try {
		let allAdventurers = []
		const adventurersJson = fs.readFileSync(filePath, 'utf8', (err, data) => {})
		console.log('Retrieving data from json file...')
		const parsedJson = JSON.parse(adventurersJson)
		allAdventurers = parsedJson.allAdventurers
		return allAdventurers
	} catch (err) {
		return 'adventurer-id.json file not found. Please run "count" command first.'
	}
}

module.exports = {
	retrieveAdventurers,
	countAdventurers,
}
