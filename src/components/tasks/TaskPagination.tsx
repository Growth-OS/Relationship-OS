import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";
import { Button } from "../ui/button";

interface TaskPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const TaskPagination = ({ currentPage, totalPages, onPageChange }: TaskPaginationProps) => {
  if (totalPages <= 1) return null;

  return (
    <Pagination className="mt-4">
      <PaginationContent>
        <PaginationItem>
          <Button
            variant="outline"
            size="default"
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
        </PaginationItem>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
          <PaginationItem key={pageNum}>
            <PaginationLink
              onClick={() => onPageChange(pageNum)}
              isActive={currentPage === pageNum}
            >
              {pageNum}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <Button
            variant="outline"
            size="default"
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};