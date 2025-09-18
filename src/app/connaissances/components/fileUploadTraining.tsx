'use client'

import React, { useState, useRef } from 'react';
import { Progress } from '@/components/ui/progress';
import { CloudUpload, DeleteIcon, TrashIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from 'sonner';
import test from 'node:test';

const testFiles = [
	{
		ObjectName: 'Document1.pdf',
		size: 42048576, // 42MB
	},
	{
		ObjectName: 'Image1.png',
		size: 524288, // 512KB
	},
	{
		ObjectName: 'Presentation.pptx',
		size: 2097152, // 2MB
	},
]


function LinearProgressWithLabel(props: { value: number }) {
	return (
		<div className='flex gap-2 items-center my-auto'>
			<Progress value={props.value} />
			{`${Math.round(props.value)}%`}
		</div>
	);
}

const FileUploadComponent = ({ id }: { id: string }) => {
	// State to store the uploaded file
	const [files, setFiles] = useState<File[]>([]);
	// Reference to the hidden file input element
	const fileInputRef = useRef<any>(null);
	const [progress, setProgress] = React.useState(0);
	const [currentFiles, setCurrentFiles] = React.useState<any[]>(testFiles);
	const [working, setWorking] = React.useState(false);
	const [taskId, setTaskId] = React.useState(null);

	const [loading, setLoading] = React.useState(false);

	// Handler when a file is dragged over the drop zone
	const handleDragOver = (event: any) => {
		event.preventDefault();
		event.stopPropagation();
	};

	// Handler when a file is dropped into the drop zone
	const handleDrop = (event: any) => {
		event.preventDefault();
		event.stopPropagation();

		const droppedFiles = event.dataTransfer.files;
		if (droppedFiles.length > 0) {
			handleFiles(droppedFiles);
		}
	};


	// Function to process the selected files
	const handleFiles = async (files: any) => {
		setFiles(files);
	};

	// Handler when the file input changes (file selected via the upload button)
	const handleFileInputChange = (event: any) => {
		const selectedFiles = event.target.files;
		if (selectedFiles.length > 0) {
			handleFiles(selectedFiles);
		}
	};

	// Handler for the upload button click to trigger the hidden file input
	const handleUploadButtonClick = () => {
		fileInputRef.current.click();
	};

	async function handleUpload() {
		alert('Hire me!')
	}

	async function handleTrain() {
		alert('Hire me!')
	}


	return (
		<>
			<p className='text-xs mb-2'>Vous devez cliquer sur <b>Téléverser les fichiers</b> après avoir sélectionné des fichiers.</p>
			{
				loading ?
					<div
						style={{
							border: '1px dashed #283618',
							borderRadius: '5px',
							padding: '40px',
							textAlign: 'center',
							color: '#283618',
							marginBottom: '20px',
							height: '200px',
						}}
					>
						<div className='flex'>
							<div className='flex flex-col m-auto gap-3'>
								<div className='flex gap-2'>
									<p className=''>Téléversement des fichiers...</p>
								</div>
								<LinearProgressWithLabel value={progress} />
							</div>
						</div>
					</div> :
					<div onClick={handleUploadButtonClick} className='cursor-pointer'>
						{/* Drop zone area */}
						<div
							style={{
								display: 'flex',
								flexDirection: 'column',
								border: '1px dashed #283618',
								borderRadius: '5px',
								padding: '30px',
								textAlign: 'center',
								color: '#283618',
								marginBottom: '20px',
								minHeight: '200px',
								width: '100%'
							}}
							onDragOver={handleDragOver}
							onDrop={handleDrop}
						>
							{files?.length > 0 ? (
								Array.from(files).map((elem, index) => (
									<div className='mb-5 text-left' key={index}>
										<p className='text-xs'><b>{elem.name}</b></p>
										<p className='text-xs'>Taille: {(elem.size / 1000000).toFixed(2)}MB</p>
									</div>
								))
							) : (
								<div className='flex w-full h-full m-auto'>
									<div className='m-auto'>
										<CloudUpload className='mb-5 mx-auto' />
										<p>Cliquez ou faites glisser pour télécharger des fichiers</p>
										<p>(.pdf, .doc, .docx, .txt, .cvs)</p>
									</div>
								</div>
							)}
						</div>

						{/* Hidden file input */}
						<input
							type="file"
							ref={fileInputRef}
							style={{ display: 'none' }}
							onChange={handleFileInputChange}
							multiple
						/>
					</div>
			}
			<div className='flex w-full justify-between'>
				<Button onClick={handleUpload}>Téléverser les fichiers</Button>
				<div className='flex flex-col items-end w-64'>
					<Button onClick={handleTrain} disabled={working}>{working ? "Entraînement en cours..." : "Entrainer l'agent"}</Button>
					<p className='text-xs mt-2 text-wrap'>Vous devez cliquer sur <b>Entrainer l'agent</b> après avoir ajouté ou supprimé des fichiers.</p>
				</div>
			</div>
			<div className='flex flex-col gap-3 mt-5'>
				<p>Fichiers:</p>
				{
					currentFiles.length > 0 ? currentFiles.map((elem: any, index) => (
						<div className='flex justify-between border-2 rounded-lg p-3 ' key={index}>
							<div>
								<p>{elem.ObjectName}</p>
								<p className='text-xs'>Taille: {(elem.size / 1000000).toFixed(2)}MB</p>
							</div>
							<div className='my-auto'>
								<Tooltip>
									<TooltipTrigger asChild>
										<Button>
											<TrashIcon fontSize='large' />
										</Button>
									</TooltipTrigger>
									<TooltipContent>
										<p>Supprimer</p>
									</TooltipContent>
								</Tooltip>
							</div>
						</div>
					)) : <p>Aucun fichier.</p>
				}
			</div>
		</>
	);
};

export default FileUploadComponent;
