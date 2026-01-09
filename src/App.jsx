import React from "react";
import PasswordGenerator from "./PasswordGenerator";
import "./index.css";

const App = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-2xl mx-auto p-6">
        <header className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">
            🔐 Password Generator
          </h1>
          <span className="text-sm text-gray-400">React + Tailwind</span>
        </header>
        <PasswordGenerator />
      </div>
    </div>
  );
};

export default App;