export function getAuthorString(authors: string[]) {
    return authors.map((author, i) =>
      i === authors.length - 1 ? author : author + ", "
    );
  }