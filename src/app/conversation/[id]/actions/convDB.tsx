'use server';

import { MongoClient } from "mongodb";

export async function getConversationById(id: string) {
	const client = new MongoClient(process.env.MONGODB_URI!);
	const db = client.db("ChatSaaS");
	const coll = db.collection("Conversations");

	const conversation = await coll.findOne({ id });
	await client.close();
	const _conversation = {
		messages: conversation?.messages || []
	}
	if (conversation) {
		return _conversation;
	}
	return { messages: [] };
}

