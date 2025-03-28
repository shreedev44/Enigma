import {
  ColumnDef,
  Row,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
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
import { ProblemListType } from "@/types/types";
import { ArrowUpDown, Check, ChevronDown, Menu } from "lucide-react";
import { truncate } from "@/utils/utilityFunctions";
import { useState } from "react";
import { ProblemPagePropType } from "@/types/propsTypes";
import { DynamicPagination } from "./ProblemPagination";
import { useNavigate } from "react-router-dom";
import { studentRoutes } from "@/constants/routeUrl";
import ClassicSpinner from "./loaders/ClassicSpinner";

const getColumn = (
  role: "student" | "admin",
  sort: (sortBy: string) => void
): ColumnDef<ProblemListType>[] => {
  const columns: ColumnDef<ProblemListType>[] = [
    {
      id: "problemNo",
      accessorKey: "problemNo",
      header: () => (
        <Button variant={"ghost"} onClick={() => sort("problemNo")}>
          No:
          <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }: { row: Row<ProblemListType> }) => (
        <div className="capitalize pl-5">{row.getValue("problemNo")}</div>
      ),
    },
    role === "student"
      ? {
          id: "solved",
          accessorKey: "solved",
          header: () => (
            <Button variant={"ghost"}>
              Status
              <ArrowUpDown />
            </Button>
          ),
          cell: ({ row }: { row: Row<ProblemListType> }) => (
            <div className="capitalize ml-6">
              {row.getValue("solved") === "solved" ? <Check /> : ""}
            </div>
          ),
        }
      : null,
    {
      id: "title",
      accessorKey: "title",
      header: () => (
        <Button variant={"ghost"} onClick={() => sort("title")}>
          Title
          <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }: { row: Row<ProblemListType> }) => (
        <div className="capitalize">{truncate(row.getValue("title"), 20)}</div>
      ),
    },
    {
      id: "successRate",
      accessorKey: "successRate",
      header: () => (
        <Button variant={"ghost"}>
          Success Rate
          <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }: { row: Row<ProblemListType> }) => (
        <div className="capitalize ml-9">{row.getValue("successRate")}</div>
      ),
    },
    role === "admin"
      ? {
          id: "dateAdded",
          accessorKey: "dateAdded",
          header: () => (
            <Button>
              Date Added
              <ArrowUpDown />
            </Button>
          ),
          cell: ({ row }: { row: Row<ProblemListType> }) => (
            <div className="capitalize">{row.getValue("dateAdded")}</div>
          ),
        }
      : null,
    {
      id: "difficulty",
      accessorKey: "difficulty",
      header: () => (
        <Button variant={"ghost"} onClick={() => sort("difficulty")}>
          Difficulty
          <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }: { row: Row<ProblemListType> }) => (
        <div
          className={`capitalize pl-5
                  ${
                    row.getValue("difficulty") === "Beginner"
                      ? "text-green-500"
                      : row.getValue("difficulty") === "Intermediate"
                      ? "text-yellow-500"
                      : "text-red-500"
                  }`}
        >
          {row.getValue("difficulty")}
        </div>
      ),
    },
    role === "admin"
      ? {
          id: "actions",
          accessorKey: "actions",
          header: "Actions",
          cell: ({ row }: { row: Row<ProblemListType> }) => {
            const problem = row.original;
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <Menu />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Edit</DropdownMenuItem>
                {problem.status === "listed" ? (
                  <DropdownMenuItem className="text-red-600">
                    Block
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem className="text-green-600">
                    Unblock
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>;
          },
        }
      : null,
  ].filter(Boolean) as ColumnDef<ProblemListType>[];

  return columns;
};

const ProblemsTable = (props: ProblemPagePropType) => {
  const [columnVisibility, setColumnVisibility] = useState({});

  const navigate = useNavigate();

  const columns = getColumn(props.userLevel, props.sort);

  const table = useReactTable({
    data: props.data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: { columnVisibility },
    onColumnVisibilityChange: setColumnVisibility,
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4 gap-2">
        <Input
          placeholder="Filter problems"
          value={props.search}
          onChange={(event) => props.setSearch(event.target.value)}
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
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
      <div className="rounded-md border mb-5">
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
            {props.loading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24">
                  <div className="flex justify-start ml-32 md:justify-center md:ml-0">
                    <ClassicSpinner />
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => {
                const problemNo = row.original.problemNo;
                return (
                  <TableRow
                    key={row.id}
                    onClick={() => navigate(`${studentRoutes.PROBLEM}/${problemNo}`)}
                    className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
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
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DynamicPagination
        totalPages={props.pageData.totalPages}
        page={props.pageData.page}
        setPage={props.pageData.setPage}
      />
    </div>
  );
};

export default ProblemsTable;
