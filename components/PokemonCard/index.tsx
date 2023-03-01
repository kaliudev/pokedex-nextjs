import { Pokemon } from '@/@types'
import { useAppContext } from '@/contexts/appContext'
import Image from 'next/image'
import styles from './PokemonCard.module.css'

export const PokemonCard = ({ pokemon }: { pokemon: Pokemon }) => {
	const { setActivePokemon, activePokemon, setColapsed, isMobile } =
		useAppContext()
	const handleClickCard = () => {
		setActivePokemon(pokemon.name)
		if (isMobile) {
			setColapsed(true)
		} else {
			setColapsed(false)
		}
	}
	return (
		<div
			key={pokemon.id}
			className={`${styles.pokemon_card} ${
				activePokemon === pokemon.name ? styles.enabled : styles.disabled
			}`}
			onClick={() => {
				handleClickCard()
			}}
		>
			<div className={styles.pokemon_number}>
				<span>{pokemon.id}</span>
			</div>
			<div className={styles.pokemon_image}>
				<Image
					src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`}
					alt={pokemon.name}
					width={100}
					height={100}
					placeholder="blur"
					blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mOMrAcAATcA2mMRmZgAAAAASUVORK5CYII="
				/>
			</div>
			<div className={styles.pokemon_name}>{pokemon.name}</div>
			<div className={styles.pokemon_types}>
				{pokemon.types.map((type) => {
					return (
						<div
							key={type.slot}
							className={`${styles.pokemon_type} ${type.name}`}
						>
							<p>{type.name.slice(0, 3)}</p>
						</div>
					)
				})}
			</div>
		</div>
	)
}
