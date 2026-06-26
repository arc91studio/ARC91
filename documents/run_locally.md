# Running the Project Locally

This project uses Vite as its development server. Follow the step-by-step instructions below to run the project on your local machine.

## Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed on your machine. This project requires Node.js and npm (Node Package Manager) to install dependencies and run the development server.

## Step-by-Step Instructions

1. **Open your terminal:**
   Ensure your terminal or command prompt is open and navigated to the root directory of the project (`d:\GowthamPitla\Projects\Demo1`).

2. **Install dependencies:**
   Before running the project for the first time, you need to install all required dependencies. Run the following command in your terminal:
   ```bash
   npm install
   ```

3. **Start the local development server:**
   Once the dependencies are installed, you can start the Vite development server by running:
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   After running the start command, the terminal will output a local server URL (usually `http://localhost:5173/` or similar).
   Open that URL in your web browser to view the live project. Any changes you make to the code will automatically reflect in the browser thanks to Vite's Hot Module Replacement (HMR).

## Additional Commands

- **Build for production:**
  To generate a production-ready build in the `dist` folder, run:
  ```bash
  npm run build
  ```

- **Preview production build:**
  To locally preview the production build you just created, run:
  ```bash
  npm run preview
  ```
