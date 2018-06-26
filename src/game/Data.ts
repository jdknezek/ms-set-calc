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

export function parseID(ids: string, index: number) {
  const start = 1 + index * 3;
  return +ids.slice(start, start + 3);
}

export function parseIDs(ids: string) {
  return [0, 1, 2].map(index => parseID(ids, index));
}
