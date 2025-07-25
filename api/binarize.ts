export function otsuCustomThreshold(src: any): number {
  const blur = new cv.Mat();
  const ksize = new cv.Size(5, 5);
  cv.GaussianBlur(src, blur, ksize, 0, 0, cv.BORDER_DEFAULT);

  const hist = new cv.Mat();

  // ✅ Re-add these definitions:
  const channels = [0];
  const histSize = [256];
  const ranges = [0, 256];

  // Prepare MatVector and compute histogram
  const matVector = new cv.MatVector();
  matVector.push_back(blur);
  cv.calcHist(matVector, channels, new cv.Mat(), hist, histSize, ranges);
  matVector.delete();

  const total = src.rows * src.cols;
  const histData = Array.from(
    { length: 256 },
    (_, i) => hist.floatAt(i, 0) / total,
  );

  const Q = histData.map(
    (
      (sum) => (v) =>
        (sum += v)
    )(0),
  );

  let fnMin = Infinity;
  let thresh = -1;
  const bins = Array.from({ length: 256 }, (_, i) => i);

  for (let i = 1; i < 256; i++) {
    const q1 = Q[i],
      q2 = 1 - Q[i];
    if (q1 < 1e-6 || q2 < 1e-6) continue;

    const p1 = histData.slice(0, i),
      p2 = histData.slice(i);
    const b1 = bins.slice(0, i),
      b2 = bins.slice(i);

    const m1 = p1.reduce((s, v, j) => s + v * b1[j], 0) / q1;
    const m2 = p2.reduce((s, v, j) => s + v * b2[j], 0) / q2;

    const v1 = p1.reduce((s, v, j) => s + v * (b1[j] - m1) ** 2, 0) / q1;
    const v2 = p2.reduce((s, v, j) => s + v * (b2[j] - m2) ** 2, 0) / q2;

    const fn = v1 * q1 + v2 * q2;
    if (fn < fnMin) {
      fnMin = fn;
      thresh = i;
    }
  }

  blur.delete();
  hist.delete();
  return thresh;
}
