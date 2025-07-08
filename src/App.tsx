import DarkModeToggle from "./components/DarkModeToggle.tsx";
import UploadBox from "./components/UnuploadedImageBox.tsx";
import UploadedImageBox from "./components/uploadedImageBox.tsx";
import {useState} from "react";



function App() {

  const [ theme, setTheme ] = useState('dark');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  return (
    <>
      {/* Bg */}
      <div
        className={`${theme ? "dark" : ""} bg-(--background-light) dark:bg-(--background-dark) h-screen w-full flex`}>
        <DarkModeToggle theme={theme} setTheme={setTheme}/>
        {uploadedFile === null ? (
          <UploadBox theme={theme} onUpload={setUploadedFile} />
        ) : (
          <UploadedImageBox
            image={uploadedFile}
            theme={theme}
            imageName={uploadedFile.name}
            onUpload={setUploadedFile}
          />
        )}
      </div>
    </>
  )
}

export default App
