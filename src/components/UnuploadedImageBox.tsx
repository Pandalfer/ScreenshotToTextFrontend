import { MdCloudUpload } from "react-icons/md";
import { useRef } from "react";

function UploadBox({ theme, onUpload }: { theme: string; onUpload: (file: File) => void }) {
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleBoxClick = () => {
		fileInputRef.current?.click();
	};

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file && file.type.startsWith("image/")) {
			onUpload(file); // Send file to App.tsx
		} else {
			alert("Please select a valid image file.");
		}
	};

	return (
		<div
			onClick={handleBoxClick}
			className={`${theme ? "dark" : ""} bg-(--card-light) dark:bg-(--card-dark) w-3/4 h-[50%] relative rounded-[35px] m-auto text-center cursor-pointer`}
		>
			<input
				type="file"
				accept="image/*"
				ref={fileInputRef}
				onChange={handleFileChange}
				style={{ display: "none" }}
			/>

			<div className="w-[95%] h-[90%] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/0 rounded-[35px] border border-red-400 border-dashed" />

			<div className="flex flex-col items-center justify-start h-full">
				<div style={{ height: "20%" }}></div>
				<div className="flex flex-col items-center">
					<div className="w-12 h-12 overflow-hidden">
						<MdCloudUpload
							color={theme ? "var(--text-body-dark)" : "var(--text-body-light)"}
							size={40}
						/>
					</div>
					<div
						className={`${theme ? "dark" : ""} text-(--text-body-light) dark:text-(--text-body-dark) text-base font-bold font-['Inter'] text-center`}
					>
						Paste Images Here
					</div>
				</div>
			</div>
		</div>
	);
}

export default UploadBox;
