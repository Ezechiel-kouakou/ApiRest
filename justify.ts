
export function justifyText(input: string, lineLength = 80): string {
  // Normalize spaces and split into words
  const words = input
    .replace(/\r\n/g, '\n')
    .split(/\s+/)
    .filter(Boolean);

  if (words.length === 0) return '';

  const lines: string[] = [];
  let currentLineWords: string[] = [];
  let currentLen = 0; // length of words + minimal spaces

  for (const w of words) {
    if (currentWordsFits(w)) {
      addWord(w);
    } else {
      flushLine();
      addWord(w);
    }
  }
  if (currentLineWords.length > 0) flushLineLast();

  return lines.join('\n');

  function currentWordsFits(nextWord: string) {
    if (currentLineWords.length === 0) {
      return nextWord.length <= lineLength;
    }
    // spaces needed = number of words (currentLineWords.length) (one space between words)
    return currentLen + 1 + nextWord.length <= lineLength;
  }

  function addWord(w: string) {
    if (currentLineWords.length === 0) {
      currentLineWords.push(w);
      currentLen = w.length;
    } else {
      currentLineWords.push(w);
      currentLen += 1 + w.length; // one space + word
    }
  }

  function flushLine() {
    // fully justify currentLineWords into exactly lineLength characters
    if (currentLineWords.length === 1) {
      // single word -> left align and pad spaces to the right
      const s = currentLineWords[0] + ' '.repeat(lineLength - currentLineWords[0].length);
      lines.push(s);
    } else {
      const totalWordsLen = currentLineWords.reduce((a, b) => a + b.length, 0);
      const totalSpaces = lineLength - totalWordsLen;
      const gaps = currentLineWords.length - 1;
      const baseSpace = Math.floor(totalSpaces / gaps);
      let extra = totalSpaces % gaps;

      let line = '';
      for (let i = 0; i < currentLineWords.length; i++) {
        line += currentLineWords[i];
        if (i < gaps) {
          const s = baseSpace + (extra > 0 ? 1 : 0);
          line += ' '.repeat(s);
          if (extra > 0) extra--;
        }
      }
      lines.push(line);
    }
    // reset
    currentLineWords = [];
    currentLen = 0;
  }

  function flushLineLast() {
    // last line -> left-justify (single space between words) but no padding needed usually.
    const s = currentLineWords.join(' ');
    lines.push(s);
  }
}
