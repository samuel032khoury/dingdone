import { redirect } from "@tanstack/react-router";
import { createServerFn, useServerFn } from "@tanstack/react-start";
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

export function TodoForm() {
	const [isLoading, setIsLoading] = useState(false);
	const nameRef = useRef<HTMLInputElement>(null);
	const addTodoFn = useServerFn(addTodo);

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		e.stopPropagation();
		const name = nameRef.current?.value;
		if (!name) return;
		setIsLoading(true);
		await addTodoFn({ data: { name } });
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
			/>
			<Button type="submit" disabled={isLoading}>
				<LoadingSwap isLoading={isLoading} className="flex gap-2 items-center">
					<PlusIcon /> Add
				</LoadingSwap>
			</Button>
		</form>
	);
}
