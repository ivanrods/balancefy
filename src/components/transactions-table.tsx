"use client";

import * as React from "react";
import { useTransactions } from "@/hooks/use-transactions";
import { Transaction } from "@/types/transaction";
import { type UseMutationResult } from "@tanstack/react-query";

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
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EditTransactionDialog } from "@/app/app/transactions/components/edit-transaction-dialog";
import { toast } from "sonner";

import { usePeriod } from "@/context/period-context";
import { useCurrency } from "@/context/currency-context";
import { formatCurrency } from "@/utils/format-currency";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "@/hooks/use-translation";

export const columns = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  deleteTransaction: UseMutationResult<any, Error, string, unknown>,
  currency: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: (key: string, params?: any) => string,
  locale: string = "pt-BR"
): ColumnDef<Transaction>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label={t("table.selectAll")}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label={t("table.selectRow")}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "description",
    header: t("table.description"),
    cell: ({ row }) => <div>{row.getValue("description")}</div>,
  },
  {
    accessorKey: "wallet.name",
    header: t("table.wallet"),
    cell: ({ row }) => (
      <div className="capitalize">{row.original.wallet?.name ?? "—"}</div>
    ),
  },
  {
    accessorKey: "category.name",
    header: t("table.category"),
    cell: ({ row }) => (
      <div className="capitalize">{row.original.category?.name ?? "—"}</div>
    ),
  },
  {
    accessorKey: "type",
    header: t("table.type"),
    cell: ({ row }) => {
      const type = row.getValue("type") as string;

      const label =
        type === "income"
          ? t("table.typeIncome")
          : type === "expense"
          ? t("table.typeExpense")
          : t("table.typeUnknown");

      return (
        <span
          className={
            type === "income"
              ? "text-chart-2 font-medium"
              : "text-destructive font-medium"
          }
        >
          {label}
        </span>
      );
    },
  },
  {
    accessorKey: "value",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        {t("table.value")}
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const valor = parseFloat(row.getValue("value"));
      const formatted = formatCurrency(valor, currency);

      return <div className="font-medium px-4">{formatted}</div>;
    },
  },
  {
    accessorKey: "date",
    header: t("table.date"),
    cell: ({ row }) => {
      const date = new Date(row.getValue("date"));
      return (
        <div>
          {date.toLocaleDateString(locale, {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const transaction = row.original;

      function handleDeleteTransaction() {
        deleteTransaction.mutate(transaction.id, {
          onSuccess: () => {
            toast.success(t("table.deleteSuccess"));
          },
          onError: () => {
            toast.error(t("table.deleteError"));
          },
        });
      }

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">{t("table.openMenu")}</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{t("table.actions")}</DropdownMenuLabel>

            <DropdownMenuItem
              onClick={() =>
                navigator.clipboard.writeText(transaction.id.toString())
              }
            >
              {t("table.copyId")}
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() =>
                navigator.clipboard.writeText(transaction.description)
              }
            >
              {t("table.copyDescription")}
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <EditTransactionDialog transaction={transaction} />

            <DropdownMenuItem
              className="text-red-600"
              onClick={handleDeleteTransaction}
            >
              {t("table.deleteTransaction")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export function TransactionsTable() {
  const { t, locale } = useTranslation();
  const { mode, selectedMonth } = usePeriod();
  const { currency } = useCurrency();
  const now = new Date();
  const year = now.getFullYear();

  const { transactions, deleteTransaction, isLoading } = useTransactions(
    mode === "month" ? { month: selectedMonth, year } : undefined
  );

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable<Transaction>({
    data: transactions ?? [],
    columns: columns(deleteTransaction, currency, t, locale),
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
    return <Skeleton className="h-96 w-full rounded-xl animate-pulse" />;
  }

  return (
    <div className="w-full">
      <div className="flex items-center py-4 gap-2">
        <Input
          placeholder={t("table.filterDescription")}
          value={
            (table.getColumn("description")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("description")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              {t("table.columns")} <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="overflow-hidden rounded-md border">
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
                  );
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
                  {t("table.noTransactions")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          {t("table.rowsSelected", {
            count: table.getFilteredSelectedRowModel().rows.length,
            total: table.getFilteredRowModel().rows.length,
          })}
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {t("table.previous")}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {t("table.next")}
          </Button>
        </div>
      </div>
    </div>
  );
}
