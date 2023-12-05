import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";

interface Column {
  id: "id" | "sender" | "reciever" | "amount" | "timestamp";
  label: string;
  minWidth?: number;
  align?: "right";
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  {
    id: "id",
    label: "ID",
    minWidth: 10,
    format: (value: Number) => value.toLocaleString("en-US"),
  },
  { id: "sender", label: "Sender", minWidth: 170 },
  { id: "reciever", label: "Reciever", minWidth: 100 },
  {
    id: "amount",
    label: "Amount (in APT)",
    minWidth: 170,
    align: "right",
    format: (value: number) => value.toLocaleString("en-US"),
  },
  {
    id: "timestamp",
    label: "Timestamp",
    minWidth: 170,
    align: "right",
    format: (value: number) => value.toLocaleString("en-US"),
  },
];

interface Data {
  id: number;
  sender: string;
  reciever: string;
  amount: number;
  timestamp: number;
}

function createData(
  id: number,
  sender: string,
  reciever: string,
  amount: number,
  timestamp: number
): Data {
  return { id, sender, reciever, amount, timestamp };
}

const rows = [
  createData(1, "India", "IN", 1324171354, 3287263),
  createData(2, "China", "CN", 1403500365, 9596961),
  createData(3, "Italy", "IT", 60483973, 301340),
  createData(4, "United States", "US", 327167434, 9833520),
  createData(5, "Canada", "CA", 37602103, 9984670),
  createData(6, "Australia", "AU", 25475400, 7692024),
  createData(7, "Germany", "DE", 83019200, 357578),
  createData(8, "Ireland", "IE", 4857000, 70273),
  createData(9, "Mexico", "MX", 126577691, 1972550),
  createData(10, "Japan", "JP", 126317000, 377973),
  createData(11, "France", "FR", 67022000, 640679),
  createData(12, "United Kingdom", "GB", 67545757, 242495),
  createData(13, "Russia", "RU", 146793744, 17098246),
  createData(14, "Nigeria", "NG", 200962417, 923768),
  createData(15, "Brazil", "BR", 210147125, 8515767),
];

interface TableProps {
  address: string;
  publicKey: string | string[];
}

export default function StickyHeadTable({ address, publicKey }: TableProps) {
  console.log(address, publicKey);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <>
    <h2 className="text-2xl font-semibold text-center md:py-10">Transactions</h2>
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={row.reciever}
                  >
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === "number"
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
    </>
  );
}
