// src/components/ToastUtils.tsx
import { toast, ToastContainer } from "react-toastify";

import type { IconType } from "react-icons";


export const showToast = (
	message: string,
	theme: string = "light",
	type: "success" | "error" | "info" | "warning" | "default" = "default",
	Icon?: IconType
) => {
	const iconNode = Icon ? (
		<Icon
			style={{
				color: theme === "dark" ? "var(--text-body-dark)" : "var(--text-body-light)",
				marginRight: "0.5rem"
			}}
		/>
	) : undefined;

	switch (type) {
		case "success":
			toast.success(message, { icon: iconNode });
			break;
		case "error":
			toast.error(message, { icon: iconNode });
			break;
		case "info":
			toast.info(message, { icon: iconNode });
			break;
		case "warning":
			toast.warning(message, { icon: iconNode });
			break;
		default:
			toast(message, { icon: iconNode });
	}
};


export const ThemedToastContainer = ({ theme }: { theme: string }) => (
	<ToastContainer
		toastStyle={{
			backgroundColor: theme === "dark" ? "var(--card-dark)" : "var(--card-light)",
			color: theme === "dark" ? "var(--text-body-dark)" : "var(--text-body-light)",
			border: "1px solid var(--border)",
			borderRadius: "1rem",
			padding: "1rem",
			boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
			maxWidth: "400px",
			overflow: "hidden"
		}}
		position="bottom-right"
		autoClose={2000}
		hideProgressBar={false}
		newestOnTop={false}
		closeOnClick
		pauseOnFocusLoss
		draggable
		pauseOnHover
	/>
);
