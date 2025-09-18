"use client"

import * as React from "react"
import {
	ColumnDef,
	ColumnFiltersState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	SortingState,
	useReactTable,
	VisibilityState,
} from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import { useUser } from "@clerk/nextjs"
import { getConversationsById } from "../actions/conversations"

import { Skeleton } from "@/components/ui/skeleton"


export type Conversation = {
	id: string,
	lastUpdate: string,
	title: string,
	user_id?: string,
}

const LoadingSkeleton = () => {
	return (
		<div className="w-full p-4">
			<Skeleton className="h-8 w-full mb-2 bg-primary" />
			<Skeleton className="h-8 w-full mb-2 bg-primary" />
			<Skeleton className="h-8 w-full mb-2 bg-primary" />
			<Skeleton className="h-8 w-full mb-2 bg-primary" />
			<Skeleton className="h-8 w-full mb-2 bg-primary" />
			<Skeleton className="h-8 w-full mb-2 bg-primary" />
			<Skeleton className="h-8 w-full mb-2 bg-primary" />
		</div>
	)
}

export const columns: ColumnDef<Conversation>[] = [
	{
		accessorKey: "id",
		header: "ID",

	},
	{
		accessorKey: "lastUpdate",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Dernier message
					<ArrowUpDown className="ml-2 h-4 w-3" />
				</Button>
			)
		},
	},
	{
		accessorKey: "title",
		header: "Titre",
	},
	{
		header: 'Voir',
		cell: ({ row }) => (
			<Button variant="link" size="sm" onClick={() => {
				//redirect to /discussion/[id]
				window.location.href = `/conversation/${row.original.id}`;
			}}>
				Ouvrir
			</Button>
		),
	}
]

export function DiscussionsTable() {
	const [sorting, setSorting] = React.useState<SortingState>([])
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[]
	)
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({})
	const [rowSelection, setRowSelection] = React.useState({})
	const [data, setData] = React.useState<any[]>([])
	const [loading, setLoading] = React.useState(true)

	const { user } = useUser();

	React.useEffect(() => {
		//fetch data from /api/conversations
		if (user) {
			getConversationsById(user.id).then((convs) => {
				setData(convs);
				setLoading(false);
			});
		}
	}, [user])

	const table = useReactTable({
		data,
		columns,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
		},
	})

	return (
		<div className="w-full">
			<div className="flex items-center py-4">
				<Input
					placeholder="Filtrer les conversations..."
					value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
					onChange={(event) =>
						table.getColumn("title")?.setFilterValue(event.target.value)
					}
					className="max-w-sm"
				/>

			</div>
			<div>
				<p>Vous avez {data.length} conversation{data.length > 1 ? 's' : ''}.</p>
			</div>
			<div className="overflow-hidden rounded-md border">
				{
					loading ? <LoadingSkeleton /> : <>
						<Table>
							<TableHeader>
								{table.getHeaderGroups().map((headerGroup) => (
									<TableRow key={headerGroup.id}>
										{headerGroup.headers.map((header) => {
											return (
												<TableHead key={header.id}>
													{header.isPlaceholder
														? null
														: flexRender(
															header.column.columnDef.header,
															header.getContext()
														)}
												</TableHead>
											)
										})}
									</TableRow>
								))}
							</TableHeader>
							<TableBody>
								{table.getRowModel().rows?.length ? (
									table.getRowModel().rows.map((row) => (
										<TableRow
											key={row.id}
											data-state={row.getIsSelected() && "selected"}
										>
											{row.getVisibleCells().map((cell) => (
												<TableCell key={cell.id}>
													{flexRender(
														cell.column.columnDef.cell,
														cell.getContext()
													)}
												</TableCell>
											))}
										</TableRow>
									))
								) : (
									<TableRow>
										<TableCell
											colSpan={columns.length}
											className="h-24 text-center"
										>
											Aucun résultat.
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</>
				}

			</div>
			<div className="flex items-center justify-end space-x-2 py-4">

				<div className="space-x-2">
					<Button
						variant="outline"
						size="sm"
						onClick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}
					>
						Précédent
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={() => table.nextPage()}
						disabled={!table.getCanNextPage()}
					>
						Suivant
					</Button>
				</div>
			</div>
		</div>
	)
}
