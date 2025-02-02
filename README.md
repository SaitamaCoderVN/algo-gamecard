# AlgoBooks - NFT Game Card Platform on Algorand

AlgoBooks is a platform for buying and selling NFT game cards, built on the Algorand blockchain. This project uses Next.js and integrates with the Pera Wallet to handle transactions.

## Key Features

- Displays a list of NFT cards with detailed information
- Searches for cards by name or rarity
- Connects with the Pera Wallet
- Adds cards to the shopping cart
- Pays with ALGO through the Algorand blockchain

## Technologies Used

- Next.js
- React
- TypeScript
- Tailwind CSS
- Algorand SDK
- Pera Wallet Connect

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/SaitamaCoderVN/algo-gamecard.git
   ```

2. Move into the project directory:
   ```
   cd algo-gamecard
   ```

3. Install the dependencies:
   ```
   pnpm install
   ```

4. Run the application in development mode:
   ```
   pnpm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to view the result.

## Project Structure

- `app/`: Contains the main components and pages of the application
- `app/components/`: Contains reusable components
- `app/providers.tsx`: Configures the WalletProvider for the application
- `public/`: Contains static resources such as images

## Contributing

We welcome any contributions to the project. Please create an issue or pull request if you want to contribute.

## License

This project is distributed under the MIT license. See the `LICENSE` file for more details.
