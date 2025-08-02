// import { otsuCustomThreshold } from "./binarize.ts";
import { openMorph } from "./openMorph.ts";
import { deskewImage } from "./deskew.ts";

export const preprocessImage = (file: File): Promise<Blob> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const scale = 4;
      const canvas = document.createElement("canvas");
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 2, 2, canvas.width, canvas.height);

      const src = cv.imread(canvas);
      const deskewed = deskewImage(src);
      const gray = new cv.Mat();
      cv.cvtColor(deskewed, gray, cv.COLOR_RGBA2GRAY);

      const mean = cv.mean(gray)[0];
      if (mean < 127) {
        cv.bitwise_not(gray, gray);
      }

      const binarized = new cv.Mat();
      const thresholdValue = cv.threshold(
        gray,
        binarized,
        0,
        255,
        cv.THRESH_BINARY + cv.THRESH_OTSU,
      );
      cv.threshold(gray, binarized, thresholdValue, 255, cv.THRESH_BINARY);
      const clahe = new cv.CLAHE(2.0, new cv.Size(8, 8));
      clahe.apply(gray, gray);
      clahe.delete();

      let finalMat = binarized;

      if (mean < 200 && mean > 50) {
        finalMat = openMorph(binarized);
        binarized.delete(); // safe to delete after morph
      }

      cv.imshow(canvas, finalMat);

      canvas.toBlob((blob) => {
        deskewed.delete();
        gray.delete();
        finalMat.delete(); // whichever mat was displayed is now deleted
        if (blob) resolve(blob);
      }, "image/png");
    };

    img.src = URL.createObjectURL(file);
  });
};
