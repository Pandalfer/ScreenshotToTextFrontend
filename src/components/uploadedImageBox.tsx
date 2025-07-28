import { useEffect, useState } from "react";
import { FaCopy } from "react-icons/fa";
import { FaDownload } from "react-icons/fa";
import { showToast, ThemedToastContainer } from "./Toasts.tsx";
import LoadingAnimation from "./LoadingAnimation.tsx";

function UploadedImageBox({
  image,
  theme,
  imageName,
  onUpload,
}: {
  image: File;
  theme: string;
  imageName: string;
  onUpload: (file: File | null) => void;
}) {
  const [imageURL, setImageURL] = useState<string>("");
  const [imageText, setImageText] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const copyNotify = () => showToast("Copied!", theme, "success", FaCopy);
  const downloadNotify = () =>
    showToast("Downloaded!", theme, "success", FaDownload);

  const downloadTextFile = (text: string, filename: string) => {
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    const url = URL.createObjectURL(image);
    setImageURL(url);

    const recognizeText = async () => {
      setLoading(true); // Set loading state to true

      try {
        // Preprocess the image first

        // Create FormData to send the image to the backend OCR API (ocr.py)
        const formData = new FormData();
        formData.append("file", image, "image.png"); // Preprocessed image

        // Make the API request to the serverless function (e.g., /api/ocr)
        const response = await fetch("/api/ocr", {
          method: "POST",
          body: formData,
        });

        // Check if the response is OK
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        // Parse the response from the serverless function
        const json = await response.json();

        // Extract the text from the response
        const extractedText = json?.text || ""; // Assuming your OCR API returns a 'text' field

        // Set the extracted text or fallback message
        if (extractedText.trim()) {
          setImageText(extractedText);
        } else {
          setImageText("No text found");
        }
      } catch (err) {
        console.error("OCR error:", err);
        setImageText("Failed to extract text");
      } finally {
        setLoading(false); // Turn off the loading state
      }
    };

    recognizeText();

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [image]);

  return (
    <div
      className={`${theme ? "dark" : ""} bg-(--card-light) dark:bg-(--card-dark) w-3/4 min-h-[60%] relative rounded-[35px] m-auto`}
    >
      <button
        className={`${theme ? "dark" : ""} bg-(--button-light) dark:bg-(--button-dark)
				text-(--text-main-light) dark:text-(--text-main-dark) px-12 py-3
				text-[20px] mx-6 my-7 rounded-[35px] border border-(--border) font-bold cursor-pointer`}
        onClick={() => onUpload(null)}
      >
        Start Over
      </button>

      <div
        className={`${theme ? "dark" : ""} bg-(--button-light) dark:bg-(--button-dark) text-(--text-main-light) dark:text-(--text-main-dark) text-[20px] mx-6 my-7 rounded-[35px] border border-(--border) `}
      >
        <div className="flex justify-between items-center px-6 py-4">
          <div className="flex items-center space-x-4">
            {imageURL && (
              <img
                src={imageURL}
                alt={imageName}
                className="w-[60%] max-h-[5rem] h-auto object-contain p-2 rounded-[20px]"
              />
            )}
            <p
              className={`truncate overflow-hidden whitespace-nowrap ${theme ? "dark" : ""} 
						  text-(--text-body-light) dark:text-(--text-body-dark) 
						  w-40 sm:w-64 md:w-96`}
            >
              {imageName}
            </p>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {/* Copy Button */}
            <div
              className={`${theme ? "dark" : ""} cursor-pointer bg-(--button-light) dark:bg-(--button-dark) border border-2 border-(--border) p-2 rounded-md w-25 flex items-center space-x-2 h-12`}
              onClick={() => {
                navigator.clipboard.writeText(imageText);
                copyNotify();
              }}
            >
              <FaCopy
                color={
                  theme ? "var(--text-body-dark)" : "var(--text-body-light)"
                }
                size={25}
              />
              <p
                className={`${theme ? "dark" : ""} text-(--text-body-light) dark:text-(--text-body-dark)`}
              >
                Copy
              </p>
            </div>

            {/* Download Button */}
            <div
              className={`${theme ? "dark" : ""} cursor-pointer bg-(--button-light) dark:bg-(--button-dark) border border-2 border-(--border) p-2 rounded-md w-37 flex items-center space-x-2 h-12`}
              onClick={() => {
                downloadTextFile(imageText, `${imageName}.txt`);
                downloadNotify();
              }}
            >
              <FaDownload
                color={
                  theme ? "var(--text-body-dark)" : "var(--text-body-light)"
                }
                size={25}
              />
              <p
                className={`${theme ? "dark" : ""} text-(--text-body-light) dark:text-(--text-body-dark)`}
              >
                Download
              </p>
            </div>
          </div>
        </div>

        <hr className="w-[100%] rounded-sm mb-10 border border-(--border)" />

        <div
          className={`${theme ? "dark" : ""} text-(--text-body-light) dark:text-(--text-body-dark) m-4 mb-10`}
        >
          {loading ? (
            <div className="flex items-center space-x-4">
              <LoadingAnimation />
              <p>Please Wait...</p>
            </div>
          ) : (
            <p>{imageText}</p>
          )}
        </div>
      </div>
      <ThemedToastContainer theme={theme} />
    </div>
  );
}

export default UploadedImageBox;
