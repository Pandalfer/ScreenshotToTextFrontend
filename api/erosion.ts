export function erosion(src: any): any {
  const dst = new cv.Mat();
  const M = cv.Mat.ones(5, 5, cv.CV_8U);
  const anchor = new cv.Point(-1, -1);

  cv.erode(
    src,
    dst,
    M,
    anchor,
    1,
    cv.BORDER_CONSTANT,
    cv.morphologyDefaultBorderValue(),
  );

  M.delete();
  return dst;
}
