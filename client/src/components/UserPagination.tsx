import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationEllipsis,
    PaginationPrevious,
    PaginationNext,
  } from "@/components/ui/pagination";
  
  export function DynamicPagination({
    totalPages,
    page,
    setPage,
    user
  }: {
    totalPages: number;
    page: number;
    setPage: (page: number, user: "student" | "recruiter") => void;
    user: "student" | "recruiter"
  }) {
    const getPageNumbers = () => {
      const pages = [];
      const maxPagesToShow = 3;
  
      if (totalPages <= maxPagesToShow) {
        for (let i = 1; i <= totalPages; i++) pages.push(i);
      } else {
        if (page <= 3) {
          pages.push(1, 2, 3, "...", totalPages);
        } else if (page >= totalPages - 2) {
          pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
        } else {
          pages.push(1, "...", page - 1, page, page + 1, "...", totalPages);
        }
      }
  
      return pages;
    };
  
    return (
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setPage(Math.max(page - 1, 1), user)}
              className={page === 1 ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
  
          {getPageNumbers().map((pageNumber, index) => (
            <PaginationItem key={index}>
              {pageNumber === "..." ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  isActive={pageNumber === page}
                  onClick={() => setPage(Number(pageNumber), user)}
                >
                  {pageNumber}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}
  
          <PaginationItem>
            <PaginationNext
              onClick={() => setPage(Math.min(page + 1, totalPages), user)}
              className={page === totalPages ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  }
  