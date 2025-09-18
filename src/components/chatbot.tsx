'use client';

import {
	Conversation,
	ConversationContent,
	ConversationScrollButton,
} from '@/components/ai-elements/conversation';
import { Message, MessageAvatar, MessageContent } from '@/components/ai-elements/message';
import {
	PromptInput,
	PromptInputActionAddAttachments,
	PromptInputActionMenu,
	PromptInputActionMenuContent,
	PromptInputActionMenuTrigger,
	PromptInputAttachment,
	PromptInputAttachments,
	PromptInputBody,
	PromptInputButton,
	PromptInputMessage,
	PromptInputSubmit,
	PromptInputTextarea,
	PromptInputToolbar,
	PromptInputTools,
} from '@/components/ai-elements/prompt-input';
import {
	Action,
	Actions
} from '@/components/ai-elements/actions';
import { Fragment, useEffect, useRef, useState } from 'react';
import { UIMessage, useChat } from '@ai-sdk/react';
import { Response } from '@/components/ai-elements/response';
import { CopyIcon, GlobeIcon, Mic, Paperclip, RefreshCcwIcon } from 'lucide-react';
import {
	Source,
	Sources,
	SourcesContent,
	SourcesTrigger,
} from '@/components/ai-elements/sources';
import {
	Reasoning,
	ReasoningContent,
	ReasoningTrigger,
} from '@/components/ai-elements/reasoning';
import { Loader } from '@/components/ai-elements/loader';

import Image from 'next/image';
import AudioMotion from './audio-motion';
import { useUser } from '@clerk/nextjs';
import { DefaultChatTransport } from 'ai';

