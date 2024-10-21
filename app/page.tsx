"use client"
import { PeraWalletConnect } from "@perawallet/connect";
import { useEffect, useState } from "react";
import { FaShoppingCart, FaWallet, FaSearch, FaUser, FaFacebook, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';
import algosdk from 'algosdk';
import { NetworkId, useWallet } from '@txnlab/use-wallet-react';
import React from "react";
import CartSummary from './components/CartSummary';
import Image from 'next/image';

const peraWallet = new PeraWalletConnect();

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  rarity: string;
  power: number;
}

export default function Home() {
  const {
    algodClient,
    activeAddress,
    setActiveNetwork,
    transactionSigner,
    wallets
  } = useWallet();
  const [accountAddress, setAccountAddress] = useState<string | null>(null);
  const isConnectedToPeraWallet = !!accountAddress;
  const [products] = useState<Product[]>([
    { id: 1, name: "Fire Dragon", price: 0.015, image: "https://salmon-raw-harrier-526.mypinata.cloud/ipfs/QmWtAAvZ2U7kwKPqzX1pFcgH1pADgseHDQNFzvxpMDFa1Z", description: "Powerful fire-breathing dragon", rarity: "Legendary", power: 95 },
    { id: 2, name: "Ice Wizard", price: 0.02, image: "https://salmon-raw-harrier-526.mypinata.cloud/ipfs/QmQ6hCrn4rZgDWqHL7cwb1ncZsQWgDprgcF8VW1SswPeL9", description: "Master of ice magic", rarity: "Epic", power: 88 },
    { id: 3, name: "Forest Elf", price: 0.018, image: "https://salmon-raw-harrier-526.mypinata.cloud/ipfs/QmbY4eTpEtCAnUwiTGT3vTPnSHYhZcLj5xEuW3qS2t6LDY", description: "Agile archer from the enchanted forest", rarity: "Rare", power: 75 },
    // ... thêm các sản phẩm khác ...
  ]);
  const [cart, setCart] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    peraWallet
      .reconnectSession()
      .then((accounts: string[]) => {
        peraWallet.connector?.on("disconnect", handleDisconnectWalletClick);
        if (accounts.length) {
          setAccountAddress(accounts[0]);
        }
      })
      .catch((e: Error) => console.log(e));
  }, [handleDisconnectWalletClick]);

  function handleConnectWalletClick() {
    wallets[0]
      .connect()
      .then((newAccounts) => {
        peraWallet.connector?.on("disconnect", handleDisconnectWalletClick);
        setAccountAddress(newAccounts[0].address);
        setActiveNetwork(NetworkId.TESTNET);
        wallets[0].setActiveAccount(newAccounts[0].address)
      })
      .catch((error) => {
        if (error?.data?.type !== "CONNECT_MODAL_CLOSED") {
          console.log(error);
        }
      });
  }

  function handleDisconnectWalletClick() {
    wallets[0].disconnect();
    setAccountAddress(null);
  }

  function addToCart(product: Product) {
    setCart((prevCart) => [...prevCart, product]);
  }

  async function handlePurchase() {
    if (!accountAddress || !activeAddress) {
      alert('Please connect your wallet before making a payment.');
      return;
    }

    const totalAmount = cart.reduce((sum, item) => sum + item.price, 0);

    try {
      const atc = new algosdk.AtomicTransactionComposer()
      const suggestedParams = await algodClient.getTransactionParams().do()
      const transaction = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        suggestedParams: suggestedParams,
        from: accountAddress,
        to: "DTUA424DKCJYPHF5MLO6CL4R2BWOTH2GLOUQA257K5I7G65ENHSDJ4TTTE",
        amount: totalAmount * 1000000,
      });
      
      atc.addTransaction({ txn: transaction, signer: transactionSigner })

      const result = await atc.execute(algodClient, 2)
      console.info(`Transaction successful!`, {
        confirmedRound: result.confirmedRound,
        txIDs: result.txIDs
      })
      alert('Payment successful!')
      setCart([]);
    } catch (error) {
      console.error('Error during transaction:', error)
      alert('An error occurred during payment. Please try again.')
    }
  }

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.rarity.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold text-purple-500">NFT Game Cards</h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for cards..."
                className="py-2 px-4 pr-10 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FaSearch className="absolute right-3 top-3 text-gray-400" />
            </div>
            <button
              className="bg-white text-blue-600 px-4 py-2 rounded-full flex items-center hover:bg-blue-100 transition duration-300"
              onClick={isConnectedToPeraWallet ? handleDisconnectWalletClick : handleConnectWalletClick}
            >
              <FaWallet className="mr-2" />
              {isConnectedToPeraWallet ? "Disconnect wallet" : "Connect Pera wallet"}
            </button>
            <FaUser className="text-2xl cursor-pointer" />
            <div className="relative">
              <FaShoppingCart className="text-2xl cursor-pointer" />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {cart.length}
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-8">
        <h2 className="text-4xl font-semibold mb-8 text-center text-purple-400">Rare NFT Game Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-purple-500 transform transition duration-300 hover:scale-105">
              <Image 
                src={product.image} 
                alt={product.name} 
                width={300} 
                height={300} 
                className="w-full h-64 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-xl mb-1 text-purple-400">{product.name}</h3>
                <p className="text-sm text-gray-400 mb-2">Rarity: {product.rarity}</p>
                <p className="text-sm text-gray-400 mb-2">Power: {product.power}</p>
                <p className="text-gray-300 text-sm mb-4">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-green-400">{product.price} ALGO</span>
                  <button
                    className="bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-purple-700 transition duration-300 flex items-center"
                    onClick={() => addToCart(product)}
                  >
                    <FaShoppingCart className="mr-2" />
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <CartSummary cart={cart} />

        <div className="flex justify-center mt-12">
          <button
            className="bg-purple-600 text-white px-10 py-3 rounded-full text-lg font-semibold hover:bg-purple-700 transition duration-300 shadow-lg"
            onClick={handlePurchase}
          >
            Checkout
          </button>
        </div>
      </main>

      <footer className="bg-gray-800 text-white p-8 mt-12">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">About AlgoBooks</h3>
            <ul className="space-y-2">
              <li>Introduction</li>
              <li>Jobs</li>
              <li>Privacy Policy</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Customer Support</h3>
            <ul className="space-y-2">
              <li>Help Center</li>
              <li>Buying Guide</li>
              <li>Payment Methods</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Partnerships and Affiliates</h3>
            <ul className="space-y-2">
              <li>Terms of Service</li>
              <li>Sell with AlgoBooks</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect with Us</h3>
            <div className="flex space-x-4">
              <FaFacebook className="text-2xl" />
              <FaTwitter className="text-2xl" />
              <FaInstagram className="text-2xl" />
              <FaYoutube className="text-2xl" />
            </div>
          </div>
        </div>
        <div className="mt-8 text-center">
          <p>&copy; 2024 AlgoBooks. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
