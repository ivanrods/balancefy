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

import { ArrowUpDown, ChevronDown, MoreHorizontal, ArrowLeftRight, Circle } from "lucide-react";

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
import { useCategoriesQuery } from "@/hooks/use-categories";
import { usePeriod } from "@/context/period-context";
import { useCurrency } from "@/context/currency-context";
import { formatCurrency } from "@/utils/format-currency";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "@/hooks/use-translation";
import type { Categories } from "@/types/categories";

const columns = (
  currency: string,
  t: (key: string, params?: Record<string, string | number>) => string,
): ColumnDef<Categories>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        {t("categories.name")}
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <span>{row.original.name}</span>,
  },
  {
    id: "transactions",
    header: t("categories.transactions"),
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <ArrowLeftRight size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="start">
          <DropdownMenuLabel>{t("categories.relatedTransactions")}</DropdownMenuLabel>
          {row.original.relationship.length ? (
            row.original.relationship.map((tr, i) => (
              <DropdownMenuItem key={i}>{tr}</DropdownMenuItem>
            ))
          ) : (
            <DropdownMenuItem disabled>{t("categories.none")}</DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
  {
    accessorKey: "color",
    header: t("categories.color"),
    cell: ({ row }) => <Circle color={row.original.color} fill={row.original.color} />,
    enableSorting: false,
  },
  {
    accessorKey: "value",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        {t("categories.value")}
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <span className="px-4">{formatCurrency(row.original.value, currency)}</span>,
  },
  {
    accessorKey: "number",
    header: t("categories.quantity"),
    cell: ({ row }) => <span>{row.original.number}</span>,
  },
  {
    id: "actions",
    enableHiding: false,
    header: t("categories.actions"),
    cell: ({ row }) => {
      const cat = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">{t("categories.actions")}</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{t("categories.actions")}</DropdownMenuLabel>
            <EditCategoriesDialog categories={cat} />
            <DeleteCategoriesDialog id={cat.id} />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

type CategoriesDataTableProps = {
  initialCategories?: Categories[];
};

export function CategoriesDataTable({ initialCategories }: CategoriesDataTableProps) {
  "use no memo";

  const { t } = useTranslation();
  const { mode, selectedMonth } = usePeriod();
  const { currency } = useCurrency();
  const year = new Date().getFullYear();

  const { data: categories, isLoading } = useCategoriesQuery(
    mode === "month" ? { month: selectedMonth, year } : undefined,
    initialCategories,
  );

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  // TanStack Table returns an API whose functions are intentionally not memoizable.
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: categories ?? [],
    columns: columns(currency, t),
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

  if (isLoading && !categories) {
    return <Skeleton className="w-full h-96 rounded-xl animate-pulse" />;
  }

  return (
    <div className="w-full">
      <div className="flex items-center py-4 gap-2">
        <Input
          placeholder={t("categories.filterName")}
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              {t("categories.columns")} <ChevronDown className="ml-2 h-4 w-4" />
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

      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
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
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  {t("categories.noResults")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          {t("categories.count", { count: table.getFilteredRowModel().rows.length })}
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {t("categories.previous")}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {t("categories.next")}
          </Button>
        </div>
      </div>
    </div>
  );
}
