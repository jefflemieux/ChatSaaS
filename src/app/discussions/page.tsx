import { Button } from '@/components/ui/button';
import { Disc } from 'lucide-react';
import * as React from 'react'
import { DiscussionsTable } from './components/discussions-table';

export default function Page() {
	return (
		<div className='max-w-[800px] mx-auto p-2 md:mt-10'>
			<div className='flex justify-between items-center mb-4'>
				<h1 className='font-semibold text-3xl'>Votre historique de conversations</h1>
				<Button color='black'>
					<a href='/'>
						+ Nouvelle conversation
					</a>
				</Button>
			</div>
			<div>
				<DiscussionsTable />
			</div>
		</div>
	);
}