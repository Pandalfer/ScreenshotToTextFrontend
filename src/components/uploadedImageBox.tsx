import { useEffect, useState } from "react";
import api from "../api";
import { FaCopy } from "react-icons/fa";
import { FaDownload } from "react-icons/fa";
import { showToast, ThemedToastContainer } from "./Toasts.tsx";



function UploadedImageBox({ image, theme, imageName, onUpload }: { image: File; theme: string; imageName: string, onUpload: (file: File | null) => void }) {
	const [imageURL, setImageURL] = useState<string>("");
	const [imageText, setImageText] = useState<string>("");
	const [loading, setLoading] = useState(true);
	const copyNotify = () => showToast("Copied!", theme, "success", FaCopy);
	const downloadNotify = () => showToast("Downloaded!", theme, "success", FaDownload);
	const downloadTextFile = (text: string, filename: string) => {
		const blob = new Blob([text], { type: "text/plain" });
		const url = URL.createObjectURL(blob);

		const a = document.createElement("a");
		a.href = url;
		a.download = filename;
		document.body.appendChild(a);
		a.click();

		// Clean up
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	};


	useEffect(() => {
	  const url = URL.createObjectURL(image);
	  setImageURL(url);
	
	  const getImageText = async () => {
	    setLoading(true);
	    try {
	      const formData = new FormData();
	      formData.append("file", image);
	
	      const response = await api.post("/image", formData, {
	        headers: {
	          "Content-Type": "multipart/form-data",
	        },
	      });
	
	      setImageText(response.data.text);
	    } catch (error) {
	      console.error("Failed to get image text:", error);
	      setImageText("Failed to load text");
	    } finally {
	      setLoading(false);
	    }
	  };
	
	  getImageText();
	
	  return () => {
	    URL.revokeObjectURL(url);
	  };
	}, [image]);


	return (
		<div
			className={`${theme ? "dark" : ""} bg-(--card-light) dark:bg-(--card-dark) w-3/4 h-[60%] relative rounded-[35px] m-auto`}
		>

			<button className={`${theme ? "dark" : ""} bg-(--button-light) dark:bg-(--button-dark)
				text-(--text-main-light) dark:text-(--text-main-dark) px-12 py-3
				text-[20px] mx-6 my-7 rounded-[35px] border border-(--border) font-bold cursor-pointer`} onClick={(()=> onUpload(null))}>Start Over
			</button>

			<div
				className={`${theme ? "dark" : ""} bg-(--button-light) dark:bg-(--button-dark) text-(--text-main-light) dark:text-(--text-main-dark) text-[20px] mx-6 my-7 rounded-[35px] border border-(--border) `}>
				<div className="flex justify-between items-center px-6 py-4">
					<div className="flex items-center space-x-4">
						{imageURL && (
							<img
								src={imageURL}
								alt={imageName}
								className="w-[60%] max-h-[5rem] h-auto object-contain p-2 rounded-[20px]"
							/>
						)}
						<p className={`${theme ? "dark" : ""} text-(--text-body-light) dark:text-(--text-body-dark)`}>
							{imageName}
						</p>
					</div>

					<div className="flex items-center space-x-4">
						<div
							className={`${theme ? "dark" : ""} cursor-pointer bg-(--button-light) dark:bg-(--button-dark) border border-2 border-(--border) p-2 rounded-md w-25 flex items-center space-x-2 h-12`}
							onClick={() => {navigator.clipboard.writeText(imageText); copyNotify() }}>

							<FaCopy
								color={theme ? "var(--text-body-dark)" : "var(--text-body-light)"}
								size={25} // smaller icon size to fit
							/>
							<p className={`${theme ? "dark" : ""} text-(--text-body-light) dark:text-(--text-body-dark) `}>
								Copy
							</p>
						</div>

						<div
							className={`${theme ? "dark" : ""} cursor-pointer bg-(--button-light) dark:bg-(--button-dark) border border-2 border-(--border) p-2 rounded-md w-37 flex items-center space-x-2 h-12`}
							onClick={() => {downloadTextFile(imageText, `${imageName}.txt`); downloadNotify();}}>
							<FaDownload
								color={theme ? "var(--text-body-dark)" : "var(--text-body-light)"}
								size={25} // smaller icon size to fit
							/>
							<p className={`${theme ? "dark" : ""} text-(--text-body-light) dark:text-(--text-body-dark) `}
							   >
								Download
							</p>
						</div>
					</div>
				</div>

				<hr className="w-[100%] rounded-sm mb-10 border border-(--border)"/>

				<p className={`${theme ? "dark" : ""} text-(--text-body-light) dark:text-(--text-body-dark) m-4 mb-10`}>
				  {loading ? "Please Wait..." : imageText}
				</p>

			</div>
			<ThemedToastContainer theme={theme} />




		</div>
	);
}

export default UploadedImageBox;
