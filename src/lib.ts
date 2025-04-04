import { z } from "zod";
import raw from "./output.json" with { type: "json" };

const guidSchema = z.string().uuid();

const dateTimeSchema = z.string().datetime({ offset: true });

const userSchema = z.object({
	attrs: z.object({
		guid: guidSchema,
		name: z.string(),
	}),
});

const codeSchema = z.object({
	attrs: z.object({
		guid: guidSchema,
		name: z.string(),
		isCodable: z.string().transform((val) => val === "true"),
	}),
	Code: z
		.array(
			z.object({
				attrs: z.object({
					guid: guidSchema,
					name: z.string(),
					isCodable: z.string().transform((val) => val === "true"),
				}),
				Description: z.string().optional(),
			}),
		)
		.optional(),
	Description: z.string().optional(),
});

const codeRefSchema = z.object({
	attrs: z.object({
		targetGUID: guidSchema,
	}),
});

const codingSchema = z.object({
	attrs: z.object({
		creatingUser: guidSchema,
		creationDateTime: dateTimeSchema,
		guid: guidSchema,
	}),
	CodeRef: codeRefSchema,
});

const pdfSelectionSchema = z.object({
	attrs: z.object({
		firstX: z.string().transform(Number),
		firstY: z.string().transform(Number),
		modifyingUser: guidSchema,
		creatingUser: guidSchema,
		creationDateTime: dateTimeSchema,
		modifiedDateTime: dateTimeSchema,
		secondY: z.string().transform(Number),
		secondX: z.string().transform(Number),
		guid: guidSchema,
		name: z.string(),
		page: z.string().transform(Number),
	}),
	Coding: z
		.union([codingSchema, codingSchema.array()])
		.optional()
		.transform((c) => (Array.isArray(c) ? c : c ? [c] : [])),
});

const representationSchema = z.object({
	attrs: z.object({
		plainTextPath: z.string(),
		modifyingUser: guidSchema,
		modifiedDateTime: dateTimeSchema,
		creatingUser: guidSchema,
		creationDateTime: dateTimeSchema,
		guid: guidSchema,
		name: z.string(),
	}),
});

const pdfSourceSchema = z
	.object({
		attrs: z.object({
			modifiedDateTime: dateTimeSchema,
			modifyingUser: guidSchema,
			creatingUser: guidSchema,
			creationDateTime: dateTimeSchema,
			path: z.string(),
			guid: guidSchema,
			name: z.string(),
		}),
		PDFSelection: z
			.union([pdfSelectionSchema, pdfSelectionSchema.array()])
			.transform((p) => (Array.isArray(p) ? p : [p])),
		Representation: representationSchema.optional(),
	})
	.transform((d) => ({
		...parseTitle(d.attrs.name),
		guid: d.attrs.guid,
		selections: d.PDFSelection,
	}));

const codeBookSchema = z
	.object({
		Codes: z.object({
			Code: z.array(codeSchema),
		}),
	})
	.transform((d) =>
		d.Codes.Code.map((c) => ({
			group: c.attrs,
			children: c.Code ?? [],
		})),
	);

const projectSchema = z
	.object({
		Project: z.object({
			attrs: z.object({
				creatingUserGUID: guidSchema,
				modifiedDateTime: dateTimeSchema,
				creationDateTime: dateTimeSchema,
				basePath: z.string(),
				modifyingUserGUID: guidSchema,
				name: z.string(),
				"xsi:schemaLocation": z.string(),
				xmlns: z.string(),
				"xmlns:xsi": z.string(),
			}),
			Users: z.object({
				User: z.array(userSchema),
			}),
			CodeBook: codeBookSchema,
			Sources: z
				.object({
					PDFSource: z.array(pdfSourceSchema),
				})
				.transform((t) => t.PDFSource),
		}),
	})
	.transform((root) => ({
		sources: root.Project.Sources,
		codes: root.Project.CodeBook,
	}));

function parseTitle(filename: string) {
	const name = filename.replace(/\.pdf$/, "");
	const match = name.match(/^(.+?) - (\d{4}) - (.+)$/);
	if (!match) throw Error("Cannot parse title");
	const [, authors, year, title] = match;
	return { authors, year: +year, title };
}

export async function loadFigures() {
	const content = projectSchema.parse(raw);

	const codeBook = new Map<string, string>();
	for (const code of content.codes) {
		codeBook.set(code.group.guid, code.group.name);
		for (const child of code.children) {
			codeBook.set(child.attrs.guid, `${code.group.name}:${child.attrs.name}`);
		}
	}

	/** @type {Array<{ source: { title: string, year: number, authors: string }, codes: Array<string>, imageId: string }>} */
	const figures: Array<{
		source: { title: string; year: number; authors: string };
		imagePath: Array<string>;
		codes: Array<string>;
	}> = [];

	for (const source of content.sources) {
		for (const selection of source.selections) {
			figures.push({
				source: {
					title: source.title,
					year: source.year,
					authors: source.authors,
				},
				imagePath: [source.guid, selection.attrs.guid],
				codes: selection.Coding.map(
					// biome-ignore lint/style/noNonNullAssertion: We know it's there
					(c) => codeBook.get(c.CodeRef.attrs.targetGUID)!,
				),
			});
		}
	}

	// codes to ignore
	const excludeCodes = new Set([
		"org:complex, needs to be looked over",
		"org:exclude candidate",
		"size used",
	]);

	return figures.flatMap((figure) => {
		let codes = figure.codes.filter((code) => !excludeCodes.has(code));
		if (codes.length === 0) return [];
		return { ...figure, codes };
	});
}
