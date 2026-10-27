import { useEffect, useState } from "react";

// CSS pixels: browsers cannot reliably detect a monitor's physical size.
export function useProductColumns() {
  const getColumns = () => window.matchMedia("(min-width: 3200px)").matches ? 8
    : window.matchMedia("(min-width: 2560px)").matches ? 6 : 4;
  const [columns, setColumns] = useState(getColumns);

  useEffect(() => {
    const queries = [2560, 3200].map((width) => window.matchMedia(`(min-width: ${width}px)`));
    const update = () => setColumns(getColumns());
    queries.forEach((query) => query.addEventListener("change", update));
    update();
    return () => queries.forEach((query) => query.removeEventListener("change", update));
  }, []);

  return columns;
}
