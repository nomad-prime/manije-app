'use client';

import { useState, useEffect, useMemo } from 'react';

const brailleSpinners = [
  ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧'],
  ['⠐', '⠒', '⠓', '⠋', '⠙', '⠹', '⠸', '⠼'],
  ['⠁', '⠂', '⠄', '⡀', '⢀', '⠠', '⠐', '⠈'],
  ['⡏', '⡟', '⡻', '⣻', '⣿', '⣯', '⣧', '⡧'],
  ['⣷', '⣯', '⣟', '⡿', '⢿', '⠿', '⠷', '⣶'],
  ['⠋', '⠙', '⠚', '⠞', '⠖', '⠦', '⠴', '⠲'],
  ['⢹', '⢺', '⢼', '⣸', '⣇', '⡧', '⡏', '⡃'],
];

const LoadingDots = () => {
  const [frame, setFrame] = useState(-1);

  const currentSpinner = useMemo(() => {
    return brailleSpinners[Math.floor(Math.random() * brailleSpinners.length)];
  }, []);

  useEffect(() => {
    setFrame(0);
    const interval = setInterval(() => {
      setFrame((prev) => prev + 1);
    }, 80);

    return () => clearInterval(interval);
  }, []);

  if (frame < 0) return <span className="inline-flex items-center justify-center ml-1 font-mono text-lg">&nbsp;</span>;

  return (
    <span className="inline-flex items-center justify-center ml-1 font-mono text-lg">
      {currentSpinner[frame % currentSpinner.length]}
    </span>
  );
};

export default LoadingDots;
