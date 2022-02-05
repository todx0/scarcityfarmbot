const ethers = require('ethers')
const abi = require('../abi/main.abi.json')

require('dotenv').config()
//
;(async () => {
	const provider = new ethers.providers.JsonRpcProvider(
		`https://polygon-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_POLYGON_API_KEY}`
	)
	const privateKey = process.env.PRIVATE_KEY
	const wallet = new ethers.Wallet(privateKey, provider)
	const contractAddress = config.contracts.main
	const contract = new ethers.Contract(contractAddress, abi, wallet)

	// write tx
	//
	// await contract.Function()

	const tx = await contract.summon(5)
	const res = await tx.wait()

	//let next = await contract.next_summoner()
	//console.log(ethers.BigNumber.from(next).toString())

	//  prints summoner id from event in hex
	// todo: convert hex to int
	console.log(res.logs[0].topics[3])
})().catch((err) => {
	console.error(err)
})
