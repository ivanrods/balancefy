"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
} from "@tanstack/react-table";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  ArrowUpDown,
  ChevronDown,
  MoreHorizontal,
  ArrowLeftRight,
  Circle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { DeleteCategoriesDialog } from "./delete-categories-dialog";
import { EditCategoriesDialog } from "./edit-categories-dialog";
import { useCategories } from "@/hooks/use-categories";
import { usePeriod } from "@/context/period-context";
import { formatCurrency } from "@/utils/format-currency";
import { Skeleton } from "@/components/ui/skeleton";

// Tipagem da categoria
export type Category = {
  id: string;
  name: string;
  color: string;
  value: number;
  number: number;
  relationship: string[];
};

// Definição das colunas
export const columns: ColumnDef<Category>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Nome
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <span>{row.original.name}</span>,
  },
  {
    id: "transactions",
    header: "Transações",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <ArrowLeftRight size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="start">
          <DropdownMenuLabel>Transações relacionadas</DropdownMenuLabel>
          {row.original.relationship.length ? (
            row.original.relationship.map((t, i) => (
              <DropdownMenuItem key={i}>{t}</DropdownMenuItem>
            ))
          ) : (
            <DropdownMenuItem disabled>Nenhuma</DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
  {
    accessorKey: "color",
    header: "Cor",
    cell: ({ row }) => (
      <Circle color={row.original.color} fill={row.original.color} />
    ),
    enableSorting: false,
  },
  {
    accessorKey: "value",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Valor
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <span>{formatCurrency(row.original.value)}</span>,
  },
  {
    accessorKey: "number",
    header: "Quantidade",
    cell: ({ row }) => <span>{row.original.number}</span>,
  },
  {
    id: "actions",
    enableHiding: false,
    header: "Ações",
    cell: ({ row }) => {
      const cat = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Ações</DropdownMenuLabel>
            <EditCategoriesDialog categories={cat} />
            <DeleteCategoriesDialog id={cat.id} />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export function CategoriesDataTable() {
  const { mode } = usePeriod();
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const { categories, isLoading } = useCategories(
    mode === "month" ? { month, year } : undefined
  );

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data: categories,
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
  });

  if (isLoading) {
    return <Skeleton className="w-full h-96 rounded-xl animate-pulse" />;
  }

  return (
    <div className="w-full">
      {/* Barra de filtro e controle de colunas */}
      <div className="flex items-center py-4 gap-2">
        <Input
          placeholder="Filtrar por nome..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Colunas <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Tabela */}
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
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
                  Nenhum resultado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginação */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredRowModel().rows.length} categoria(s)
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Próxima
          </Button>
        </div>
      </div>
    </div>
  );
}