const ChatBot = ({ id, init_messages }: { id?: string; init_messages?: any[] }) => {
	const [input, setInput] = useState('');
	const [webSearch, setWebSearch] = useState(false);
	const { messages, sendMessage, status, regenerate } = useChat({
		transport: new DefaultChatTransport({
			api: '/api/chat',
		}),
		id,
		messages: init_messages as UIMessage[],
	});
	const { user } = useUser();
	const [speech, setSpeech] = useState<boolean>(false);


	async function convertObjectUrlsToDataUrls<T extends { url: string }>(
		items: T[]
	): Promise<T[]> {
		return Promise.all(
			items.map(async (item) => {
				// If url starts with "blob:", convert it
				if (item.url.startsWith("blob:")) {
					const blob = await fetch(item.url).then((res) => res.blob());

					const dataUrl = await new Promise<string>((resolve, reject) => {
						const reader = new FileReader();
						reader.onloadend = () => {
							if (typeof reader.result === "string") {
								resolve(reader.result);
							} else {
								reject(new Error("Failed to convert blob to DataURL"));
							}
						};
						reader.onerror = reject;
						reader.readAsDataURL(blob);
					});

					return { ...item, url: dataUrl };
				}

				// If not a blob URL, return unchanged
				return item;
			})
		);
	}


	const handleSubmit = async (message: PromptInputMessage) => {
		const hasText = Boolean(message.text);
		const hasAttachments = Boolean(message.files?.length);

		if (!(hasText || hasAttachments)) {
			return;
		}

		const updated = await convertObjectUrlsToDataUrls(message.files || []);

		sendMessage(
			{
				text: message.text || 'Sent with attachments',
				files: updated
			},
			{
				body: {
					webSearch: webSearch,
					user_id: user?.id || 'invite',
				},
			},
		);
		setInput('');
	};

	return (
		<div className="max-w-4xl mx-auto p-6 relative size-full h-screen">
			<div className="flex flex-col h-full">
				<Conversation className="h-full">
					<ConversationContent>
						{
							messages.length === 0 && (
								<div className="text-center text-muted-foreground absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[800px]">
									<h1 className='text-4xl font-semibold text-primary mb-10'>Bonjour!</h1>
									<div className={`${speech ? '' : 'hidden'} flex w-full px-10`}>
										<div className='mx-auto w-full'>
											<AudioMotion activate={speech} setActivate={setSpeech} setPrompt={setInput} lang={"fr"} />
										</div>
									</div>
									<PromptInput onSubmit={handleSubmit} globalDrop multiple>
										<PromptInputBody>
											<PromptInputAttachments>
												{(attachment) => <PromptInputAttachment data={attachment} />}
											</PromptInputAttachments>
											<PromptInputTextarea
												onChange={(e) => setInput(e.target.value)}
												value={input}
											/>
										</PromptInputBody>
										<PromptInputToolbar>
											<PromptInputTools>
												<PromptInputActionMenu>
													<PromptInputActionMenuTrigger />
													<PromptInputActionMenuContent>
														<PromptInputActionAddAttachments />
													</PromptInputActionMenuContent>
												</PromptInputActionMenu>
												<PromptInputButton
													onMouseDown={() => setSpeech(true)}
													onMouseUp={() => setSpeech(false)}
													onTouchStart={() => setSpeech(true)}
													onTouchEnd={() => setSpeech(false)}
												>
													<Mic size={16} />
												</PromptInputButton>
												<PromptInputButton
													onClick={() => setWebSearch(!webSearch)}
													variant={webSearch ? 'default' : 'ghost'}
												>
													<GlobeIcon size={16} />
													<span>Recherche</span>
												</PromptInputButton>
											</PromptInputTools>
											<PromptInputSubmit disabled={!input && !status} status={status} />
										</PromptInputToolbar>
									</PromptInput>
								</div>
							)
						}
						{messages.map((message, index) => (
							<div key={`m-${index}`} className="w-full">
								{message.role === 'assistant' && message.parts.filter((part) => part.type === 'source-url').length > 0 && (
									<Sources>
										<SourcesTrigger
											count={
												message.parts.filter(
													(part) => part.type === 'source-url',
												).length
											}
										/>
										{message.parts.filter((part) => part.type === 'source-url').map((part, i) => (
											<SourcesContent key={`${message.id}-${i}`}>
												<Source
													key={`${message.id}-${i}`}
													href={part.url}
													title={part.url}
												/>
											</SourcesContent>
										))}
									</Sources>
								)}
								{message.parts.map((part, i) => {
									switch (part.type) {
										case 'text':
											return (
												<Fragment key={`${message.id}-${i}`}>
													<Message from={message.role} >
														<MessageContent variant='flat'>
															<Response >
																{part.text}
															</Response>
														</MessageContent>
													</Message>
													{message.role === 'assistant' && (
														<Actions className="mt-2">
															<Action
																onClick={() => regenerate()}
																label="Retry"
															>
																<RefreshCcwIcon className="size-3" />
															</Action>
															<Action
																onClick={() =>
																	navigator.clipboard.writeText(part.text)
																}
																label="Copy"
															>
																<CopyIcon className="size-3" />
															</Action>
														</Actions>
													)}
												</Fragment>
											);
										case 'tool-getInformation':
											return (
												<Message key={`${message.id}-${i}`} from={message.role}>
													<MessageContent variant='flat'>
														Je cherche dans la base de connaissances.
													</MessageContent>
												</Message>
											);
										case 'reasoning':
											return (
												<Reasoning
													key={`${message.id}-${i}`}
													className="w-full"
													isStreaming={status === 'streaming' && i === message.parts.length - 1 && message.id === messages.at(-1)?.id}
												>
													<ReasoningContent>{part.text}</ReasoningContent>
													<ReasoningTrigger />
												</Reasoning>
											);
										case 'file':
											return (
												<Message key={`${message.id}-${i}`} from={message.role}>
													<MessageContent variant='flat'>
														<p>Fichier joint : {part.filename}</p>
													</MessageContent>
												</Message>
											);
										default:
											return null;
									}
								})}
							</div>
						))}
						{status === 'submitted' && <Loader />}
					</ConversationContent>
					<ConversationScrollButton />
				</Conversation>
				{
					messages.length > 0 && (
						<>
							<div className={`${speech ? '' : 'hidden'} flex w-full px-10`}>
								<div className='mx-auto w-full'>
									<AudioMotion activate={speech} setActivate={setSpeech} setPrompt={setInput} lang={"fr"} />
								</div>
							</div>
							<PromptInput onSubmit={handleSubmit} globalDrop multiple>
								<PromptInputBody>
									<PromptInputAttachments>
										{(attachment) => <PromptInputAttachment data={attachment} />}
									</PromptInputAttachments>
									<PromptInputTextarea
										onChange={(e) => setInput(e.target.value)}
										value={input}
									/>
								</PromptInputBody>
								<PromptInputToolbar>
									<PromptInputTools>
										<PromptInputActionMenu>
											<PromptInputActionMenuTrigger />
											<PromptInputActionMenuContent>
												<PromptInputActionAddAttachments />
											</PromptInputActionMenuContent>
										</PromptInputActionMenu>
										<PromptInputButton
											onMouseDown={() => setSpeech(true)}
											onMouseUp={() => setSpeech(false)}
											onTouchStart={() => setSpeech(true)}
											onTouchEnd={() => setSpeech(false)}
										>
											<Mic size={16} />
										</PromptInputButton>
										<PromptInputButton
											onClick={() => setWebSearch(!webSearch)}
											variant={webSearch ? 'default' : 'ghost'}
										>
											<GlobeIcon size={16} />
											<span>Recherche</span>
										</PromptInputButton>
									</PromptInputTools>
									<PromptInputSubmit disabled={!input && !status} status={status} />
								</PromptInputToolbar>
							</PromptInput>
						</>
					)
				}
			</div>
		</div>
	);
};

export default ChatBot;