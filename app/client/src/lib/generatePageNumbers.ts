function generatePageNumbers(
  currentPage: number,
  totalPages: number,
  displayCount = 8
): (number | "...")[] {
  const pages: (number | "...")[] = [];

  if (totalPages <= 1) {
    return pages;
  }

  const isNearStart = currentPage <= Math.ceil(displayCount / 2);
  const isNearEnd = currentPage > totalPages - Math.ceil(displayCount / 2);

  if (totalPages <= displayCount) {
    // If total pages are less than or equal to display count, show all pages
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else if (isNearStart) {
    // Near the start, show first displayCount pages and ellipsis
    for (let i = 1; i <= displayCount - 1; i++) {
      pages.push(i);
    }
    pages.push("...");
  } else if (isNearEnd) {
    // Near the end, show ellipsis and last displayCount pages
    pages.push("...");
    for (let i = totalPages - displayCount + 2; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    // In the middle, show ellipsis on both sides
    pages.push("...");
    const middleStart = currentPage - Math.floor((displayCount - 4) / 2);
    const middleEnd = currentPage + Math.ceil((displayCount - 4) / 2);
    for (let i = middleStart; i <= middleEnd; i++) {
      pages.push(i);
    }
    pages.push("...");
  }

  return pages;
}

export { generatePageNumbers };
