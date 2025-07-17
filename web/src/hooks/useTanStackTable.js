import { getCoreRowModel, useReactTable } from '@tanstack/react-table'

export default function useTanStackTable({ columnDefs, data, options }) {
  const table = useReactTable({
    columns: columnDefs,
    data,
    getCoreRowModel: getCoreRowModel(),
    ...options,
  })

  return table
}
