export function deskewImage(src: any): any {
  const gray = new cv.Mat();
  cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);

  // Invert if necessary to make text white
  const mean = cv.mean(gray)[0];
  if (mean < 127) {
    cv.bitwise_not(gray, gray);
  }

  // Edge detection
  const edges = new cv.Mat();
  cv.Canny(gray, edges, 50, 150);

  // Hough Line Transform
  const lines = new cv.Mat();
  cv.HoughLines(edges, lines, 1, Math.PI / 180, 100);

  let angle = 0.0;
  let count = 0;

  for (let i = 0; i < lines.rows; ++i) {
    const rho = lines.data32F[i * 2];
    const theta = lines.data32F[i * 2 + 1];

    // Filter near-horizontal lines only
    const deg = theta * (180 / Math.PI);
    if (deg > 45 && deg < 135) {
      angle += theta;
      count++;
    }
  }

  let correctedAngle = 0;
  if (count > 0) {
    angle /= count;
    correctedAngle = (angle * 180) / Math.PI - 90;
  }

  // Rotate to correct skew
  const center = new cv.Point(src.cols / 2, src.rows / 2);
  const M = cv.getRotationMatrix2D(center, correctedAngle, 1);
  const dst = new cv.Mat();
  cv.warpAffine(
    src,
    dst,
    M,
    new cv.Size(src.cols, src.rows),
    cv.INTER_LINEAR,
    cv.BORDER_CONSTANT,
    new cv.Scalar(),
  );

  // Clean up
  gray.delete();
  edges.delete();
  lines.delete();
  M.delete();

  return dst;
}
