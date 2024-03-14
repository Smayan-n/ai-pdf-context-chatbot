import { Chat, convertTextToDocument, formatDownloadJson, getNamespaceFromChat } from "@/lib/utils";
import { Blob } from "buffer";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import Spinner from "./Spinner";

interface FileInputProps {
	currentChat: Chat | undefined;
	onFileUploaded: (chatFor: Chat, fileName: string) => void;
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

	async function getAccessToken(clientId: string, clientSecret: string) {
		const response = await fetch("https://pdf-services.adobe.io/token", {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body: new URLSearchParams({
				client_id: clientId,
				client_secret: clientSecret,
			}),
		});
		const data = await response.json();
		return data.access_token;
	}

	async function getUploadUri(token: string, clientId: string) {
		const response1 = await fetch("https://pdf-services.adobe.io/assets", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${token}`,
				"x-api-key": clientId,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				mediaType: "application/pdf",
			}),
		});
		const data = await response1.json();
		if (data && response1.status === 200) {
			return { uploadUri: data.uploadUri, assetID: data.assetID };
		} else {
			throw new Error();
		}
	}

	async function storePdf(uri: string) {
		const response = await fetch(uri, {
			method: "PUT",
			headers: {
				"Content-Type": "application/pdf",
			},
			body: file,
		});

		return response.ok;
	}

	async function extractTextFromFile(token: string, assetID: string, clientId: string) {
		const response = await fetch("https://pdf-services-ue1.adobe.io/operation/extractpdf", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${token}`,
				"x-api-key": clientId,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				assetID: assetID,
				getCharBounds: false, // Set to true if you want bounding boxes for characters
				includeStyling: false, // Set to true if you want styling information
				elementsToExtract: ["text"], // Extract only text
			}),
		});
		if (response.ok) {
			//return download url
			return response.headers.get("Location") as string;
		}
		return "";
	}

	async function pollExtractJob(url: string, clientId: string, token: string) {
		const response = await fetch(url, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${token}`,
				"x-api-key": clientId,
			},
		});
		if (response.ok) {
			const data = await response.json();
			if (data && data.status === "done") {
				return data.content.downloadUri;
			} else {
				return undefined;
			}
		}
	}

	async function downloadText(url: string) {
		const response = await fetch(url);
		return response.json();
	}

	const uploadFileToPinecone = async () => {
		if (!currentChat || !file) {
			return;
		}
		setUploadLoading(true);
		//send over file as blob to be read and stored to API endpoint
		const formData = new FormData();
		formData.append("file", file);
		formData.append("namespace", getNamespaceFromChat(currentChat));
		const response = await fetch("/api/upload-file", {
			method: "POST",
			body: formData,
		});

		setUploadLoading(false);
		console.log(response);
		//when upload is successful, callback func
		onFileUploaded(currentChat, file.name);
	};

	return (
		<div className="flex items-center justify-center h-screen">
			<form
				className={`${
					dragActive ? " bg-gray-600 " : " "
				}  m-4 p-8 w-[100%] h-[100%] rounded-lg text-center flex flex-col items-center justify-center`}
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
				{uploadLoading ? (
					<div className="flex justify-center items-center flex-col gap-2">
						<Spinner />
						<span>Uploading File...</span>
					</div>
				) : (
					<p className="text-lg">
						Drag & Drop PDF or{" "}
						<span
							onClick={() => fileInputRef.current?.click()}
							className="font-bold text-blue-600 cursor-pointer"
						>
							<u>Select File</u>
						</span>{" "}
						to upload
					</p>
				)}

				<br />
				<br />
			</form>
		</div>
	);
}

export default FileInput;
