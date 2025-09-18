'use server';

import { MongoClient } from "mongodb";

export async function getRecentConversationsById(user_id: string) {
	const client = new MongoClient(process.env.MONGODB_URI!);
	const db = client.db("ChatSaaS");
	const coll = db.collection("Conversations");

	let conversations = await coll.find({ user_id }).limit(10).sort({ lastUpdate: -1 }).toArray();
	let n_conversations = [];
	for (let conv of conversations) {
		let new_conv = {
			id: conv.id,
			title: conv.title || "Sans titre",
			lastUpdate: conv.lastUpdate
		};
		n_conversations.push(new_conv);
	}
	await client.close();
	if (n_conversations) {
		return n_conversations;
	}
	return [];
}