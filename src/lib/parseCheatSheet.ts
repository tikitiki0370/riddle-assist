export type CheatSheetData = {
	title: string;
	group: string;
	visible: boolean;
	rows: string[][];
};

export type CheatSheetGroup = {
	label: string;
	sheets: CheatSheetData[];
};

export function parseCheatSheet(raw: string): CheatSheetData {
	const frontmatterMatch = raw.match(/^---\n([\s\S]*?)\n---\n/);
	const frontmatter = frontmatterMatch?.[1] ?? "";
	const titleMatch = frontmatter.match(/title:\s*(.+)/);
	const title = titleMatch?.[1].trim() ?? "";
	const groupMatch = frontmatter.match(/group:\s*(.+)/);
	const group = groupMatch?.[1].trim() ?? "";
	const visibleMatch = frontmatter.match(/visible:\s*(.+)/);
	const visible = visibleMatch ? visibleMatch[1].trim() !== "false" : true;

	const body = frontmatterMatch ? raw.slice(frontmatterMatch[0].length) : raw;

	const rows = body
		.split("\n")
		.map((line) => line.trim())
		.filter((line) => line.includes("|") && !line.match(/^\|[\s-|]+\|$/))
		.map((line) =>
			line
				.split("|")
				.slice(1, -1)
				.map((cell) => cell.trim())
		);

	return { title, group, visible, rows };
}

export function loadCheatSheetGroups(): CheatSheetGroup[] {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const ctx = (require as any).context(
		"@/components/cheetSheet",
		false,
		/\.md$/
	);

	const sheets: CheatSheetData[] = ctx
		.keys()
		.map((key: string) => parseCheatSheet(ctx(key).default ?? ctx(key)))
		.filter((sheet: CheatSheetData) => sheet.visible);

	const groupMap = new Map<string, CheatSheetData[]>();
	for (const sheet of sheets) {
		const key = sheet.group || "その他";
		if (!groupMap.has(key)) groupMap.set(key, []);
		groupMap.get(key)!.push(sheet);
	}

	const extractNum = (s: string) => {
		const m = s.match(/(\d+)/);
		return m ? Number(m[1]) : Infinity;
	};

	return Array.from(groupMap, ([label, sheets]) => ({ label, sheets })).sort(
		(a, b) => extractNum(a.label) - extractNum(b.label)
	);
}
