import React, { useEffect, useState } from 'react';

export default function GetTransactions() {
    interface Transaction {
        version: number;
        type: string;
        sender: string;
        timestamp: string;
        transactionType: string;
        amount: string;
        gasInAPT: number;
      }
      
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
    }, []);

    return (
        <div>
            {transactionDetails.map((transaction, index) => (
                <div key={index}>
                    <p>Version: {transaction.version}</p>
                    <p>Type: {transaction.type}</p>
                    <p>Sender: {transaction.sender}</p>
                    <p>Timestamp: {transaction.timestamp}</p>
                    <p>Transaction Type: {transaction.transactionType}</p>
                    <p>Amount: {transaction.amount}</p>
                    <p>Gas in APT: {transaction.gasInAPT}</p>
                </div>
            ))}
        </div>
    )
}