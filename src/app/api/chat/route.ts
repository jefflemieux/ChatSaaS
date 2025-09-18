import {
  streamText,
  UIMessage,
  convertToModelMessages,
  generateObject,
  stepCountIs,
  tool,
} from "ai";
import { openai } from "@ai-sdk/openai";
import { perplexity } from "@ai-sdk/perplexity";
import { MongoClient } from "mongodb";
import { z } from "zod";
import { VoyageAIClient } from "voyageai";
import { sanitizeUiMessages } from "@/lib/sanitize";
// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const client = new MongoClient(process.env.MONGODB_URI!);
const voyage_client = new VoyageAIClient({
  apiKey: process.env.VOYAGE_API_KEY,
});

async function runVecSearch(query: string, user_id: string) {
  const db = client.db("SQ-AI-Embeddings");
  const coll = db.collection(user_id);

  const res = await voyage_client.embed({
    input: query,
    model: "voyage-3-large",
  });

  if (!res.data || res.data.length === 0 || !res.data[0].embedding) {
    throw new Error("No embedding returned from Voyage API");
  }

  const embedding = res.data[0].embedding;

  const agg = [
    {
      $vectorSearch: {
        index: `vector_index_${user_id}`,
        path: "embedding",
        queryVector: embedding,
        numCandidates: 150,
        limit: 10,
      },
    },
    {
      $project: {
        _id: 0,
        enriched_text: 1,
        score: {
          $meta: "vectorSearchScore",
        },
      },
    },
  ];
  const results = await coll.aggregate(agg).toArray();
  return results;
}

async function saveMessages({
  id,
  messages,
  user_id,
}: {
  id: string;
  messages: UIMessage[];
  user_id: string;
}) {
  const db = client.db("ChatSaaS");
  const coll = db.collection("Conversations");

  const msgs = convertToModelMessages(sanitizeUiMessages(messages));

  for (const msg of msgs) {
    if (msg.role === "user") {
      if (Array.isArray(msg.content)) {
        for (const part of msg.content) {
          if (part.type === "file") {
            part.data = "[FILE CONTENT REMOVED]";
          }
        }
      }
    }
  }

  const { object } = await generateObject({
    model: openai("gpt-4o"),
    temperature: 0.1,
    schema: z.object({ title: z.string().min(1).max(75) }),
    messages: [
      {
        role: "system",
        content:
          "Tu fournis un UNIQUE titre de conversation. Concret, descriptif, sans mystère. MAX 75 caractères." +
          "Réutilise les termes présents (technos, APIs, marques). Pas d’emoji/guillemets/ponctuation finale. " +
          "Langue = langue majoritaire. Si insuffisant: 'Sans titre'.",
      },
      {
        role: "user",
        content:
          "Exemples mauvais: 'Aide', 'Discussion', 'Problème général'. " +
          "Exemples bons: 'Next.js 15: erreur headers() asynchrone', 'FastAPI + Celery: 422 Unprocessable Entity', 'Widget chatbot SaaS: bulle initiale et modale'.",
      },
      {
        role: "user",
        content: "Messages:\n" + JSON.stringify(msgs),
      },
    ],
  });

  let title = object.title.trim().replace(/[.!?…]+$/g, "");
  if (!title) title = "Sans titre";

  // TEMP: replace file URLs with dummy data URIs
  for (const message of messages as UIMessage[]) {
    for (const key in message) {
      if (key === "parts") {
        message.parts = message.parts.map((part) => {
          if (part.type === "file") {
            part.url =
              "data:application/pdf;base64,JVBERi0xLjQKJeLjz9MKMSAwIG9iago8PC9UeXBlL0NhdGFsb2cvUGFnZXMgMiAwIFIgPj4KZW5kb2JqCjIgMCBvYmoKPDwvVHlwZS9QYWdlcy9LaWRzWzMgMCBSXS9Db3VudCAxID4+CmVuZG9iagozIDAgb2JqCjw8L1R5cGUvUGFnZS9QYXJlbnQgMiAwIFIvTWVkaWFCb3hbMCAwIDYxMiA3OTJdPj4KZW5kb2JqCnhyZWYKMCA0CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDAxMCAwMDAwMCBuIAowMDAwMDAwMDYwIDAwMDAwIG4gCjAwMDAwMDAxMTAgMDAwMDAgbiAKdHJhaWxlcgo8PC9Sb290IDEgMCBSL1NpemUgNCA+PgpzdGFydHhyZWYKNzYKJSVFT0YK";
          }
          // if (part.type === "image") {
          //   part.url = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA";
          // }
          return part;
        });
      }
    }
  }

  try {
    await coll.updateOne(
      { id },
      {
        $set: {
          messages: messages,
          lastUpdate: new Date().toLocaleString("fr-CA", {
            timeZone: "America/Toronto",
          }),
          user_id,
          title: title,
        },
      },
      { upsert: true },
    );
  } catch (err) {
    console.log("ERROR: ", err);
  }
}

export async function POST(req: Request) {
  const {
    messages,
    webSearch,
    id,
    user_id,
  }: {
    messages: UIMessage[];
    webSearch: boolean;
    id: string;
    user_id: string;
  } = await req.json();

  let modelMessages;
  try {
    modelMessages = convertToModelMessages(messages);
  } catch (error) {
    console.error("Error converting messages:", error);
  }

  const result = streamText({
    model: webSearch ? perplexity("sonar") : openai("gpt-5-nano"),
    messages: modelMessages!,
    stopWhen: stepCountIs(5),
    system:
      "Vous êtes un assistant IA utile et compétent. Répondez de manière concise et pertinente aux questions de l'utilisateur en utilisant au besoin votre base de connaissances 'getInformation'. Utilisez les informations dans vos tool calls (getInformation) pour fournir des réponses précises et informatives. Utilisez un français formel et professionnel, et n'hésitez pas à utiliser toutes les fonctionnalités du Markdown dans vos réponses, avec des titres, des tableaux et du code lorsque nécessaire.",
    tools: {
      getInformation: tool({
        description:
          "Utilisez cet outil pour rechercher des informations pertinentes dans votre base de connaissances. Fournissez des réponses précises basées sur les résultats de la recherche.",
        inputSchema: z.object({
          query: z
            .string()
            .min(1)
            .max(500)
            .describe("La requête de recherche de l'utilisateur."),
        }),
        execute: async ({ query }) => {
          const results = await runVecSearch(query, user_id);
          if (results.length === 0) {
            return "Aucun résultat pertinent trouvé.";
          }
          let responseText = "Voici les informations trouvées:\n";
          results.forEach((res, index) => {
            responseText += `${index + 1}. ${res.enriched_text} (Score: ${res.score.toFixed(2)})\n`;
          });
          return responseText;
        },
      }),
    },
  });

  // send sources and reasoning back to the client
  return result.toUIMessageStreamResponse({
    sendSources: true,
    sendReasoning: true,
    onFinish: async ({ responseMessage }) => {
      await saveMessages({
        id,
        messages: [...messages, responseMessage],
        user_id,
      });
    },
  });
}
