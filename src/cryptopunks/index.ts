import {
	Account,
	Transfer,
	OrderBook
} from '../../generated/schema'

import {
	CryptoPunk,
	Assign as AssignEvent,
	PunkBidEntered as PunkBidEnteredEvent,
	PunkBidWithdrawn as PunkBidWithdrawnEvent,
	PunkBought as PunkBoughtEvent,
	PunkNoLongerForSale as PunkNoLongerForSaleEvent,
	PunkOffered as PunkOfferedEvent,
	PunkTransfer as PunkTransferEvent,
	Transfer as TransferEvent,
} from '../../generated/CryptoPunks/CryptoPunk'

import {
	fetchRegistry,
	fetchToken,
} from '../utils'

import {
	constants,
	events,
	transactions,
} from '@amxx/graphprotocol-utils'

export function handleAssign(event: AssignEvent): void {
	let registry = fetchRegistry(CryptoPunk.bind(event.address));
	let token = fetchToken(registry, event.params.punkIndex)
	let from = new Account(constants.ADDRESS_ZERO)
	let to = new Account(event.params.to.toHex())

	token.owner = to.id

	registry.save()
	token.save()
	from.save()
	to.save()

	let ev = new Transfer(events.id(event))
	ev.transaction = transactions.log(event).id
	ev.timestamp = event.block.timestamp
	ev.token = token.id
	ev.from = from.id
	ev.to = to.id
	ev.save()
}

export function handlePunkBidEntered(event: PunkBidEnteredEvent): void {
	let registry = fetchRegistry(CryptoPunk.bind(event.address));
	let token = fetchToken(registry, event.params.punkIndex)
	let from = new Account(event.params.fromAddress.toHex())
	let value = event.params.value

	let ob = new OrderBook(events.id(event))
	ob.transaction = transactions.log(event).id
	ob.timestamp = event.block.timestamp
	ob.token = token.id
	ob.type = 'BID'
	ob.from = from.id
	ob.price = value
	ob.save()
}

export function handlePunkBidWithdrawn(event: PunkBidWithdrawnEvent): void {
	let registry = fetchRegistry(CryptoPunk.bind(event.address));
	let token = fetchToken(registry, event.params.punkIndex)
	let from = new Account(event.params.fromAddress.toHex())
	let value = event.params.value

	let ob = new OrderBook(events.id(event))
	ob.transaction = transactions.log(event).id
	ob.timestamp = event.block.timestamp
	ob.token = token.id
	ob.type = 'CANCEL_BID'
	ob.from = from.id
	ob.price = value
	ob.save()
}

export function handlePunkBought(event: PunkBoughtEvent): void {
	let registry = fetchRegistry(CryptoPunk.bind(event.address));
	let token = fetchToken(registry, event.params.punkIndex)
	let from = new Account(event.params.fromAddress.toHex())
	let to = new Account(event.params.toAddress.toHex())
	let value = event.params.value

	let ob = new OrderBook(events.id(event))
	ob.transaction = transactions.log(event).id
	ob.timestamp = event.block.timestamp
	ob.token = token.id
	ob.type = 'SALE'
	ob.from = from.id
	ob.to = to.id
	ob.price = value
	ob.save()
}

export function handlePunkNoLongerForSale(event: PunkNoLongerForSaleEvent): void {
	let registry = fetchRegistry(CryptoPunk.bind(event.address));
	let token = fetchToken(registry, event.params.punkIndex)

	let ob = new OrderBook(events.id(event))
	ob.transaction = transactions.log(event).id
	ob.timestamp = event.block.timestamp
	ob.token = token.id
	ob.type = 'CANCEL_ASK'
	ob.save()
}

export function handlePunkOffered(event: PunkOfferedEvent): void {
	let registry = fetchRegistry(CryptoPunk.bind(event.address));
	let token = fetchToken(registry, event.params.punkIndex)
	let to = new Account(event.params.toAddress.toHex())
	let value = event.params.minValue

	let ob = new OrderBook(events.id(event))
	ob.transaction = transactions.log(event).id
	ob.timestamp = event.block.timestamp
	ob.token = token.id
	ob.type = 'ASK'
	ob.to = to.id
	ob.price = value
	ob.save()
}

export function handlePunkTransfer(event: PunkTransferEvent): void {
	let registry = fetchRegistry(CryptoPunk.bind(event.address));
	let token = fetchToken(registry, event.params.punkIndex)
	let from = new Account(event.params.from.toHex())
	let to = new Account(event.params.to.toHex())

	token.owner = to.id

	registry.save()
	token.save()
	from.save()
	to.save()

	let ev = new Transfer(events.id(event))
	ev.transaction = transactions.log(event).id
	ev.timestamp = event.block.timestamp
	ev.token = token.id
	ev.from = from.id
	ev.to = to.id
	ev.save()
}

export function handleTransfer(event: TransferEvent): void {
}
