import { useEffect, useState } from "react";

export function useTypingWords(words, speed = 70, pause = 1400) {
  const [wordIndex, setWordIndex] = useState(0);
  const [letterCount, setLetterCount] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!words.length) {
      return undefined;
    }

    const word = words[wordIndex];
    const complete = letterCount === word.length;
    const empty = letterCount === 0;
    const delay = complete && !deleting ? pause : deleting ? speed / 1.8 : speed;

    const timer = window.setTimeout(() => {
      if (complete && !deleting) {
        setDeleting(true);
        return;
      }

      if (empty && deleting) {
        setDeleting(false);
        setWordIndex((current) => (current + 1) % words.length);
        return;
      }

      setLetterCount((current) => current + (deleting ? -1 : 1));
    }, delay);

    return () => window.clearTimeout(timer);
  }, [deleting, letterCount, pause, speed, wordIndex, words]);

  return words[wordIndex]?.slice(0, letterCount) || "";
}

