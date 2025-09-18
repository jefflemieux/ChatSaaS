'use client'

import * as React from 'react';
import FileUploadComponent from './fileUploadTraining';
import { useUser } from '@clerk/nextjs';

export default function KnowledgeBase() {
	const { user } = useUser();
	return (
		<div>
			{
				user && <FileUploadComponent id={user?.id} />
			}
		</div>
	)
}