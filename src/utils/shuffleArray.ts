export default function shuffleArray<T>(a: Array<T>): void {
  const l = a.length;
  for (let i = 0; i < l; i++) {
    const r = Math.floor(Math.random() * l);
    const r2 = Math.floor(Math.random() * l);
    const temp = a[r];
    a[r] = a[r2];
    a[r2] = temp;
  }
}
