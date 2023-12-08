import { createContext, useContext } from 'react';
import { Account } from './types';

export const AccountContext = createContext<Account | null>(null);

export function useAccountContext() {
  const account = useContext(AccountContext);

//   if (account === null) {
//     throw new Error('useAccountContext must be used within an AccountContext');
//   }
  return account;
}