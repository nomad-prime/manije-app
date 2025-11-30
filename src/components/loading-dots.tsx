'use client';

import { useState, useEffect, useMemo } from 'react';

const LoadingDots = () => {
  const [frame, setFrame] = useState(0);


  const currentSpinner = useMemo(() => {
    const brailleSpinners = [
      ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧'],
      ['⠐', '⠒', '⠓', '⠋', '⠙', '⠹', '⠸', '⠼'],
      ['⠁', '⠂', '⠄', '⡀', '⢀', '⠠', '⠐', '⠈'],
      ['⡏', '⡟', '⡻', '⣻', '⣿', '⣯', '⣧', '⡧'],
      ['⣷', '⣯', '⣟', '⡿', '⢿', '⠿', '⠷', '⣶'],
      ['⠋', '⠙', '⠚', '⠞', '⠖', '⠦', '⠴', '⠲'],
      ['⢹', '⢺', '⢼', '⣸', '⣇', '⡧', '⡏', '⡃'],
    ];

    return brailleSpinners[Math.floor(Math.random() * brailleSpinners.length)];
  }, []);

  const currentChar = currentSpinner[frame % currentSpinner.length];

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame((prev) => prev + 1);
    }, 80);

    return () => clearInterval(interval);
  }, []);

  return (
    <span className="inline-flex items-center justify-center ml-1 font-mono text-lg">
      {currentChar}
    </span>
  );
};

export default LoadingDots;
