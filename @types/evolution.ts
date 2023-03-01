export interface ChainType{
	chain_url: string
	from_id: number
	from_name: string
	from_sprite: string,
	error?: any
}

export interface EvolvesFrom extends ChainType {
	min_level: number | null
	trigger: string
	item: string
	held_item: string
}
