import { redirect } from "@tanstack/react-router";
import { createServerFn, useServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { PlusIcon } from "lucide-react";
import { type FormEvent, useRef, useState } from "react";
import z from "zod";
import { db } from "@/db";
import { todos } from "@/db/schema";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { LoadingSwap } from "./ui/loading-swap";

const addTodo = createServerFn({ method: "POST" })
	.inputValidator(
		z.object({
			name: z.string().min(1).max(255),
		}),
	)
	.handler(async ({ data }) => {
		await db.insert(todos).values({
			...data,
			isComplete: false,
		});
		throw redirect({ to: "/" });
	});

const updateTodo = createServerFn({ method: "POST" })
	.inputValidator(
		z.object({
			id: z.string().min(1),
			name: z.string().min(1).max(255),
		}),
	)
	.handler(async ({ data }) => {
		await db.update(todos).set(data).where(eq(todos.id, data.id));
		throw redirect({ to: "/" });
	});

export function TodoForm({ todo }: { todo?: { id: string; name: string } }) {
	const [isLoading, setIsLoading] = useState(false);
	const nameRef = useRef<HTMLInputElement>(null);
	const addTodoFn = useServerFn(addTodo);
	const updateTodoFn = useServerFn(updateTodo);

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		e.stopPropagation();
		const name = nameRef.current?.value;
		if (!name) return;
		setIsLoading(true);
		if (todo) {
			await updateTodoFn({ data: { id: todo.id, name } });
		} else {
			await addTodoFn({ data: { name } });
		}
		setIsLoading(false);
	};
	return (
		<form className="flex gap-2" onSubmit={handleSubmit}>
			<Input
				autoFocus
				ref={nameRef}
				placeholder="Enter your todo..."
				className="flex-1"
				aria-label="Name"
				defaultValue={todo?.name}
			/>
			<Button type="submit" disabled={isLoading}>
				<LoadingSwap isLoading={isLoading} className="flex gap-2 items-center">
					{todo == null ? (
						<>
							<PlusIcon /> Add
						</>
					) : (
						"Update"
					)}
				</LoadingSwap>
			</Button>
		</form>
	);
}
