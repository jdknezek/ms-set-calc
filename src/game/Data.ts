export interface Record {
  [column: string]: string
}

export function parseText(text: string) {
  const lines = text
    .trim()
    .split(/\r\n|\r|\n/)
    .filter(line => line !== '')
    .map(line => line.split(','));

  const headers = lines[0];

  return lines
    .slice(1)
    .map(line => line
      .reduce((record, value, index) => {
        record[headers[index]] = value;
        return record;
      }, {} as Record)
    );
}

export function parseInt(encoded: string, start: number, length: number) {
  return +encoded.slice(++start, start + length);
}

export function parseInts(encoded: string, length: number) {
  const ints = [];
  for (let start = 0; start < encoded.length; start += length) {
    ints.push(parseInt(encoded, start, length));
  }
  return ints;
}
