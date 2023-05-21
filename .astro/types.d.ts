declare module 'astro:content' {
	interface Render {
		'.mdx': Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
		}>;
	}
}

declare module 'astro:content' {
	interface Render {
		'.md': Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
		}>;
	}
}

declare module 'astro:content' {
	export { z } from 'astro/zod';
	export type CollectionEntry<C extends keyof AnyEntryMap> = AnyEntryMap[C][keyof AnyEntryMap[C]];

	// TODO: Remove this when having this fallback is no longer relevant. 2.3? 3.0? - erika, 2023-04-04
	/**
	 * @deprecated
	 * `astro:content` no longer provide `image()`.
	 *
	 * Please use it through `schema`, like such:
	 * ```ts
	 * import { defineCollection, z } from "astro:content";
	 *
	 * defineCollection({
	 *   schema: ({ image }) =>
	 *     z.object({
	 *       image: image(),
	 *     }),
	 * });
	 * ```
	 */
	export const image: never;

	// This needs to be in sync with ImageMetadata
	export type ImageFunction = () => import('astro/zod').ZodObject<{
		src: import('astro/zod').ZodString;
		width: import('astro/zod').ZodNumber;
		height: import('astro/zod').ZodNumber;
		format: import('astro/zod').ZodUnion<
			[
				import('astro/zod').ZodLiteral<'png'>,
				import('astro/zod').ZodLiteral<'jpg'>,
				import('astro/zod').ZodLiteral<'jpeg'>,
				import('astro/zod').ZodLiteral<'tiff'>,
				import('astro/zod').ZodLiteral<'webp'>,
				import('astro/zod').ZodLiteral<'gif'>,
				import('astro/zod').ZodLiteral<'svg'>
			]
		>;
	}>;

	type BaseSchemaWithoutEffects =
		| import('astro/zod').AnyZodObject
		| import('astro/zod').ZodUnion<import('astro/zod').AnyZodObject[]>
		| import('astro/zod').ZodDiscriminatedUnion<string, import('astro/zod').AnyZodObject[]>
		| import('astro/zod').ZodIntersection<
				import('astro/zod').AnyZodObject,
				import('astro/zod').AnyZodObject
		  >;

	type BaseSchema =
		| BaseSchemaWithoutEffects
		| import('astro/zod').ZodEffects<BaseSchemaWithoutEffects>;

	export type SchemaContext = { image: ImageFunction };

	type DataCollectionConfig<S extends BaseSchema> = {
		type: 'data';
		schema?: S | ((context: SchemaContext) => S);
	};

	type ContentCollectionConfig<S extends BaseSchema> = {
		type?: 'content';
		schema?: S | ((context: SchemaContext) => S);
	};

	type CollectionConfig<S> = ContentCollectionConfig<S> | DataCollectionConfig<S>;

	export function defineCollection<S extends BaseSchema>(
		input: CollectionConfig<S>
	): CollectionConfig<S>;

	type AllValuesOf<T> = T extends any ? T[keyof T] : never;
	type ValidContentEntrySlug<C extends keyof ContentEntryMap> = AllValuesOf<
		ContentEntryMap[C]
	>['slug'];

