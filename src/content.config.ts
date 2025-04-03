import { defineCollection, reference, z } from "astro:content";

const sourceCollection = defineCollection({
	type: "data",
	schema: z.object({
		path: z.string(),
		guid: z.string(),
		name: z.string(),
	}),
});

const codeCollection = defineCollection({
	type: "data",
	schema: z
		.object({
			guid: z.string(),
			name: z.string(),
			isCodable: z.enum(["true", "false"]),
		})
		.transform((obj) => {
			return {
				...obj,
				isCodable: obj.isCodable === "true",
			};
		}),
});

const quoteCollection = defineCollection({
	type: "data",
	schema: z.object({
		source_guid: reference("sources"),
		subfig_num: z.string().nullable().optional(),
		attrs: z.object({
			guid: z.string(),
			page: z.string(),
		}),
		Coding: z.array(
			z.object({
				attrs: z.object({
					guid: z.string(),
				}),
				CodeRef: z.object({
					attrs: z.object({
						targetGUID: reference("codes"),
					}),
				}),
			}),
		),
	}),
});

// 3. Export a single `collections` object to register your collection(s)
//    This key should match your collection directory name in "src/content"
export const collections = {
	codes: codeCollection,
	quotations: quoteCollection,
	sources: sourceCollection,
};
