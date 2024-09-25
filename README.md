# 🖥️ Fluffy POS Desktop App

**Fluffy POS** is a desktop-based Point of Sale (POS) system built with Electron and React. This app is designed to streamline sales operations, providing a smooth user experience and enabling integration with hardware like receipt printers.

## 🎯 Key Features

- 🖱️ **Desktop Application**: Built with Electron for a native-like experience on Windows, macOS, and Linux.
- 🛒 **Point of Sale Management**: Manage sales, inventory, and orders from a single application.
- 🧾 **Printer Integration**: Seamless integration with ESC/POS printers using `@node-escpos`.
- 🗂️ **Modular Architecture**: Separate main, preload, and renderer processes for better maintainability.
- ⚡ **Fast Performance**: Using Vite for blazing-fast builds and hot-reloading.

## 🛠️ Technologies Used

- **Electron**: Cross-platform desktop app framework.
- **React**: Frontend library for building the user interface.
- **Apollo Client**: For GraphQL queries and state management.
- **Mantine**: UI library for React, offering customizable and responsive components.
- **ESC/POS**: Support for printing to various receipt printers.

## 🚀 Getting Started

Follow these steps to get the Fluffy POS app running on your machine.

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/fluffy-electron.git
cd fluffy-electron
```

### 2. Install Dependencies

Using `pnpm`:

```bash
pnpm install
```

### 3. Run the App in Development Mode

To start the app in development mode:

```bash
pnpm run watch
```

### 4. Build the Application

To build the Electron app for production:

```bash
pnpm run compile
```

### 5. Running Tests

Run tests to ensure the app is functioning correctly:

```bash
pnpm run test
```

## 📦 Project Structure

```bash
├── packages
│   ├── main       # Main process code
│   ├── preload    # Preload scripts
│   ├── renderer   # React frontend (renderer process)
├── .electron-builder.config.js  # Electron Builder configuration
└── scripts       # Automation scripts
```

## 🔌 ESC/POS Printer Setup

Fluffy POS supports ESC/POS printers via `@node-escpos`. Make sure you have the correct USB drivers installed for your printer:

1. Install USB adapter package:
   ```bash
   pnpm add @node-escpos/usb-adapter
   ```
2. Use the `escpos` API to connect and print from the app.

## 🌍 Environment Variables

Ensure you set the correct environment variables by creating a `.env` file in the root:

```
API_URL=https://yourapiurl.com
FIREBASE_KEY=yourfirebaseapikey
```

## 🛠️ Development Commands

- **Build**: `pnpm run build` – Create production builds.
- **Linting**: `pnpm run lint` – Check for code style and issues.
- **Type Checking**: `pnpm run typecheck` – Ensure TypeScript types are correct.
