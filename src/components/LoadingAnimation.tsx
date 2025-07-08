function LoadingAnimation() {
	return (
		<div className={"flex justify-center items-center"}>
			<div className={"animate-spin h-10 w-10 border-t-4 border-b-4 rounded-full border-(--border)"}></div>
		</div>
	);
}

export default LoadingAnimation;
