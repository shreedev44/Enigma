import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, Menu } from "lucide-react";

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
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import defaultPic from "../../assets/default-avatar.jpg";
import { Skeleton } from "../ui/skeleton";
import { Badge } from "../ui/badge";
import { RecruiterData, StudentData } from "@/types/formTypes";
import { UsersPagePropType } from "@/types/propsTypes";
import { DynamicPagination } from "../UserPagination";

const studentColumns = (
  loading: boolean = false,
  sort: (sortBy: string) => void,
  blockUser: (userId: string, block: boolean) => void,
  viewProfile: (userId: string) => void
): ColumnDef<StudentData>[] => {
  return [
    {
      id: "profilePicture",
      header: "",
      cell: ({ row }) => (
        <Avatar>
          <AvatarImage
            src={row.original.profilePicture || defaultPic}
            alt="profile"
          />
          <AvatarFallback>
            <Skeleton className="w-3 md:w-5 h-3 md:h-5 rounded-full" />
          </AvatarFallback>
        </Avatar>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorFn: (row) => `${row.firstName} ${row.lastName}`,
      id: "name",
      header: () => (
        <Button
          variant="ghost"
          onClick={() => sort("firstName")}
          disabled={loading}
        >
          Name
          <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="capitalize">
          {String(row.getValue("name")).length <= 20
            ? row.getValue("name")
            : String(row.getValue("name")).slice(0, 20) + "..."}
        </div>
      ),
      sortingFn: "text",
    },
    {
      accessorKey: "email",
      header: () => (
        <Button
          variant="ghost"
          onClick={() => sort("email")}
          disabled={loading}
        >
          Email
          <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("email")}</div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: () => (
        <Button
          variant="ghost"
          onClick={() => sort("createdAt")}
          disabled={loading}
        >
          Date Joined
          <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="ml-5">
          {new Date(row.getValue("createdAt")).toLocaleDateString()}
        </div>
      ),
      sortingFn: "datetime",
    },
    {
      accessorKey: "status",
      header: () => {
        return (
          <Button
            variant="ghost"
            onClick={() => sort("status")}
            disabled={loading}
          >
            Status
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="ml-5 capitalize">
          <Badge
            variant={
              row.getValue("status") === "active" ? "default" : "destructive"
            }
          >
            {row.getValue("status")}
          </Badge>
        </div>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const user = row.original;

        return (
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
              <DropdownMenuItem onClick={() => viewProfile(user._id)}>
                View Profile
              </DropdownMenuItem>
              {user.status === "active" ? (
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={() => blockUser(user._id, true)}
                >
                  Block
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  className="text-green-600"
                  onClick={() => blockUser(user._id, false)}
                >
                  Unblock
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
};

const recruiterColumns = (
  loading: boolean = false,
  sort: (sortBy: string) => void,
  blockUser: (userId: string, block: boolean) => void,
  viewProfile: (userId: string) => void
): ColumnDef<RecruiterData>[] => {
  return [
    {
      id: "profilePicture",
      header: "",
      cell: ({ row }) => (
        <Avatar>
          <AvatarImage
            src={row.original.profilePicture || defaultPic}
            alt="profile"
          />
          <AvatarFallback>
            <Skeleton className="w-3 md:w-5 h-3 md:h-5 rounded-full" />
          </AvatarFallback>
        </Avatar>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorFn: (row) => `${row.companyName}`,
      id: "name",
      header: () => (
        <Button
          variant="ghost"
          onClick={() => sort("companyName")}
          disabled={loading}
        >
          Name
          <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="capitalize">
          {String(row.getValue("name")).length <= 20
            ? row.getValue("name")
            : String(row.getValue("name")).slice(0, 20) + "..."}
        </div>
      ),
      sortingFn: "text",
    },
    {
      accessorKey: "email",
      header: () => (
        <Button
          variant="ghost"
          onClick={() => sort("email")}
          disabled={loading}
        >
          Email
          <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("email")}</div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: () => (
        <Button
          variant="ghost"
          onClick={() => sort("createdAt")}
          disabled={loading}
        >
          Date Joined
          <ArrowUpDown />
        </Button>
      ),
      cell: ({ row }) => (
        <div>{new Date(row.getValue("createdAt")).toLocaleDateString()}</div>
      ),
      sortingFn: "datetime",
    },
    {
      accessorKey: "status",
      header: () => {
        return (
          <Button
            variant="ghost"
            onClick={() => sort("status")}
            disabled={loading}
          >
            Status
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="ml-5 capitalize">
          <Badge
            variant={
              row.getValue("status") === "active" ? "default" : "destructive"
            }
          >
            {row.getValue("status")}
          </Badge>
        </div>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const user = row.original;

        return (
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
              <DropdownMenuItem onClick={() => viewProfile(user._id)}>
                View Profile
              </DropdownMenuItem>
              {user.status === "active" ? (
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={() => blockUser(user._id, true)}
                >
                  Block
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  className="text-green-600"
                  onClick={() => blockUser(user._id, false)}
                >
                  Unblock
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
};

const getColumn = (
  user: "student" | "recruiter",
  loading: boolean,
  sort: (sortBy: string) => void,
  blockUser: (userId: string, block: boolean) => void,
  viewProfile: (userId: string) => void
) => {
  return user === "student"
    ? studentColumns(loading, sort, blockUser, viewProfile)
    : recruiterColumns(loading, sort, blockUser, viewProfile);
};

export function DataTable(props: UsersPagePropType) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data: props.data as StudentData[],
    columns: getColumn(
      props.user,
      props.loading,
      props.sort,
      props.blockUser,
      props.viewProfile
    ) as ColumnDef<StudentData, unknown>[],
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

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter users"
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
      <div className="rounded-md border mb-5">
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
              table.getRowModel().rows.map((row) =>
                !props.loading ? (
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
                ) : (
                  <></>
                )
              )
            ) : !props.loading ? (
              <TableRow>
                <TableCell
                  colSpan={
                    studentColumns(props.loading, props.sort, props.blockUser, props.viewProfile)
                      .length
                  }
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            ) : (
              <></>
            )}
            {props.loading ? (
              <TableRow>
                <TableCell
                  colSpan={
                    studentColumns(props.loading, props.sort, props.blockUser, props.viewProfile)
                      .length
                  }
                  className="h-24"
                >
                  <div className="flex justify-start ml-32 md:justify-center md:ml-0">
                    <div className="w-6 h-6 border-4 border-t-black border-gray-300 rounded-full animate-spin"></div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              <></>
            )}
          </TableBody>
        </Table>
      </div>
      <DynamicPagination totalPages={props.pageData.totalPages} page={props.pageData.page} setPage={props.pageData.setPage} user={props.user}/>
    </div>
  );
}
