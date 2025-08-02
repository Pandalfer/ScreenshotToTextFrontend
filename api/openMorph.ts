export function openMorph(src: any): any {
  const dst = new cv.Mat();
  const kernel = cv.Mat.ones(3, 3, cv.CV_8U);
  cv.morphologyEx(src, dst, cv.MORPH_CLOSE, kernel);
  kernel.delete();
  return dst;
}
