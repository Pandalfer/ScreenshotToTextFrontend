export function deskewImage(src: any): any {
  const gray = new cv.Mat();
  cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);

  const mean = cv.mean(gray)[0];
  if (mean < 127) {
    cv.bitwise_not(gray, gray);
  }

  cv.GaussianBlur(gray, gray, new cv.Size(3, 3), 0);

  const edges = new cv.Mat();
  cv.Canny(gray, edges, 50, 150);

  const lines = new cv.Mat();
  cv.HoughLines(edges, lines, 1, Math.PI / 180, 100);

  const angles = [];
  for (let i = 0; i < lines.rows; ++i) {
    const theta = lines.data32F[i * 2 + 1];
    const deg = theta * (180 / Math.PI);
    if (deg > 45 && deg < 135) {
      angles.push(theta);
    }
  }

  let correctedAngle = 0;
  if (angles.length > 0) {
    angles.sort();
    const medianTheta = angles[Math.floor(angles.length / 2)];
    correctedAngle = (medianTheta * 180) / Math.PI - 90;
  } else {
    gray.delete();
    edges.delete();
    lines.delete();
    return src.clone(); // fallback, no skew detected
  }

  if (Math.abs(correctedAngle) < 0.1) {
    gray.delete();
    edges.delete();
    lines.delete();
    return src.clone();
  }

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
    new cv.Scalar(255, 255, 255, 255),
  );

  gray.delete();
  edges.delete();
  lines.delete();
  M.delete();

  return dst;
}
