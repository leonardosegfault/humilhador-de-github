export default function truncateString(content: string, max: number) {
  if (content.length > max) {
    return content.slice(0, max - 3) + "...";
  }

  return content;
}
