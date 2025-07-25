export function openMorph(src: any): any {
  const dst = new cv.Mat();
  const kernel = cv.Mat.ones(3, 3, cv.CV_8U); // smaller kernel
  const anchor = new cv.Point(-1, -1);
  cv.morphologyEx(
    src,
    dst,
    cv.MORPH_OPEN,
    kernel,
    anchor,
    1,
    cv.BORDER_CONSTANT,
    cv.morphologyDefaultBorderValue(),
  );
  kernel.delete();
  return dst;
}
