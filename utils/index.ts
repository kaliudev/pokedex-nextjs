import { Type } from '@/@types/pokemonInfo';
import damageTypes from '@/data/damageTypes.json';
import { api } from '@/services/api';
import axios from 'axios';
import { ChainType, EvolvesFrom } from './../@types/evolution';
import { FlavorTextEntry } from './../@types/pokemonSpecie';
interface TypeData {
  name: string;
  damage_relations: {
    double_damage_from: { name: string; url: string }[];
    double_damage_to: { name: string; url: string }[];
    half_damage_from: { name: string; url: string }[];
    half_damage_to: { name: string; url: string }[];
    no_damage_from: { name: string; url: string }[];
    no_damage_to: { name: string; url: string }[];
  }
}
export interface DamageTypes {
  double_damage_from: DoubleDamageFrom
  half_damage_from: HalfDamageFrom
  no_damage_from: NoDamageFrom
}

export interface DoubleDamageFrom {
  [key:string]: boolean
}

export interface HalfDamageFrom {
  [key:string]: boolean
}

export interface NoDamageFrom {
  [key:string]: boolean
}

export interface MultipliersType {
  [key: string]: number
}

export function escapeString(string: string): string {
	const regex = new RegExp('\\n|\\f|\\r', 'gm')
	const escapedString = string.replace(regex, ' ')
	return escapedString
}

export function getStatWidth(number: number): number{
	const width = (100 / 255) * number
	return width
}

export function getClassFillName(number: number):string {
	if(number < 43){
		return 'rank-1'
	}else if(number >= 43  &&  number < 86){
		return 'rank-2'
	}else if(number >= 86 && number < 129){
		return 'rank-3'
	}else if(number >= 129 && number < 172){
		return 'rank-4'
	}
	else if(number >= 172 && number < 215){
		return 'rank-5'
	}
	else{
		return 'rank-6'
	}
}

export function getFlavorText(flavor_entries: FlavorTextEntry[], lang: string): string {
	const text = flavor_entries.find(flavor => flavor.language.name === lang)
	if(text){
		return text.flavor_text
	}else{
		return ''
	}
}
async function getTypeData(name: string): Promise<TypeData>{
	const typeData = await api.get<TypeData>(`/type/${name}`)
	return typeData.data
}

export async function getDamages(types: Type[]){
	let damages : DamageTypes = {
		double_damage_from: {},
		half_damage_from: {},
		no_damage_from: {}
	}
	const defenses = await Promise.all(
		types.map(async (type: Type) => {
			const relation = await getTypeData(type.type.name)

			const double_damage_from = relation.damage_relations.double_damage_from.map(item => {return item.name})
			const half_damage_from = relation.damage_relations.half_damage_from.map(item => {return item.name})
			const no_damage_from = relation.damage_relations.no_damage_from.map(item => {return item.name})

			return {
				double_damage_from,
				half_damage_from,
				no_damage_from,
			}
		})
	)

	damageTypes.forEach(type => {
		defenses.forEach(defense => {
			if(defense.double_damage_from.some(d => d === type.name)){
				damages.double_damage_from[type.name] = true 
			}
			if(defense.half_damage_from.some(d => d === type.name)){
				damages.half_damage_from[type.name] = true
			}
			if(defense.no_damage_from.some(d => d === type.name)){
				damages.no_damage_from[type.name] = true
			}
		})
	})

	return damages
}


export async function getMultipliers(types: Type[]){
	let multipliers: MultipliersType = {}
	const damages = await getDamages(types)
	
	damageTypes.forEach(type => {
		multipliers[type.name] = 1
		if(damages.double_damage_from[type.name]){
			multipliers[type.name] = 2
		}
		if(damages.half_damage_from[type.name]){
			multipliers[type.name] = 0.5
		}
		if(damages.no_damage_from[type.name]){
			multipliers[type.name] = 0
		}
	})

	return multipliers
}


export function getClassEffectiveness (number: number):string {
	if(number === 1){
		return 'normal-damage'
	}
	if(number < 1 && number > 0){
		return 'not-very-effective'
	}
	if(number <= 0){
		return 'no-effect'
	}
	return 'super-effective'
}

export async function getUrlChainUrl(url?: string){
	let urlChain: ChainType | any = {}
	if(url){
		try {
			const { data } = await axios.get(url)
			urlChain = {
				chain_url: data.evolution_chain.url,
				from_name: data.name,
				from_id: data.id,
				from_sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${data.id}.png`
			}
		}catch(error){
			urlChain = {
				error
			}
		}
	}
	return urlChain
}
export async function getEvolvesFrom(name: string, url?: string ){
	let evolves_from: EvolvesFrom[] = []
	const chainUrl: ChainType = await getUrlChainUrl(url)
	const { data } = await axios.get(chainUrl.chain_url)
	
	let currentEvolution = data.chain
	
	while (currentEvolution) {
		currentEvolution.evolves_to.forEach((element:any) => {
			if(element.species.name === name){
				evolves_from.push({
					min_level: element?.evolution_details[0]?.min_level,
					trigger: element?.evolution_details[0]?.trigger?.name,
					item: element?.evolution_details[0]?.item?.name,
					held_item: element?.evolution_details[0]?.held_item?.name,
					...chainUrl
				})
			}
			if(element.species.name !== 'basculin'){
				evolves_from.push({
					min_level: element?.evolution_details[0]?.min_level,
					trigger: element?.evolution_details[0]?.trigger?.name,
					item: element?.evolution_details[0]?.item?.name,
					held_item: element?.evolution_details[0]?.held_item?.name,
					...chainUrl
				})
			}
		})
		currentEvolution = currentEvolution.evolves_to[0]		
	}		
	
	
	return evolves_from
}
