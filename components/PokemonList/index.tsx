import { useAppContext } from '@/contexts/appContext'
import { useState } from 'react'
import { PokemonCard } from '../PokemonCard'
import styles from './PokemonList.module.css'

export const PokemonList = () => {
	const { search, pokemons } = useAppContext()
	const [offset, setOffset] = useState<number>(20)
	if (search === undefined || search === '') {
		return (
			<div className={styles.pokemon_list}>
				{pokemons.slice(0, offset).map((pokemon) => {
					return <PokemonCard key={pokemon.id} pokemon={pokemon} />
				})}
				{pokemons.slice(0, offset).length === 1008 ? null : (
					<button onClick={() => setOffset(offset + 20)}>Load more...</button>
				)}
			</div>
		)
	} else {
		return (
			<div className={styles.pokemon_list}>
				{pokemons
					.filter((item) => item.name.includes(search.toLocaleLowerCase()))
					.slice(0, offset)
					.map((pokemon) => {
						return <PokemonCard key={pokemon.id} pokemon={pokemon} />
					})}
				{pokemons.filter((item) =>
					item.name.includes(search.toLocaleLowerCase())
				).length <= offset ? null : (
					<button onClick={() => setOffset(offset + 20)}>
						{
							pokemons.filter((item) =>
								item.name.includes(search.toLocaleLowerCase())
							).length
						}
					</button>
				)}
			</div>
		)
	}
}
