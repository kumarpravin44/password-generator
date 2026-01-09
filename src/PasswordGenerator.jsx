import React, { useMemo, useState } from "react";

const upperSet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const lowerSet = "abcdefghijklmnopqrstuvwxyz";
const numberSet = "0123456789";
const symbolSet = "!@#$%^&*()_+[]{}<>?/|~";

const PasswordGenerator = () => {
    const [length, setLength] = useState(12);
    const [includeUpper, setIncludeUpper] = useState(true);
    const [includeLower, setIncludeLower] = useState(true);
    const [includeNumbers, setIncludeNumbers] = useState(true);
    const [includeSymbols, setIncludeSymbols] = useState(true);

    const [password, setPassword] = useState("");
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState("");

    // Build charset based on toggles
    const charset = useMemo(() => {
        let chars = "";
        if (includeUpper) chars += upperSet;
        if (includeLower) chars += lowerSet;
        if (includeNumbers) chars += numberSet;
        if (includeSymbols) chars += symbolSet;
        return chars;
    }, [includeUpper, includeLower, includeNumbers, includeSymbols]);

    // Strength scoring (simple heuristic)
    const score = useMemo(() => {
        let s = 0;
        if (includeUpper) s++;
        if (includeLower) s++;
        if (includeNumbers) s++;
        if (includeSymbols) s++;
        if (length >= 12) s++;
        if (length >= 16) s++;
        return Math.min(s, 6);
    }, [includeUpper, includeLower, includeNumbers, includeSymbols, length]);

    const strengthLabel = [
        "Very weak",
        "Weak",
        "Fair",
        "Good",
        "Strong",
        "Very strong",
    ][Math.max(0, score - 1)];

    const strengthColor = [
        "bg-red-500",
        "bg-orange-500",
        "bg-yellow-500",
        "bg-emerald-500",
        "bg-green-600",
    ][Math.max(0, Math.min(4, score - 2))];

    const generatePassword = () => {
        // Validation: at least one checkbox must be selected
        if (!includeUpper && !includeLower && !includeNumbers && !includeSymbols) {
            setPassword("");
            setError("At least one option must be selected!");
            return;
        }
        setError("");

        const len = Number(length);
        if (!charset || len <= 0) {
            setPassword("");
            setError("Invalid configuration.");
            return;
        }

        let result = "";

        // Ensure at least one of each selected type appears
        const buckets = [];
        if (includeUpper) buckets.push(upperSet);
        if (includeLower) buckets.push(lowerSet);
        if (includeNumbers) buckets.push(numberSet);
        if (includeSymbols) buckets.push(symbolSet);

        buckets.forEach((bucket) => {
            result += bucket[Math.floor(Math.random() * bucket.length)];
        });

        for (let i = result.length; i < len; i++) {
            result += charset[Math.floor(Math.random() * charset.length)];
        }

        // Shuffle
        result = result
            .split("")
            .sort(() => Math.random() - 0.5)
            .join("");

        setPassword(result);
        setCopied(false);
    };

    const copyToClipboard = async () => {
        if (!password || error) return;
        await navigator.clipboard.writeText(password);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    return (
        <div className="bg-gray-800 rounded-2xl shadow-xl p-6">
            {/* Display + copy */}
            <div className="flex items-center gap-3 bg-gray-900 rounded-xl p-4 relative">
                <div
                    className={`flex-1 font-mono text-lg truncate ${password ? "text-white" : "text-gray-400"
                        }`}
                >
                    {password || "Generate a password…"}
                </div>

                <div className="relative">
                    <button
                        onClick={copyToClipboard}
                        disabled={!password || !!error}
                        className={`px-3 py-2 rounded-lg text-sm transition relative
              ${!password || !!error
                                ? "bg-gray-600 cursor-not-allowed"
                                : "bg-blue-500 hover:bg-blue-600 active:scale-95"
                            }`}
                        aria-label="Copy password"
                    >
                        Copy
                    </button>

                    {copied && (
                        <div className="absolute -top-9 right-0 bg-black text-white text-xs rounded-md px-2 py-1 shadow-lg animate-fade-in-up">
                            Copied!
                        </div>
                    )}
                </div>
            </div>

            {/* Error message */}
            {error && (
                <p className="mt-2 text-red-400 font-semibold text-sm animate-fade-in-up">
                    {error}
                </p>
            )}

            {/* Controls */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-1">
                    <label className="block text-sm text-gray-300 mb-2">
                        <span className="mr-2">Length:</span>
                        <span className="font-semibold text-emerald-400">{length}</span>
                    </label>
                    <input
                        type="range"
                        min="6"
                        max="32"
                        value={length}
                        onChange={(e) => setLength(Number(e.target.value))}
                        className="w-full accent-emerald-400"
                        aria-label="Password length"
                    />
                </div>

                <div className="space-y-2">
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={includeUpper}
                            onChange={() => setIncludeUpper(!includeUpper)}
                            className="accent-emerald-400"
                        />
                        <span>Include uppercase</span>
                    </label>
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={includeLower}
                            onChange={() => setIncludeLower(!includeLower)}
                            className="accent-emerald-400"
                        />
                        <span>Include lowercase</span>
                    </label>
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={includeNumbers}
                            onChange={() => setIncludeNumbers(!includeNumbers)}
                            className="accent-emerald-400"
                        />
                        <span>Include numbers</span>
                    </label>
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={includeSymbols}
                            onChange={() => setIncludeSymbols(!includeSymbols)}
                            className="accent-emerald-400"
                        />
                        <span>Include symbols</span>
                    </label>
                    {!includeUpper && !includeLower && !includeNumbers && !includeSymbols && (
                        <p className="text-xs text-red-400">At least one option must be selected.</p>
                    )}
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
                    className="w-full md:w-auto bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-4 py-2 rounded-lg transition active:scale-95 animate-pulse-once"
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