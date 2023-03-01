import { SetStateAction } from "react"

export interface AppContextType {
	pokemons: Pokemon[],
	setPokemons: React.Dispatch<SetStateAction<Pokemon[]>>,
	loading: boolean,
	setLoading: React.Dispatch<SetStateAction<boolean>>,
	search: string | undefined,
	setSearch: React.Dispatch<SetStateAction<string | undefined>>,
	activePokemon: string,
	setActivePokemon: React.Dispatch<SetStateAction<string>>,
	colapsed: boolean,
	setColapsed: React.Dispatch<SetStateAction<boolean>>,
	isMobile: boolean,
	setIsMobile: React.Dispatch<SetStateAction<boolean>>,
}
export interface Pokemon {
	name: string,
	id: number,
	types: Types[]
}

export interface Types{
	slot: number,
	name: string
}

export interface PokeApiPokemons {
	count: number,
	next: string,
	previous: string,
	results: PokeApiPokemonsResults[]
}

export interface PokeApiPokemonsResults{
	name: string,
	url: string
}

export interface PokeApiType{
	slot: number,
	type: {
		name: string,
		url: string
	}
}
