import { Chat, getNamespaceFromChat } from "@/lib/utils";
import { Blob } from "buffer";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import Spinner from "./Spinner";

interface FileInputProps {
	currentChat: Chat | undefined;
	onFileUploaded: (chatFor: Chat) => void;
}

function FileInput(props: FileInputProps) {
	const { currentChat, onFileUploaded } = props;

	const [dragActive, setDragActive] = useState(false);
	const [file, setFile] = useState<File | undefined>(undefined);
	const [uploadLoading, setUploadLoading] = useState(false);

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
			setFile(file);
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
				const file = files[0];
				setFile(file);
			}
		}
	};

	//load and store pdf file given to pinecone
	//post request to server which will call api
	useEffect(() => {
		if (file) {
			uploadFileToPinecone();
		}
	}, [file]);

	const uploadFileToPinecone = async () => {
		if (!currentChat || !file) {
			return;
		}
		setUploadLoading(true);
		//send over file as blob to server
		const formData = new FormData();
		formData.append("file", file);
		formData.append("namespace", getNamespaceFromChat(currentChat));
		const response = await fetch("/api/upload-file", {
			method: "POST",
			body: formData,
		});
		setUploadLoading(false);
		// console.log(response);
		//when upload is successful, callback func
		onFileUploaded(currentChat);
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
				<br />
				<br />
				{uploadLoading && (
					<div className="flex justify-center items-center flex-col gap-2">
						<Spinner />
						<span>Uploading File...</span>
					</div>
				)}
			</form>
		</div>
	);
}

export default FileInput;
