"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SolverPage() {
	const router = useRouter();
	useEffect(() => {
		router.replace("/solver/magic");
	}, [router]);
	return null;
}
