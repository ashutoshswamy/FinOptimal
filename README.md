# FinOptimal - Smart Financial Calculators

FinOptimal is a comprehensive, modern web application that provides a suite of intelligent financial calculators. Built with Next.js, TypeScript, and ShadCN UI, it offers a clean, responsive, and user-friendly interface to help users make informed financial decisions. The application covers a wide range of calculations, from basic investment planning to complex derivatives and tax estimations.

## ✨ Features

The application includes a wide array of calculators designed for various financial needs:

### Investment Planning
- **SIP Calculator**: Estimate the future value of your Systematic Investment Plans.
- **Lumpsum Calculator**: Project the future value of a one-time investment.
- **Step-Up SIP Calculator**: Model SIP returns with annual investment increments.
- **Retirement Planner**: Assess your retirement corpus and determine if you're on track.
- **NPS Calculator**: Estimate your National Pension Scheme wealth and monthly pension.
- **SWP Calculator**: Plan systematic withdrawals from your investments.
- **STP Calculator**: Plan your Systematic Transfer Plan from one fund to another.

### Loans & Taxes
- **EMI Calculator**: Calculate your Equated Monthly Installment for loans.
- **Income Tax Calculator**: Compare your tax liability under the old and new tax regimes.

### Trading & Derivatives
- **Brokerage Calculator**: Estimate the charges for your equity trades.
- **Black-Scholes Calculator**: Calculate European option prices and Greeks.
- **MTF Calculator**: Estimate costs for trading with Margin Trading Facility.
- **F&O Margin Calculator**: Estimate margin for shorting options (simplified).
- **Equity Futures Calculator**: Calculate potential profit or loss for futures contracts.
- **Equity Margin Calculator**: Conceptually estimate SPAN & Exposure margin for options.
- **Commodity Margin Calculator**: Estimate margin for commodity futures.
- **Currency Derivatives Margin Calculator**: Conceptually estimate margin for USD/INR futures.

### AI-Powered Insights
- **Financial Insight Generator**: Leverages Generative AI (via Genkit) to provide plain-English explanations for complex financial situations and decisions.

## 🚀 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
- **AI Integration**: [Genkit](https://firebase.google.com/docs/genkit)
- **Charts**: [Recharts](https://recharts.org/)

## ⚙️ Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v18 or newer recommended)
- `npm` or `yarn`

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/your-username/finoptimal.git
   cd finoptimal
   ```

2. **Install NPM packages:**
   ```sh
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file in the root of the project and add your Genkit/Google AI API keys if you intend to use the AI features.
   ```env
   GEMINI_API_KEY=YOUR_API_KEY
   ```

### Running the Application

- **Development Server:**
  To run the app in development mode with hot-reloading:
  ```sh
  npm run dev
  ```
  Open [http://localhost:9002](http://localhost:9002) to view it in the browser.

- **Genkit Development Server:**
  To run the Genkit flows locally for testing AI features:
  ```sh
  npm run genkit:dev
  ```

- **Production Build:**
  To build the application for production:
  ```sh
  npm run build
  ```
  To start the production server:
  ```sh
  npm run start
  ```

## 🤝 Contributing

Contributions are welcome! If you have suggestions for improvements or new features, feel free to open an issue or submit a pull request.
