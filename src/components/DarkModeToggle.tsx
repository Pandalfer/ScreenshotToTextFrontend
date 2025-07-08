import {LuMoon, LuSun} from "react-icons/lu";

function DarkModeToggle({ theme, setTheme }: { theme: string, setTheme: (t: string) => void }){

	return(
		<>

					<button
						onClick={() => {
							setTheme(`${theme == "dark" ? "" : "dark"}`);
						}}
						className={"fixed top-4 right-4 bg-transparent p-2 hover:bg-(--hover-light) dark:hover:bg-(--hover-dark) object-top-right cursor-pointer dark:text-(--text-body-dark) rounded-lg text-(--text-body-light)"}>
						{theme == "dark" ? <LuSun className={"text-3xl"}/> : <LuMoon className={"text-3xl"}/>}
					</button>

		</>
	);
}


export default DarkModeToggle;