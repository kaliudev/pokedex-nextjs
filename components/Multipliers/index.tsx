import { Type } from '@/@types/pokemonInfo'
import { getClassEffectiveness, getMultipliers, MultipliersType } from '@/utils'
import { useEffect, useState } from 'react'
import styles from './Multipliers.module.css'

function GetFraction({ number }: { number: number }) {
	if (number === 0.2) {
		return <>&frac15;</>
	} else if (number === 0.25) {
		return <>&frac14;</>
	} else if (number === 0.5) {
		return <>&frac12;</>
	} else {
		return <span>{`${number}x`}</span>
	}
}

export const Multipliers = ({ pokemonTypes }: { pokemonTypes: Type[] }) => {
	const [multipliers, setMultipliers] = useState<MultipliersType>({})
	useEffect(() => {
		const loadData = async () => {
			const data = await getMultipliers(pokemonTypes)
			setMultipliers(data)
		}
		loadData()
	}, [pokemonTypes])
	return (
		<div className={styles.pokemon_multipliers}>
			{Object.keys(multipliers).map((name, index) => {
				return (
					<div className={styles.pokemon_multiplier} key={index}>
						<div className={`${styles.pokemon_damage_type} ${name}`}>
							{name.slice(0, 3)}
							<div className={styles.pokemon_damage_type_tooltip}>{name}</div>
						</div>
						<div
							className={`${
								styles.pokemon_damage_number
							} ${getClassEffectiveness(multipliers[name])}`}
						>
							<GetFraction number={multipliers[name]} />
						</div>
					</div>
				)
			})}
		</div>
	)
}
