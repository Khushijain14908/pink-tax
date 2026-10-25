// Where raw Bright Data search results are saved, one file per search.
export function rawFile(type: string, gender: string) {
  return `scripts/raw/${type.replace(/\W+/g, "-")}-${gender}.json`;
}

export function brandRawFile(id: string, gender: string) {
  return `scripts/raw/brand-${id}-${gender}.json`;
}
