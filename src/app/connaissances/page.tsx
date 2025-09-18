import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import KnowledgeBase from "./components/fichiers";

export default function KnowledgeBasePage() {
	return (
		<div className="max-w-[800px] mx-auto p-2 md:mt-10">
			<h1 className="text-3xl font-bold">Connaissances</h1>
			<p className="mt-10">
				Gérez les documents et les données que l'IA peut consulter pour
				répondre à vos questions.
			</p>
			<div className="my-10">
				<Card>
					<CardHeader>
						<div className="flex justify-between w-full items-center">
							<CardTitle>Ajouter des des documents</CardTitle>
						</div>
					</CardHeader>
					<CardContent>
						<KnowledgeBase />
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
