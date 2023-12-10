import * as React from "react";
import { useState, useEffect } from "react";
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

interface Transaction {
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
): Transaction {
  return { id, sender, reciever, amount, timestamp };
}



interface TableProps {
  address: string;
  publicKey: string | string[];
}

export default function StickyHeadTable({ address, publicKey }: TableProps) {


  
  const [transactionDetails, setTransactionDetails] = useState<Transaction[]>([]);

  useEffect(() => {
    const fetchData = async () => {
        const url = 'https://fullnode.devnet.aptoslabs.com/v1/accounts/0xbebe574b455ce6b3ce909b61d856038c25ada16e777521982811c43786e4ec54/transactions?limit=10';

        try {
            const response = await fetch(url);
            const data = await response.json();
            console.log(data);

            // Extracting required transaction details from the response array
            const details = data.map((transaction: any) => {
                const {
                    version,
                    type,
                    sender,
                    timestamp,
                    payload: {
                        function: transactionType,
                        arguments: [amount],
                    },
                    max_gas_amount,
                    gas_unit_price,
                } = transaction;

                // Converting gas to APT
                const gasInAPT = Number(max_gas_amount) * Number(gas_unit_price) * (0.00000001);

                // Building the final transaction object with required details
                return {
                    version,
                    type,
                    sender,
                    timestamp,
                    transactionType,
                    amount,
                    gasInAPT
                };
            });

            setTransactionDetails(details);
        } catch (error) {
            console.error(error);
        }
    }

    fetchData();
}, [address]);



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
            {transactionDetails
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((transaction, index) => {
                return (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={transaction.reciever}
                  >
                    {columns.map((column) => {
                      const value = transaction[column.id];
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
        count={transactionDetails.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
    </>
  );
}
