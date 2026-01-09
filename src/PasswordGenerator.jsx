import React, { useState, useMemo } from "react";

const PasswordGenerator = () => {
    const [length, setLength] = useState(12);
    const [upper, setUpper] = useState(true);
    const [lower, setLower] = useState(true);
    const [numbers, setNumbers] = useState(true);
    const [symbols, setSymbols] = useState(true);
    const [password, setPassword] = useState("");
    const [copied, setCopied] = useState(false);

    const charset = useMemo(() => {
        let chars = "";
        if (upper) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        if (lower) chars += "abcdefghijklmnopqrstuvwxyz";
        if (numbers) chars += "0123456789";
        if (symbols) chars += "!@#$%^&*()_+[]{}<>?/|~";
        return chars;
    }, [upper, lower, numbers, symbols]);

    const generatePassword = () => {
        if (!charset) {
            setPassword("");
            return;
        }
        let result = "";
        for (let i = 0; i < Number(length); i++) {
            result += charset[Math.floor(Math.random() * charset.length)];
        }
        setPassword(result);
        setCopied(false);
    };

    const copyToClipboard = async () => {
        if (!password) return;
        await navigator.clipboard.writeText(password);
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
    };

    const score = useMemo(() => {
        let s = 0;
        if (upper) s++;
        if (lower) s++;
        if (numbers) s++;
        if (symbols) s++;
        if (length >= 12) s++;
        if (length >= 16) s++;
        return Math.min(s, 6);
    }, [upper, lower, numbers, symbols, length]);

    const strengthLabel = ["Very weak", "Weak", "Fair", "Good", "Strong", "Very strong"][Math.max(0, score - 1)];
    const strengthColor = [
        "bg-red-500",
        "bg-orange-500",
        "bg-yellow-500",
        "bg-emerald-500",
        "bg-green-600",
    ][Math.max(0, Math.min(4, score - 2))];

    return (
        <div className="bg-gray-800 rounded-2xl shadow-xl p-6">
            {/* Display + copy */}
            <div className="flex items-center gap-3 bg-gray-900 rounded-xl p-4">
                <div className="flex-1 font-mono text-lg truncate">{password || "Generate a password…"}</div>
                <button
                    onClick={copyToClipboard}
                    className="px-3 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 active:scale-95 transition"
                    disabled={!password}
                    aria-label="Copy password"
                >
                    {copied ? "Copied!" : "Copy"}
                </button>
            </div>

            {/* Controls */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-1">
                    <label className="block text-sm text-gray-300 mb-2">
                        Length: <span className="font-semibold text-emerald-400">{length}</span>
                    </label>
                    <input
                        type="range"
                        min="6"
                        max="32"
                        value={length}
                        onChange={(e) => setLength(e.target.value)}
                        className="w-full accent-emerald-400"
                        aria-label="Password length"
                    />
                </div>

                <div className="space-y-2">
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={upper}
                            onChange={() => setUpper(!upper)}
                            className="accent-emerald-400"
                        />
                        <span>Include uppercase</span>
                    </label>
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={lower}
                            onChange={() => setLower(!lower)}
                            className="accent-emerald-400"
                        />
                        <span>Include lowercase</span>
                    </label>
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={numbers}
                            onChange={() => setNumbers(!numbers)}
                            className="accent-emerald-400"
                        />
                        <span>Include numbers</span>
                    </label>
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={symbols}
                            onChange={() => setSymbols(!symbols)}
                            className="accent-emerald-400"
                        />
                        <span>Include symbols</span>
                    </label>
                </div>
            </div>

            {/* Strength meter */}
            <div className="mt-6">
                <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-300">Strength</span>
                    <span className="text-sm font-semibold">{strengthLabel || "Very weak"}</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                        className={`h-full ${strengthColor} transition-all duration-300`}
                        style={{ width: `${(score / 6) * 100}%` }}
                    />
                </div>
            </div>

            {/* Generate button */}
            <div className="mt-6 flex items-center justify-between">
                <button
                    onClick={generatePassword}
                    className="w-full md:w-auto bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-4 py-2 rounded-lg transition active:scale-95"
                >
                    Generate
                </button>
                <p className="hidden md:block text-xs text-gray-400 md:ml-4">
                    Tip: Use 12+ length with all sets for strong passwords.
                </p>
            </div>
        </div>
    );
};

export default PasswordGenerator;