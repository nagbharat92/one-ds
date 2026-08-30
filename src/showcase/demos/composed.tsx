import { useState, useMemo } from "react"
import {
  useTable,
  tableFeatures,
  createColumnHelper,
  columnFilteringFeature,
  columnVisibilityFeature,
  rowSortingFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  globalFilteringFeature,
  createFilteredRowModel,
  createSortedRowModel,
  createPaginatedRowModel,
  flexRender,
  type SortDirection,
  type ColumnDef,
} from "@tanstack/react-table"
import { parseDate } from "chrono-node"
import {
  ArrowUpDownIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  ColumnsIcon,
  MoreHorizontalIcon,
  SearchIcon,
} from "lucide-react"
import { format, isValid } from "date-fns"

import type { ComponentEntry } from "@/showcase/types"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoices,
  QuestionnaireDescription,
  QuestionnaireError,
  QuestionnaireInput,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireProgress,
  QuestionnaireSkip,
  QuestionnaireSubmit,
  QuestionnaireTitle,
} from "@/components/ui/questionnaire"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

// ---------------------------------------------------------------------------
// DATA TABLE
// ---------------------------------------------------------------------------

type Payment = {
  id: string
  amount: number
  status: "pending" | "processing" | "success" | "failed"
  email: string
  date: string
}

const payments: Payment[] = [
  { id: "pay-01", amount: 316.0, status: "success", email: "ken@example.com", date: "2024-01-15" },
  { id: "pay-02", amount: 242.0, status: "success", email: "abe@example.com", date: "2024-02-20" },
  { id: "pay-03", amount: 837.0, status: "processing", email: "monserrat@example.com", date: "2024-03-10" },
  { id: "pay-04", amount: 874.0, status: "success", email: "silas@example.com", date: "2024-04-05" },
  { id: "pay-05", amount: 721.0, status: "failed", email: "carmella@example.com", date: "2024-05-22" },
  { id: "pay-06", amount: 456.0, status: "pending", email: "janet@example.com", date: "2024-06-11" },
  { id: "pay-07", amount: 129.0, status: "success", email: "pedro@example.com", date: "2024-07-03" },
  { id: "pay-08", amount: 593.0, status: "processing", email: "lila@example.com", date: "2024-08-19" },
  { id: "pay-09", amount: 210.0, status: "pending", email: "omar@example.com", date: "2024-09-30" },
  { id: "pay-10", amount: 685.0, status: "failed", email: "rosa@example.com", date: "2024-10-14" },
  { id: "pay-11", amount: 320.0, status: "success", email: "nora@example.com", date: "2024-11-01" },
  { id: "pay-12", amount: 950.0, status: "pending", email: "dave@example.com", date: "2024-12-25" },
]

const dataTableFeatures = tableFeatures({
  rowSortingFeature,
  columnFilteringFeature,
  columnVisibilityFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  globalFilteringFeature,
  sortedRowModel: createSortedRowModel(),
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
})

const columnHelper = createColumnHelper<typeof dataTableFeatures, Payment>()

function StatusBadge({ status }: { status: Payment["status"] }) {
  const variant = status === "success"
    ? "default"
    : status === "failed"
      ? "destructive"
      : status === "processing"
        ? "secondary"
        : "outline"
  return <Badge variant={variant}>{status}</Badge>
}

function SortIcon({ direction }: { direction: false | SortDirection }) {
  if (direction === "asc") return <ArrowUpIcon className="ml-2 size-4" />
  if (direction === "desc") return <ArrowDownIcon className="ml-2 size-4" />
  return <ArrowUpDownIcon className="ml-2 size-4" />
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value)
}

const baseColumns = columnHelper.columns([
  columnHelper.accessor("id", { header: "Invoice", cell: (info) => info.getValue() }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: (info) => <StatusBadge status={info.getValue()} />,
  }),
  columnHelper.accessor("email", { header: "Email" }),
  columnHelper.accessor("amount", {
    header: () => <span className="text-right">Amount</span>,
    cell: (info) => <span className="text-right font-medium tabular-nums">{formatCurrency(info.getValue())}</span>,
  }),
  columnHelper.accessor("date", { header: "Date" }),
])

