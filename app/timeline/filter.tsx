"use client"

import { useAtom } from "jotai"
import { useHydrateAtoms } from "jotai/utils"

import { Checkbox } from "@/components/ui/checkbox"
import { capitalize } from "@/lib/utils"

import { selectedTypeAtom } from "./state"

export default function TimelineFilter({
	filters: filtersFromServer,
}: {
	filters: string[]
}) {
	useHydrateAtoms([[selectedTypeAtom, filtersFromServer] as const])
	const [selectedType, setSelectedType] = useAtom(selectedTypeAtom)

	return (
		<div className="mx-auto my-10 flex max-w-2xl flex-wrap gap-4">
			{filtersFromServer.map((filter) => (
				<div className="flex items-center gap-2" key={filter}>
					<Checkbox
						checked={selectedType.includes(filter)}
						onCheckedChange={(checked) => {
							if (checked) {
								setSelectedType((prev) => [...prev, filter])
							} else {
								setSelectedType((prev) =>
									prev.filter((prevFilter) => prevFilter !== filter)
								)
							}
						}}
					/>
					<label className="text-sm font-medium leading-none">
						{capitalize(filter)}
					</label>
				</div>
			))}
		</div>
	)
}
