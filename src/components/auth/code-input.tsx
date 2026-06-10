"use client";

import { useRef, useCallback } from "react";

export default function CodeInput({ onComplete }: { onComplete: (code: string) => void }) {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = useCallback((index: number, value: string) => {
    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
    const code = inputsRef.current.map((inp) => inp?.value || "").join("");
    if (code.length === 6) {
      onComplete(code);
    }
  }, [onComplete]);

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !inputsRef.current[index]?.value && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    pasted.split("").forEach((char, i) => {
      if (inputsRef.current[i]) {
        inputsRef.current[i]!.value = char;
      }
    });
    if (pasted.length === 6) {
      onComplete(pasted);
    } else {
      inputsRef.current[pasted.length]?.focus();
    }
  };

  return (
    <div className="flex gap-2 justify-center" onPaste={handlePaste}>
      {Array.from({ length: 6 }).map((_, i) => (
        <input
          key={i}
          ref={(el) => { inputsRef.current[i] = el; }}
          type="text"
          maxLength={1}
          inputMode="numeric"
          pattern="[0-9]"
          autoFocus={i === 0}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          className="h-12 w-10 rounded-lg border border-border text-center text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-ring"
        />
      ))}
    </div>
  );
}
