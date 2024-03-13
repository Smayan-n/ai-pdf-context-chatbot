import { ChangeEvent, useRef, useState } from "react";

interface FileInputProps {}

function FileInput(props: FileInputProps) {
	const [dragActive, setDragActive] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleDragOver = (e: any) => {
		e.preventDefault();
		e.stopPropagation();
		setDragActive(true);
	};

	const handleDragEnter = (e: any) => {
		e.preventDefault();
		e.stopPropagation();
		setDragActive(true);
	};

	const handleDragLeave = (e: any) => {
		e.preventDefault();
		e.stopPropagation();
		setDragActive(false);
	};

	//when user drops file into input
	const handleDrop = async (e: any) => {
		e.preventDefault();
		e.stopPropagation();
		setDragActive(false);
		//get file
		if (e.dataTransfer.files && e.dataTransfer.files[0]) {
			const file: File = e.dataTransfer.files[0];
			console.log(file);
		}
	};

	//when user manually selects fils
	const handleFileSelected = (e: ChangeEvent<HTMLInputElement>) => {
		e.preventDefault();
		e.stopPropagation();
		//extract file
		if (e.target.files) {
			const files = Array.from(e.target.files);
			if (files[0]) {
				console.log(files[0]);
			}
		}
	};

	return (
		<div className="flex items-center justify-center h-screen">
			<form
				className={`${
					dragActive ? " bg-blue-300 " : " "
				}  m-4 p-4 w-[100%] h-[100%] rounded-lg text-center flex flex-col items-center justify-center`}
				onDragEnter={handleDragEnter}
				onSubmit={(e) => e.preventDefault()}
				onDrop={handleDrop}
				onDragLeave={handleDragLeave}
				onDragOver={handleDragOver}
			>
				{/* this input element allows us to select files for upload. We make it hidden so we can activate it when the user clicks select files */}
				<input
					placeholder="fileInput"
					className="hidden"
					type="file"
					multiple={true}
					ref={fileInputRef}
					onChange={handleFileSelected}
					accept=".pdf"
				/>

				<p>
					Drag & Drop PDF file or{" "}
					<span
						onClick={() => fileInputRef.current?.click()}
						className="font-bold text-blue-600 cursor-pointer"
					>
						<u>Select File</u>
					</span>{" "}
					to upload
				</p>
			</form>
		</div>
	);
}

export default FileInput;
