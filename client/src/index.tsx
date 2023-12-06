import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { PetraWallet } from "petra-plugin-wallet-adapter";
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
// import  Uplaod  from './Pages/Upload';

const wallets = [new PetraWallet()];

declare global {
  interface Window { aptos: any; }
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
window.addEventListener('load', () => {
  root.render(
    <React.StrictMode>
      <AptosWalletAdapterProvider plugins={wallets} autoConnect={true}>
        <App />
      </AptosWalletAdapterProvider>
    </React.StrictMode>
  );
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
