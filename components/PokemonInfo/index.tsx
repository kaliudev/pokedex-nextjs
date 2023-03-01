import { PokemonInfoType, Stat } from '@/@types/pokemonInfo'
import { PokemonSpecieType } from '@/@types/pokemonSpecie'
import { useAppContext } from '@/contexts/appContext'
import { api } from '@/services/api'
import {
	escapeString,
	getClassFillName,
	getFlavorText,
	getStatWidth,
} from '@/utils'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { EvolvesFrom } from '../EvolvesFrom'
import { Loading } from '../Loading'
import { Multipliers } from '../Multipliers'
import styles from './PokemonInfo.module.css'
export const PokemonInfo = () => {
	const [pokemon, setPokemon] = useState<PokemonInfoType>()
	const [pokemonSpecie, setPokemonSpecie] = useState<PokemonSpecieType>()
	const { activePokemon, loading } = useAppContext()
	const ref = useRef<HTMLDivElement>(null)
	useEffect(() => {
		async function loadData() {
			const { data } = await api.get<PokemonInfoType>(
				`/pokemon/${activePokemon}`
			)
			const { data: species } = await api.get<PokemonSpecieType>(
				`/pokemon-species/${data.species.name}`
			)
			setPokemon(data)
			setPokemonSpecie(species)
		}
		loadData()
	}, [activePokemon])
	const myLoader = () => {
		return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png?w=${100}&q=${75}`
	}
	if (!loading && pokemon && pokemonSpecie) {
		return (
			<section className={styles.pokemon_info} ref={ref}>
				<div className={styles.pokemon_info_content}>
					<div className={styles.pokemon_info_header}>
						<div className={styles.pokemon_image}>
							<Image
								loader={myLoader}
								src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`}
								alt={pokemon.name}
								width={300}
								height={300}
								loading="lazy"
							/>
						</div>
						<div className={styles.pokemon_info_header_content}>
							<div className={styles.pokemon_name}>
								<span>{pokemon.id}</span>
								<h1>{pokemon.name}</h1>
							</div>
							<div className={styles.pokemon_types}>
								{pokemon.types.map((type) => {
									return (
										<div
											key={type.slot}
											className={`${styles.pokemon_type} ${type.type.name}`}
										>
											<p>{type.type.name}</p>
										</div>
									)
								})}
							</div>
							<div className={styles.pokemon_flavor_text}>
								<p>
									{escapeString(
										getFlavorText(pokemonSpecie.flavor_text_entries, 'en')
									)}
								</p>
							</div>
							<div className={styles.pokemon_meta_info}>
								<div>Weight: {pokemon.weight / 10} kg</div>
								<div>Height: {pokemon.height / 10} m</div>
								<div>
									<span className={styles.genders_info}>
										<Image
											src="/images/icons/male.png"
											alt="Male"
											width={16}
											height={16}
										/>
										<strong>
											{100 - 100 * (pokemonSpecie.gender_rate / 8)}%
										</strong>
										<Image
											src="/images/icons/female.png"
											alt="Female"
											width={16}
											height={16}
										/>
										<strong>{100 * (pokemonSpecie.gender_rate / 8)}%</strong>
									</span>
								</div>
							</div>
						</div>
					</div>
					<div className={styles.pokemon_content_grid}>
						<div className={styles.pokemon_content_card}>
							<div className={styles.content_card_title}>
								<h2>Base stats</h2>
							</div>
							<div className={styles.pokemon_stats}>
								{pokemon.stats.map((stat: Stat, i) => {
									return (
										<div key={i} className={styles.stat}>
											<div className={styles.stat_header}>
												<span>{stat.stat.name}</span>
											</div>
											<div className={styles.stat_bar}>
												<span>{stat.base_stat}</span>
												<div className={styles.stat_bar_container}>
													<div
														className={`${
															styles.stat_bar_fill
														} ${getClassFillName(stat.base_stat)}`}
														style={{
															width: `${getStatWidth(stat.base_stat)}%`,
														}}
													></div>
												</div>
												<span>255</span>
											</div>
										</div>
									)
								})}
							</div>
						</div>
						<div className={styles.pokemon_content_card}>
							<div className={styles.content_card_title}>
								<h2>Type defenses</h2>
							</div>
							<div className={styles.content_card_description}>
								<p>
									The effectiveness of each type on{' '}
									<strong>{pokemon.name}</strong>
								</p>
							</div>
							<Multipliers pokemonTypes={pokemon.types} />
						</div>
					</div>
					{pokemonSpecie.evolves_from_species ? (
						<>
							<div className={styles.pokemon_content_card}>
								<h2>
									Evolves from
									<strong> {pokemonSpecie.evolves_from_species?.name}</strong>
								</h2>
							</div>
							<EvolvesFrom
								url={pokemonSpecie.evolves_from_species?.url}
								name={pokemon.name}
								divRef={ref}
							/>
						</>
					) : null}
				</div>
			</section>
		)
	} else {
		return <Loading />
	}
}
