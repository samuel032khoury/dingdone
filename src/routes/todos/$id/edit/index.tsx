import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { ArrowLeftIcon } from "lucide-react";
import z from "zod";
import { TodoForm } from "@/components/todo-form";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { db } from "@/db";
import { todos } from "@/db/schema";

const loaderFn = createServerFn({ method: "GET" })
	.inputValidator(z.object({ id: z.string() }))
	.handler(async ({ data: { id } }) => {
		const todo = await db.query.todos.findFirst({
			where: eq(todos.id, id),
		});
		if (todo == null) throw notFound();
		return todo;
	});

export const Route = createFileRoute("/todos/$id/edit/")({
	component: EditTodo,
	loader: ({ params }) => {
		return loaderFn({ data: params });
	},
});

function EditTodo() {
	const todo = Route.useLoaderData();
	return (
		<div className="container space-y-2">
			<Button
				asChild
				variant="ghost"
				size="sm"
				className="text-muted-foreground"
			>
				<Link to="/">
					<ArrowLeftIcon /> Todo List
				</Link>
			</Button>
			<Card>
				<CardHeader>
					<CardTitle>Edit Todo</CardTitle>
					<CardDescription>Update the details of your task</CardDescription>
				</CardHeader>
				<CardContent>
					<TodoForm todo={todo} />
				</CardContent>
			</Card>
		</div>
	);
}
