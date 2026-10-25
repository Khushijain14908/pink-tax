// Where raw Bright Data search results are saved, one file per search.
export function rawFile(type: string, gender: string) {
  return `scripts/raw/${type.replace(/\W+/g, "-")}-${gender}.json`;
}