	export function getEntryBySlug<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {})
	>(
		collection: C,
		// Note that this has to accept a regular string too, for SSR
		entrySlug: E
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;

	export function getDataEntryById<C extends keyof DataEntryMap, E extends keyof DataEntryMap[C]>(
		collection: C,
		entryId: E
	): Promise<CollectionEntry<C>>;

	export function getCollection<C extends keyof AnyEntryMap, E extends CollectionEntry<C>>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => entry is E
	): Promise<E[]>;
	export function getCollection<C extends keyof AnyEntryMap>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => unknown
	): Promise<CollectionEntry<C>[]>;

	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {})
	>(entry: {
		collection: C;
		slug: E;
	}): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {})
	>(entry: {
		collection: C;
		id: E;
	}): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {})
	>(
		collection: C,
		slug: E
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {})
	>(
		collection: C,
		id: E
	): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;

	/** Resolve an array of entry references from the same collection */
	export function getEntries<C extends keyof ContentEntryMap>(
		entries: {
			collection: C;
			slug: ValidContentEntrySlug<C>;
		}[]
	): Promise<CollectionEntry<C>[]>;
	export function getEntries<C extends keyof DataEntryMap>(
		entries: {
			collection: C;
			id: keyof DataEntryMap[C];
		}[]
	): Promise<CollectionEntry<C>[]>;

	export function reference<C extends keyof AnyEntryMap>(
		collection: C
	): import('astro/zod').ZodEffects<
		import('astro/zod').ZodString,
		C extends keyof ContentEntryMap
			? {
					collection: C;
					slug: ValidContentEntrySlug<C>;
			  }
			: {
					collection: C;
					id: keyof DataEntryMap[C];
			  }
	>;
	// Allow generic `string` to avoid excessive type errors in the config
	// if `dev` is not running to update as you edit.
	// Invalid collection names will be caught at build time.
	export function reference<C extends string>(
		collection: C
	): import('astro/zod').ZodEffects<import('astro/zod').ZodString, never>;

	type ReturnTypeOrOriginal<T> = T extends (...args: any[]) => infer R ? R : T;
	type InferEntrySchema<C extends keyof AnyEntryMap> = import('astro/zod').infer<
		ReturnTypeOrOriginal<Required<ContentConfig['collections'][C]>['schema']>
	>;

	type ContentEntryMap = {
		"author": {
"christie.md": {
	id: "christie.md";
  slug: "christie";
  body: string;
  collection: "author";
  data: InferEntrySchema<"author">
} & { render(): Render[".md"] };
"default.md": {
	id: "default.md";
  slug: "default";
  body: string;
  collection: "author";
  data: InferEntrySchema<"author">
} & { render(): Render[".md"] };
};
"bio": {
"childhood.md": {
	id: "childhood.md";
  slug: "childhood";
  body: string;
  collection: "bio";
  data: InferEntrySchema<"bio">
} & { render(): Render[".md"] };
"current.md": {
	id: "current.md";
  slug: "current";
  body: string;
  collection: "bio";
  data: InferEntrySchema<"bio">
} & { render(): Render[".md"] };
"death.md": {
	id: "death.md";
  slug: "death";
  body: string;
  collection: "bio";
  data: InferEntrySchema<"bio">
} & { render(): Render[".md"] };
"evolution.md": {
	id: "evolution.md";
  slug: "evolution";
  body: string;
  collection: "bio";
  data: InferEntrySchema<"bio">
} & { render(): Render[".md"] };
"family.md": {
	id: "family.md";
  slug: "family";
  body: string;
  collection: "bio";
  data: InferEntrySchema<"bio">
} & { render(): Render[".md"] };
"introduction.md": {
	id: "introduction.md";
  slug: "introduction";
  body: string;
  collection: "bio";
  data: InferEntrySchema<"bio">
} & { render(): Render[".md"] };
"my-father.md": {
	id: "my-father.md";
  slug: "my-father";
  body: string;
  collection: "bio";
  data: InferEntrySchema<"bio">
} & { render(): Render[".md"] };
"my-grandmother.md": {
	id: "my-grandmother.md";
  slug: "my-grandmother";
  body: string;
  collection: "bio";
  data: InferEntrySchema<"bio">
} & { render(): Render[".md"] };
"my-great-grandfather.mdx": {
	id: "my-great-grandfather.mdx";
  slug: "my-great-grandfather";
  body: string;
  collection: "bio";
  data: InferEntrySchema<"bio">
} & { render(): Render[".mdx"] };
"my-mother.md": {
	id: "my-mother.md";
  slug: "my-mother";
  body: string;
  collection: "bio";
  data: InferEntrySchema<"bio">
} & { render(): Render[".md"] };
"parents.md": {
	id: "parents.md";
  slug: "parents";
  body: string;
  collection: "bio";
  data: InferEntrySchema<"bio">
} & { render(): Render[".md"] };
"retirement.md": {
	id: "retirement.md";
  slug: "retirement";
  body: string;
  collection: "bio";
  data: InferEntrySchema<"bio">
} & { render(): Render[".md"] };
"technical.md": {
	id: "technical.md";
  slug: "technical";
  body: string;
  collection: "bio";
  data: InferEntrySchema<"bio">
} & { render(): Render[".md"] };
"tham-history.md": {
	id: "tham-history.md";
  slug: "tham-history";
  body: string;
  collection: "bio";
  data: InferEntrySchema<"bio">
} & { render(): Render[".md"] };
"tham-surname.mdx": {
	id: "tham-surname.mdx";
  slug: "tham-surname";
  body: string;
  collection: "bio";
  data: InferEntrySchema<"bio">
} & { render(): Render[".mdx"] };
"university.md": {
	id: "university.md";
  slug: "university";
  body: string;
  collection: "bio";
  data: InferEntrySchema<"bio">
} & { render(): Render[".md"] };
"work.md": {
	id: "work.md";
  slug: "work";
  body: string;
  collection: "bio";
  data: InferEntrySchema<"bio">
} & { render(): Render[".md"] };
};
"blog": {
"2000-01-01-template.md": {
	id: "2000-01-01-template.md";
  slug: "2000-01-01-template";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2001/2001-12-01-polyglot.md": {
	id: "2001/2001-12-01-polyglot.md";
  slug: "2001/2001-12-01-polyglot";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2009/2009-10-04-artarmon-bike-path.md": {
	id: "2009/2009-10-04-artarmon-bike-path.md";
  slug: "2009/2009-10-04-artarmon-bike-path";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2009/2009-10-04-chatswood-cbd.md": {
	id: "2009/2009-10-04-chatswood-cbd.md";
  slug: "2009/2009-10-04-chatswood-cbd";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2009/2009-10-06-magpie-attacks-foiled-by-cable-ties.md": {
	id: "2009/2009-10-06-magpie-attacks-foiled-by-cable-ties.md";
  slug: "2009/2009-10-06-magpie-attacks-foiled-by-cable-ties";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2010/2010-04-20-andante-in-e-minor-fernando-sor.md": {
	id: "2010/2010-04-20-andante-in-e-minor-fernando-sor.md";
  slug: "2010/2010-04-20-andante-in-e-minor-fernando-sor";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2010/2010-07-20-andantino-op-44-no-3-fernando-sor.md": {
	id: "2010/2010-07-20-andantino-op-44-no-3-fernando-sor.md";
  slug: "2010/2010-07-20-andantino-op-44-no-3-fernando-sor";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2012/2012-05-01-joe-hisaishi-the-name-of-life-instrumental-version.md": {
	id: "2012/2012-05-01-joe-hisaishi-the-name-of-life-instrumental-version.md";
  slug: "2012/2012-05-01-joe-hisaishi-the-name-of-life-instrumental-version";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2012/2012-05-02-bach-two-part-invention-no-1.md": {
	id: "2012/2012-05-02-bach-two-part-invention-no-1.md";
  slug: "2012/2012-05-02-bach-two-part-invention-no-1";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2013/2013-03-24-giant-test-ride.md": {
	id: "2013/2013-03-24-giant-test-ride.md";
  slug: "2013/2013-03-24-giant-test-ride";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2014/2014-02-13-beartrix.md": {
	id: "2014/2014-02-13-beartrix.md";
  slug: "2014/2014-02-13-beartrix";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2014/2014-02-14-bears-carribean.md": {
	id: "2014/2014-02-14-bears-carribean.md";
  slug: "2014/2014-02-14-bears-carribean";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2014/2014-02-15-bear-runner.md": {
	id: "2014/2014-02-15-bear-runner.md";
  slug: "2014/2014-02-15-bear-runner";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2014/2014-02-24-polar-cub.md": {
	id: "2014/2014-02-24-polar-cub.md";
  slug: "2014/2014-02-24-polar-cub";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2014/2014-02-28-babylon-5-opening-theme.md": {
	id: "2014/2014-02-28-babylon-5-opening-theme.md";
  slug: "2014/2014-02-28-babylon-5-opening-theme";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2014/2014-02-28-brandenburg-concerto-no-5-in-d-major-bwv-1050-i-allegro-solo-instruments.md": {
	id: "2014/2014-02-28-brandenburg-concerto-no-5-in-d-major-bwv-1050-i-allegro-solo-instruments.md";
  slug: "2014/2014-02-28-brandenburg-concerto-no-5-in-d-major-bwv-1050-i-allegro-solo-instruments";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2014/2014-03-05-puppies.md": {
	id: "2014/2014-03-05-puppies.md";
  slug: "2014/2014-03-05-puppies";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2014/2014-03-06-mei-and-totoro.md": {
	id: "2014/2014-03-06-mei-and-totoro.md";
  slug: "2014/2014-03-06-mei-and-totoro";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2014/2014-03-10-winter-music.md": {
	id: "2014/2014-03-10-winter-music.md";
  slug: "2014/2014-03-10-winter-music";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2014/2014-03-13-forever-friends.md": {
	id: "2014/2014-03-13-forever-friends.md";
  slug: "2014/2014-03-13-forever-friends";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2014/2014-03-16-ave-maria-vavilov.md": {
	id: "2014/2014-03-16-ave-maria-vavilov.md";
  slug: "2014/2014-03-16-ave-maria-vavilov";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2014/2014-03-24-ave-maria-vavilov-finale-gpo4.md": {
	id: "2014/2014-03-24-ave-maria-vavilov-finale-gpo4.md";
  slug: "2014/2014-03-24-ave-maria-vavilov-finale-gpo4";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2014/2014-03-24-ave-maria-vavilov-logic-pro-x-ewql.md": {
	id: "2014/2014-03-24-ave-maria-vavilov-logic-pro-x-ewql.md";
  slug: "2014/2014-03-24-ave-maria-vavilov-logic-pro-x-ewql";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2014/2014-04-21-memories-of-tomorrow.md": {
	id: "2014/2014-04-21-memories-of-tomorrow.md";
  slug: "2014/2014-04-21-memories-of-tomorrow";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2014/2014-04-25-500-miles-high.md": {
	id: "2014/2014-04-25-500-miles-high.md";
  slug: "2014/2014-04-25-500-miles-high";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2014/2014-05-30-olhos-de-gato-orchestral-arrangement.md": {
	id: "2014/2014-05-30-olhos-de-gato-orchestral-arrangement.md";
  slug: "2014/2014-05-30-olhos-de-gato-orchestral-arrangement";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2015/2015-07-30-commuting-to-work-29-july-2015.md": {
	id: "2015/2015-07-30-commuting-to-work-29-july-2015.md";
  slug: "2015/2015-07-30-commuting-to-work-29-july-2015";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2016/2016-04-10-mona-vale-rd-at-40-55-km-h.md": {
	id: "2016/2016-04-10-mona-vale-rd-at-40-55-km-h.md";
  slug: "2016/2016-04-10-mona-vale-rd-at-40-55-km-h";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2017/2017-10-27-a-twin-peaks-dream.md": {
	id: "2017/2017-10-27-a-twin-peaks-dream.md";
  slug: "2017/2017-10-27-a-twin-peaks-dream";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2018/2018-01-09-adagio-oboe-concerto-d-minor-alessandro-marcello.md": {
	id: "2018/2018-01-09-adagio-oboe-concerto-d-minor-alessandro-marcello.md";
  slug: "2018/2018-01-09-adagio-oboe-concerto-d-minor-alessandro-marcello";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2018/2018-01-10-winter-music-electronic-115bpm.md": {
	id: "2018/2018-01-10-winter-music-electronic-115bpm.md";
  slug: "2018/2018-01-10-winter-music-electronic-115bpm";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2018/2018-03-22-my-new-bike.md": {
	id: "2018/2018-03-22-my-new-bike.md";
  slug: "2018/2018-03-22-my-new-bike";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2018/2018-03-31-bach-adagio-concerto-3-d-minor.md": {
	id: "2018/2018-03-31-bach-adagio-concerto-3-d-minor.md";
  slug: "2018/2018-03-31-bach-adagio-concerto-3-d-minor";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2018/2018-04-01-bach-prelude-no-1-in-c-major-wtc1.md": {
	id: "2018/2018-04-01-bach-prelude-no-1-in-c-major-wtc1.md";
  slug: "2018/2018-04-01-bach-prelude-no-1-in-c-major-wtc1";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2020/2020-07-05-cinema-paradiso-string-orchestra.md": {
	id: "2020/2020-07-05-cinema-paradiso-string-orchestra.md";
  slug: "2020/2020-07-05-cinema-paradiso-string-orchestra";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2020/2020-09-05-dream.md": {
	id: "2020/2020-09-05-dream.md";
  slug: "2020/2020-09-05-dream";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2020/2020-10-01-kon-loh-mee-recipe.md": {
	id: "2020/2020-10-01-kon-loh-mee-recipe.md";
  slug: "2020/2020-10-01-kon-loh-mee-recipe";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2020/2020-10-02-mayfield-garden.md": {
	id: "2020/2020-10-02-mayfield-garden.md";
  slug: "2020/2020-10-02-mayfield-garden";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2020/2020-10-05-how-to-draw-almost-every-day.md": {
	id: "2020/2020-10-05-how-to-draw-almost-every-day.md";
  slug: "2020/2020-10-05-how-to-draw-almost-every-day";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2021/2021-10-17-radika-birthday.md": {
	id: "2021/2021-10-17-radika-birthday.md";
  slug: "2021/2021-10-17-radika-birthday";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2021/2021-11-04-dhakshin-diwali.md": {
	id: "2021/2021-11-04-dhakshin-diwali.md";
  slug: "2021/2021-11-04-dhakshin-diwali";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2021/2021-11-06-berrima.md": {
	id: "2021/2021-11-06-berrima.md";
  slug: "2021/2021-11-06-berrima";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2021/2021-11-07-soong-birthday.md": {
	id: "2021/2021-11-07-soong-birthday.md";
  slug: "2021/2021-11-07-soong-birthday";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2021/2021-11-08-sydney.md": {
	id: "2021/2021-11-08-sydney.md";
  slug: "2021/2021-11-08-sydney";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2021/2021-11-11-lcnp.md": {
	id: "2021/2021-11-11-lcnp.md";
  slug: "2021/2021-11-11-lcnp";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2021/2021-11-11-post-cycling-dessert.md": {
	id: "2021/2021-11-11-post-cycling-dessert.md";
  slug: "2021/2021-11-11-post-cycling-dessert";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2021/2021-11-13-north-head.md": {
	id: "2021/2021-11-13-north-head.md";
  slug: "2021/2021-11-13-north-head";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2021/2021-11-14-dams.md": {
	id: "2021/2021-11-14-dams.md";
  slug: "2021/2021-11-14-dams";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2021/2021-11-15-cat-lunch.md": {
	id: "2021/2021-11-15-cat-lunch.md";
  slug: "2021/2021-11-15-cat-lunch";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2021/2021-11-19-breakfast.md": {
	id: "2021/2021-11-19-breakfast.md";
  slug: "2021/2021-11-19-breakfast";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2021/2021-11-19-dream.md": {
	id: "2021/2021-11-19-dream.md";
  slug: "2021/2021-11-19-dream";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2021/2021-11-21-small-chillies.md": {
	id: "2021/2021-11-21-small-chillies.md";
  slug: "2021/2021-11-21-small-chillies";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2021/2021-11-23-new-tyres.md": {
	id: "2021/2021-11-23-new-tyres.md";
  slug: "2021/2021-11-23-new-tyres";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2021/2021-11-25-bershka-skirt.md": {
	id: "2021/2021-11-25-bershka-skirt.md";
  slug: "2021/2021-11-25-bershka-skirt";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2021/2021-11-25-mlc-reunion.md": {
	id: "2021/2021-11-25-mlc-reunion.md";
  slug: "2021/2021-11-25-mlc-reunion";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2021/2021-11-26-lane-covelo-xmas.md": {
	id: "2021/2021-11-26-lane-covelo-xmas.md";
  slug: "2021/2021-11-26-lane-covelo-xmas";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2021/2021-11-28-thanksgiving-tumpeng.md": {
	id: "2021/2021-11-28-thanksgiving-tumpeng.md";
  slug: "2021/2021-11-28-thanksgiving-tumpeng";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2021/2021-11-30-hot-lap.md": {
	id: "2021/2021-11-30-hot-lap.md";
  slug: "2021/2021-11-30-hot-lap";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2021/2021-12-01-bicycles.md": {
	id: "2021/2021-12-01-bicycles.md";
  slug: "2021/2021-12-01-bicycles";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2021/2021-12-01-stationary-bike.md": {
	id: "2021/2021-12-01-stationary-bike.md";
  slug: "2021/2021-12-01-stationary-bike";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2021/2021-12-02-cafe-rumah.md": {
	id: "2021/2021-12-02-cafe-rumah.md";
  slug: "2021/2021-12-02-cafe-rumah";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2021/2021-12-02-pleated skirt.md": {
	id: "2021/2021-12-02-pleated skirt.md";
  slug: "2021/2021-12-02-pleated-skirt";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2021/2021-12-03-dosa-hut.md": {
	id: "2021/2021-12-03-dosa-hut.md";
  slug: "2021/2021-12-03-dosa-hut";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2021/2021-12-04-killiney.md": {
	id: "2021/2021-12-04-killiney.md";
  slug: "2021/2021-12-04-killiney";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2021/2021-12-07-dream.md": {
	id: "2021/2021-12-07-dream.md";
  slug: "2021/2021-12-07-dream";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2021/2021-12-08-4dp-profile.md": {
	id: "2021/2021-12-08-4dp-profile.md";
  slug: "2021/2021-12-08-4dp-profile";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2021/2021-12-11-chilli-jam-nasi-goreng.md": {
	id: "2021/2021-12-11-chilli-jam-nasi-goreng.md";
  slug: "2021/2021-12-11-chilli-jam-nasi-goreng";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2021/2021-12-11-family-xmas-lights.md": {
	id: "2021/2021-12-11-family-xmas-lights.md";
  slug: "2021/2021-12-11-family-xmas-lights";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2021/2021-12-11-trail-shoes.md": {
	id: "2021/2021-12-11-trail-shoes.md";
  slug: "2021/2021-12-11-trail-shoes";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2021/2021-12-12-hello-kitty-cycling.md": {
	id: "2021/2021-12-12-hello-kitty-cycling.md";
  slug: "2021/2021-12-12-hello-kitty-cycling";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2021/2021-12-12-rita-xmas-party.md": {
	id: "2021/2021-12-12-rita-xmas-party.md";
  slug: "2021/2021-12-12-rita-xmas-party";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2021/2021-12-12-zeal-xmas.md": {
	id: "2021/2021-12-12-zeal-xmas.md";
  slug: "2021/2021-12-12-zeal-xmas";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2021/2021-12-13-vintage-pantry.md": {
	id: "2021/2021-12-13-vintage-pantry.md";
  slug: "2021/2021-12-13-vintage-pantry";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2021/2021-12-15-stir-fry-veges.md": {
	id: "2021/2021-12-15-stir-fry-veges.md";
  slug: "2021/2021-12-15-stir-fry-veges";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2021/2021-12-16-dyson.md": {
	id: "2021/2021-12-16-dyson.md";
  slug: "2021/2021-12-16-dyson";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2021/2021-12-17-fitzroy-falls.md": {
	id: "2021/2021-12-17-fitzroy-falls.md";
  slug: "2021/2021-12-17-fitzroy-falls";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2021/2021-12-17-suckling-pig.md": {
	id: "2021/2021-12-17-suckling-pig.md";
  slug: "2021/2021-12-17-suckling-pig";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2021/2021-12-18-banh-cuon.md": {
	id: "2021/2021-12-18-banh-cuon.md";
  slug: "2021/2021-12-18-banh-cuon";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2021/2021-12-18-loader-nights.md": {
	id: "2021/2021-12-18-loader-nights.md";
  slug: "2021/2021-12-18-loader-nights";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2021/2021-12-19-lunch-kingsford.md": {
	id: "2021/2021-12-19-lunch-kingsford.md";
  slug: "2021/2021-12-19-lunch-kingsford";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2021/2021-12-19-simplest-fried-rice.md": {
	id: "2021/2021-12-19-simplest-fried-rice.md";
  slug: "2021/2021-12-19-simplest-fried-rice";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2021/2021-12-20-cat-lunch.md": {
	id: "2021/2021-12-20-cat-lunch.md";
  slug: "2021/2021-12-20-cat-lunch";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2021/2021-12-21-lcnp.md": {
	id: "2021/2021-12-21-lcnp.md";
  slug: "2021/2021-12-21-lcnp";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2021/2021-12-22-char-siew-siew-yoke.md": {
	id: "2021/2021-12-22-char-siew-siew-yoke.md";
  slug: "2021/2021-12-22-char-siew-siew-yoke";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2021/2021-12-22-waterfall-walk.md": {
	id: "2021/2021-12-22-waterfall-walk.md";
  slug: "2021/2021-12-22-waterfall-walk";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2021/2021-12-24-haircut.md": {
	id: "2021/2021-12-24-haircut.md";
  slug: "2021/2021-12-24-haircut";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2021/2021-12-24-leuven-city.md": {
	id: "2021/2021-12-24-leuven-city.md";
  slug: "2021/2021-12-24-leuven-city";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2021/2021-12-24-sydney.md": {
	id: "2021/2021-12-24-sydney.md";
  slug: "2021/2021-12-24-sydney";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2021/2021-12-25-family-xmas-lunch.md": {
	id: "2021/2021-12-25-family-xmas-lunch.md";
  slug: "2021/2021-12-25-family-xmas-lunch";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2021/2021-12-26-ivan-boxing-day.md": {
	id: "2021/2021-12-26-ivan-boxing-day.md";
  slug: "2021/2021-12-26-ivan-boxing-day";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2021/2021-12-27-cabramatta.md": {
	id: "2021/2021-12-27-cabramatta.md";
  slug: "2021/2021-12-27-cabramatta";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2021/2021-12-28-daggy-lunch.md": {
	id: "2021/2021-12-28-daggy-lunch.md";
  slug: "2021/2021-12-28-daggy-lunch";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2021/2021-12-29-katoomba-falls.md": {
	id: "2021/2021-12-29-katoomba-falls.md";
  slug: "2021/2021-12-29-katoomba-falls";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2021/2021-12-30-botanic-gardens.md": {
	id: "2021/2021-12-30-botanic-gardens.md";
  slug: "2021/2021-12-30-botanic-gardens";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2021/2021-12-31-cumberland-state-forest.md": {
	id: "2021/2021-12-31-cumberland-state-forest.md";
  slug: "2021/2021-12-31-cumberland-state-forest";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-01-01-epson.md": {
	id: "2022/2022-01-01-epson.md";
  slug: "2022/2022-01-01-epson";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-01-05-breakfast.md": {
	id: "2022/2022-01-05-breakfast.md";
  slug: "2022/2022-01-05-breakfast";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-01-05-honours-reunion.md": {
	id: "2022/2022-01-05-honours-reunion.md";
  slug: "2022/2022-01-05-honours-reunion";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-01-05-lunch.md": {
	id: "2022/2022-01-05-lunch.md";
  slug: "2022/2022-01-05-lunch";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-01-05-parade.md": {
	id: "2022/2022-01-05-parade.md";
  slug: "2022/2022-01-05-parade";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-01-05-tolkien.md": {
	id: "2022/2022-01-05-tolkien.md";
  slug: "2022/2022-01-05-tolkien";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-01-06-breakfast.md": {
	id: "2022/2022-01-06-breakfast.md";
  slug: "2022/2022-01-06-breakfast";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-01-06-karen-birthday.md": {
	id: "2022/2022-01-06-karen-birthday.md";
  slug: "2022/2022-01-06-karen-birthday";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-01-06-passo-dello-stelvio.md": {
	id: "2022/2022-01-06-passo-dello-stelvio.md";
  slug: "2022/2022-01-06-passo-dello-stelvio";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-01-07-carpenters.md": {
	id: "2022/2022-01-07-carpenters.md";
  slug: "2022/2022-01-07-carpenters";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-01-07-dream.md": {
	id: "2022/2022-01-07-dream.md";
  slug: "2022/2022-01-07-dream";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-01-08-fagan-park.md": {
	id: "2022/2022-01-08-fagan-park.md";
  slug: "2022/2022-01-08-fagan-park";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-01-09-men-at-work.md": {
	id: "2022/2022-01-09-men-at-work.md";
  slug: "2022/2022-01-09-men-at-work";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-01-10-suzie-wong.md": {
	id: "2022/2022-01-10-suzie-wong.md";
  slug: "2022/2022-01-10-suzie-wong";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-01-11-dream.md": {
	id: "2022/2022-01-11-dream.md";
  slug: "2022/2022-01-11-dream";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-01-12-olmo-resurrected.md": {
	id: "2022/2022-01-12-olmo-resurrected.md";
  slug: "2022/2022-01-12-olmo-resurrected";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-01-16-ya-malaysia.md": {
	id: "2022/2022-01-16-ya-malaysia.md";
  slug: "2022/2022-01-16-ya-malaysia";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-01-21-cafe-rumah.md": {
	id: "2022/2022-01-21-cafe-rumah.md";
  slug: "2022/2022-01-21-cafe-rumah";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-01-22-fitzroy-falls.md": {
	id: "2022/2022-01-22-fitzroy-falls.md";
  slug: "2022/2022-01-22-fitzroy-falls";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-01-24-yumcha-eight.md": {
	id: "2022/2022-01-24-yumcha-eight.md";
  slug: "2022/2022-01-24-yumcha-eight";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-01-25-gotong-royong.md": {
	id: "2022/2022-01-25-gotong-royong.md";
  slug: "2022/2022-01-25-gotong-royong";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-01-27-cycling.md": {
	id: "2022/2022-01-27-cycling.md";
  slug: "2022/2022-01-27-cycling";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-01-28-hokkian-kia.md": {
	id: "2022/2022-01-28-hokkian-kia.md";
  slug: "2022/2022-01-28-hokkian-kia";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-01-29-kingsford-lunch.md": {
	id: "2022/2022-01-29-kingsford-lunch.md";
  slug: "2022/2022-01-29-kingsford-lunch";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-01-30-cny-lunch.md": {
	id: "2022/2022-01-30-cny-lunch.md";
  slug: "2022/2022-01-30-cny-lunch";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-01-31-chatswood-cny.md": {
	id: "2022/2022-01-31-chatswood-cny.md";
  slug: "2022/2022-01-31-chatswood-cny";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-01-31-hello-kitty-bliss.md": {
	id: "2022/2022-01-31-hello-kitty-bliss.md";
  slug: "2022/2022-01-31-hello-kitty-bliss";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-01-31-mapo-tofu-mushrooms.md": {
	id: "2022/2022-01-31-mapo-tofu-mushrooms.md";
  slug: "2022/2022-01-31-mapo-tofu-mushrooms";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-02-02-2-2-22.md": {
	id: "2022/2022-02-02-2-2-22.md";
  slug: "2022/2022-02-02-2-2-22";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-02-02-lunar-lanterns.md": {
	id: "2022/2022-02-02-lunar-lanterns.md";
  slug: "2022/2022-02-02-lunar-lanterns";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-02-03-chinatown.md": {
	id: "2022/2022-02-03-chinatown.md";
  slug: "2022/2022-02-03-chinatown";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-02-03-dream.md": {
	id: "2022/2022-02-03-dream.md";
  slug: "2022/2022-02-03-dream";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-02-06-warragamba-dam.md": {
	id: "2022/2022-02-06-warragamba-dam.md";
  slug: "2022/2022-02-06-warragamba-dam";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-02-08-kueh-bangkit.md": {
	id: "2022/2022-02-08-kueh-bangkit.md";
  slug: "2022/2022-02-08-kueh-bangkit";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-02-09-nanyang.md": {
	id: "2022/2022-02-09-nanyang.md";
  slug: "2022/2022-02-09-nanyang";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-02-11-scenic-world.md": {
	id: "2022/2022-02-11-scenic-world.md";
  slug: "2022/2022-02-11-scenic-world";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-02-11-unique-patisserie.md": {
	id: "2022/2022-02-11-unique-patisserie.md";
  slug: "2022/2022-02-11-unique-patisserie";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-02-12-zinnia.md": {
	id: "2022/2022-02-12-zinnia.md";
  slug: "2022/2022-02-12-zinnia";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-02-14-margaret-birthday.md": {
	id: "2022/2022-02-14-margaret-birthday.md";
  slug: "2022/2022-02-14-margaret-birthday";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-02-15-chicago.md": {
	id: "2022/2022-02-15-chicago.md";
  slug: "2022/2022-02-15-chicago";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-02-15-dream.md": {
	id: "2022/2022-02-15-dream.md";
  slug: "2022/2022-02-15-dream";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-02-16-carrington-falls.md": {
	id: "2022/2022-02-16-carrington-falls.md";
  slug: "2022/2022-02-16-carrington-falls";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-02-16-dream.md": {
	id: "2022/2022-02-16-dream.md";
  slug: "2022/2022-02-16-dream";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-02-16-retford-park.md": {
	id: "2022/2022-02-16-retford-park.md";
  slug: "2022/2022-02-16-retford-park";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-02-18-gotong-royong-rita.md": {
	id: "2022/2022-02-18-gotong-royong-rita.md";
  slug: "2022/2022-02-18-gotong-royong-rita";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-02-19-sawmiller-reserve.md": {
	id: "2022/2022-02-19-sawmiller-reserve.md";
  slug: "2022/2022-02-19-sawmiller-reserve";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-02-21-trio-of-dishes.md": {
	id: "2022/2022-02-21-trio-of-dishes.md";
  slug: "2022/2022-02-21-trio-of-dishes";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-02-22-columbia-rescued.md": {
	id: "2022/2022-02-22-columbia-rescued.md";
  slug: "2022/2022-02-22-columbia-rescued";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-02-22-hk-bing-sutt.md": {
	id: "2022/2022-02-22-hk-bing-sutt.md";
  slug: "2022/2022-02-22-hk-bing-sutt";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-02-22-shunde.md": {
	id: "2022/2022-02-22-shunde.md";
  slug: "2022/2022-02-22-shunde";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-02-28-lotr.md": {
	id: "2022/2022-02-28-lotr.md";
  slug: "2022/2022-02-28-lotr";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-03-01-armidale-trip.md": {
	id: "2022/2022-03-01-armidale-trip.md";
  slug: "2022/2022-03-01-armidale-trip";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-03-04-breakfast.md": {
	id: "2022/2022-03-04-breakfast.md";
  slug: "2022/2022-03-04-breakfast";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-03-04-laksa.md": {
	id: "2022/2022-03-04-laksa.md";
  slug: "2022/2022-03-04-laksa";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-03-05-small-chillies.md": {
	id: "2022/2022-03-05-small-chillies.md";
  slug: "2022/2022-03-05-small-chillies";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-03-06-breakfast.md": {
	id: "2022/2022-03-06-breakfast.md";
  slug: "2022/2022-03-06-breakfast";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-03-06-mapo-tofu.md": {
	id: "2022/2022-03-06-mapo-tofu.md";
  slug: "2022/2022-03-06-mapo-tofu";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-03-06-turandot.md": {
	id: "2022/2022-03-06-turandot.md";
  slug: "2022/2022-03-06-turandot";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-03-07-turandot.md": {
	id: "2022/2022-03-07-turandot.md";
  slug: "2022/2022-03-07-turandot";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-03-09-captains-log.md": {
	id: "2022/2022-03-09-captains-log.md";
  slug: "2022/2022-03-09-captains-log";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-03-10-parramatta.md": {
	id: "2022/2022-03-10-parramatta.md";
  slug: "2022/2022-03-10-parramatta";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-03-10-turandot.md": {
	id: "2022/2022-03-10-turandot.md";
  slug: "2022/2022-03-10-turandot";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-03-11-lai-lai.md": {
	id: "2022/2022-03-11-lai-lai.md";
  slug: "2022/2022-03-11-lai-lai";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-03-12-char-siew.md": {
	id: "2022/2022-03-12-char-siew.md";
  slug: "2022/2022-03-12-char-siew";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-03-13-enlighten.md": {
	id: "2022/2022-03-13-enlighten.md";
  slug: "2022/2022-03-13-enlighten";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-03-13-googong-dam.md": {
	id: "2022/2022-03-13-googong-dam.md";
  slug: "2022/2022-03-13-googong-dam";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-03-13-lake-george.md": {
	id: "2022/2022-03-13-lake-george.md";
  slug: "2022/2022-03-13-lake-george";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-03-14-balloon.md": {
	id: "2022/2022-03-14-balloon.md";
  slug: "2022/2022-03-14-balloon";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-03-14-canberra-street-art.md": {
	id: "2022/2022-03-14-canberra-street-art.md";
  slug: "2022/2022-03-14-canberra-street-art";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-03-14-cotter-dam.md": {
	id: "2022/2022-03-14-cotter-dam.md";
  slug: "2022/2022-03-14-cotter-dam";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-03-14-mt-stromlo.md": {
	id: "2022/2022-03-14-mt-stromlo.md";
  slug: "2022/2022-03-14-mt-stromlo";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-03-15-death-on-the-nile.md": {
	id: "2022/2022-03-15-death-on-the-nile.md";
  slug: "2022/2022-03-15-death-on-the-nile";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-03-16-bos23.md": {
	id: "2022/2022-03-16-bos23.md";
  slug: "2022/2022-03-16-bos23";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-03-16-palisade.md": {
	id: "2022/2022-03-16-palisade.md";
  slug: "2022/2022-03-16-palisade";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-03-18-bos23.md": {
	id: "2022/2022-03-18-bos23.md";
  slug: "2022/2022-03-18-bos23";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-03-18-malay-chinese.md": {
	id: "2022/2022-03-18-malay-chinese.md";
  slug: "2022/2022-03-18-malay-chinese";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-03-19-dream.md": {
	id: "2022/2022-03-19-dream.md";
  slug: "2022/2022-03-19-dream";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-03-19-powerhouse-museum.md": {
	id: "2022/2022-03-19-powerhouse-museum.md";
  slug: "2022/2022-03-19-powerhouse-museum";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-03-20-dream.md": {
	id: "2022/2022-03-20-dream.md";
  slug: "2022/2022-03-20-dream";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-03-21-lai-lai.md": {
	id: "2022/2022-03-21-lai-lai.md";
  slug: "2022/2022-03-21-lai-lai";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-03-23-ckt-party.md": {
	id: "2022/2022-03-23-ckt-party.md";
  slug: "2022/2022-03-23-ckt-party";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-03-23-leica.md": {
	id: "2022/2022-03-23-leica.md";
  slug: "2022/2022-03-23-leica";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-03-25-french-toast.md": {
	id: "2022/2022-03-25-french-toast.md";
  slug: "2022/2022-03-25-french-toast";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-03-25-gold-and-black.md": {
	id: "2022/2022-03-25-gold-and-black.md";
  slug: "2022/2022-03-25-gold-and-black";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-03-25-motown.md": {
	id: "2022/2022-03-25-motown.md";
  slug: "2022/2022-03-25-motown";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-03-26-biryani-corner.md": {
	id: "2022/2022-03-26-biryani-corner.md";
  slug: "2022/2022-03-26-biryani-corner";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-03-27-david-jones.md": {
	id: "2022/2022-03-27-david-jones.md";
  slug: "2022/2022-03-27-david-jones";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-03-27-dream.md": {
	id: "2022/2022-03-27-dream.md";
  slug: "2022/2022-03-27-dream";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-03-27-old-school-kafey.md": {
	id: "2022/2022-03-27-old-school-kafey.md";
  slug: "2022/2022-03-27-old-school-kafey";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-03-27-ping-birthday.md": {
	id: "2022/2022-03-27-ping-birthday.md";
  slug: "2022/2022-03-27-ping-birthday";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-03-28-hayden-orpheum.md": {
	id: "2022/2022-03-28-hayden-orpheum.md";
  slug: "2022/2022-03-28-hayden-orpheum";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-03-29-cataract-dam.md": {
	id: "2022/2022-03-29-cataract-dam.md";
  slug: "2022/2022-03-29-cataract-dam";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-03-29-cordeaux-dam.md": {
	id: "2022/2022-03-29-cordeaux-dam.md";
  slug: "2022/2022-03-29-cordeaux-dam";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-03-29-nepean-dam.md": {
	id: "2022/2022-03-29-nepean-dam.md";
  slug: "2022/2022-03-29-nepean-dam";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-03-29-woronora-dam.md": {
	id: "2022/2022-03-29-woronora-dam.md";
  slug: "2022/2022-03-29-woronora-dam";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-03-30-rhodes-central.md": {
	id: "2022/2022-03-30-rhodes-central.md";
  slug: "2022/2022-03-30-rhodes-central";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-03-31-snow-apple.md": {
	id: "2022/2022-03-31-snow-apple.md";
  slug: "2022/2022-03-31-snow-apple";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-04-02-dream.md": {
	id: "2022/2022-04-02-dream.md";
  slug: "2022/2022-04-02-dream";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-04-02-james-taylor.md": {
	id: "2022/2022-04-02-james-taylor.md";
  slug: "2022/2022-04-02-james-taylor";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-04-02-lilong.md": {
	id: "2022/2022-04-02-lilong.md";
  slug: "2022/2022-04-02-lilong";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-04-03-dream.md": {
	id: "2022/2022-04-03-dream.md";
  slug: "2022/2022-04-03-dream";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-04-03-sydney-walk.md": {
	id: "2022/2022-04-03-sydney-walk.md";
  slug: "2022/2022-04-03-sydney-walk";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-04-04-dream.md": {
	id: "2022/2022-04-04-dream.md";
  slug: "2022/2022-04-04-dream";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-04-04-pork-luncheon-meat-fried-rice.md": {
	id: "2022/2022-04-04-pork-luncheon-meat-fried-rice.md";
  slug: "2022/2022-04-04-pork-luncheon-meat-fried-rice";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-04-04-pork-luncheon-meat-fritters.md": {
	id: "2022/2022-04-04-pork-luncheon-meat-fritters.md";
  slug: "2022/2022-04-04-pork-luncheon-meat-fritters";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-04-04-walk.md": {
	id: "2022/2022-04-04-walk.md";
  slug: "2022/2022-04-04-walk";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-04-05-dream.md": {
	id: "2022/2022-04-05-dream.md";
  slug: "2022/2022-04-05-dream";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-04-06-chinese-sausage-fried-rice.md": {
	id: "2022/2022-04-06-chinese-sausage-fried-rice.md";
  slug: "2022/2022-04-06-chinese-sausage-fried-rice";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-04-07-fish-cake-vege-stir-fry.md": {
	id: "2022/2022-04-07-fish-cake-vege-stir-fry.md";
  slug: "2022/2022-04-07-fish-cake-vege-stir-fry";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-04-10-lego-friends.md": {
	id: "2022/2022-04-10-lego-friends.md";
  slug: "2022/2022-04-10-lego-friends";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-04-10-royal-easter-show.md": {
	id: "2022/2022-04-10-royal-easter-show.md";
  slug: "2022/2022-04-10-royal-easter-show";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-04-12-bistro-59.md": {
	id: "2022/2022-04-12-bistro-59.md";
  slug: "2022/2022-04-12-bistro-59";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-04-12-easter-girls-road-trip.md": {
	id: "2022/2022-04-12-easter-girls-road-trip.md";
  slug: "2022/2022-04-12-easter-girls-road-trip";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-04-12-lincoln-rock.md": {
	id: "2022/2022-04-12-lincoln-rock.md";
  slug: "2022/2022-04-12-lincoln-rock";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-04-12-oberon-dam.md": {
	id: "2022/2022-04-12-oberon-dam.md";
  slug: "2022/2022-04-12-oberon-dam";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-04-12-unique-patisserie.md": {
	id: "2022/2022-04-12-unique-patisserie.md";
  slug: "2022/2022-04-12-unique-patisserie";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-04-13-mayfield-garden.md": {
	id: "2022/2022-04-13-mayfield-garden.md";
  slug: "2022/2022-04-13-mayfield-garden";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-04-14-frenchies.md": {
	id: "2022/2022-04-14-frenchies.md";
  slug: "2022/2022-04-14-frenchies";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-04-16-paul-landa.md": {
	id: "2022/2022-04-16-paul-landa.md";
  slug: "2022/2022-04-16-paul-landa";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-04-16-pearl-beach.md": {
	id: "2022/2022-04-16-pearl-beach.md";
  slug: "2022/2022-04-16-pearl-beach";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-04-17-galleria.md": {
	id: "2022/2022-04-17-galleria.md";
  slug: "2022/2022-04-17-galleria";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-04-17-ikhwan.md": {
	id: "2022/2022-04-17-ikhwan.md";
  slug: "2022/2022-04-17-ikhwan";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-04-18-newcastle.md": {
	id: "2022/2022-04-18-newcastle.md";
  slug: "2022/2022-04-18-newcastle";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-04-19-dream.md": {
	id: "2022/2022-04-19-dream.md";
  slug: "2022/2022-04-19-dream";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-04-20-mt-wilson.md": {
	id: "2022/2022-04-20-mt-wilson.md";
  slug: "2022/2022-04-20-mt-wilson";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-04-21-rhodes-central.md": {
	id: "2022/2022-04-21-rhodes-central.md";
  slug: "2022/2022-04-21-rhodes-central";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-04-22-chinta-ria.md": {
	id: "2022/2022-04-22-chinta-ria.md";
  slug: "2022/2022-04-22-chinta-ria";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-04-22-museum-of-sydney.md": {
	id: "2022/2022-04-22-museum-of-sydney.md";
  slug: "2022/2022-04-22-museum-of-sydney";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-04-23-southern-highlands.md": {
	id: "2022/2022-04-23-southern-highlands.md";
  slug: "2022/2022-04-23-southern-highlands";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-04-24-southern-highlands.md": {
	id: "2022/2022-04-24-southern-highlands.md";
  slug: "2022/2022-04-24-southern-highlands";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-04-25-casarecce.md": {
	id: "2022/2022-04-25-casarecce.md";
  slug: "2022/2022-04-25-casarecce";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-04-26-assam-laksa.md": {
	id: "2022/2022-04-26-assam-laksa.md";
  slug: "2022/2022-04-26-assam-laksa";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-04-27-amah.md": {
	id: "2022/2022-04-27-amah.md";
  slug: "2022/2022-04-27-amah";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-04-30-guildford.md": {
	id: "2022/2022-04-30-guildford.md";
  slug: "2022/2022-04-30-guildford";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-04-30-investment.md": {
	id: "2022/2022-04-30-investment.md";
  slug: "2022/2022-04-30-investment";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-05-02-sydney.md": {
	id: "2022/2022-05-02-sydney.md";
  slug: "2022/2022-05-02-sydney";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-05-03-sharon-vanilla-slice.md": {
	id: "2022/2022-05-03-sharon-vanilla-slice.md";
  slug: "2022/2022-05-03-sharon-vanilla-slice";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-05-05-dream.md": {
	id: "2022/2022-05-05-dream.md";
  slug: "2022/2022-05-05-dream";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-05-05-guildford.md": {
	id: "2022/2022-05-05-guildford.md";
  slug: "2022/2022-05-05-guildford";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-05-05-mt-tomah.md": {
	id: "2022/2022-05-05-mt-tomah.md";
  slug: "2022/2022-05-05-mt-tomah";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-05-05-mt-wilson.md": {
	id: "2022/2022-05-05-mt-wilson.md";
  slug: "2022/2022-05-05-mt-wilson";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-05-05-nooroo.md": {
	id: "2022/2022-05-05-nooroo.md";
  slug: "2022/2022-05-05-nooroo";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-05-07-lcnp.md": {
	id: "2022/2022-05-07-lcnp.md";
  slug: "2022/2022-05-07-lcnp";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-05-08-mt-annan.md": {
	id: "2022/2022-05-08-mt-annan.md";
  slug: "2022/2022-05-08-mt-annan";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-05-09-liverpool.md": {
	id: "2022/2022-05-09-liverpool.md";
  slug: "2022/2022-05-09-liverpool";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-05-10-huong-xua.md": {
	id: "2022/2022-05-10-huong-xua.md";
  slug: "2022/2022-05-10-huong-xua";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-05-11-cat-birthday.md": {
	id: "2022/2022-05-11-cat-birthday.md";
  slug: "2022/2022-05-11-cat-birthday";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-05-11-ready-to-party.md": {
	id: "2022/2022-05-11-ready-to-party.md";
  slug: "2022/2022-05-11-ready-to-party";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-05-12-port-macquarie.md": {
	id: "2022/2022-05-12-port-macquarie.md";
  slug: "2022/2022-05-12-port-macquarie";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-05-13-court-house.md": {
	id: "2022/2022-05-13-court-house.md";
  slug: "2022/2022-05-13-court-house";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-05-13-flower-dress.md": {
	id: "2022/2022-05-13-flower-dress.md";
  slug: "2022/2022-05-13-flower-dress";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-05-13-kaftan.md": {
	id: "2022/2022-05-13-kaftan.md";
  slug: "2022/2022-05-13-kaftan";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-05-13-koala-hospital.md": {
	id: "2022/2022-05-13-koala-hospital.md";
  slug: "2022/2022-05-13-koala-hospital";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-05-13-museum.md": {
	id: "2022/2022-05-13-museum.md";
  slug: "2022/2022-05-13-museum";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-05-13-port-macquarie.md": {
	id: "2022/2022-05-13-port-macquarie.md";
  slug: "2022/2022-05-13-port-macquarie";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-05-13-roto-house.md": {
	id: "2022/2022-05-13-roto-house.md";
  slug: "2022/2022-05-13-roto-house";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-05-14-coastal-walk.md": {
	id: "2022/2022-05-14-coastal-walk.md";
  slug: "2022/2022-05-14-coastal-walk";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-05-15-cowarra-dam.md": {
	id: "2022/2022-05-15-cowarra-dam.md";
  slug: "2022/2022-05-15-cowarra-dam";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-05-15-lego-friends.md": {
	id: "2022/2022-05-15-lego-friends.md";
  slug: "2022/2022-05-15-lego-friends";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-05-15-old-bottlebutt.md": {
	id: "2022/2022-05-15-old-bottlebutt.md";
  slug: "2022/2022-05-15-old-bottlebutt";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-05-15-port-macquarie.md": {
	id: "2022/2022-05-15-port-macquarie.md";
  slug: "2022/2022-05-15-port-macquarie";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-05-16-gnomes.md": {
	id: "2022/2022-05-16-gnomes.md";
  slug: "2022/2022-05-16-gnomes";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-05-16-kaftan.md": {
	id: "2022/2022-05-16-kaftan.md";
  slug: "2022/2022-05-16-kaftan";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-05-16-rita-birthday.md": {
	id: "2022/2022-05-16-rita-birthday.md";
  slug: "2022/2022-05-16-rita-birthday";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-05-16-vesak-day.md": {
	id: "2022/2022-05-16-vesak-day.md";
  slug: "2022/2022-05-16-vesak-day";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-05-17-macquarie.md": {
	id: "2022/2022-05-17-macquarie.md";
  slug: "2022/2022-05-17-macquarie";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-05-18-hojiak-haymarket.md": {
	id: "2022/2022-05-18-hojiak-haymarket.md";
  slug: "2022/2022-05-18-hojiak-haymarket";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-05-19-nurragingy.md": {
	id: "2022/2022-05-19-nurragingy.md";
  slug: "2022/2022-05-19-nurragingy";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-05-20-princess.md": {
	id: "2022/2022-05-20-princess.md";
  slug: "2022/2022-05-20-princess";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-05-21-cindy-baby-shower.md": {
	id: "2022/2022-05-21-cindy-baby-shower.md";
  slug: "2022/2022-05-21-cindy-baby-shower";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-05-22-campsie.md": {
	id: "2022/2022-05-22-campsie.md";
  slug: "2022/2022-05-22-campsie";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-05-22-dream.md": {
	id: "2022/2022-05-22-dream.md";
  slug: "2022/2022-05-22-dream";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-05-23-dream.md": {
	id: "2022/2022-05-23-dream.md";
  slug: "2022/2022-05-23-dream";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-05-24-bak-chang.md": {
	id: "2022/2022-05-24-bak-chang.md";
  slug: "2022/2022-05-24-bak-chang";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-05-25-dream.md": {
	id: "2022/2022-05-25-dream.md";
  slug: "2022/2022-05-25-dream";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-05-25-hons-reunion.md": {
	id: "2022/2022-05-25-hons-reunion.md";
  slug: "2022/2022-05-25-hons-reunion";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-05-27-vivid.md": {
	id: "2022/2022-05-27-vivid.md";
  slug: "2022/2022-05-27-vivid";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-05-28-autumn.md": {
	id: "2022/2022-05-28-autumn.md";
  slug: "2022/2022-05-28-autumn";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-05-28-bos23.md": {
	id: "2022/2022-05-28-bos23.md";
  slug: "2022/2022-05-28-bos23";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-05-29-night-flight.md": {
	id: "2022/2022-05-29-night-flight.md";
  slug: "2022/2022-05-29-night-flight";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-05-29-zenith.md": {
	id: "2022/2022-05-29-zenith.md";
  slug: "2022/2022-05-29-zenith";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-05-31-dream.md": {
	id: "2022/2022-05-31-dream.md";
  slug: "2022/2022-05-31-dream";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-06-01-theatre-royal.md": {
	id: "2022/2022-06-01-theatre-royal.md";
  slug: "2022/2022-06-01-theatre-royal";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-06-02-parramatta-river.md": {
	id: "2022/2022-06-02-parramatta-river.md";
  slug: "2022/2022-06-02-parramatta-river";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-06-02-vivid.md": {
	id: "2022/2022-06-02-vivid.md";
  slug: "2022/2022-06-02-vivid";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-06-04-vivid.md": {
	id: "2022/2022-06-04-vivid.md";
  slug: "2022/2022-06-04-vivid";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-06-05-bollywood.md": {
	id: "2022/2022-06-05-bollywood.md";
  slug: "2022/2022-06-05-bollywood";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-06-05-vivid.md": {
	id: "2022/2022-06-05-vivid.md";
  slug: "2022/2022-06-05-vivid";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-06-06-vivid.md": {
	id: "2022/2022-06-06-vivid.md";
  slug: "2022/2022-06-06-vivid";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-06-08-eunice-birthday.md": {
	id: "2022/2022-06-08-eunice-birthday.md";
  slug: "2022/2022-06-08-eunice-birthday";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-06-09-vivid.md": {
	id: "2022/2022-06-09-vivid.md";
  slug: "2022/2022-06-09-vivid";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-06-11-burwood.md": {
	id: "2022/2022-06-11-burwood.md";
  slug: "2022/2022-06-11-burwood";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-06-12-bos23.md": {
	id: "2022/2022-06-12-bos23.md";
  slug: "2022/2022-06-12-bos23";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-06-14-canton-cafe.md": {
	id: "2022/2022-06-14-canton-cafe.md";
  slug: "2022/2022-06-14-canton-cafe";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-06-14-elemnt-roam.md": {
	id: "2022/2022-06-14-elemnt-roam.md";
  slug: "2022/2022-06-14-elemnt-roam";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-06-15-haymarket.md": {
	id: "2022/2022-06-15-haymarket.md";
  slug: "2022/2022-06-15-haymarket";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-06-16-dream.md": {
	id: "2022/2022-06-16-dream.md";
  slug: "2022/2022-06-16-dream";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-06-17-my-malaysian-kitchen.md": {
	id: "2022/2022-06-17-my-malaysian-kitchen.md";
  slug: "2022/2022-06-17-my-malaysian-kitchen";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-06-18-bomber-jacket.md": {
	id: "2022/2022-06-18-bomber-jacket.md";
  slug: "2022/2022-06-18-bomber-jacket";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-06-20-dosa-hut.md": {
	id: "2022/2022-06-20-dosa-hut.md";
  slug: "2022/2022-06-20-dosa-hut";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-06-20-liverpool.md": {
	id: "2022/2022-06-20-liverpool.md";
  slug: "2022/2022-06-20-liverpool";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-06-23-cooking-wok-gas.md": {
	id: "2022/2022-06-23-cooking-wok-gas.md";
  slug: "2022/2022-06-23-cooking-wok-gas";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-06-24-aileen-birthday.md": {
	id: "2022/2022-06-24-aileen-birthday.md";
  slug: "2022/2022-06-24-aileen-birthday";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-06-24-kebaya.md": {
	id: "2022/2022-06-24-kebaya.md";
  slug: "2022/2022-06-24-kebaya";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-06-25-dream.md": {
	id: "2022/2022-06-25-dream.md";
  slug: "2022/2022-06-25-dream";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-06-26-scavenger-hunt.md": {
	id: "2022/2022-06-26-scavenger-hunt.md";
  slug: "2022/2022-06-26-scavenger-hunt";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-06-27-mr-stonepot.md": {
	id: "2022/2022-06-27-mr-stonepot.md";
  slug: "2022/2022-06-27-mr-stonepot";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-06-28-dream.md": {
	id: "2022/2022-06-28-dream.md";
  slug: "2022/2022-06-28-dream";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-07-01-dream.md": {
	id: "2022/2022-07-01-dream.md";
  slug: "2022/2022-07-01-dream";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-07-01-sharon-birthday.md": {
	id: "2022/2022-07-01-sharon-birthday.md";
  slug: "2022/2022-07-01-sharon-birthday";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-07-01-top-gun.md": {
	id: "2022/2022-07-01-top-gun.md";
  slug: "2022/2022-07-01-top-gun";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-07-02-kingsford.md": {
	id: "2022/2022-07-02-kingsford.md";
  slug: "2022/2022-07-02-kingsford";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-07-04-cindy-lunch.md": {
	id: "2022/2022-07-04-cindy-lunch.md";
  slug: "2022/2022-07-04-cindy-lunch";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-07-05-spice-world.md": {
	id: "2022/2022-07-05-spice-world.md";
  slug: "2022/2022-07-05-spice-world";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-07-11-flower.md": {
	id: "2022/2022-07-11-flower.md";
  slug: "2022/2022-07-11-flower";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-07-12-nanyang.md": {
	id: "2022/2022-07-12-nanyang.md";
  slug: "2022/2022-07-12-nanyang";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-07-13-kimono.md": {
	id: "2022/2022-07-13-kimono.md";
  slug: "2022/2022-07-13-kimono";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-07-13-sri-lanka.md": {
	id: "2022/2022-07-13-sri-lanka.md";
  slug: "2022/2022-07-13-sri-lanka";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-07-14-patio.md": {
	id: "2022/2022-07-14-patio.md";
  slug: "2022/2022-07-14-patio";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-07-16-ipoh-dynasty.md": {
	id: "2022/2022-07-16-ipoh-dynasty.md";
  slug: "2022/2022-07-16-ipoh-dynasty";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-07-20-dream.md": {
	id: "2022/2022-07-20-dream.md";
  slug: "2022/2022-07-20-dream";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-07-22-flower-power.md": {
	id: "2022/2022-07-22-flower-power.md";
  slug: "2022/2022-07-22-flower-power";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-07-23-nasi-kandar-parlea.md": {
	id: "2022/2022-07-23-nasi-kandar-parlea.md";
  slug: "2022/2022-07-23-nasi-kandar-parlea";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-07-24-sunday-dose-breakfast.md": {
	id: "2022/2022-07-24-sunday-dose-breakfast.md";
  slug: "2022/2022-07-24-sunday-dose-breakfast";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-07-27-dream.md": {
	id: "2022/2022-07-27-dream.md";
  slug: "2022/2022-07-27-dream";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-07-30-dream.md": {
	id: "2022/2022-07-30-dream.md";
  slug: "2022/2022-07-30-dream";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-07-30-sufferfest.md": {
	id: "2022/2022-07-30-sufferfest.md";
  slug: "2022/2022-07-30-sufferfest";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-07-30-yulefest.md": {
	id: "2022/2022-07-30-yulefest.md";
  slug: "2022/2022-07-30-yulefest";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-07-31-echo-point.md": {
	id: "2022/2022-07-31-echo-point.md";
  slug: "2022/2022-07-31-echo-point";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-07-31-megalong-valley.md": {
	id: "2022/2022-07-31-megalong-valley.md";
  slug: "2022/2022-07-31-megalong-valley";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-08-01-megalong-valley.md": {
	id: "2022/2022-08-01-megalong-valley.md";
  slug: "2022/2022-08-01-megalong-valley";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-08-02-megalong-valley.md": {
	id: "2022/2022-08-02-megalong-valley.md";
  slug: "2022/2022-08-02-megalong-valley";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-08-06-peranakan-place.md": {
	id: "2022/2022-08-06-peranakan-place.md";
  slug: "2022/2022-08-06-peranakan-place";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-08-06-tasmania.md": {
	id: "2022/2022-08-06-tasmania.md";
  slug: "2022/2022-08-06-tasmania";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-08-07-dream.md": {
	id: "2022/2022-08-07-dream.md";
  slug: "2022/2022-08-07-dream";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-08-08-birthday.md": {
	id: "2022/2022-08-08-birthday.md";
  slug: "2022/2022-08-08-birthday";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-08-09-dream.md": {
	id: "2022/2022-08-09-dream.md";
  slug: "2022/2022-08-09-dream";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-08-11-elemnt-bolt.md": {
	id: "2022/2022-08-11-elemnt-bolt.md";
  slug: "2022/2022-08-11-elemnt-bolt";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-08-13-kebaya.md": {
	id: "2022/2022-08-13-kebaya.md";
  slug: "2022/2022-08-13-kebaya";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-08-13-temasek-dinner.md": {
	id: "2022/2022-08-13-temasek-dinner.md";
  slug: "2022/2022-08-13-temasek-dinner";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-08-14-darling-harbour.md": {
	id: "2022/2022-08-14-darling-harbour.md";
  slug: "2022/2022-08-14-darling-harbour";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-08-14-family-birthday.md": {
	id: "2022/2022-08-14-family-birthday.md";
  slug: "2022/2022-08-14-family-birthday";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-08-14-leather-skirt.md": {
	id: "2022/2022-08-14-leather-skirt.md";
  slug: "2022/2022-08-14-leather-skirt";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-08-17-broadway.md": {
	id: "2022/2022-08-17-broadway.md";
  slug: "2022/2022-08-17-broadway";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-08-17-grounds.md": {
	id: "2022/2022-08-17-grounds.md";
  slug: "2022/2022-08-17-grounds";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-08-18-akuna-bay.md": {
	id: "2022/2022-08-18-akuna-bay.md";
  slug: "2022/2022-08-18-akuna-bay";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-08-20-auburn-cherry-blossom.md": {
	id: "2022/2022-08-20-auburn-cherry-blossom.md";
  slug: "2022/2022-08-20-auburn-cherry-blossom";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-08-22-femmes.md": {
	id: "2022/2022-08-22-femmes.md";
  slug: "2022/2022-08-22-femmes";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-09-07-wong-time-again.md": {
	id: "2022/2022-09-07-wong-time-again.md";
  slug: "2022/2022-09-07-wong-time-again";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-09-08-spring-garden.md": {
	id: "2022/2022-09-08-spring-garden.md";
  slug: "2022/2022-09-08-spring-garden";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-09-08-yunn.md": {
	id: "2022/2022-09-08-yunn.md";
  slug: "2022/2022-09-08-yunn";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-09-10-cheongsam.md": {
	id: "2022/2022-09-10-cheongsam.md";
  slug: "2022/2022-09-10-cheongsam";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-09-10-dream.md": {
	id: "2022/2022-09-10-dream.md";
  slug: "2022/2022-09-10-dream";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-09-10-sharon-wong-birthday.md": {
	id: "2022/2022-09-10-sharon-wong-birthday.md";
  slug: "2022/2022-09-10-sharon-wong-birthday";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-09-11-laura-kitchen.md": {
	id: "2022/2022-09-11-laura-kitchen.md";
  slug: "2022/2022-09-11-laura-kitchen";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-09-12-clueless.md": {
	id: "2022/2022-09-12-clueless.md";
  slug: "2022/2022-09-12-clueless";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-09-15-rice-den.md": {
	id: "2022/2022-09-15-rice-den.md";
  slug: "2022/2022-09-15-rice-den";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-09-17-nurragingy-reserve.md": {
	id: "2022/2022-09-17-nurragingy-reserve.md";
  slug: "2022/2022-09-17-nurragingy-reserve";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-09-18-zeal-north.md": {
	id: "2022/2022-09-18-zeal-north.md";
  slug: "2022/2022-09-18-zeal-north";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-09-19-parramatta.md": {
	id: "2022/2022-09-19-parramatta.md";
  slug: "2022/2022-09-19-parramatta";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-09-20-cape-formentor.md": {
	id: "2022/2022-09-20-cape-formentor.md";
  slug: "2022/2022-09-20-cape-formentor";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-09-21-mt-annan.md": {
	id: "2022/2022-09-21-mt-annan.md";
  slug: "2022/2022-09-21-mt-annan";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-09-22-dream.md": {
	id: "2022/2022-09-22-dream.md";
  slug: "2022/2022-09-22-dream";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-09-22-vn-street-food.md": {
	id: "2022/2022-09-22-vn-street-food.md";
  slug: "2022/2022-09-22-vn-street-food";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-09-23-cowra.md": {
	id: "2022/2022-09-23-cowra.md";
  slug: "2022/2022-09-23-cowra";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-09-24-japanese-garden.md": {
	id: "2022/2022-09-24-japanese-garden.md";
  slug: "2022/2022-09-24-japanese-garden";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-09-25-floriade.md": {
	id: "2022/2022-09-25-floriade.md";
  slug: "2022/2022-09-25-floriade";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-09-26-tulip-top.md": {
	id: "2022/2022-09-26-tulip-top.md";
  slug: "2022/2022-09-26-tulip-top";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-09-27-masak-masak.md": {
	id: "2022/2022-09-27-masak-masak.md";
  slug: "2022/2022-09-27-masak-masak";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-09-28-chill.md": {
	id: "2022/2022-09-28-chill.md";
  slug: "2022/2022-09-28-chill";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-10-01-poke-bowl.md": {
	id: "2022/2022-10-01-poke-bowl.md";
  slug: "2022/2022-10-01-poke-bowl";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-10-02-parramatta.md": {
	id: "2022/2022-10-02-parramatta.md";
  slug: "2022/2022-10-02-parramatta";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-10-02-spring.md": {
	id: "2022/2022-10-02-spring.md";
  slug: "2022/2022-10-02-spring";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-10-03-leather-outfit.md": {
	id: "2022/2022-10-03-leather-outfit.md";
  slug: "2022/2022-10-03-leather-outfit";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-10-03-leura.md": {
	id: "2022/2022-10-03-leura.md";
  slug: "2022/2022-10-03-leura";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-10-05-investment-update.md": {
	id: "2022/2022-10-05-investment-update.md";
  slug: "2022/2022-10-05-investment-update";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-10-06-hunter-valley-gardens.md": {
	id: "2022/2022-10-06-hunter-valley-gardens.md";
  slug: "2022/2022-10-06-hunter-valley-gardens";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-10-06-peppers.md": {
	id: "2022/2022-10-06-peppers.md";
  slug: "2022/2022-10-06-peppers";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-10-06-winmark.md": {
	id: "2022/2022-10-06-winmark.md";
  slug: "2022/2022-10-06-winmark";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-10-08-dream.md": {
	id: "2022/2022-10-08-dream.md";
  slug: "2022/2022-10-08-dream";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-10-08-nanyang.md": {
	id: "2022/2022-10-08-nanyang.md";
  slug: "2022/2022-10-08-nanyang";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-10-09-flapper.md": {
	id: "2022/2022-10-09-flapper.md";
  slug: "2022/2022-10-09-flapper";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-10-09-radika-birthday.md": {
	id: "2022/2022-10-09-radika-birthday.md";
  slug: "2022/2022-10-09-radika-birthday";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-10-11-travel.md": {
	id: "2022/2022-10-11-travel.md";
  slug: "2022/2022-10-11-travel";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-10-12-amah.md": {
	id: "2022/2022-10-12-amah.md";
  slug: "2022/2022-10-12-amah";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-10-15-burwood.md": {
	id: "2022/2022-10-15-burwood.md";
  slug: "2022/2022-10-15-burwood";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-10-17-indian-outfit.md": {
	id: "2022/2022-10-17-indian-outfit.md";
  slug: "2022/2022-10-17-indian-outfit";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-10-17-nawaz.md": {
	id: "2022/2022-10-17-nawaz.md";
  slug: "2022/2022-10-17-nawaz";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-10-18-dream.md": {
	id: "2022/2022-10-18-dream.md";
  slug: "2022/2022-10-18-dream";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-10-19-hello-kitty.md": {
	id: "2022/2022-10-19-hello-kitty.md";
  slug: "2022/2022-10-19-hello-kitty";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-10-19-hokkien-mee.md": {
	id: "2022/2022-10-19-hokkien-mee.md";
  slug: "2022/2022-10-19-hokkien-mee";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-10-21-dream.md": {
	id: "2022/2022-10-21-dream.md";
  slug: "2022/2022-10-21-dream";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-10-23-kirribilli.md": {
	id: "2022/2022-10-23-kirribilli.md";
  slug: "2022/2022-10-23-kirribilli";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-10-23-ryoko-100.md": {
	id: "2022/2022-10-23-ryoko-100.md";
  slug: "2022/2022-10-23-ryoko-100";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-10-24-patricia-birthday.md": {
	id: "2022/2022-10-24-patricia-birthday.md";
  slug: "2022/2022-10-24-patricia-birthday";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-10-25-luci.md": {
	id: "2022/2022-10-25-luci.md";
  slug: "2022/2022-10-25-luci";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-10-26-sculpture-by-the-sea.md": {
	id: "2022/2022-10-26-sculpture-by-the-sea.md";
  slug: "2022/2022-10-26-sculpture-by-the-sea";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-10-27-sculpture-by-the-sea.md": {
	id: "2022/2022-10-27-sculpture-by-the-sea.md";
  slug: "2022/2022-10-27-sculpture-by-the-sea";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-10-29-radika-birthday.md": {
	id: "2022/2022-10-29-radika-birthday.md";
  slug: "2022/2022-10-29-radika-birthday";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-10-30-bundanoon.md": {
	id: "2022/2022-10-30-bundanoon.md";
  slug: "2022/2022-10-30-bundanoon";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-10-30-flower-lace-dress.md": {
	id: "2022/2022-10-30-flower-lace-dress.md";
  slug: "2022/2022-10-30-flower-lace-dress";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-10-30-satay-guildford.md": {
	id: "2022/2022-10-30-satay-guildford.md";
  slug: "2022/2022-10-30-satay-guildford";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-10-31-sculpture-by-the-sea.md": {
	id: "2022/2022-10-31-sculpture-by-the-sea.md";
  slug: "2022/2022-10-31-sculpture-by-the-sea";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-11-01-melbourne-cup.md": {
	id: "2022/2022-11-01-melbourne-cup.md";
  slug: "2022/2022-11-01-melbourne-cup";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-11-01-portfolio.md": {
	id: "2022/2022-11-01-portfolio.md";
  slug: "2022/2022-11-01-portfolio";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-11-02-sunflower.md": {
	id: "2022/2022-11-02-sunflower.md";
  slug: "2022/2022-11-02-sunflower";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-11-03-dunoon.md": {
	id: "2022/2022-11-03-dunoon.md";
  slug: "2022/2022-11-03-dunoon";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-11-03-grace-of-india.md": {
	id: "2022/2022-11-03-grace-of-india.md";
  slug: "2022/2022-11-03-grace-of-india";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-11-03-jacaranda-dress.md": {
	id: "2022/2022-11-03-jacaranda-dress.md";
  slug: "2022/2022-11-03-jacaranda-dress";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-11-03-kirribilli.md": {
	id: "2022/2022-11-03-kirribilli.md";
  slug: "2022/2022-11-03-kirribilli";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-11-03-sub-base-platypus.md": {
	id: "2022/2022-11-03-sub-base-platypus.md";
  slug: "2022/2022-11-03-sub-base-platypus";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-11-04-de-ronde.md": {
	id: "2022/2022-11-04-de-ronde.md";
  slug: "2022/2022-11-04-de-ronde";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-11-04-holy-basil.md": {
	id: "2022/2022-11-04-holy-basil.md";
  slug: "2022/2022-11-04-holy-basil";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-11-05-flat-rock-gully.md": {
	id: "2022/2022-11-05-flat-rock-gully.md";
  slug: "2022/2022-11-05-flat-rock-gully";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-11-05-hallstrom-park.md": {
	id: "2022/2022-11-05-hallstrom-park.md";
  slug: "2022/2022-11-05-hallstrom-park";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-11-06-popiah-gotong-royong.md": {
	id: "2022/2022-11-06-popiah-gotong-royong.md";
  slug: "2022/2022-11-06-popiah-gotong-royong";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-11-07-pan-mee.md": {
	id: "2022/2022-11-07-pan-mee.md";
  slug: "2022/2022-11-07-pan-mee";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-11-08-kon-loh-mee.md": {
	id: "2022/2022-11-08-kon-loh-mee.md";
  slug: "2022/2022-11-08-kon-loh-mee";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-11-09-flower-dress.md": {
	id: "2022/2022-11-09-flower-dress.md";
  slug: "2022/2022-11-09-flower-dress";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-11-09-masuya.md": {
	id: "2022/2022-11-09-masuya.md";
  slug: "2022/2022-11-09-masuya";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-11-11-burwood.md": {
	id: "2022/2022-11-11-burwood.md";
  slug: "2022/2022-11-11-burwood";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-11-11-rickshaw.md": {
	id: "2022/2022-11-11-rickshaw.md";
  slug: "2022/2022-11-11-rickshaw";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-11-11-size-10.md": {
	id: "2022/2022-11-11-size-10.md";
  slug: "2022/2022-11-11-size-10";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-11-12-peranakan-dinner.md": {
	id: "2022/2022-11-12-peranakan-dinner.md";
  slug: "2022/2022-11-12-peranakan-dinner";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-11-12-pink-kebaya.md": {
	id: "2022/2022-11-12-pink-kebaya.md";
  slug: "2022/2022-11-12-pink-kebaya";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-11-13-technics.md": {
	id: "2022/2022-11-13-technics.md";
  slug: "2022/2022-11-13-technics";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-11-13-zeal-of-zebras.md": {
	id: "2022/2022-11-13-zeal-of-zebras.md";
  slug: "2022/2022-11-13-zeal-of-zebras";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-11-14-thermomix.md": {
	id: "2022/2022-11-14-thermomix.md";
  slug: "2022/2022-11-14-thermomix";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-11-15-linda-birthday.md": {
	id: "2022/2022-11-15-linda-birthday.md";
  slug: "2022/2022-11-15-linda-birthday";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-11-15-pink-lace.md": {
	id: "2022/2022-11-15-pink-lace.md";
  slug: "2022/2022-11-15-pink-lace";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-11-17-david-jones.md": {
	id: "2022/2022-11-17-david-jones.md";
  slug: "2022/2022-11-17-david-jones";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-11-17-east-sydney.md": {
	id: "2022/2022-11-17-east-sydney.md";
  slug: "2022/2022-11-17-east-sydney";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-11-17-jacarandas.md": {
	id: "2022/2022-11-17-jacarandas.md";
  slug: "2022/2022-11-17-jacarandas";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-11-17-seelv.md": {
	id: "2022/2022-11-17-seelv.md";
  slug: "2022/2022-11-17-seelv";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-11-17-sydney.md": {
	id: "2022/2022-11-17-sydney.md";
  slug: "2022/2022-11-17-sydney";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-11-19-bobbin-head.md": {
	id: "2022/2022-11-19-bobbin-head.md";
  slug: "2022/2022-11-19-bobbin-head";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-11-19-lane-covelo-xmas.md": {
	id: "2022/2022-11-19-lane-covelo-xmas.md";
  slug: "2022/2022-11-19-lane-covelo-xmas";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-11-19-pink-swirl.md": {
	id: "2022/2022-11-19-pink-swirl.md";
  slug: "2022/2022-11-19-pink-swirl";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-11-20-xo-sauce-fried-rice.md": {
	id: "2022/2022-11-20-xo-sauce-fried-rice.md";
  slug: "2022/2022-11-20-xo-sauce-fried-rice";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-11-21-bobbin-head.md": {
	id: "2022/2022-11-21-bobbin-head.md";
  slug: "2022/2022-11-21-bobbin-head";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-11-24-gucci.md": {
	id: "2022/2022-11-24-gucci.md";
  slug: "2022/2022-11-24-gucci";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-11-24-guildford.md": {
	id: "2022/2022-11-24-guildford.md";
  slug: "2022/2022-11-24-guildford";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-11-24-market-city-xmas.md": {
	id: "2022/2022-11-24-market-city-xmas.md";
  slug: "2022/2022-11-24-market-city-xmas";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-11-24-omnibus-lane.md": {
	id: "2022/2022-11-24-omnibus-lane.md";
  slug: "2022/2022-11-24-omnibus-lane";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-11-24-powerhouse.md": {
	id: "2022/2022-11-24-powerhouse.md";
  slug: "2022/2022-11-24-powerhouse";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-11-24-unpopular.md": {
	id: "2022/2022-11-24-unpopular.md";
  slug: "2022/2022-11-24-unpopular";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-11-24-zampatti.md": {
	id: "2022/2022-11-24-zampatti.md";
  slug: "2022/2022-11-24-zampatti";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-11-25-blue-kaftan.md": {
	id: "2022/2022-11-25-blue-kaftan.md";
  slug: "2022/2022-11-25-blue-kaftan";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-11-25-thanksgiving.md": {
	id: "2022/2022-11-25-thanksgiving.md";
  slug: "2022/2022-11-25-thanksgiving";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-11-26-akuna-bay.md": {
	id: "2022/2022-11-26-akuna-bay.md";
  slug: "2022/2022-11-26-akuna-bay";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-11-26-gin-and-high-tea.md": {
	id: "2022/2022-11-26-gin-and-high-tea.md";
  slug: "2022/2022-11-26-gin-and-high-tea";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-11-26-jacarandas.md": {
	id: "2022/2022-11-26-jacarandas.md";
  slug: "2022/2022-11-26-jacarandas";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-11-26-sardine-sandwich.md": {
	id: "2022/2022-11-26-sardine-sandwich.md";
  slug: "2022/2022-11-26-sardine-sandwich";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-11-27-chatswood-xmas.md": {
	id: "2022/2022-11-27-chatswood-xmas.md";
  slug: "2022/2022-11-27-chatswood-xmas";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-11-27-malaysian-festival.md": {
	id: "2022/2022-11-27-malaysian-festival.md";
  slug: "2022/2022-11-27-malaysian-festival";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-11-27-qvb-xmas.md": {
	id: "2022/2022-11-27-qvb-xmas.md";
  slug: "2022/2022-11-27-qvb-xmas";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-11-29-jeans.md": {
	id: "2022/2022-11-29-jeans.md";
  slug: "2022/2022-11-29-jeans";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-11-29-new-shanghai.md": {
	id: "2022/2022-11-29-new-shanghai.md";
  slug: "2022/2022-11-29-new-shanghai";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-12-01-dream.md": {
	id: "2022/2022-12-01-dream.md";
  slug: "2022/2022-12-01-dream";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-12-02-dream.md": {
	id: "2022/2022-12-02-dream.md";
  slug: "2022/2022-12-02-dream";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-12-02-sydney-xmas.md": {
	id: "2022/2022-12-02-sydney-xmas.md";
  slug: "2022/2022-12-02-sydney-xmas";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-12-03-campsie.md": {
	id: "2022/2022-12-03-campsie.md";
  slug: "2022/2022-12-03-campsie";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-12-03-dream.md": {
	id: "2022/2022-12-03-dream.md";
  slug: "2022/2022-12-03-dream";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-12-03-lane-covelo-bbq.md": {
	id: "2022/2022-12-03-lane-covelo-bbq.md";
  slug: "2022/2022-12-03-lane-covelo-bbq";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-12-03-tinkerbelle.md": {
	id: "2022/2022-12-03-tinkerbelle.md";
  slug: "2022/2022-12-03-tinkerbelle";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-12-04-coal-loader.md": {
	id: "2022/2022-12-04-coal-loader.md";
  slug: "2022/2022-12-04-coal-loader";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-12-04-kopi-tiam.md": {
	id: "2022/2022-12-04-kopi-tiam.md";
  slug: "2022/2022-12-04-kopi-tiam";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-12-06-sydney-xmas.md": {
	id: "2022/2022-12-06-sydney-xmas.md";
  slug: "2022/2022-12-06-sydney-xmas";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-12-07-jennifer-birthday.md": {
	id: "2022/2022-12-07-jennifer-birthday.md";
  slug: "2022/2022-12-07-jennifer-birthday";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-12-07-mickey-mouse.md": {
	id: "2022/2022-12-07-mickey-mouse.md";
  slug: "2022/2022-12-07-mickey-mouse";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-12-09-noel-xmas.md": {
	id: "2022/2022-12-09-noel-xmas.md";
  slug: "2022/2022-12-09-noel-xmas";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-12-10-investment.md": {
	id: "2022/2022-12-10-investment.md";
  slug: "2022/2022-12-10-investment";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-12-10-surry-hills.md": {
	id: "2022/2022-12-10-surry-hills.md";
  slug: "2022/2022-12-10-surry-hills";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-12-11-zeal-xmas-ride.md": {
	id: "2022/2022-12-11-zeal-xmas-ride.md";
  slug: "2022/2022-12-11-zeal-xmas-ride";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-12-13-zeal-west-head.md": {
	id: "2022/2022-12-13-zeal-west-head.md";
  slug: "2022/2022-12-13-zeal-west-head";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-12-14-borgnis-st-xmas.md": {
	id: "2022/2022-12-14-borgnis-st-xmas.md";
  slug: "2022/2022-12-14-borgnis-st-xmas";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-12-14-ncr-reunion.md": {
	id: "2022/2022-12-14-ncr-reunion.md";
  slug: "2022/2022-12-14-ncr-reunion";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-12-15-nan-tien.md": {
	id: "2022/2022-12-15-nan-tien.md";
  slug: "2022/2022-12-15-nan-tien";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-12-16-chilly-spring.md": {
	id: "2022/2022-12-16-chilly-spring.md";
  slug: "2022/2022-12-16-chilly-spring";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-12-16-grounds-alexandria.md": {
	id: "2022/2022-12-16-grounds-alexandria.md";
  slug: "2022/2022-12-16-grounds-alexandria";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-12-17-dream.md": {
	id: "2022/2022-12-17-dream.md";
  slug: "2022/2022-12-17-dream";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-12-18-pink-outfit.md": {
	id: "2022/2022-12-18-pink-outfit.md";
  slug: "2022/2022-12-18-pink-outfit";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-12-18-sydney-park.md": {
	id: "2022/2022-12-18-sydney-park.md";
  slug: "2022/2022-12-18-sydney-park";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-12-18-westconnex.md": {
	id: "2022/2022-12-18-westconnex.md";
  slug: "2022/2022-12-18-westconnex";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-12-19-half-monty.md": {
	id: "2022/2022-12-19-half-monty.md";
  slug: "2022/2022-12-19-half-monty";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-12-21-cat-xmas.md": {
	id: "2022/2022-12-21-cat-xmas.md";
  slug: "2022/2022-12-21-cat-xmas";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-12-22-noel-xmas.md": {
	id: "2022/2022-12-22-noel-xmas.md";
  slug: "2022/2022-12-22-noel-xmas";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-12-24-buddha bowl.md": {
	id: "2022/2022-12-24-buddha bowl.md";
  slug: "2022/2022-12-24-buddha-bowl";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-12-25-family-xmas-lunch.md": {
	id: "2022/2022-12-25-family-xmas-lunch.md";
  slug: "2022/2022-12-25-family-xmas-lunch";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-12-26-burwood.md": {
	id: "2022/2022-12-26-burwood.md";
  slug: "2022/2022-12-26-burwood";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-12-27-muswellbrook.md": {
	id: "2022/2022-12-27-muswellbrook.md";
  slug: "2022/2022-12-27-muswellbrook";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-12-28-burning-mountain.md": {
	id: "2022/2022-12-28-burning-mountain.md";
  slug: "2022/2022-12-28-burning-mountain";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-12-28-dream.md": {
	id: "2022/2022-12-28-dream.md";
  slug: "2022/2022-12-28-dream";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-12-29-muswellbrook-walk.md": {
	id: "2022/2022-12-29-muswellbrook-walk.md";
  slug: "2022/2022-12-29-muswellbrook-walk";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-12-30-hunter-valley.md": {
	id: "2022/2022-12-30-hunter-valley.md";
  slug: "2022/2022-12-30-hunter-valley";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-12-31-air-burger.md": {
	id: "2022/2022-12-31-air-burger.md";
  slug: "2022/2022-12-31-air-burger";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2022/2022-12-31-mr-stonepot.md": {
	id: "2022/2022-12-31-mr-stonepot.md";
  slug: "2022/2022-12-31-mr-stonepot";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-01-01-new-year-walk.md": {
	id: "2023/2023-01-01-new-year-walk.md";
  slug: "2023/2023-01-01-new-year-walk";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-01-02-dream.md": {
	id: "2023/2023-01-02-dream.md";
  slug: "2023/2023-01-02-dream";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-01-02-rogue.md": {
	id: "2023/2023-01-02-rogue.md";
  slug: "2023/2023-01-02-rogue";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-01-02-sausage-burger.md": {
	id: "2023/2023-01-02-sausage-burger.md";
  slug: "2023/2023-01-02-sausage-burger";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-01-03-ya-malaysia.md": {
	id: "2023/2023-01-03-ya-malaysia.md";
  slug: "2023/2023-01-03-ya-malaysia";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-01-06-karen-birthday.md": {
	id: "2023/2023-01-06-karen-birthday.md";
  slug: "2023/2023-01-06-karen-birthday";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-01-07-guildford.md": {
	id: "2023/2023-01-07-guildford.md";
  slug: "2023/2023-01-07-guildford";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-01-08-cabramatta.md": {
	id: "2023/2023-01-08-cabramatta.md";
  slug: "2023/2023-01-08-cabramatta";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-01-08-size-xl.md": {
	id: "2023/2023-01-08-size-xl.md";
  slug: "2023/2023-01-08-size-xl";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-01-09-char-kuay-teow.md": {
	id: "2023/2023-01-09-char-kuay-teow.md";
  slug: "2023/2023-01-09-char-kuay-teow";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-01-10-taro-soy-latte.md": {
	id: "2023/2023-01-10-taro-soy-latte.md";
  slug: "2023/2023-01-10-taro-soy-latte";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-01-11-cat-town.md": {
	id: "2023/2023-01-11-cat-town.md";
  slug: "2023/2023-01-11-cat-town";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-01-11-dream.md": {
	id: "2023/2023-01-11-dream.md";
  slug: "2023/2023-01-11-dream";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-01-13-sydney-walk.md": {
	id: "2023/2023-01-13-sydney-walk.md";
  slug: "2023/2023-01-13-sydney-walk";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-01-14-la-boheme.md": {
	id: "2023/2023-01-14-la-boheme.md";
  slug: "2023/2023-01-14-la-boheme";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-01-14-rose-bay.md": {
	id: "2023/2023-01-14-rose-bay.md";
  slug: "2023/2023-01-14-rose-bay";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-01-15-dream.md": {
	id: "2023/2023-01-15-dream.md";
  slug: "2023/2023-01-15-dream";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-01-16-gotong-royong.md": {
	id: "2023/2023-01-16-gotong-royong.md";
  slug: "2023/2023-01-16-gotong-royong";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-01-17-flower-outfit.md": {
	id: "2023/2023-01-17-flower-outfit.md";
  slug: "2023/2023-01-17-flower-outfit";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-01-17-luho.md": {
	id: "2023/2023-01-17-luho.md";
  slug: "2023/2023-01-17-luho";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-01-19-comeco.md": {
	id: "2023/2023-01-19-comeco.md";
  slug: "2023/2023-01-19-comeco";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-01-19-newtown.md": {
	id: "2023/2023-01-19-newtown.md";
  slug: "2023/2023-01-19-newtown";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-01-20-ckt-fried-rice.md": {
	id: "2023/2023-01-20-ckt-fried-rice.md";
  slug: "2023/2023-01-20-ckt-fried-rice";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-01-20-cleaning-lps.md": {
	id: "2023/2023-01-20-cleaning-lps.md";
  slug: "2023/2023-01-20-cleaning-lps";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-01-20-la-boheme.md": {
	id: "2023/2023-01-20-la-boheme.md";
  slug: "2023/2023-01-20-la-boheme";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-01-20-mt-ventoux.md": {
	id: "2023/2023-01-20-mt-ventoux.md";
  slug: "2023/2023-01-20-mt-ventoux";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-01-21-lion-kiss.md": {
	id: "2023/2023-01-21-lion-kiss.md";
  slug: "2023/2023-01-21-lion-kiss";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-01-21-lny-eve-dinner.md": {
	id: "2023/2023-01-21-lny-eve-dinner.md";
  slug: "2023/2023-01-21-lny-eve-dinner";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-01-21-lunar-new-year-eve.md": {
	id: "2023/2023-01-21-lunar-new-year-eve.md";
  slug: "2023/2023-01-21-lunar-new-year-eve";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-01-21-summer.md": {
	id: "2023/2023-01-21-summer.md";
  slug: "2023/2023-01-21-summer";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-01-22-cny-dinner.md": {
	id: "2023/2023-01-22-cny-dinner.md";
  slug: "2023/2023-01-22-cny-dinner";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-01-23-bakkwa-burger.md": {
	id: "2023/2023-01-23-bakkwa-burger.md";
  slug: "2023/2023-01-23-bakkwa-burger";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-01-24-cny-lunch.md": {
	id: "2023/2023-01-24-cny-lunch.md";
  slug: "2023/2023-01-24-cny-lunch";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-01-24-dream.md": {
	id: "2023/2023-01-24-dream.md";
  slug: "2023/2023-01-24-dream";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-01-25-mozarella-burger.md": {
	id: "2023/2023-01-25-mozarella-burger.md";
  slug: "2023/2023-01-25-mozarella-burger";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-01-25-xopp.md": {
	id: "2023/2023-01-25-xopp.md";
  slug: "2023/2023-01-25-xopp";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-01-26-australia-day.md": {
	id: "2023/2023-01-26-australia-day.md";
  slug: "2023/2023-01-26-australia-day";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-01-27-cape-formentor.md": {
	id: "2023/2023-01-27-cape-formentor.md";
  slug: "2023/2023-01-27-cape-formentor";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-01-28-china-doll.md": {
	id: "2023/2023-01-28-china-doll.md";
  slug: "2023/2023-01-28-china-doll";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-01-28-wallis.md": {
	id: "2023/2023-01-28-wallis.md";
  slug: "2023/2023-01-28-wallis";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-01-29-zeal-north.md": {
	id: "2023/2023-01-29-zeal-north.md";
  slug: "2023/2023-01-29-zeal-north";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-01-30-home-network.md": {
	id: "2023/2023-01-30-home-network.md";
  slug: "2023/2023-01-30-home-network";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-01-31-three-cheongsams.md": {
	id: "2023/2023-01-31-three-cheongsams.md";
  slug: "2023/2023-01-31-three-cheongsams";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-02-01-eastwood.md": {
	id: "2023/2023-02-01-eastwood.md";
  slug: "2023/2023-02-01-eastwood";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-02-01-target.md": {
	id: "2023/2023-02-01-target.md";
  slug: "2023/2023-02-01-target";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-02-04-mopoke.md": {
	id: "2023/2023-02-04-mopoke.md";
  slug: "2023/2023-02-04-mopoke";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-02-04-nanyang.md": {
	id: "2023/2023-02-04-nanyang.md";
  slug: "2023/2023-02-04-nanyang";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-02-05-temasek-cny.md": {
	id: "2023/2023-02-05-temasek-cny.md";
  slug: "2023/2023-02-05-temasek-cny";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-02-05-two-cheongsams.md": {
	id: "2023/2023-02-05-two-cheongsams.md";
  slug: "2023/2023-02-05-two-cheongsams";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-02-06-kueh bangkit.md": {
	id: "2023/2023-02-06-kueh bangkit.md";
  slug: "2023/2023-02-06-kueh-bangkit";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-02-06-summer-outfit.md": {
	id: "2023/2023-02-06-summer-outfit.md";
  slug: "2023/2023-02-06-summer-outfit";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-02-07-masak-masak.md": {
	id: "2023/2023-02-07-masak-masak.md";
  slug: "2023/2023-02-07-masak-masak";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-02-07-nails.md": {
	id: "2023/2023-02-07-nails.md";
  slug: "2023/2023-02-07-nails";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-02-07-school-outfit.md": {
	id: "2023/2023-02-07-school-outfit.md";
  slug: "2023/2023-02-07-school-outfit";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-02-10-charlie-chan.md": {
	id: "2023/2023-02-10-charlie-chan.md";
  slug: "2023/2023-02-10-charlie-chan";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-02-10-marcs.md": {
	id: "2023/2023-02-10-marcs.md";
  slug: "2023/2023-02-10-marcs";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-02-12-language-models.md": {
	id: "2023/2023-02-12-language-models.md";
  slug: "2023/2023-02-12-language-models";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-02-13-burwood-yumcha.md": {
	id: "2023/2023-02-13-burwood-yumcha.md";
  slug: "2023/2023-02-13-burwood-yumcha";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-02-13-plaid.md": {
	id: "2023/2023-02-13-plaid.md";
  slug: "2023/2023-02-13-plaid";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-02-14-margaret-birthday.md": {
	id: "2023/2023-02-14-margaret-birthday.md";
  slug: "2023/2023-02-14-margaret-birthday";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-02-15-gumshara.md": {
	id: "2023/2023-02-15-gumshara.md";
  slug: "2023/2023-02-15-gumshara";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-02-15-katherine.md": {
	id: "2023/2023-02-15-katherine.md";
  slug: "2023/2023-02-15-katherine";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-02-16-peach-polka-dot.md": {
	id: "2023/2023-02-16-peach-polka-dot.md";
  slug: "2023/2023-02-16-peach-polka-dot";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-02-17-axi.md": {
	id: "2023/2023-02-17-axi.md";
  slug: "2023/2023-02-17-axi";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-02-17-cindy-birthday.md": {
	id: "2023/2023-02-17-cindy-birthday.md";
  slug: "2023/2023-02-17-cindy-birthday";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-02-17-sarong.md": {
	id: "2023/2023-02-17-sarong.md";
  slug: "2023/2023-02-17-sarong";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-02-18-chatgpt.md": {
	id: "2023/2023-02-18-chatgpt.md";
  slug: "2023/2023-02-18-chatgpt";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-02-18-heroes-of-hollywood.md": {
	id: "2023/2023-02-18-heroes-of-hollywood.md";
  slug: "2023/2023-02-18-heroes-of-hollywood";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-02-18-mink-pink.md": {
	id: "2023/2023-02-18-mink-pink.md";
  slug: "2023/2023-02-18-mink-pink";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-02-19-ho-jiak-strathfield.md": {
	id: "2023/2023-02-19-ho-jiak-strathfield.md";
  slug: "2023/2023-02-19-ho-jiak-strathfield";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-02-19-yours-truly.md": {
	id: "2023/2023-02-19-yours-truly.md";
  slug: "2023/2023-02-19-yours-truly";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-02-20-world-pride.md": {
	id: "2023/2023-02-20-world-pride.md";
  slug: "2023/2023-02-20-world-pride";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-02-21-emperors-garden.md": {
	id: "2023/2023-02-21-emperors-garden.md";
  slug: "2023/2023-02-21-emperors-garden";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-02-22-masak-masak.md": {
	id: "2023/2023-02-22-masak-masak.md";
  slug: "2023/2023-02-22-masak-masak";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-02-23-carriageworks.md": {
	id: "2023/2023-02-23-carriageworks.md";
  slug: "2023/2023-02-23-carriageworks";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-02-23-yee-sang.md": {
	id: "2023/2023-02-23-yee-sang.md";
  slug: "2023/2023-02-23-yee-sang";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-02-24-braving-time.md": {
	id: "2023/2023-02-24-braving-time.md";
  slug: "2023/2023-02-24-braving-time";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-02-24-dyke-bar.md": {
	id: "2023/2023-02-24-dyke-bar.md";
  slug: "2023/2023-02-24-dyke-bar";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-02-24-mr-fat-duck.md": {
	id: "2023/2023-02-24-mr-fat-duck.md";
  slug: "2023/2023-02-24-mr-fat-duck";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-02-24-oxford-st.md": {
	id: "2023/2023-02-24-oxford-st.md";
  slug: "2023/2023-02-24-oxford-st";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-02-24-qtopia.md": {
	id: "2023/2023-02-24-qtopia.md";
  slug: "2023/2023-02-24-qtopia";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-02-24-westfield.md": {
	id: "2023/2023-02-24-westfield.md";
  slug: "2023/2023-02-24-westfield";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-02-25-kl-flavors.md": {
	id: "2023/2023-02-25-kl-flavors.md";
  slug: "2023/2023-02-25-kl-flavors";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-02-25-transparent.md": {
	id: "2023/2023-02-25-transparent.md";
  slug: "2023/2023-02-25-transparent";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-02-26-february-babies.md": {
	id: "2023/2023-02-26-february-babies.md";
  slug: "2023/2023-02-26-february-babies";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-02-26-ghanda-shift.md": {
	id: "2023/2023-02-26-ghanda-shift.md";
  slug: "2023/2023-02-26-ghanda-shift";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-02-27-durango.md": {
	id: "2023/2023-02-27-durango.md";
  slug: "2023/2023-02-27-durango";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-02-27-vegan-poke-bowl.md": {
	id: "2023/2023-02-27-vegan-poke-bowl.md";
  slug: "2023/2023-02-27-vegan-poke-bowl";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-02-28-flower-blouse.md": {
	id: "2023/2023-02-28-flower-blouse.md";
  slug: "2023/2023-02-28-flower-blouse";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-03-02-dream.md": {
	id: "2023/2023-03-02-dream.md";
  slug: "2023/2023-03-02-dream";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-03-02-kreta-ayer.md": {
	id: "2023/2023-03-02-kreta-ayer.md";
  slug: "2023/2023-03-02-kreta-ayer";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-03-02-vietnamese-poke-bowl.md": {
	id: "2023/2023-03-02-vietnamese-poke-bowl.md";
  slug: "2023/2023-03-02-vietnamese-poke-bowl";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-03-03-art-gallery.md": {
	id: "2023/2023-03-03-art-gallery.md";
  slug: "2023/2023-03-03-art-gallery";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-03-03-jatz-anchovy.md": {
	id: "2023/2023-03-03-jatz-anchovy.md";
  slug: "2023/2023-03-03-jatz-anchovy";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-03-03-mca.md": {
	id: "2023/2023-03-03-mca.md";
  slug: "2023/2023-03-03-mca";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-03-03-salesforce.md": {
	id: "2023/2023-03-03-salesforce.md";
  slug: "2023/2023-03-03-salesforce";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-03-03-ses-zara.md": {
	id: "2023/2023-03-03-ses-zara.md";
  slug: "2023/2023-03-03-ses-zara";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-03-03-spirit-house.md": {
	id: "2023/2023-03-03-spirit-house.md";
  slug: "2023/2023-03-03-spirit-house";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-03-04-oxford-st-party.md": {
	id: "2023/2023-03-04-oxford-st-party.md";
  slug: "2023/2023-03-04-oxford-st-party";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-03-04-queens-cross-hotel.md": {
	id: "2023/2023-03-04-queens-cross-hotel.md";
  slug: "2023/2023-03-04-queens-cross-hotel";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-03-04-ses-zara.md": {
	id: "2023/2023-03-04-ses-zara.md";
  slug: "2023/2023-03-04-ses-zara";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-03-04-temasek-walk.md": {
	id: "2023/2023-03-04-temasek-walk.md";
  slug: "2023/2023-03-04-temasek-walk";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-03-05-hons-reunion.md": {
	id: "2023/2023-03-05-hons-reunion.md";
  slug: "2023/2023-03-05-hons-reunion";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-03-05-ride-with-pride.md": {
	id: "2023/2023-03-05-ride-with-pride.md";
  slug: "2023/2023-03-05-ride-with-pride";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-03-06-bankstown.md": {
	id: "2023/2023-03-06-bankstown.md";
  slug: "2023/2023-03-06-bankstown";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-03-06-pleated-skirt.md": {
	id: "2023/2023-03-06-pleated-skirt.md";
  slug: "2023/2023-03-06-pleated-skirt";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-03-06-preloved.md": {
	id: "2023/2023-03-06-preloved.md";
  slug: "2023/2023-03-06-preloved";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-03-08-holi-virgin.md": {
	id: "2023/2023-03-08-holi-virgin.md";
  slug: "2023/2023-03-08-holi-virgin";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-03-08-holi.md": {
	id: "2023/2023-03-08-holi.md";
  slug: "2023/2023-03-08-holi";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-03-10-swirly-shift.md": {
	id: "2023/2023-03-10-swirly-shift.md";
  slug: "2023/2023-03-10-swirly-shift";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-03-10-trivia.md": {
	id: "2023/2023-03-10-trivia.md";
  slug: "2023/2023-03-10-trivia";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-03-11-etf-performance.md": {
	id: "2023/2023-03-11-etf-performance.md";
  slug: "2023/2023-03-11-etf-performance";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-03-12-chequered.md": {
	id: "2023/2023-03-12-chequered.md";
  slug: "2023/2023-03-12-chequered";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-03-12-sivb.md": {
	id: "2023/2023-03-12-sivb.md";
  slug: "2023/2023-03-12-sivb";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-03-12-sydney.md": {
	id: "2023/2023-03-12-sydney.md";
  slug: "2023/2023-03-12-sydney";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-03-12-yum-cha.md": {
	id: "2023/2023-03-12-yum-cha.md";
  slug: "2023/2023-03-12-yum-cha";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-03-13-bond-etf.md": {
	id: "2023/2023-03-13-bond-etf.md";
  slug: "2023/2023-03-13-bond-etf";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-03-13-cat-cooking.md": {
	id: "2023/2023-03-13-cat-cooking.md";
  slug: "2023/2023-03-13-cat-cooking";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-03-14-cred.md": {
	id: "2023/2023-03-14-cred.md";
  slug: "2023/2023-03-14-cred";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-03-14-flgourmet.md": {
	id: "2023/2023-03-14-flgourmet.md";
  slug: "2023/2023-03-14-flgourmet";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-03-14-pink-trail.md": {
	id: "2023/2023-03-14-pink-trail.md";
  slug: "2023/2023-03-14-pink-trail";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-03-15-masak-masak.md": {
	id: "2023/2023-03-15-masak-masak.md";
  slug: "2023/2023-03-15-masak-masak";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-03-16-ho-jiak.md": {
	id: "2023/2023-03-16-ho-jiak.md";
  slug: "2023/2023-03-16-ho-jiak";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-03-16-katherine.md": {
	id: "2023/2023-03-16-katherine.md";
  slug: "2023/2023-03-16-katherine";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-03-16-mlc-reunion.md": {
	id: "2023/2023-03-16-mlc-reunion.md";
  slug: "2023/2023-03-16-mlc-reunion";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-03-18-stanley-st.md": {
	id: "2023/2023-03-18-stanley-st.md";
  slug: "2023/2023-03-18-stanley-st";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-03-18-summer-dress.md": {
	id: "2023/2023-03-18-summer-dress.md";
  slug: "2023/2023-03-18-summer-dress";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-03-19-vegan-poke-bowl.md": {
	id: "2023/2023-03-19-vegan-poke-bowl.md";
  slug: "2023/2023-03-19-vegan-poke-bowl";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-03-19-zeal-aborted.md": {
	id: "2023/2023-03-19-zeal-aborted.md";
  slug: "2023/2023-03-19-zeal-aborted";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-03-20-eight-yumcha.md": {
	id: "2023/2023-03-20-eight-yumcha.md";
  slug: "2023/2023-03-20-eight-yumcha";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-03-22-gossip-gal.md": {
	id: "2023/2023-03-22-gossip-gal.md";
  slug: "2023/2023-03-22-gossip-gal";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-03-22-porkfat.md": {
	id: "2023/2023-03-22-porkfat.md";
  slug: "2023/2023-03-22-porkfat";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-03-22-serenity.md": {
	id: "2023/2023-03-22-serenity.md";
  slug: "2023/2023-03-22-serenity";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-03-23-nanyang.md": {
	id: "2023/2023-03-23-nanyang.md";
  slug: "2023/2023-03-23-nanyang";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-03-24-izakaya-nakano.md": {
	id: "2023/2023-03-24-izakaya-nakano.md";
  slug: "2023/2023-03-24-izakaya-nakano";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-03-25-amah.md": {
	id: "2023/2023-03-25-amah.md";
  slug: "2023/2023-03-25-amah";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-03-26-zeal.md": {
	id: "2023/2023-03-26-zeal.md";
  slug: "2023/2023-03-26-zeal";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-04-02-tasmania-trip.md": {
	id: "2023/2023-04-02-tasmania-trip.md";
  slug: "2023/2023-04-02-tasmania-trip";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-04-04-aws-summit.md": {
	id: "2023/2023-04-04-aws-summit.md";
  slug: "2023/2023-04-04-aws-summit";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-04-05-pork-lard.md": {
	id: "2023/2023-04-05-pork-lard.md";
  slug: "2023/2023-04-05-pork-lard";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-04-06-mama-mulan.md": {
	id: "2023/2023-04-06-mama-mulan.md";
  slug: "2023/2023-04-06-mama-mulan";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-04-06-modern-cheongsam.md": {
	id: "2023/2023-04-06-modern-cheongsam.md";
  slug: "2023/2023-04-06-modern-cheongsam";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-04-10-kl-hokkien-mee.md": {
	id: "2023/2023-04-10-kl-hokkien-mee.md";
  slug: "2023/2023-04-10-kl-hokkien-mee";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-04-11-nanyang.md": {
	id: "2023/2023-04-11-nanyang.md";
  slug: "2023/2023-04-11-nanyang";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-04-12-black.md": {
	id: "2023/2023-04-12-black.md";
  slug: "2023/2023-04-12-black";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-04-13-dolar.md": {
	id: "2023/2023-04-13-dolar.md";
  slug: "2023/2023-04-13-dolar";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-04-14-air.md": {
	id: "2023/2023-04-14-air.md";
  slug: "2023/2023-04-14-air";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-04-15-lane-covelo-zoo.md": {
	id: "2023/2023-04-15-lane-covelo-zoo.md";
  slug: "2023/2023-04-15-lane-covelo-zoo";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-04-16-lamy.md": {
	id: "2023/2023-04-16-lamy.md";
  slug: "2023/2023-04-16-lamy";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-04-17-baby-g.md": {
	id: "2023/2023-04-17-baby-g.md";
  slug: "2023/2023-04-17-baby-g";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-04-18-wowo.md": {
	id: "2023/2023-04-18-wowo.md";
  slug: "2023/2023-04-18-wowo";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-04-22-temasek-walk.md": {
	id: "2023/2023-04-22-temasek-walk.md";
  slug: "2023/2023-04-22-temasek-walk";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-04-24-thornleigh-to-eastwood-walk.md": {
	id: "2023/2023-04-24-thornleigh-to-eastwood-walk.md";
  slug: "2023/2023-04-24-thornleigh-to-eastwood-walk";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-04-25-hong-kong-recipe.md": {
	id: "2023/2023-04-25-hong-kong-recipe.md";
  slug: "2023/2023-04-25-hong-kong-recipe";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-04-25-nurragingy.md": {
	id: "2023/2023-04-25-nurragingy.md";
  slug: "2023/2023-04-25-nurragingy";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-04-25-tokito.md": {
	id: "2023/2023-04-25-tokito.md";
  slug: "2023/2023-04-25-tokito";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-04-26-ee-vonne-birthday.md": {
	id: "2023/2023-04-26-ee-vonne-birthday.md";
  slug: "2023/2023-04-26-ee-vonne-birthday";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-04-27-black-dress.md": {
	id: "2023/2023-04-27-black-dress.md";
  slug: "2023/2023-04-27-black-dress";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-04-28-wai-kitchen.md": {
	id: "2023/2023-04-28-wai-kitchen.md";
  slug: "2023/2023-04-28-wai-kitchen";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-04-29-hot-dog.md": {
	id: "2023/2023-04-29-hot-dog.md";
  slug: "2023/2023-04-29-hot-dog";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-05-01-leaf-cafe.md": {
	id: "2023/2023-05-01-leaf-cafe.md";
  slug: "2023/2023-05-01-leaf-cafe";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-05-02-bobbin-head.md": {
	id: "2023/2023-05-02-bobbin-head.md";
  slug: "2023/2023-05-02-bobbin-head";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-05-02-enjoy-mie.md": {
	id: "2023/2023-05-02-enjoy-mie.md";
  slug: "2023/2023-05-02-enjoy-mie";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-05-03-omela.md": {
	id: "2023/2023-05-03-omela.md";
  slug: "2023/2023-05-03-omela";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-05-04-upperroom.md": {
	id: "2023/2023-05-04-upperroom.md";
  slug: "2023/2023-05-04-upperroom";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-05-05-mt-tomah.md": {
	id: "2023/2023-05-05-mt-tomah.md";
  slug: "2023/2023-05-05-mt-tomah";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-05-06-annie.md": {
	id: "2023/2023-05-06-annie.md";
  slug: "2023/2023-05-06-annie";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
"2023/2023-05-07-rita-birthday.md": {
	id: "2023/2023-05-07-rita-birthday.md";
  slug: "2023/2023-05-07-rita-birthday";
  body: string;
  collection: "blog";
  data: InferEntrySchema<"blog">
} & { render(): Render[".md"] };
};
"category": {
"art.md": {
	id: "art.md";
  slug: "art";
  body: string;
  collection: "category";
  data: InferEntrySchema<"category">
} & { render(): Render[".md"] };
"create.md": {
	id: "create.md";
  slug: "create";
  body: string;
  collection: "category";
  data: InferEntrySchema<"category">
} & { render(): Render[".md"] };
"cycling.md": {
	id: "cycling.md";
  slug: "cycling";
  body: string;
  collection: "category";
  data: InferEntrySchema<"category">
} & { render(): Render[".md"] };
"design.md": {
	id: "design.md";
  slug: "design";
  body: string;
  collection: "category";
  data: InferEntrySchema<"category">
} & { render(): Render[".md"] };
"dream.md": {
	id: "dream.md";
  slug: "dream";
  body: string;
  collection: "category";
  data: InferEntrySchema<"category">
} & { render(): Render[".md"] };
"event.md": {
	id: "event.md";
  slug: "event";
  body: string;
  collection: "category";
  data: InferEntrySchema<"category">
} & { render(): Render[".md"] };
"fashion.md": {
	id: "fashion.md";
  slug: "fashion";
  body: string;
  collection: "category";
  data: InferEntrySchema<"category">
} & { render(): Render[".md"] };
"food.md": {
	id: "food.md";
  slug: "food";
  body: string;
  collection: "category";
  data: InferEntrySchema<"category">
} & { render(): Render[".md"] };
"garden.md": {
	id: "garden.md";
  slug: "garden";
  body: string;
  collection: "category";
  data: InferEntrySchema<"category">
} & { render(): Render[".md"] };
"music.md": {
	id: "music.md";
  slug: "music";
  body: string;
  collection: "category";
  data: InferEntrySchema<"category">
} & { render(): Render[".md"] };
"photography.md": {
	id: "photography.md";
  slug: "photography";
  body: string;
  collection: "category";
  data: InferEntrySchema<"category">
} & { render(): Render[".md"] };
"software.md": {
	id: "software.md";
  slug: "software";
  body: string;
  collection: "category";
  data: InferEntrySchema<"category">
} & { render(): Render[".md"] };
"travel.md": {
	id: "travel.md";
  slug: "travel";
  body: string;
  collection: "category";
  data: InferEntrySchema<"category">
} & { render(): Render[".md"] };
"website.md": {
	id: "website.md";
  slug: "website";
  body: string;
  collection: "category";
  data: InferEntrySchema<"category">
} & { render(): Render[".md"] };
};
"page": {
"privacy.md": {
	id: "privacy.md";
  slug: "privacy";
  body: string;
  collection: "page";
  data: InferEntrySchema<"page">
} & { render(): Render[".md"] };
};
"website": {
"buddhavacana.md": {
	id: "buddhavacana.md";
  slug: "buddhavacana";
  body: string;
  collection: "website";
  data: InferEntrySchema<"website">
} & { render(): Render[".md"] };
"chakra.md": {
	id: "chakra.md";
  slug: "chakra";
  body: string;
  collection: "website";
  data: InferEntrySchema<"website">
} & { render(): Render[".md"] };
"christham-hugo.md": {
	id: "christham-hugo.md";
  slug: "christham-hugo";
  body: string;
  collection: "website";
  data: InferEntrySchema<"website">
} & { render(): Render[".md"] };
"hello-astro.md": {
	id: "hello-astro.md";
  slug: "hello-astro";
  body: string;
  collection: "website";
  data: InferEntrySchema<"website">
} & { render(): Render[".md"] };
"hello-gatsby.md": {
	id: "hello-gatsby.md";
  slug: "hello-gatsby";
  body: string;
  collection: "website";
  data: InferEntrySchema<"website">
} & { render(): Render[".md"] };
"hello-jekyll.md": {
	id: "hello-jekyll.md";
  slug: "hello-jekyll";
  body: string;
  collection: "website";
  data: InferEntrySchema<"website">
} & { render(): Render[".md"] };
"hellotham.md": {
	id: "hellotham.md";
  slug: "hellotham";
  body: string;
  collection: "website";
  data: InferEntrySchema<"website">
} & { render(): Render[".md"] };
"hons87.md": {
	id: "hons87.md";
  slug: "hons87";
  body: string;
  collection: "website";
  data: InferEntrySchema<"website">
} & { render(): Render[".md"] };
"learningjamstack.md": {
	id: "learningjamstack.md";
  slug: "learningjamstack";
  body: string;
  collection: "website";
  data: InferEntrySchema<"website">
} & { render(): Render[".md"] };
"portfolio.md": {
	id: "portfolio.md";
  slug: "portfolio";
  body: string;
  collection: "website";
  data: InferEntrySchema<"website">
} & { render(): Render[".md"] };
"prismatic.md": {
	id: "prismatic.md";
  slug: "prismatic";
  body: string;
  collection: "website";
  data: InferEntrySchema<"website">
} & { render(): Render[".md"] };
"record.md": {
	id: "record.md";
  slug: "record";
  body: string;
  collection: "website";
  data: InferEntrySchema<"website">
} & { render(): Render[".md"] };
"rosebay.md": {
	id: "rosebay.md";
  slug: "rosebay";
  body: string;
  collection: "website";
  data: InferEntrySchema<"website">
} & { render(): Render[".md"] };
"rosely.md": {
	id: "rosely.md";
  slug: "rosely";
  body: string;
  collection: "website";
  data: InferEntrySchema<"website">
} & { render(): Render[".md"] };
"travel.md": {
	id: "travel.md";
  slug: "travel";
  body: string;
  collection: "website";
  data: InferEntrySchema<"website">
} & { render(): Render[".md"] };
"visualvoyager.md": {
	id: "visualvoyager.md";
  slug: "visualvoyager";
  body: string;
  collection: "website";
  data: InferEntrySchema<"website">
} & { render(): Render[".md"] };
};

	};

	type DataEntryMap = {
		"social": {
"email": {
	id: "email";
  collection: "social";
  data: any
};
"facebook": {
	id: "facebook";
  collection: "social";
  data: any
};
"github": {
	id: "github";
  collection: "social";
  data: any
};
"instagram": {
	id: "instagram";
  collection: "social";
  data: any
};
"linkedin": {
	id: "linkedin";
  collection: "social";
  data: any
};
"twitter": {
	id: "twitter";
  collection: "social";
  data: any
};
};

	};

	type AnyEntryMap = ContentEntryMap & DataEntryMap;

	type ContentConfig = typeof import("../src/content/config");
}