function BasicDataTable() {
  const table = useTable({
    features: dataTableFeatures,
    data: payments.slice(0, 5),
    columns: baseColumns,
  })

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead key={header.id}>
                {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.map((row) => (
          <TableRow key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

function CellFormattingDemo() {
  const cols = columnHelper.columns([
    columnHelper.accessor("id", { header: "Invoice" }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: (info) => <StatusBadge status={info.getValue()} />,
    }),
    columnHelper.accessor("email", {
      header: "Email",
      cell: (info) => <span className="lowercase">{info.getValue()}</span>,
    }),
    columnHelper.accessor("amount", {
      header: () => <span className="text-right">Amount</span>,
      cell: (info) => <span className="text-right font-medium tabular-nums">{formatCurrency(info.getValue())}</span>,
    }),
    columnHelper.accessor("date", {
      header: "Date",
      cell: (info) => {
        const date = new Date(info.getValue())
        return <span className="tabular-nums">{format(date, "MMM d, yyyy")}</span>
      },
    }),
  ])

  const table = useTable({
    features: dataTableFeatures,
    data: payments.slice(0, 5),
    columns: cols,
  })

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((hg) => (
          <TableRow key={hg.id}>
            {hg.headers.map((header) => (
              <TableHead key={header.id}>
                {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.map((row) => (
          <TableRow key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

function RowActionsDemo() {
  const [data, setData] = useState(payments.slice(0, 5))

  function updateStatus(rowId: string, newStatus: Payment["status"]) {
    setData((prev) =>
      prev.map((row) => (row.id === rowId ? { ...row, status: newStatus } : row))
    )
  }

  const cols = columnHelper.columns([
    columnHelper.accessor("id", { header: "Invoice" }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: (info) => <StatusBadge status={info.getValue()} />,
    }),
    columnHelper.accessor("email", { header: "Email" }),
    columnHelper.accessor("amount", {
      header: "Amount",
      cell: (info) => <span className="font-medium tabular-nums">{formatCurrency(info.getValue())}</span>,
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const payment = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Row actions">
                <MoreHorizontalIcon className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => updateStatus(payment.id, "success")}>
                Mark success
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => updateStatus(payment.id, "processing")}>
                Mark processing
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => updateStatus(payment.id, "failed")}>
                Mark failed
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => updateStatus(payment.id, "pending")}>
                Mark pending
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    }),
  ])

  const table = useTable({
    features: dataTableFeatures,
    data,
    columns: cols,
  })

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((hg) => (
          <TableRow key={hg.id}>
            {hg.headers.map((header) => (
              <TableHead key={header.id}>
                {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.map((row) => (
          <TableRow key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

function PaginationDemo() {
  const table = useTable(
    {
      features: dataTableFeatures,
      data: payments,
      columns: baseColumns,
      state: { pagination: { pageIndex: 0, pageSize: 5 } },
    },
    (state) => ({ pagination: state.pagination }),
  )

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((hg) => (
            <TableRow key={hg.id}>
              {hg.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Page {table.state.pagination.pageIndex + 1} of {table.getPageCount()}
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}

function SortingDemo() {
  const sortableCols = columnHelper.columns([
    columnHelper.accessor("id", { header: "Invoice" }),
    columnHelper.accessor("status", {
      header: ({ column }) => (
        <Button variant="ghost" className="-ml-4" onClick={() => column.toggleSorting()}>
          Status <SortIcon direction={column.getIsSorted()} />
        </Button>
      ),
      cell: (info) => <StatusBadge status={info.getValue()} />,
    }),
    columnHelper.accessor("email", {
      header: ({ column }) => (
        <Button variant="ghost" className="-ml-4" onClick={() => column.toggleSorting()}>
          Email <SortIcon direction={column.getIsSorted()} />
        </Button>
      ),
    }),
    columnHelper.accessor("amount", {
      header: ({ column }) => (
        <Button variant="ghost" className="-ml-4" onClick={() => column.toggleSorting()}>
          Amount <SortIcon direction={column.getIsSorted()} />
        </Button>
      ),
      cell: (info) => <span className="font-medium tabular-nums">{formatCurrency(info.getValue())}</span>,
    }),
  ])

  const table = useTable(
    {
      features: dataTableFeatures,
      data: payments.slice(0, 6),
      columns: sortableCols,
    },
    (state) => ({ sorting: state.sorting }),
  )

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((hg) => (
          <TableRow key={hg.id}>
            {hg.headers.map((header) => (
              <TableHead key={header.id}>
                {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.map((row) => (
          <TableRow key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

function FilteringDemo() {
  const [globalFilter, setGlobalFilter] = useState("")

  const table = useTable(
    {
      features: dataTableFeatures,
      data: payments,
      columns: baseColumns,
      state: { globalFilter },
      onGlobalFilterChange: setGlobalFilter,
    },
    (state) => ({ globalFilter: state.globalFilter }),
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <SearchIcon className="size-4 text-muted-foreground" />
        <Input
          placeholder="Filter payments..."
          value={globalFilter}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-sm"
        />
      </div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((hg) => (
            <TableRow key={hg.id}>
              {hg.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length ? (
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
              <TableCell colSpan={baseColumns.length} className="text-center text-muted-foreground">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <p className="text-sm text-muted-foreground">{table.getRowModel().rows.length} result(s)</p>
    </div>
  )
}

function VisibilityDemo() {
  const table = useTable(
    {
      features: dataTableFeatures,
      data: payments.slice(0, 5),
      columns: baseColumns,
    },
    (state) => ({ columnVisibility: state.columnVisibility }),
  )

  return (
    <div className="space-y-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <ColumnsIcon className="mr-2 size-4" /> Columns
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {table.getAllColumns().filter((col) => col.getCanHide()).map((col) => (
            <DropdownMenuCheckboxItem
              key={col.id}
              checked={col.getIsVisible()}
              onCheckedChange={(value) => col.toggleVisibility(!!value)}
            >
              {typeof col.columnDef.header === "string" ? col.columnDef.header : col.id}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((hg) => (
            <TableRow key={hg.id}>
              {hg.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function RowSelectionDemo() {
  const selectCols: ColumnDef<typeof dataTableFeatures, Payment, unknown>[] = [
    columnHelper.display({
      id: "select",
      header: ({ table: tbl }) => (
        <Checkbox
          checked={tbl.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => tbl.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label={`Select row ${row.id}`}
        />
      ),
    }),
    ...baseColumns,
  ]

  const table = useTable(
    {
      features: dataTableFeatures,
      data: payments.slice(0, 6),
      columns: selectCols,
    },
    (state) => ({ rowSelection: state.rowSelection }),
  )

  const selectedCount = Object.keys(table.state.rowSelection ?? {}).filter(
    (key) => table.state.rowSelection?.[key]
  ).length

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((hg) => (
            <TableRow key={hg.id}>
              {hg.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id} data-state={row.getIsSelected() ? "selected" : undefined}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <p className="text-sm text-muted-foreground">
        {selectedCount} of {payments.slice(0, 6).length} row(s) selected
      </p>
    </div>
  )
}

function ColumnHeaderDemo() {
  const headerCols = columnHelper.columns([
    columnHelper.accessor("email", {
      header: ({ column }) => (
        <Button variant="ghost" className="-ml-4" onClick={() => column.toggleSorting()}>
          Email <SortIcon direction={column.getIsSorted()} />
        </Button>
      ),
    }),
    columnHelper.accessor("amount", {
      header: ({ column }) => (
        <div className="text-right">
          <Button variant="ghost" onClick={() => column.toggleSorting()}>
            Amount <SortIcon direction={column.getIsSorted()} />
          </Button>
        </div>
      ),
      cell: (info) => <span className="text-right font-medium tabular-nums">{formatCurrency(info.getValue())}</span>,
    }),
    columnHelper.accessor("status", {
      header: ({ column }) => (
        <Button variant="ghost" className="-ml-4" onClick={() => column.toggleSorting()}>
          Status <SortIcon direction={column.getIsSorted()} />
        </Button>
      ),
      cell: (info) => <StatusBadge status={info.getValue()} />,
    }),
  ])

  const table = useTable(
    {
      features: dataTableFeatures,
      data: payments.slice(0, 5),
      columns: headerCols,
    },
    (state) => ({ sorting: state.sorting }),
  )

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((hg) => (
          <TableRow key={hg.id}>
            {hg.headers.map((header) => (
              <TableHead key={header.id}>
                {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.map((row) => (
          <TableRow key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

function TablePaginationDemo() {
  const table = useTable(
    {
      features: dataTableFeatures,
      data: payments,
      columns: baseColumns,
      state: { pagination: { pageIndex: 0, pageSize: 4 } },
    },
    (state) => ({ pagination: state.pagination }),
  )

  const pageCount = table.getPageCount()
  const currentPage = table.state.pagination.pageIndex

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((hg) => (
            <TableRow key={hg.id}>
              {hg.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground tabular-nums">
          Page {currentPage + 1} of {pageCount}
        </p>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon" onClick={() => table.firstPage()} disabled={!table.getCanPreviousPage()} aria-label="First page">
            <ChevronsLeftIcon className="size-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} aria-label="Previous page">
            <ChevronLeftIcon className="size-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} aria-label="Next page">
            <ChevronRightIcon className="size-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => table.lastPage()} disabled={!table.getCanNextPage()} aria-label="Last page">
            <ChevronsRightIcon className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

function ColumnToggleDemo() {
  const table = useTable(
    {
      features: dataTableFeatures,
      data: payments.slice(0, 4),
      columns: baseColumns,
    },
    (state) => ({ columnVisibility: state.columnVisibility }),
  )

  const toggleable = table.getAllColumns().filter((col) => col.getCanHide())

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {toggleable.map((col) => (
          <Button
            key={col.id}
            variant={col.getIsVisible() ? "default" : "outline"}
            size="sm"
            onClick={() => col.toggleVisibility()}
          >
            {col.id}
          </Button>
        ))}
      </div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((hg) => (
            <TableRow key={hg.id}>
              {hg.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

// ---------------------------------------------------------------------------
// DATE PICKER
// ---------------------------------------------------------------------------

function BasicDatePicker() {
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className={cn("w-60 justify-start text-left font-normal", !date && "text-muted-foreground")}>
          <CalendarIcon className="mr-2 size-4" />
          {date ? format(date, "PPP") : "Pick a date"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(day) => { setDate(day); setOpen(false) }}
        />
      </PopoverContent>
    </Popover>
  )
}

function RangePickerDemo() {
  const [range, setRange] = useState<{ from?: Date; to?: Date }>({})
  const [open, setOpen] = useState(false)

  const label = range.from
    ? range.to
      ? `${format(range.from, "LLL dd")} - ${format(range.to, "LLL dd, y")}`
      : format(range.from, "LLL dd, y")
    : "Pick a range"

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className={cn("w-72 justify-start text-left font-normal", !range.from && "text-muted-foreground")}>
          <CalendarIcon className="mr-2 size-4" />
          {label}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          selected={range.from ? { from: range.from, to: range.to } : undefined}
          onSelect={(val) => {
            if (val) setRange({ from: val.from, to: val.to })
          }}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  )
}

function PresetsDemo() {
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [open, setOpen] = useState(false)

  const [presets] = useState(() => {
    const today = new Date()
    const day = 24 * 60 * 60 * 1000
    return [
      { label: "Today", value: today },
      { label: "Tomorrow", value: new Date(today.getTime() + day) },
      { label: "In a week", value: new Date(today.getTime() + 7 * day) },
      { label: "In a month", value: new Date(today.getTime() + 30 * day) },
    ]
  })

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className={cn("w-60 justify-start text-left font-normal", !date && "text-muted-foreground")}>
          <CalendarIcon className="mr-2 size-4" />
          {date ? format(date, "PPP") : "Pick a date"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex w-auto gap-2 p-2" align="start">
        <div className="flex flex-col gap-1">
          {presets.map((preset) => (
            <Button
              key={preset.label}
              variant="ghost"
              size="sm"
              className="justify-start"
              onClick={() => { setDate(preset.value); setOpen(false) }}
            >
              {preset.label}
            </Button>
          ))}
        </div>
        <Calendar mode="single" selected={date} onSelect={(day) => { setDate(day); setOpen(false) }} />
      </PopoverContent>
    </Popover>
  )
}

function DateOfBirthDemo() {
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className={cn("w-60 justify-start text-left font-normal", !date && "text-muted-foreground")}>
          <CalendarIcon className="mr-2 size-4" />
          {date ? format(date, "PPP") : "Date of birth"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(day) => { setDate(day); setOpen(false) }}
          captionLayout="dropdown"
          startMonth={new Date(1920, 0)}
          endMonth={new Date()}
        />
      </PopoverContent>
    </Popover>
  )
}

function DateInputDemo() {
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [inputValue, setInputValue] = useState("")
  const [open, setOpen] = useState(false)

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const raw = event.target.value
    setInputValue(raw)
    const parsed = new Date(raw)
    if (isValid(parsed) && raw.length >= 8) {
      setDate(parsed)
    }
  }

  function handleCalendarSelect(day: Date | undefined) {
    setDate(day)
    if (day) setInputValue(format(day, "yyyy-MM-dd"))
    setOpen(false)
  }

  return (
    <div className="flex items-center gap-2">
      <Input
        className="w-40"
        placeholder="yyyy-mm-dd"
        value={inputValue}
        onChange={handleInputChange}
      />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="icon" aria-label="Open calendar">
            <CalendarIcon className="size-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar mode="single" selected={date} onSelect={handleCalendarSelect} />
        </PopoverContent>
      </Popover>
      {date && isValid(date) && (
        <p className="text-sm text-muted-foreground">Selected: {format(date, "PPP")}</p>
      )}
    </div>
  )
}

function TimePickerDemo() {
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [time, setTime] = useState("12:00")
  const [open, setOpen] = useState(false)

  const combined = useMemo(() => {
    if (!date) return null
    const [hours, minutes] = time.split(":").map(Number)
    const result = new Date(date)
    result.setHours(hours, minutes, 0, 0)
    return result
  }, [date, time])

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className={cn("w-48 justify-start text-left font-normal", !date && "text-muted-foreground")}>
              <CalendarIcon className="mr-2 size-4" />
              {date ? format(date, "PPP") : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar mode="single" selected={date} onSelect={(day) => { setDate(day); setOpen(false) }} />
          </PopoverContent>
        </Popover>
        <Input type="time" value={time} onChange={(event) => setTime(event.target.value)} className="w-28" />
      </div>
      {combined && (
        <p className="text-sm text-muted-foreground">Combined: {format(combined, "PPP p")}</p>
      )}
    </div>
  )
}

function NaturalLanguagePickerDemo() {
  const [text, setText] = useState("")
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [feedback, setFeedback] = useState("")
  const [open, setOpen] = useState(false)

  function handleParse() {
    const result = parseDate(text)
    if (result && isValid(result)) {
      setDate(result)
      setFeedback(`Parsed: ${format(result, "PPP p")}`)
    } else {
      setDate(undefined)
      setFeedback("Could not parse a date from the input.")
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Input
          className="w-64"
          placeholder='e.g. "next friday" or "in 3 days"'
          value={text}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={(event) => { if (event.key === "Enter") handleParse() }}
        />
        <Button onClick={handleParse} size="sm">Parse</Button>
        {date && (
          <Button variant="ghost" size="sm" onClick={() => { setDate(undefined); setText(""); setFeedback("") }}>
            Clear
          </Button>
        )}
      </div>
      {feedback && <p className="text-sm text-muted-foreground">{feedback}</p>}
      {date && (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-60 justify-start text-left font-normal">
              <CalendarIcon className="mr-2 size-4" />
              {format(date, "PPP")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar mode="single" selected={date} onSelect={(day) => { setDate(day); if (day) setFeedback(`Selected: ${format(day, "PPP")}`); setOpen(false) }} />
          </PopoverContent>
        </Popover>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// QUESTIONNAIRE
// ---------------------------------------------------------------------------

function BasicQuestionnaire() {
  const [result, setResult] = useState<string | null>(null)

  return (
    <div className="mx-auto w-full max-w-lg space-y-4">
      {result ? (
        <div className="rounded-lg border bg-muted/50 p-4 text-sm">
          <p className="font-medium">Submission received</p>
          <pre className="mt-2 whitespace-pre-wrap text-xs text-muted-foreground">{result}</pre>
          <Button variant="outline" size="sm" className="mt-3" onClick={() => setResult(null)}>Reset</Button>
        </div>
      ) : (
        <Questionnaire
          onSubmit={(event) => {
            event.preventDefault()
            const fd = new FormData(event.currentTarget)
            const entries = Object.fromEntries(fd.entries())
            setResult(JSON.stringify(entries, null, 2))
          }}
        >
          <QuestionnaireProgress />
          <QuestionnaireItem name="role">
            <QuestionnaireTitle>What is your role?</QuestionnaireTitle>
            <QuestionnaireDescription>Select the option that best describes you.</QuestionnaireDescription>
            <QuestionnaireChoices>
              <QuestionnaireChoice value="developer">Developer</QuestionnaireChoice>
              <QuestionnaireChoice value="designer">Designer</QuestionnaireChoice>
              <QuestionnaireChoice value="manager">Manager</QuestionnaireChoice>
            </QuestionnaireChoices>
          </QuestionnaireItem>
          <QuestionnaireItem name="experience">
            <QuestionnaireTitle>How many years of experience?</QuestionnaireTitle>
            <QuestionnaireChoices>
              <QuestionnaireChoice value="0-2">0 - 2 years</QuestionnaireChoice>
              <QuestionnaireChoice value="3-5">3 - 5 years</QuestionnaireChoice>
              <QuestionnaireChoice value="6+">6+ years</QuestionnaireChoice>
            </QuestionnaireChoices>
          </QuestionnaireItem>
          <QuestionnaireItem name="feedback">
            <QuestionnaireTitle>Any additional feedback?</QuestionnaireTitle>
            <QuestionnaireInput placeholder="Type here..." />
          </QuestionnaireItem>
          <QuestionnaireActions>
            <QuestionnairePrevious />
            <QuestionnaireSkip />
            <QuestionnaireNext />
            <QuestionnaireSubmit />
          </QuestionnaireActions>
        </Questionnaire>
      )}
    </div>
  )
}

function MultipleSelectionDemo() {
  const [result, setResult] = useState<string | null>(null)
  return result ? (
    <div className="text-sm"><pre className="whitespace-pre-wrap text-xs">{result}</pre><Button variant="outline" size="sm" className="mt-2" onClick={() => setResult(null)}>Reset</Button></div>
  ) : (
    <Questionnaire onSubmit={(ev) => { ev.preventDefault(); setResult(JSON.stringify(Object.fromEntries(new FormData(ev.currentTarget).entries()), null, 2)) }}>
      <QuestionnaireProgress />
      <QuestionnaireItem name="languages" multiple>
        <QuestionnaireTitle>Which languages do you use?</QuestionnaireTitle>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="typescript">TypeScript</QuestionnaireChoice>
          <QuestionnaireChoice value="python">Python</QuestionnaireChoice>
          <QuestionnaireChoice value="rust">Rust</QuestionnaireChoice>
          <QuestionnaireChoice value="go">Go</QuestionnaireChoice>
        </QuestionnaireChoices>
      </QuestionnaireItem>
      <QuestionnaireActions>
        <QuestionnaireSubmit />
      </QuestionnaireActions>
    </Questionnaire>
  )
}

function FreeformAnswerDemo() {
  const [result, setResult] = useState<string | null>(null)
  return result ? (
    <div className="text-sm"><pre className="whitespace-pre-wrap text-xs">{result}</pre><Button variant="outline" size="sm" className="mt-2" onClick={() => setResult(null)}>Reset</Button></div>
  ) : (
    <Questionnaire onSubmit={(ev) => { ev.preventDefault(); setResult(JSON.stringify(Object.fromEntries(new FormData(ev.currentTarget).entries()), null, 2)) }}>
      <QuestionnaireProgress />
      <QuestionnaireItem name="thoughts">
        <QuestionnaireTitle>Share your thoughts</QuestionnaireTitle>
        <QuestionnaireDescription>Write anything you would like us to know.</QuestionnaireDescription>
        <QuestionnaireInput placeholder="Your answer..." />
      </QuestionnaireItem>
      <QuestionnaireActions>
        <QuestionnaireSubmit />
      </QuestionnaireActions>
    </Questionnaire>
  )
}

function ExplicitSkipDemo() {
  const [statuses, setStatuses] = useState<Record<string, string>>({})
  const [result, setResult] = useState<string | null>(null)

  return result ? (
    <div className="text-sm"><pre className="whitespace-pre-wrap text-xs">{result}</pre><Button variant="outline" size="sm" className="mt-2" onClick={() => { setResult(null); setStatuses({}) }}>Reset</Button></div>
  ) : (
    <div className="space-y-4">
      <Questionnaire onSubmit={(ev) => { ev.preventDefault(); setResult(JSON.stringify({ ...Object.fromEntries(new FormData(ev.currentTarget).entries()), skipped: statuses }, null, 2)) }}>
        <QuestionnaireProgress />
        <QuestionnaireItem name="color" onStatusChange={(status) => setStatuses((prev) => ({ ...prev, color: status }))}>
          <QuestionnaireTitle>Favorite color?</QuestionnaireTitle>
          <QuestionnaireChoices>
            <QuestionnaireChoice value="red">Red</QuestionnaireChoice>
            <QuestionnaireChoice value="blue">Blue</QuestionnaireChoice>
            <QuestionnaireChoice value="green">Green</QuestionnaireChoice>
          </QuestionnaireChoices>
        </QuestionnaireItem>
        <QuestionnaireItem name="food" onStatusChange={(status) => setStatuses((prev) => ({ ...prev, food: status }))}>
          <QuestionnaireTitle>Favorite food?</QuestionnaireTitle>
          <QuestionnaireChoices>
            <QuestionnaireChoice value="pizza">Pizza</QuestionnaireChoice>
            <QuestionnaireChoice value="sushi">Sushi</QuestionnaireChoice>
          </QuestionnaireChoices>
        </QuestionnaireItem>
        <QuestionnaireActions>
          <QuestionnairePrevious />
          <QuestionnaireSkip />
          <QuestionnaireNext />
          <QuestionnaireSubmit />
        </QuestionnaireActions>
      </Questionnaire>
      {Object.keys(statuses).length > 0 && (
        <div className="text-xs text-muted-foreground">
          Statuses: {Object.entries(statuses).map(([key, val]) => `${key}: ${val}`).join(", ")}
        </div>
      )}
    </div>
  )
}

function ShortcutsDemo() {
  const [result, setResult] = useState<string | null>(null)
  return result ? (
    <div className="text-sm"><pre className="whitespace-pre-wrap text-xs">{result}</pre><Button variant="outline" size="sm" className="mt-2" onClick={() => setResult(null)}>Reset</Button></div>
  ) : (
    <Questionnaire shortcuts="letters" onSubmit={(ev) => { ev.preventDefault(); setResult(JSON.stringify(Object.fromEntries(new FormData(ev.currentTarget).entries()), null, 2)) }}>
      <QuestionnaireProgress />
      <QuestionnaireItem name="speed">
        <QuestionnaireTitle>Preferred speed?</QuestionnaireTitle>
        <QuestionnaireDescription>Use keyboard shortcuts to select.</QuestionnaireDescription>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="slow">Slow</QuestionnaireChoice>
          <QuestionnaireChoice value="medium">Medium</QuestionnaireChoice>
          <QuestionnaireChoice value="fast">Fast</QuestionnaireChoice>
        </QuestionnaireChoices>
      </QuestionnaireItem>
      <QuestionnaireActions>
        <QuestionnaireSubmit />
      </QuestionnaireActions>
    </Questionnaire>
  )
}

function CustomValidationDemo() {
  const [invalid, setInvalid] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  return result ? (
    <div className="text-sm"><pre className="whitespace-pre-wrap text-xs">{result}</pre><Button variant="outline" size="sm" className="mt-2" onClick={() => { setResult(null); setInvalid(false) }}>Reset</Button></div>
  ) : (
    <Questionnaire onSubmit={(ev) => { ev.preventDefault(); if (invalid) return; setResult(JSON.stringify(Object.fromEntries(new FormData(ev.currentTarget).entries()), null, 2)) }}>
      <QuestionnaireProgress />
      <QuestionnaireItem name="age" invalid={invalid}>
        <QuestionnaireTitle>What is your age?</QuestionnaireTitle>
        <QuestionnaireInput
          placeholder="Enter a number"
          type="number"
          onChange={(ev) => {
            const val = Number(ev.target.value)
            setInvalid(val > 0 && val < 18)
          }}
        />
        <QuestionnaireError>You must be 18 or older to continue.</QuestionnaireError>
      </QuestionnaireItem>
      <QuestionnaireActions>
        <QuestionnaireSubmit />
      </QuestionnaireActions>
    </Questionnaire>
  )
}

function ControlledDemo() {
  const [currentItem, setCurrentItem] = useState("team-size")
  const [result, setResult] = useState<string | null>(null)

  return result ? (
    <div className="text-sm"><pre className="whitespace-pre-wrap text-xs">{result}</pre><Button variant="outline" size="sm" className="mt-2" onClick={() => { setResult(null); setCurrentItem("team-size") }}>Reset</Button></div>
  ) : (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Current item: <span className="font-medium text-foreground">{currentItem}</span></p>
      <Questionnaire item={currentItem} onItemChange={setCurrentItem} onSubmit={(ev) => { ev.preventDefault(); setResult(JSON.stringify(Object.fromEntries(new FormData(ev.currentTarget).entries()), null, 2)) }}>
        <QuestionnaireProgress />
        <QuestionnaireItem name="team-size">
          <QuestionnaireTitle>Team size?</QuestionnaireTitle>
          <QuestionnaireChoices>
            <QuestionnaireChoice value="small">1-5</QuestionnaireChoice>
            <QuestionnaireChoice value="medium">6-20</QuestionnaireChoice>
            <QuestionnaireChoice value="large">21+</QuestionnaireChoice>
          </QuestionnaireChoices>
        </QuestionnaireItem>
        <QuestionnaireItem name="methodology">
          <QuestionnaireTitle>Methodology?</QuestionnaireTitle>
          <QuestionnaireChoices>
            <QuestionnaireChoice value="agile">Agile</QuestionnaireChoice>
            <QuestionnaireChoice value="waterfall">Waterfall</QuestionnaireChoice>
          </QuestionnaireChoices>
        </QuestionnaireItem>
        <QuestionnaireActions>
          <QuestionnairePrevious />
          <QuestionnaireNext />
          <QuestionnaireSubmit />
        </QuestionnaireActions>
      </Questionnaire>
    </div>
  )
}

function ResumeDemo() {
  const [result, setResult] = useState<string | null>(null)
  const [key, setKey] = useState(0)

  return result ? (
    <div className="text-sm"><pre className="whitespace-pre-wrap text-xs">{result}</pre><Button variant="outline" size="sm" className="mt-2" onClick={() => { setResult(null); setKey((prev) => prev + 1) }}>Reset</Button></div>
  ) : (
    <Questionnaire key={key} defaultItem="framework" onSubmit={(ev) => { ev.preventDefault(); setResult(JSON.stringify(Object.fromEntries(new FormData(ev.currentTarget).entries()), null, 2)) }}>
      <QuestionnaireProgress />
      <QuestionnaireItem name="language">
        <QuestionnaireTitle>Preferred language?</QuestionnaireTitle>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="ts" defaultChecked>TypeScript</QuestionnaireChoice>
          <QuestionnaireChoice value="js">JavaScript</QuestionnaireChoice>
        </QuestionnaireChoices>
      </QuestionnaireItem>
      <QuestionnaireItem name="framework">
        <QuestionnaireTitle>Preferred framework?</QuestionnaireTitle>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="react">React</QuestionnaireChoice>
          <QuestionnaireChoice value="vue">Vue</QuestionnaireChoice>
          <QuestionnaireChoice value="svelte">Svelte</QuestionnaireChoice>
        </QuestionnaireChoices>
      </QuestionnaireItem>
      <QuestionnaireActions>
        <QuestionnairePrevious />
        <QuestionnaireNext />
        <QuestionnaireSubmit />
      </QuestionnaireActions>
    </Questionnaire>
  )
}

function ConditionalItemsDemo() {
  const [showRegion, setShowRegion] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  return result ? (
    <div className="text-sm"><pre className="whitespace-pre-wrap text-xs">{result}</pre><Button variant="outline" size="sm" className="mt-2" onClick={() => { setResult(null); setShowRegion(false) }}>Reset</Button></div>
  ) : (
    <Questionnaire onSubmit={(ev) => { ev.preventDefault(); setResult(JSON.stringify(Object.fromEntries(new FormData(ev.currentTarget).entries()), null, 2)) }}>
      <QuestionnaireProgress />
      <QuestionnaireItem name="deploy">
        <QuestionnaireTitle>Where do you deploy?</QuestionnaireTitle>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="cloud" onChange={() => setShowRegion(true)}>Cloud</QuestionnaireChoice>
          <QuestionnaireChoice value="on-premise" onChange={() => setShowRegion(false)}>On-premise</QuestionnaireChoice>
        </QuestionnaireChoices>
      </QuestionnaireItem>
      {showRegion && (
        <QuestionnaireItem name="region">
          <QuestionnaireTitle>Cloud region?</QuestionnaireTitle>
          <QuestionnaireChoices>
            <QuestionnaireChoice value="us-east">US East</QuestionnaireChoice>
            <QuestionnaireChoice value="eu-west">EU West</QuestionnaireChoice>
            <QuestionnaireChoice value="ap-south">AP South</QuestionnaireChoice>
          </QuestionnaireChoices>
        </QuestionnaireItem>
      )}
      <QuestionnaireActions>
        <QuestionnairePrevious />
        <QuestionnaireNext />
        <QuestionnaireSubmit />
      </QuestionnaireActions>
    </Questionnaire>
  )
}

function NavigationStateDemo() {
  const [currentItem, setCurrentItem] = useState("q1")
  const [result, setResult] = useState<string | null>(null)

  return result ? (
    <div className="text-sm"><pre className="whitespace-pre-wrap text-xs">{result}</pre><Button variant="outline" size="sm" className="mt-2" onClick={() => { setResult(null); setCurrentItem("q1") }}>Reset</Button></div>
  ) : (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button variant="outline" size="sm" disabled={currentItem === "q1"} onClick={() => setCurrentItem("q1")}>Go to Q1</Button>
        <Button variant="outline" size="sm" disabled={currentItem === "q2"} onClick={() => setCurrentItem("q2")}>Go to Q2</Button>
      </div>
      <Questionnaire item={currentItem} onItemChange={setCurrentItem} onSubmit={(ev) => { ev.preventDefault(); setResult(JSON.stringify(Object.fromEntries(new FormData(ev.currentTarget).entries()), null, 2)) }}>
        <QuestionnaireProgress />
        <QuestionnaireItem name="q1">
          <QuestionnaireTitle>Question 1</QuestionnaireTitle>
          <QuestionnaireChoices>
            <QuestionnaireChoice value="a">Option A</QuestionnaireChoice>
            <QuestionnaireChoice value="b">Option B</QuestionnaireChoice>
          </QuestionnaireChoices>
        </QuestionnaireItem>
        <QuestionnaireItem name="q2">
          <QuestionnaireTitle>Question 2</QuestionnaireTitle>
          <QuestionnaireInput placeholder="Your answer..." />
        </QuestionnaireItem>
        <QuestionnaireActions>
          <QuestionnairePrevious />
          <QuestionnaireNext />
          <QuestionnaireSubmit />
        </QuestionnaireActions>
      </Questionnaire>
    </div>
  )
}

function CustomProgressDemo() {
  const [result, setResult] = useState<string | null>(null)
  return result ? (
    <div className="text-sm"><pre className="whitespace-pre-wrap text-xs">{result}</pre><Button variant="outline" size="sm" className="mt-2" onClick={() => setResult(null)}>Reset</Button></div>
  ) : (
    <Questionnaire onSubmit={(ev) => { ev.preventDefault(); setResult(JSON.stringify(Object.fromEntries(new FormData(ev.currentTarget).entries()), null, 2)) }}>
      <QuestionnaireProgress render={(props, state) => (
        <div {...props} className="flex items-center gap-3 text-sm">
          <Progress
            aria-hidden="true"
            className="flex-1"
            value={(state.current / state.total) * 100}
          />
          <span className="tabular-nums text-muted-foreground">{state.current}/{state.total}</span>
        </div>
      )} />
      <QuestionnaireItem name="p1">
        <QuestionnaireTitle>Step one</QuestionnaireTitle>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="yes">Yes</QuestionnaireChoice>
          <QuestionnaireChoice value="no">No</QuestionnaireChoice>
        </QuestionnaireChoices>
      </QuestionnaireItem>
      <QuestionnaireItem name="p2">
        <QuestionnaireTitle>Step two</QuestionnaireTitle>
        <QuestionnaireInput placeholder="Details..." />
      </QuestionnaireItem>
      <QuestionnaireItem name="p3">
        <QuestionnaireTitle>Step three</QuestionnaireTitle>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="done">All done</QuestionnaireChoice>
        </QuestionnaireChoices>
      </QuestionnaireItem>
      <QuestionnaireActions>
        <QuestionnairePrevious />
        <QuestionnaireNext />
        <QuestionnaireSubmit />
      </QuestionnaireActions>
    </Questionnaire>
  )
}

function AnimatedItemsDemo() {
  const [result, setResult] = useState<string | null>(null)
  return result ? (
    <div className="text-sm"><pre className="whitespace-pre-wrap text-xs">{result}</pre><Button variant="outline" size="sm" className="mt-2" onClick={() => setResult(null)}>Reset</Button></div>
  ) : (
    <Questionnaire onSubmit={(ev) => { ev.preventDefault(); setResult(JSON.stringify(Object.fromEntries(new FormData(ev.currentTarget).entries()), null, 2)) }}>
      <QuestionnaireProgress />
      <QuestionnaireItem name="anim-q1" className="data-active:animate-in data-active:fade-in-0 data-active:slide-in-from-right-4">
        <QuestionnaireTitle>Animated step 1</QuestionnaireTitle>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="alpha">Alpha</QuestionnaireChoice>
          <QuestionnaireChoice value="beta">Beta</QuestionnaireChoice>
        </QuestionnaireChoices>
      </QuestionnaireItem>
      <QuestionnaireItem name="anim-q2" className="data-active:animate-in data-active:fade-in-0 data-active:slide-in-from-right-4">
        <QuestionnaireTitle>Animated step 2</QuestionnaireTitle>
        <QuestionnaireInput placeholder="Type something..." />
      </QuestionnaireItem>
      <QuestionnaireActions>
        <QuestionnairePrevious />
        <QuestionnaireNext />
        <QuestionnaireSubmit />
      </QuestionnaireActions>
    </Questionnaire>
  )
}

function CardQuestionnaireDemo() {
  const [result, setResult] = useState<string | null>(null)
  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle>Quick survey</CardTitle>
        <CardDescription>Answer a couple of questions.</CardDescription>
      </CardHeader>
      <CardContent>
        {result ? (
          <div className="text-sm"><pre className="whitespace-pre-wrap text-xs">{result}</pre><Button variant="outline" size="sm" className="mt-2" onClick={() => setResult(null)}>Reset</Button></div>
        ) : (
          <Questionnaire onSubmit={(ev) => { ev.preventDefault(); setResult(JSON.stringify(Object.fromEntries(new FormData(ev.currentTarget).entries()), null, 2)) }}>
            <QuestionnaireProgress />
            <QuestionnaireItem name="rating">
              <QuestionnaireTitle>How would you rate this?</QuestionnaireTitle>
              <QuestionnaireChoices>
                <QuestionnaireChoice value="great">Great</QuestionnaireChoice>
                <QuestionnaireChoice value="ok">Okay</QuestionnaireChoice>
                <QuestionnaireChoice value="bad">Could be better</QuestionnaireChoice>
              </QuestionnaireChoices>
            </QuestionnaireItem>
            <QuestionnaireActions>
              <QuestionnaireSubmit />
            </QuestionnaireActions>
          </Questionnaire>
        )}
      </CardContent>
    </Card>
  )
}

function DialogQuestionnaireDemo() {
  const [result, setResult] = useState<string | null>(null)
  const [open, setOpen] = useState(false)

  return (
    <div>
      <Button onClick={() => { setOpen(true); setResult(null) }}>Open questionnaire</Button>
      {result && <p className="mt-2 text-sm text-muted-foreground">Last result: {result}</p>}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Questionnaire</DialogTitle>
            <DialogDescription>Complete this short survey.</DialogDescription>
          </DialogHeader>
          <Questionnaire onSubmit={(ev) => { ev.preventDefault(); const fd = new FormData(ev.currentTarget); setResult(JSON.stringify(Object.fromEntries(fd.entries()), null, 2)); setOpen(false) }}>
            <QuestionnaireProgress />
            <QuestionnaireItem name="satisfaction">
              <QuestionnaireTitle>How satisfied are you?</QuestionnaireTitle>
              <QuestionnaireChoices>
                <QuestionnaireChoice value="very">Very satisfied</QuestionnaireChoice>
                <QuestionnaireChoice value="somewhat">Somewhat</QuestionnaireChoice>
                <QuestionnaireChoice value="not">Not satisfied</QuestionnaireChoice>
              </QuestionnaireChoices>
            </QuestionnaireItem>
            <QuestionnaireItem name="comment">
              <QuestionnaireTitle>Anything else?</QuestionnaireTitle>
              <QuestionnaireInput placeholder="Optional comment..." />
            </QuestionnaireItem>
            <QuestionnaireActions>
              <QuestionnairePrevious />
              <QuestionnaireNext />
              <QuestionnaireSubmit />
            </QuestionnaireActions>
          </Questionnaire>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ---------------------------------------------------------------------------
// TYPOGRAPHY
// ---------------------------------------------------------------------------

function TypographyDefault() {
  return (
    <div className="space-y-4">
      <h1 className="scroll-m-20 text-4xl font-extrabold lg:text-5xl">The joke tax chronicles</h1>
      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold first:mt-0">The people of the kingdom</h2>
      <h3 className="scroll-m-20 text-2xl font-semibold">The king's plan</h3>
      <h4 className="scroll-m-20 text-xl font-semibold">People stopped telling jokes</h4>
      <p className="leading-7 not-first:mt-6">
        The king, seeing how much happier his subjects were, realized the error of his ways and repealed the joke tax.
        Jokester and his court jester were reinstated, and the kingdom was once again filled with laughter.
      </p>
      <a href="#" onClick={(ev) => ev.preventDefault()} className="font-medium text-primary underline underline-offset-4">Read the full story</a>
      <p className="leading-7">
        Use the <code className="relative rounded bg-muted px-1.5 py-0.5 font-mono text-sm font-semibold">Popover</code> component for floating content.
      </p>
    </div>
  )
}

function TypographyH1() {
  return <h1 className="scroll-m-20 text-4xl font-extrabold lg:text-5xl">Taxing laughter: the joke tax chronicles</h1>
}

function TypographyH2() {
  return <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold first:mt-0">The people of the kingdom</h2>
}

function TypographyH3() {
  return <h3 className="scroll-m-20 text-2xl font-semibold">The king's plan</h3>
}

function TypographyH4() {
  return <h4 className="scroll-m-20 text-xl font-semibold">People stopped telling jokes</h4>
}

function TypographyParagraph() {
  return (
    <p className="leading-7 not-first:mt-6">
      The king, seeing how much happier his subjects were, realized the error of his ways and repealed the joke tax.
    </p>
  )
}

function TypographyLead() {
  return <p className="text-xl text-muted-foreground">A modal dialog that interrupts the user with important content and expects a response.</p>
}

function TypographyBlockquote() {
  return (
    <blockquote className="my-6 border-l-2 pl-6 italic">
      "After all," he said, "everyone enjoys a good joke, so it's only fair that they should pay for the privilege."
    </blockquote>
  )
}

function TypographyList() {
  return (
    <ul className="showcase-typography-list">
      <li>1st level of puns: 5 gold coins</li>
      <li>2nd level of puns: 10 gold coins</li>
      <li>3rd level of puns: 20 gold coins</li>
    </ul>
  )
}

function TypographyTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-24">King's Treasury</TableHead>
          <TableHead>First year</TableHead>
          <TableHead>Second year</TableHead>
          <TableHead className="text-right">Third year</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium">Gold coins</TableCell>
          <TableCell>50,000</TableCell>
          <TableCell>75,000</TableCell>
          <TableCell className="text-right">100,000</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Joke taxes</TableCell>
          <TableCell>10,000</TableCell>
          <TableCell>25,000</TableCell>
          <TableCell className="text-right">50,000</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}

function TypographyInlineCode() {
  return (
    <p className="leading-7">
      Use the <code className="relative rounded bg-muted px-1.5 py-0.5 font-mono text-sm font-semibold">@radix-ui/react-dialog</code> package.
    </p>
  )
}

function TypographyLarge() {
  return <div className="text-lg font-semibold">Are you absolutely sure?</div>
}

function TypographySmall() {
  return <small className="text-sm font-medium leading-none">Email address</small>
}

function TypographyMuted() {
  return <p className="text-sm text-muted-foreground">Enter your email address.</p>
}

// ---------------------------------------------------------------------------
// EXPORT
// ---------------------------------------------------------------------------

export const composedDemos: ComponentEntry[] = [
  {
    slug: "data-table",
    name: "Data Table",
    description: "Powerful table built on TanStack Table v9 with sorting, filtering, pagination, row selection, and column visibility.",
    category: "Data Display",
    installCommand: "npx shadcn@latest add table && npm install @tanstack/react-table",
    Demo: BasicDataTable,
    code: `import { useTable, tableFeatures, createColumnHelper } from "@tanstack/react-table"

const features = tableFeatures({ rowSortingFeature, columnFilteringFeature })
const helper = createColumnHelper<typeof features, Payment>()
const columns = [helper.accessor("email", { header: "Email" })]
const table = useTable({ features, data, columns, rowModelFns: {} })`,
    examples: [
      { name: "Cell Formatting", Demo: CellFormattingDemo, layout: "wide" },
      { name: "Row Actions", Demo: RowActionsDemo, layout: "wide" },
      { name: "Pagination", Demo: PaginationDemo, layout: "wide" },
      { name: "Sorting", Demo: SortingDemo, layout: "wide" },
      { name: "Filtering", Demo: FilteringDemo, layout: "wide" },
      { name: "Visibility", Demo: VisibilityDemo, layout: "wide" },
      { name: "Row Selection", Demo: RowSelectionDemo, layout: "wide" },
      { name: "Column Header", Demo: ColumnHeaderDemo, layout: "wide" },
      { name: "Table Pagination", Demo: TablePaginationDemo, layout: "wide" },
      { name: "Column Toggle", Demo: ColumnToggleDemo, layout: "wide" },
    ],
  },
  {
    slug: "date-picker",
    name: "Date Picker",
    description: "A date picker component with calendar popover, range selection, presets, and natural language parsing.",
    category: "Date",
    installCommand: "npx shadcn@latest add calendar popover",
    Demo: BasicDatePicker,
    code: `<Popover>
  <PopoverTrigger asChild>
    <Button variant="outline">
      <CalendarIcon className="mr-2 size-4" />
      {date ? format(date, "PPP") : "Pick a date"}
    </Button>
  </PopoverTrigger>
  <PopoverContent className="w-auto p-0">
    <Calendar mode="single" selected={date} onSelect={setDate} />
  </PopoverContent>
</Popover>`,
    examples: [
      { name: "Range Picker", Demo: RangePickerDemo },
      { name: "Presets", Demo: PresetsDemo },
      { name: "Date of Birth", Demo: DateOfBirthDemo },
      { name: "Input", Demo: DateInputDemo },
      { name: "Time Picker", Demo: TimePickerDemo },
      { name: "Natural Language Picker", Demo: NaturalLanguagePickerDemo },
    ],
  },
  {
    slug: "questionnaire",
    name: "Questionnaire",
    description: "Multi-step interactive questionnaire with progress tracking, choices, freeform input, validation, and skip logic.",
    category: "Forms",
    Demo: BasicQuestionnaire,
    code: `<Questionnaire onSubmit={handleSubmit}>
  <QuestionnaireProgress />
  <QuestionnaireItem name="role">
    <QuestionnaireTitle>What is your role?</QuestionnaireTitle>
    <QuestionnaireChoices>
      <QuestionnaireChoice value="developer">Developer</QuestionnaireChoice>
    </QuestionnaireChoices>
  </QuestionnaireItem>
  <QuestionnaireActions>
    <QuestionnairePrevious />
    <QuestionnaireSkip />
    <QuestionnaireNext />
    <QuestionnaireSubmit />
  </QuestionnaireActions>
</Questionnaire>`,
    examples: [
      { name: "Multiple Selection", Demo: MultipleSelectionDemo },
      { name: "Freeform Answer", Demo: FreeformAnswerDemo },
      { name: "Explicit Skip", Demo: ExplicitSkipDemo },
      { name: "Shortcuts", Demo: ShortcutsDemo },
      { name: "Custom Validation", Demo: CustomValidationDemo },
      { name: "Controlled", Demo: ControlledDemo },
      { name: "Resume", Demo: ResumeDemo },
      { name: "Conditional Items", Demo: ConditionalItemsDemo },
      { name: "Navigation State", Demo: NavigationStateDemo },
      { name: "Custom Progress", Demo: CustomProgressDemo, layout: "wide" },
      { name: "Animated Items", Demo: AnimatedItemsDemo },
      { name: "Card", Demo: CardQuestionnaireDemo, layout: "wide" },
      { name: "Dialog", Demo: DialogQuestionnaireDemo, layout: "viewport" },
    ],
  },
  {
    slug: "typography",
    name: "Typography",
    description: "Typography specimens using semantic Geist/theme utilities for headings, paragraphs, inline elements, and prose.",
    category: "Utilities",
    installCommand: null,
    Demo: TypographyDefault,
    code: `<h1 className="scroll-m-20 text-4xl font-extrabold lg:text-5xl">
  Heading
</h1>
<p className="leading-7">Paragraph text with <code>inline code</code>.</p>`,
    examples: [
      { name: "Heading 1", Demo: TypographyH1 },
      { name: "Heading 2", Demo: TypographyH2 },
      { name: "Heading 3", Demo: TypographyH3 },
      { name: "Heading 4", Demo: TypographyH4 },
      { name: "Paragraph", Demo: TypographyParagraph },
      { name: "Lead", Demo: TypographyLead },
      { name: "Blockquote", Demo: TypographyBlockquote },
      { name: "List", Demo: TypographyList },
      { name: "Table", Demo: TypographyTable },
      { name: "Inline Code", Demo: TypographyInlineCode },
      { name: "Large", Demo: TypographyLarge },
      { name: "Small", Demo: TypographySmall },
      { name: "Muted", Demo: TypographyMuted },
    ],
  },
]
