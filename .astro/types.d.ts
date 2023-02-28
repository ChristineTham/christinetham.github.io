declare module 'astro:content' {
	export { z } from 'astro/zod';
	export type CollectionEntry<C extends keyof typeof entryMap> =
		(typeof entryMap)[C][keyof (typeof entryMap)[C]] & Render;

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

	type BaseCollectionConfig<S extends BaseSchema> = {
		schema?: S;
		slug?: (entry: {
			id: CollectionEntry<keyof typeof entryMap>['id'];
			defaultSlug: string;
			collection: string;
			body: string;
			data: import('astro/zod').infer<S>;
		}) => string | Promise<string>;
	};
	export function defineCollection<S extends BaseSchema>(
		input: BaseCollectionConfig<S>
	): BaseCollectionConfig<S>;

	type EntryMapKeys = keyof typeof entryMap;
	type AllValuesOf<T> = T extends any ? T[keyof T] : never;
	type ValidEntrySlug<C extends EntryMapKeys> = AllValuesOf<(typeof entryMap)[C]>['slug'];

	export function getEntryBySlug<
		C extends keyof typeof entryMap,
		E extends ValidEntrySlug<C> | (string & {})
	>(
		collection: C,
		// Note that this has to accept a regular string too, for SSR
		entrySlug: E
	): E extends ValidEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getCollection<C extends keyof typeof entryMap, E extends CollectionEntry<C>>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => entry is E
	): Promise<E[]>;
	export function getCollection<C extends keyof typeof entryMap>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => unknown
	): Promise<CollectionEntry<C>[]>;

	type InferEntrySchema<C extends keyof typeof entryMap> = import('astro/zod').infer<
		Required<ContentConfig['collections'][C]>['schema']
	>;

	type Render = {
		render(): Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
		}>;
	};

	const entryMap: {
		"bio": {
"childhood.md": {
  id: "childhood.md",
  slug: "childhood",
  body: string,
  collection: "bio",
  data: InferEntrySchema<"bio">
},
"current.md": {
  id: "current.md",
  slug: "current",
  body: string,
  collection: "bio",
  data: InferEntrySchema<"bio">
},
"death.md": {
  id: "death.md",
  slug: "death",
  body: string,
  collection: "bio",
  data: InferEntrySchema<"bio">
},
"evolution.md": {
  id: "evolution.md",
  slug: "evolution",
  body: string,
  collection: "bio",
  data: InferEntrySchema<"bio">
},
"family.md": {
  id: "family.md",
  slug: "family",
  body: string,
  collection: "bio",
  data: InferEntrySchema<"bio">
},
"introduction.md": {
  id: "introduction.md",
  slug: "introduction",
  body: string,
  collection: "bio",
  data: InferEntrySchema<"bio">
},
"my-father.md": {
  id: "my-father.md",
  slug: "my-father",
  body: string,
  collection: "bio",
  data: InferEntrySchema<"bio">
},
"my-grandmother.md": {
  id: "my-grandmother.md",
  slug: "my-grandmother",
  body: string,
  collection: "bio",
  data: InferEntrySchema<"bio">
},
"my-great-grandfather.mdx": {
  id: "my-great-grandfather.mdx",
  slug: "my-great-grandfather",
  body: string,
  collection: "bio",
  data: InferEntrySchema<"bio">
},
"my-mother.md": {
  id: "my-mother.md",
  slug: "my-mother",
  body: string,
  collection: "bio",
  data: InferEntrySchema<"bio">
},
"parents.md": {
  id: "parents.md",
  slug: "parents",
  body: string,
  collection: "bio",
  data: InferEntrySchema<"bio">
},
"retirement.md": {
  id: "retirement.md",
  slug: "retirement",
  body: string,
  collection: "bio",
  data: InferEntrySchema<"bio">
},
"technical.md": {
  id: "technical.md",
  slug: "technical",
  body: string,
  collection: "bio",
  data: InferEntrySchema<"bio">
},
"tham-history.md": {
  id: "tham-history.md",
  slug: "tham-history",
  body: string,
  collection: "bio",
  data: InferEntrySchema<"bio">
},
"tham-surname.mdx": {
  id: "tham-surname.mdx",
  slug: "tham-surname",
  body: string,
  collection: "bio",
  data: InferEntrySchema<"bio">
},
"university.md": {
  id: "university.md",
  slug: "university",
  body: string,
  collection: "bio",
  data: InferEntrySchema<"bio">
},
"work.md": {
  id: "work.md",
  slug: "work",
  body: string,
  collection: "bio",
  data: InferEntrySchema<"bio">
},
},
"blog": {
"2000-01-01-template.md": {
  id: "2000-01-01-template.md",
  slug: "2000-01-01-template",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2001/2001-12-01-polyglot.md": {
  id: "2001/2001-12-01-polyglot.md",
  slug: "2001/2001-12-01-polyglot",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2009/2009-10-04-artarmon-bike-path.md": {
  id: "2009/2009-10-04-artarmon-bike-path.md",
  slug: "2009/2009-10-04-artarmon-bike-path",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2009/2009-10-04-chatswood-cbd.md": {
  id: "2009/2009-10-04-chatswood-cbd.md",
  slug: "2009/2009-10-04-chatswood-cbd",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2009/2009-10-06-magpie-attacks-foiled-by-cable-ties.md": {
  id: "2009/2009-10-06-magpie-attacks-foiled-by-cable-ties.md",
  slug: "2009/2009-10-06-magpie-attacks-foiled-by-cable-ties",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2010/2010-04-20-andante-in-e-minor-fernando-sor.md": {
  id: "2010/2010-04-20-andante-in-e-minor-fernando-sor.md",
  slug: "2010/2010-04-20-andante-in-e-minor-fernando-sor",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2010/2010-07-20-andantino-op-44-no-3-fernando-sor.md": {
  id: "2010/2010-07-20-andantino-op-44-no-3-fernando-sor.md",
  slug: "2010/2010-07-20-andantino-op-44-no-3-fernando-sor",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2012/2012-05-01-joe-hisaishi-the-name-of-life-instrumental-version.md": {
  id: "2012/2012-05-01-joe-hisaishi-the-name-of-life-instrumental-version.md",
  slug: "2012/2012-05-01-joe-hisaishi-the-name-of-life-instrumental-version",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2012/2012-05-02-bach-two-part-invention-no-1.md": {
  id: "2012/2012-05-02-bach-two-part-invention-no-1.md",
  slug: "2012/2012-05-02-bach-two-part-invention-no-1",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2013/2013-03-24-giant-test-ride.md": {
  id: "2013/2013-03-24-giant-test-ride.md",
  slug: "2013/2013-03-24-giant-test-ride",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2014/2014-02-13-beartrix.md": {
  id: "2014/2014-02-13-beartrix.md",
  slug: "2014/2014-02-13-beartrix",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2014/2014-02-14-bears-carribean.md": {
  id: "2014/2014-02-14-bears-carribean.md",
  slug: "2014/2014-02-14-bears-carribean",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2014/2014-02-15-bear-runner.md": {
  id: "2014/2014-02-15-bear-runner.md",
  slug: "2014/2014-02-15-bear-runner",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2014/2014-02-24-polar-cub.md": {
  id: "2014/2014-02-24-polar-cub.md",
  slug: "2014/2014-02-24-polar-cub",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2014/2014-02-28-babylon-5-opening-theme.md": {
  id: "2014/2014-02-28-babylon-5-opening-theme.md",
  slug: "2014/2014-02-28-babylon-5-opening-theme",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2014/2014-02-28-brandenburg-concerto-no-5-in-d-major-bwv-1050-i-allegro-solo-instruments.md": {
  id: "2014/2014-02-28-brandenburg-concerto-no-5-in-d-major-bwv-1050-i-allegro-solo-instruments.md",
  slug: "2014/2014-02-28-brandenburg-concerto-no-5-in-d-major-bwv-1050-i-allegro-solo-instruments",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2014/2014-03-05-puppies.md": {
  id: "2014/2014-03-05-puppies.md",
  slug: "2014/2014-03-05-puppies",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2014/2014-03-06-mei-and-totoro.md": {
  id: "2014/2014-03-06-mei-and-totoro.md",
  slug: "2014/2014-03-06-mei-and-totoro",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2014/2014-03-10-winter-music.md": {
  id: "2014/2014-03-10-winter-music.md",
  slug: "2014/2014-03-10-winter-music",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2014/2014-03-13-forever-friends.md": {
  id: "2014/2014-03-13-forever-friends.md",
  slug: "2014/2014-03-13-forever-friends",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2014/2014-03-16-ave-maria-vavilov.md": {
  id: "2014/2014-03-16-ave-maria-vavilov.md",
  slug: "2014/2014-03-16-ave-maria-vavilov",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2014/2014-03-24-ave-maria-vavilov-finale-gpo4.md": {
  id: "2014/2014-03-24-ave-maria-vavilov-finale-gpo4.md",
  slug: "2014/2014-03-24-ave-maria-vavilov-finale-gpo4",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2014/2014-03-24-ave-maria-vavilov-logic-pro-x-ewql.md": {
  id: "2014/2014-03-24-ave-maria-vavilov-logic-pro-x-ewql.md",
  slug: "2014/2014-03-24-ave-maria-vavilov-logic-pro-x-ewql",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2014/2014-04-21-memories-of-tomorrow.md": {
  id: "2014/2014-04-21-memories-of-tomorrow.md",
  slug: "2014/2014-04-21-memories-of-tomorrow",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2014/2014-04-25-500-miles-high.md": {
  id: "2014/2014-04-25-500-miles-high.md",
  slug: "2014/2014-04-25-500-miles-high",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2014/2014-05-30-olhos-de-gato-orchestral-arrangement.md": {
  id: "2014/2014-05-30-olhos-de-gato-orchestral-arrangement.md",
  slug: "2014/2014-05-30-olhos-de-gato-orchestral-arrangement",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2015/2015-07-30-commuting-to-work-29-july-2015.md": {
  id: "2015/2015-07-30-commuting-to-work-29-july-2015.md",
  slug: "2015/2015-07-30-commuting-to-work-29-july-2015",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2016/2016-04-10-mona-vale-rd-at-40-55-km-h.md": {
  id: "2016/2016-04-10-mona-vale-rd-at-40-55-km-h.md",
  slug: "2016/2016-04-10-mona-vale-rd-at-40-55-km-h",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2017/2017-10-27-a-twin-peaks-dream.md": {
  id: "2017/2017-10-27-a-twin-peaks-dream.md",
  slug: "2017/2017-10-27-a-twin-peaks-dream",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2018/2018-01-09-adagio-oboe-concerto-d-minor-alessandro-marcello.md": {
  id: "2018/2018-01-09-adagio-oboe-concerto-d-minor-alessandro-marcello.md",
  slug: "2018/2018-01-09-adagio-oboe-concerto-d-minor-alessandro-marcello",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2018/2018-01-10-winter-music-electronic-115bpm.md": {
  id: "2018/2018-01-10-winter-music-electronic-115bpm.md",
  slug: "2018/2018-01-10-winter-music-electronic-115bpm",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2018/2018-03-22-my-new-bike.md": {
  id: "2018/2018-03-22-my-new-bike.md",
  slug: "2018/2018-03-22-my-new-bike",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2018/2018-03-31-bach-adagio-concerto-3-d-minor.md": {
  id: "2018/2018-03-31-bach-adagio-concerto-3-d-minor.md",
  slug: "2018/2018-03-31-bach-adagio-concerto-3-d-minor",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2018/2018-04-01-bach-prelude-no-1-in-c-major-wtc1.md": {
  id: "2018/2018-04-01-bach-prelude-no-1-in-c-major-wtc1.md",
  slug: "2018/2018-04-01-bach-prelude-no-1-in-c-major-wtc1",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2020/2020-07-05-cinema-paradiso-string-orchestra.md": {
  id: "2020/2020-07-05-cinema-paradiso-string-orchestra.md",
  slug: "2020/2020-07-05-cinema-paradiso-string-orchestra",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2020/2020-09-05-dream.md": {
  id: "2020/2020-09-05-dream.md",
  slug: "2020/2020-09-05-dream",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2020/2020-10-01-kon-loh-mee-recipe.md": {
  id: "2020/2020-10-01-kon-loh-mee-recipe.md",
  slug: "2020/2020-10-01-kon-loh-mee-recipe",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2020/2020-10-02-mayfield-garden.md": {
  id: "2020/2020-10-02-mayfield-garden.md",
  slug: "2020/2020-10-02-mayfield-garden",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2020/2020-10-05-how-to-draw-almost-every-day.md": {
  id: "2020/2020-10-05-how-to-draw-almost-every-day.md",
  slug: "2020/2020-10-05-how-to-draw-almost-every-day",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-01-05-breakfast.md": {
  id: "2022/2022-01-05-breakfast.md",
  slug: "2022/2022-01-05-breakfast",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-01-05-lunch.md": {
  id: "2022/2022-01-05-lunch.md",
  slug: "2022/2022-01-05-lunch",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-01-06-breakfast.md": {
  id: "2022/2022-01-06-breakfast.md",
  slug: "2022/2022-01-06-breakfast",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-01-06-passo-dello-stelvio.md": {
  id: "2022/2022-01-06-passo-dello-stelvio.md",
  slug: "2022/2022-01-06-passo-dello-stelvio",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-01-11-dream.md": {
  id: "2022/2022-01-11-dream.md",
  slug: "2022/2022-01-11-dream",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-01-12-olmo-resurrected.md": {
  id: "2022/2022-01-12-olmo-resurrected.md",
  slug: "2022/2022-01-12-olmo-resurrected",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-01-31-hello-kitty-bliss.md": {
  id: "2022/2022-01-31-hello-kitty-bliss.md",
  slug: "2022/2022-01-31-hello-kitty-bliss",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-01-31-mapo-tofu-mushrooms.md": {
  id: "2022/2022-01-31-mapo-tofu-mushrooms.md",
  slug: "2022/2022-01-31-mapo-tofu-mushrooms",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-02-03-dream.md": {
  id: "2022/2022-02-03-dream.md",
  slug: "2022/2022-02-03-dream",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-02-22-columbia-rescued.md": {
  id: "2022/2022-02-22-columbia-rescued.md",
  slug: "2022/2022-02-22-columbia-rescued",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-03-06-breakfast.md": {
  id: "2022/2022-03-06-breakfast.md",
  slug: "2022/2022-03-06-breakfast",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-03-10-parramatta.md": {
  id: "2022/2022-03-10-parramatta.md",
  slug: "2022/2022-03-10-parramatta",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-03-12-char-siew.md": {
  id: "2022/2022-03-12-char-siew.md",
  slug: "2022/2022-03-12-char-siew",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-03-25-french-toast.md": {
  id: "2022/2022-03-25-french-toast.md",
  slug: "2022/2022-03-25-french-toast",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-03-25-gold-and-black.md": {
  id: "2022/2022-03-25-gold-and-black.md",
  slug: "2022/2022-03-25-gold-and-black",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-03-31-snow-apple.md": {
  id: "2022/2022-03-31-snow-apple.md",
  slug: "2022/2022-03-31-snow-apple",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-04-04-pork-luncheon-meat-fried-rice.md": {
  id: "2022/2022-04-04-pork-luncheon-meat-fried-rice.md",
  slug: "2022/2022-04-04-pork-luncheon-meat-fried-rice",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-04-04-pork-luncheon-meat-fritters.md": {
  id: "2022/2022-04-04-pork-luncheon-meat-fritters.md",
  slug: "2022/2022-04-04-pork-luncheon-meat-fritters",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-04-04-walk.md": {
  id: "2022/2022-04-04-walk.md",
  slug: "2022/2022-04-04-walk",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-04-06-chinese-sausage-fried-rice.md": {
  id: "2022/2022-04-06-chinese-sausage-fried-rice.md",
  slug: "2022/2022-04-06-chinese-sausage-fried-rice",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-04-07-fish-cake-vege-stir-fry.md": {
  id: "2022/2022-04-07-fish-cake-vege-stir-fry.md",
  slug: "2022/2022-04-07-fish-cake-vege-stir-fry",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-04-10-lego-friends.md": {
  id: "2022/2022-04-10-lego-friends.md",
  slug: "2022/2022-04-10-lego-friends",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-05-02-sydney.md": {
  id: "2022/2022-05-02-sydney.md",
  slug: "2022/2022-05-02-sydney",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-05-03-sharon-vanilla-slice.md": {
  id: "2022/2022-05-03-sharon-vanilla-slice.md",
  slug: "2022/2022-05-03-sharon-vanilla-slice",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-05-05-dream.md": {
  id: "2022/2022-05-05-dream.md",
  slug: "2022/2022-05-05-dream",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-05-05-guildford.md": {
  id: "2022/2022-05-05-guildford.md",
  slug: "2022/2022-05-05-guildford",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-05-05-mt-tomah.md": {
  id: "2022/2022-05-05-mt-tomah.md",
  slug: "2022/2022-05-05-mt-tomah",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-05-05-mt-wilson.md": {
  id: "2022/2022-05-05-mt-wilson.md",
  slug: "2022/2022-05-05-mt-wilson",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-05-05-nooroo.md": {
  id: "2022/2022-05-05-nooroo.md",
  slug: "2022/2022-05-05-nooroo",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-05-07-lcnp.md": {
  id: "2022/2022-05-07-lcnp.md",
  slug: "2022/2022-05-07-lcnp",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-05-08-mt-annan.md": {
  id: "2022/2022-05-08-mt-annan.md",
  slug: "2022/2022-05-08-mt-annan",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-05-09-liverpool.md": {
  id: "2022/2022-05-09-liverpool.md",
  slug: "2022/2022-05-09-liverpool",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-05-10-huong-xua.md": {
  id: "2022/2022-05-10-huong-xua.md",
  slug: "2022/2022-05-10-huong-xua",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-05-11-cat-birthday.md": {
  id: "2022/2022-05-11-cat-birthday.md",
  slug: "2022/2022-05-11-cat-birthday",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-05-11-ready-to-party.md": {
  id: "2022/2022-05-11-ready-to-party.md",
  slug: "2022/2022-05-11-ready-to-party",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-05-12-port-macquarie.md": {
  id: "2022/2022-05-12-port-macquarie.md",
  slug: "2022/2022-05-12-port-macquarie",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-05-13-court-house.md": {
  id: "2022/2022-05-13-court-house.md",
  slug: "2022/2022-05-13-court-house",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-05-13-flower-dress.md": {
  id: "2022/2022-05-13-flower-dress.md",
  slug: "2022/2022-05-13-flower-dress",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-05-13-kaftan.md": {
  id: "2022/2022-05-13-kaftan.md",
  slug: "2022/2022-05-13-kaftan",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-05-13-koala-hospital.md": {
  id: "2022/2022-05-13-koala-hospital.md",
  slug: "2022/2022-05-13-koala-hospital",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-05-13-museum.md": {
  id: "2022/2022-05-13-museum.md",
  slug: "2022/2022-05-13-museum",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-05-13-port-macquarie.md": {
  id: "2022/2022-05-13-port-macquarie.md",
  slug: "2022/2022-05-13-port-macquarie",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-05-13-roto-house.md": {
  id: "2022/2022-05-13-roto-house.md",
  slug: "2022/2022-05-13-roto-house",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-05-14-coastal-walk.md": {
  id: "2022/2022-05-14-coastal-walk.md",
  slug: "2022/2022-05-14-coastal-walk",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-05-15-cowarra-dam.md": {
  id: "2022/2022-05-15-cowarra-dam.md",
  slug: "2022/2022-05-15-cowarra-dam",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-05-15-lego-friends.md": {
  id: "2022/2022-05-15-lego-friends.md",
  slug: "2022/2022-05-15-lego-friends",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-05-15-old-bottlebutt.md": {
  id: "2022/2022-05-15-old-bottlebutt.md",
  slug: "2022/2022-05-15-old-bottlebutt",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-05-15-port-macquarie.md": {
  id: "2022/2022-05-15-port-macquarie.md",
  slug: "2022/2022-05-15-port-macquarie",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-05-16-gnomes.md": {
  id: "2022/2022-05-16-gnomes.md",
  slug: "2022/2022-05-16-gnomes",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-05-16-kaftan.md": {
  id: "2022/2022-05-16-kaftan.md",
  slug: "2022/2022-05-16-kaftan",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-05-16-rita-birthday.md": {
  id: "2022/2022-05-16-rita-birthday.md",
  slug: "2022/2022-05-16-rita-birthday",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-05-16-vesak-day.md": {
  id: "2022/2022-05-16-vesak-day.md",
  slug: "2022/2022-05-16-vesak-day",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-05-17-macquarie.md": {
  id: "2022/2022-05-17-macquarie.md",
  slug: "2022/2022-05-17-macquarie",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-05-18-hojiak-haymarket.md": {
  id: "2022/2022-05-18-hojiak-haymarket.md",
  slug: "2022/2022-05-18-hojiak-haymarket",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-05-19-nurragingy.md": {
  id: "2022/2022-05-19-nurragingy.md",
  slug: "2022/2022-05-19-nurragingy",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-05-20-princess.md": {
  id: "2022/2022-05-20-princess.md",
  slug: "2022/2022-05-20-princess",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-05-21-cindy-baby-shower.md": {
  id: "2022/2022-05-21-cindy-baby-shower.md",
  slug: "2022/2022-05-21-cindy-baby-shower",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-05-22-campsie.md": {
  id: "2022/2022-05-22-campsie.md",
  slug: "2022/2022-05-22-campsie",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-05-22-dream.md": {
  id: "2022/2022-05-22-dream.md",
  slug: "2022/2022-05-22-dream",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-05-23-dream.md": {
  id: "2022/2022-05-23-dream.md",
  slug: "2022/2022-05-23-dream",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-05-24-bak-chang.md": {
  id: "2022/2022-05-24-bak-chang.md",
  slug: "2022/2022-05-24-bak-chang",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-05-25-dream.md": {
  id: "2022/2022-05-25-dream.md",
  slug: "2022/2022-05-25-dream",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-05-25-hons-reunion.md": {
  id: "2022/2022-05-25-hons-reunion.md",
  slug: "2022/2022-05-25-hons-reunion",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-05-27-vivid.md": {
  id: "2022/2022-05-27-vivid.md",
  slug: "2022/2022-05-27-vivid",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-05-28-autumn.md": {
  id: "2022/2022-05-28-autumn.md",
  slug: "2022/2022-05-28-autumn",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-05-28-bos23.md": {
  id: "2022/2022-05-28-bos23.md",
  slug: "2022/2022-05-28-bos23",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-05-29-night-flight.md": {
  id: "2022/2022-05-29-night-flight.md",
  slug: "2022/2022-05-29-night-flight",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-05-29-zenith.md": {
  id: "2022/2022-05-29-zenith.md",
  slug: "2022/2022-05-29-zenith",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-05-31-dream.md": {
  id: "2022/2022-05-31-dream.md",
  slug: "2022/2022-05-31-dream",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-06-01-theatre-royal.md": {
  id: "2022/2022-06-01-theatre-royal.md",
  slug: "2022/2022-06-01-theatre-royal",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-06-02-parramatta-river.md": {
  id: "2022/2022-06-02-parramatta-river.md",
  slug: "2022/2022-06-02-parramatta-river",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-06-02-vivid.md": {
  id: "2022/2022-06-02-vivid.md",
  slug: "2022/2022-06-02-vivid",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-06-04-vivid.md": {
  id: "2022/2022-06-04-vivid.md",
  slug: "2022/2022-06-04-vivid",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-06-05-bollywood.md": {
  id: "2022/2022-06-05-bollywood.md",
  slug: "2022/2022-06-05-bollywood",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-06-05-vivid.md": {
  id: "2022/2022-06-05-vivid.md",
  slug: "2022/2022-06-05-vivid",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-06-06-vivid.md": {
  id: "2022/2022-06-06-vivid.md",
  slug: "2022/2022-06-06-vivid",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-06-08-eunice-birthday.md": {
  id: "2022/2022-06-08-eunice-birthday.md",
  slug: "2022/2022-06-08-eunice-birthday",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-06-09-vivid.md": {
  id: "2022/2022-06-09-vivid.md",
  slug: "2022/2022-06-09-vivid",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-06-11-burwood.md": {
  id: "2022/2022-06-11-burwood.md",
  slug: "2022/2022-06-11-burwood",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-06-12-bos23.md": {
  id: "2022/2022-06-12-bos23.md",
  slug: "2022/2022-06-12-bos23",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-06-14-canton-cafe.md": {
  id: "2022/2022-06-14-canton-cafe.md",
  slug: "2022/2022-06-14-canton-cafe",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-06-14-elemnt-roam.md": {
  id: "2022/2022-06-14-elemnt-roam.md",
  slug: "2022/2022-06-14-elemnt-roam",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-06-15-haymarket.md": {
  id: "2022/2022-06-15-haymarket.md",
  slug: "2022/2022-06-15-haymarket",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-06-16-dream.md": {
  id: "2022/2022-06-16-dream.md",
  slug: "2022/2022-06-16-dream",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-06-17-my-malaysian-kitchen.md": {
  id: "2022/2022-06-17-my-malaysian-kitchen.md",
  slug: "2022/2022-06-17-my-malaysian-kitchen",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-06-18-bomber-jacket.md": {
  id: "2022/2022-06-18-bomber-jacket.md",
  slug: "2022/2022-06-18-bomber-jacket",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-06-20-dosa-hut.md": {
  id: "2022/2022-06-20-dosa-hut.md",
  slug: "2022/2022-06-20-dosa-hut",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-06-20-liverpool.md": {
  id: "2022/2022-06-20-liverpool.md",
  slug: "2022/2022-06-20-liverpool",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-06-23-cooking-wok-gas.md": {
  id: "2022/2022-06-23-cooking-wok-gas.md",
  slug: "2022/2022-06-23-cooking-wok-gas",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-06-24-aileen-birthday.md": {
  id: "2022/2022-06-24-aileen-birthday.md",
  slug: "2022/2022-06-24-aileen-birthday",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-06-24-kebaya.md": {
  id: "2022/2022-06-24-kebaya.md",
  slug: "2022/2022-06-24-kebaya",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-06-25-dream.md": {
  id: "2022/2022-06-25-dream.md",
  slug: "2022/2022-06-25-dream",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-06-26-scavenger-hunt.md": {
  id: "2022/2022-06-26-scavenger-hunt.md",
  slug: "2022/2022-06-26-scavenger-hunt",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-06-27-mr-stonepot.md": {
  id: "2022/2022-06-27-mr-stonepot.md",
  slug: "2022/2022-06-27-mr-stonepot",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-06-28-dream.md": {
  id: "2022/2022-06-28-dream.md",
  slug: "2022/2022-06-28-dream",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-07-01-dream.md": {
  id: "2022/2022-07-01-dream.md",
  slug: "2022/2022-07-01-dream",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-07-01-sharon-birthday.md": {
  id: "2022/2022-07-01-sharon-birthday.md",
  slug: "2022/2022-07-01-sharon-birthday",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-07-01-top-gun.md": {
  id: "2022/2022-07-01-top-gun.md",
  slug: "2022/2022-07-01-top-gun",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-07-02-kingsford.md": {
  id: "2022/2022-07-02-kingsford.md",
  slug: "2022/2022-07-02-kingsford",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-07-04-cindy-lunch.md": {
  id: "2022/2022-07-04-cindy-lunch.md",
  slug: "2022/2022-07-04-cindy-lunch",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-07-05-spice-world.md": {
  id: "2022/2022-07-05-spice-world.md",
  slug: "2022/2022-07-05-spice-world",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-07-11-flower.md": {
  id: "2022/2022-07-11-flower.md",
  slug: "2022/2022-07-11-flower",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-07-12-nanyang.md": {
  id: "2022/2022-07-12-nanyang.md",
  slug: "2022/2022-07-12-nanyang",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-07-13-kimono.md": {
  id: "2022/2022-07-13-kimono.md",
  slug: "2022/2022-07-13-kimono",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-07-13-sri-lanka.md": {
  id: "2022/2022-07-13-sri-lanka.md",
  slug: "2022/2022-07-13-sri-lanka",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-07-14-patio.md": {
  id: "2022/2022-07-14-patio.md",
  slug: "2022/2022-07-14-patio",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-07-16-ipoh-dynasty.md": {
  id: "2022/2022-07-16-ipoh-dynasty.md",
  slug: "2022/2022-07-16-ipoh-dynasty",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-07-20-dream.md": {
  id: "2022/2022-07-20-dream.md",
  slug: "2022/2022-07-20-dream",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-07-22-flower-power.md": {
  id: "2022/2022-07-22-flower-power.md",
  slug: "2022/2022-07-22-flower-power",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-07-23-nasi-kandar-parlea.md": {
  id: "2022/2022-07-23-nasi-kandar-parlea.md",
  slug: "2022/2022-07-23-nasi-kandar-parlea",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-07-24-sunday-dose-breakfast.md": {
  id: "2022/2022-07-24-sunday-dose-breakfast.md",
  slug: "2022/2022-07-24-sunday-dose-breakfast",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-07-27-dream.md": {
  id: "2022/2022-07-27-dream.md",
  slug: "2022/2022-07-27-dream",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-07-30-dream.md": {
  id: "2022/2022-07-30-dream.md",
  slug: "2022/2022-07-30-dream",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-07-30-sufferfest.md": {
  id: "2022/2022-07-30-sufferfest.md",
  slug: "2022/2022-07-30-sufferfest",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-07-30-yulefest.md": {
  id: "2022/2022-07-30-yulefest.md",
  slug: "2022/2022-07-30-yulefest",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-07-31-echo-point.md": {
  id: "2022/2022-07-31-echo-point.md",
  slug: "2022/2022-07-31-echo-point",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-07-31-megalong-valley.md": {
  id: "2022/2022-07-31-megalong-valley.md",
  slug: "2022/2022-07-31-megalong-valley",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-08-01-megalong-valley.md": {
  id: "2022/2022-08-01-megalong-valley.md",
  slug: "2022/2022-08-01-megalong-valley",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-08-02-megalong-valley.md": {
  id: "2022/2022-08-02-megalong-valley.md",
  slug: "2022/2022-08-02-megalong-valley",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-08-06-peranakan-place.md": {
  id: "2022/2022-08-06-peranakan-place.md",
  slug: "2022/2022-08-06-peranakan-place",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-08-06-tasmania.md": {
  id: "2022/2022-08-06-tasmania.md",
  slug: "2022/2022-08-06-tasmania",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-08-07-dream.md": {
  id: "2022/2022-08-07-dream.md",
  slug: "2022/2022-08-07-dream",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-08-08-birthday.md": {
  id: "2022/2022-08-08-birthday.md",
  slug: "2022/2022-08-08-birthday",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-08-09-dream.md": {
  id: "2022/2022-08-09-dream.md",
  slug: "2022/2022-08-09-dream",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-08-11-elemnt-bolt.md": {
  id: "2022/2022-08-11-elemnt-bolt.md",
  slug: "2022/2022-08-11-elemnt-bolt",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-08-13-kebaya.md": {
  id: "2022/2022-08-13-kebaya.md",
  slug: "2022/2022-08-13-kebaya",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-08-13-temasek-dinner.md": {
  id: "2022/2022-08-13-temasek-dinner.md",
  slug: "2022/2022-08-13-temasek-dinner",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-08-14-darling-harbour.md": {
  id: "2022/2022-08-14-darling-harbour.md",
  slug: "2022/2022-08-14-darling-harbour",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-08-14-family-birthday.md": {
  id: "2022/2022-08-14-family-birthday.md",
  slug: "2022/2022-08-14-family-birthday",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-08-14-leather-skirt.md": {
  id: "2022/2022-08-14-leather-skirt.md",
  slug: "2022/2022-08-14-leather-skirt",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-08-17-broadway.md": {
  id: "2022/2022-08-17-broadway.md",
  slug: "2022/2022-08-17-broadway",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-08-17-grounds.md": {
  id: "2022/2022-08-17-grounds.md",
  slug: "2022/2022-08-17-grounds",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-08-18-akuna-bay.md": {
  id: "2022/2022-08-18-akuna-bay.md",
  slug: "2022/2022-08-18-akuna-bay",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-08-20-auburn-cherry-blossom.md": {
  id: "2022/2022-08-20-auburn-cherry-blossom.md",
  slug: "2022/2022-08-20-auburn-cherry-blossom",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-08-22-femmes.md": {
  id: "2022/2022-08-22-femmes.md",
  slug: "2022/2022-08-22-femmes",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-09-07-wong-time-again.md": {
  id: "2022/2022-09-07-wong-time-again.md",
  slug: "2022/2022-09-07-wong-time-again",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-09-08-spring-garden.md": {
  id: "2022/2022-09-08-spring-garden.md",
  slug: "2022/2022-09-08-spring-garden",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-09-08-yunn.md": {
  id: "2022/2022-09-08-yunn.md",
  slug: "2022/2022-09-08-yunn",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-09-10-cheongsam.md": {
  id: "2022/2022-09-10-cheongsam.md",
  slug: "2022/2022-09-10-cheongsam",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-09-10-dream.md": {
  id: "2022/2022-09-10-dream.md",
  slug: "2022/2022-09-10-dream",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-09-10-sharon-wong-birthday.md": {
  id: "2022/2022-09-10-sharon-wong-birthday.md",
  slug: "2022/2022-09-10-sharon-wong-birthday",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-09-11-laura-kitchen.md": {
  id: "2022/2022-09-11-laura-kitchen.md",
  slug: "2022/2022-09-11-laura-kitchen",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-09-12-clueless.md": {
  id: "2022/2022-09-12-clueless.md",
  slug: "2022/2022-09-12-clueless",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-09-15-rice-den.md": {
  id: "2022/2022-09-15-rice-den.md",
  slug: "2022/2022-09-15-rice-den",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-09-17-nurragingy-reserve.md": {
  id: "2022/2022-09-17-nurragingy-reserve.md",
  slug: "2022/2022-09-17-nurragingy-reserve",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-09-18-zeal-north.md": {
  id: "2022/2022-09-18-zeal-north.md",
  slug: "2022/2022-09-18-zeal-north",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-09-19-parramatta.md": {
  id: "2022/2022-09-19-parramatta.md",
  slug: "2022/2022-09-19-parramatta",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-09-20-cape-formentor.md": {
  id: "2022/2022-09-20-cape-formentor.md",
  slug: "2022/2022-09-20-cape-formentor",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-09-21-mt-annan.md": {
  id: "2022/2022-09-21-mt-annan.md",
  slug: "2022/2022-09-21-mt-annan",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-09-22-dream.md": {
  id: "2022/2022-09-22-dream.md",
  slug: "2022/2022-09-22-dream",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-09-22-vn-street-food.md": {
  id: "2022/2022-09-22-vn-street-food.md",
  slug: "2022/2022-09-22-vn-street-food",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-09-23-cowra.md": {
  id: "2022/2022-09-23-cowra.md",
  slug: "2022/2022-09-23-cowra",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-09-24-japanese-garden.md": {
  id: "2022/2022-09-24-japanese-garden.md",
  slug: "2022/2022-09-24-japanese-garden",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-09-25-floriade.md": {
  id: "2022/2022-09-25-floriade.md",
  slug: "2022/2022-09-25-floriade",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-09-26-tulip-top.md": {
  id: "2022/2022-09-26-tulip-top.md",
  slug: "2022/2022-09-26-tulip-top",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-09-27-masak-masak.md": {
  id: "2022/2022-09-27-masak-masak.md",
  slug: "2022/2022-09-27-masak-masak",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-09-28-chill.md": {
  id: "2022/2022-09-28-chill.md",
  slug: "2022/2022-09-28-chill",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-10-01-poke-bowl.md": {
  id: "2022/2022-10-01-poke-bowl.md",
  slug: "2022/2022-10-01-poke-bowl",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-10-02-parramatta.md": {
  id: "2022/2022-10-02-parramatta.md",
  slug: "2022/2022-10-02-parramatta",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-10-02-spring.md": {
  id: "2022/2022-10-02-spring.md",
  slug: "2022/2022-10-02-spring",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-10-03-leather-outfit.md": {
  id: "2022/2022-10-03-leather-outfit.md",
  slug: "2022/2022-10-03-leather-outfit",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-10-03-leura.md": {
  id: "2022/2022-10-03-leura.md",
  slug: "2022/2022-10-03-leura",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-10-06-hunter-valley-gardens.md": {
  id: "2022/2022-10-06-hunter-valley-gardens.md",
  slug: "2022/2022-10-06-hunter-valley-gardens",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-10-06-peppers.md": {
  id: "2022/2022-10-06-peppers.md",
  slug: "2022/2022-10-06-peppers",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-10-06-winmark.md": {
  id: "2022/2022-10-06-winmark.md",
  slug: "2022/2022-10-06-winmark",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-10-08-dream.md": {
  id: "2022/2022-10-08-dream.md",
  slug: "2022/2022-10-08-dream",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-10-08-nanyang.md": {
  id: "2022/2022-10-08-nanyang.md",
  slug: "2022/2022-10-08-nanyang",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-10-09-flapper.md": {
  id: "2022/2022-10-09-flapper.md",
  slug: "2022/2022-10-09-flapper",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-10-09-radika-birthday.md": {
  id: "2022/2022-10-09-radika-birthday.md",
  slug: "2022/2022-10-09-radika-birthday",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-10-12-amah.md": {
  id: "2022/2022-10-12-amah.md",
  slug: "2022/2022-10-12-amah",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-10-15-burwood.md": {
  id: "2022/2022-10-15-burwood.md",
  slug: "2022/2022-10-15-burwood",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-10-17-indian-outfit.md": {
  id: "2022/2022-10-17-indian-outfit.md",
  slug: "2022/2022-10-17-indian-outfit",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-10-17-nawaz.md": {
  id: "2022/2022-10-17-nawaz.md",
  slug: "2022/2022-10-17-nawaz",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-10-18-dream.md": {
  id: "2022/2022-10-18-dream.md",
  slug: "2022/2022-10-18-dream",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-10-19-hello-kitty.md": {
  id: "2022/2022-10-19-hello-kitty.md",
  slug: "2022/2022-10-19-hello-kitty",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-10-19-hokkien-mee.md": {
  id: "2022/2022-10-19-hokkien-mee.md",
  slug: "2022/2022-10-19-hokkien-mee",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-10-30-flower-lace-dress.md": {
  id: "2022/2022-10-30-flower-lace-dress.md",
  slug: "2022/2022-10-30-flower-lace-dress",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-10-30-satay-guildford.md": {
  id: "2022/2022-10-30-satay-guildford.md",
  slug: "2022/2022-10-30-satay-guildford",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-11-03-dunoon.md": {
  id: "2022/2022-11-03-dunoon.md",
  slug: "2022/2022-11-03-dunoon",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-11-03-jacaranda-dress.md": {
  id: "2022/2022-11-03-jacaranda-dress.md",
  slug: "2022/2022-11-03-jacaranda-dress",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-11-04-de-ronde.md": {
  id: "2022/2022-11-04-de-ronde.md",
  slug: "2022/2022-11-04-de-ronde",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-11-08-kon-loh-mee.md": {
  id: "2022/2022-11-08-kon-loh-mee.md",
  slug: "2022/2022-11-08-kon-loh-mee",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-12-18-pink-outfit.md": {
  id: "2022/2022-12-18-pink-outfit.md",
  slug: "2022/2022-12-18-pink-outfit",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-12-24-buddha bowl.md": {
  id: "2022/2022-12-24-buddha bowl.md",
  slug: "2022/2022-12-24-buddha-bowl",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-12-27-muswellbrook.md": {
  id: "2022/2022-12-27-muswellbrook.md",
  slug: "2022/2022-12-27-muswellbrook",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-12-28-burning-mountain.md": {
  id: "2022/2022-12-28-burning-mountain.md",
  slug: "2022/2022-12-28-burning-mountain",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-12-29-muswellbrook-walk.md": {
  id: "2022/2022-12-29-muswellbrook-walk.md",
  slug: "2022/2022-12-29-muswellbrook-walk",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-12-30-hunter-valley.md": {
  id: "2022/2022-12-30-hunter-valley.md",
  slug: "2022/2022-12-30-hunter-valley",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2022/2022-12-31-air-burger.md": {
  id: "2022/2022-12-31-air-burger.md",
  slug: "2022/2022-12-31-air-burger",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2023/2023-01-01-new-year-walk.md": {
  id: "2023/2023-01-01-new-year-walk.md",
  slug: "2023/2023-01-01-new-year-walk",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2023/2023-01-02-dream.md": {
  id: "2023/2023-01-02-dream.md",
  slug: "2023/2023-01-02-dream",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2023/2023-01-02-rogue.md": {
  id: "2023/2023-01-02-rogue.md",
  slug: "2023/2023-01-02-rogue",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2023/2023-01-03-ya-malaysia.md": {
  id: "2023/2023-01-03-ya-malaysia.md",
  slug: "2023/2023-01-03-ya-malaysia",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2023/2023-01-06-karen-birthday.md": {
  id: "2023/2023-01-06-karen-birthday.md",
  slug: "2023/2023-01-06-karen-birthday",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2023/2023-01-07-guildford.md": {
  id: "2023/2023-01-07-guildford.md",
  slug: "2023/2023-01-07-guildford",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2023/2023-01-08-cabramatta.md": {
  id: "2023/2023-01-08-cabramatta.md",
  slug: "2023/2023-01-08-cabramatta",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2023/2023-01-08-size-xl.md": {
  id: "2023/2023-01-08-size-xl.md",
  slug: "2023/2023-01-08-size-xl",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2023/2023-01-09-char-kuay-teow.md": {
  id: "2023/2023-01-09-char-kuay-teow.md",
  slug: "2023/2023-01-09-char-kuay-teow",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2023/2023-01-10-taro-soy-latte.md": {
  id: "2023/2023-01-10-taro-soy-latte.md",
  slug: "2023/2023-01-10-taro-soy-latte",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2023/2023-01-11-cat-town.md": {
  id: "2023/2023-01-11-cat-town.md",
  slug: "2023/2023-01-11-cat-town",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2023/2023-01-11-dream.md": {
  id: "2023/2023-01-11-dream.md",
  slug: "2023/2023-01-11-dream",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2023/2023-01-14-la-boheme.md": {
  id: "2023/2023-01-14-la-boheme.md",
  slug: "2023/2023-01-14-la-boheme",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2023/2023-01-14-rose-bay.md": {
  id: "2023/2023-01-14-rose-bay.md",
  slug: "2023/2023-01-14-rose-bay",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2023/2023-01-15-dream.md": {
  id: "2023/2023-01-15-dream.md",
  slug: "2023/2023-01-15-dream",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2023/2023-01-16-gotong-royong.md": {
  id: "2023/2023-01-16-gotong-royong.md",
  slug: "2023/2023-01-16-gotong-royong",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2023/2023-01-17-flower-outfit.md": {
  id: "2023/2023-01-17-flower-outfit.md",
  slug: "2023/2023-01-17-flower-outfit",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2023/2023-01-17-luho.md": {
  id: "2023/2023-01-17-luho.md",
  slug: "2023/2023-01-17-luho",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2023/2023-01-19-comeco.md": {
  id: "2023/2023-01-19-comeco.md",
  slug: "2023/2023-01-19-comeco",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2023/2023-01-19-newtown.md": {
  id: "2023/2023-01-19-newtown.md",
  slug: "2023/2023-01-19-newtown",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2023/2023-01-20-ckt-fried-rice.md": {
  id: "2023/2023-01-20-ckt-fried-rice.md",
  slug: "2023/2023-01-20-ckt-fried-rice",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2023/2023-01-20-cleaning-lps.md": {
  id: "2023/2023-01-20-cleaning-lps.md",
  slug: "2023/2023-01-20-cleaning-lps",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2023/2023-01-20-la-boheme.md": {
  id: "2023/2023-01-20-la-boheme.md",
  slug: "2023/2023-01-20-la-boheme",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2023/2023-01-20-mt-ventoux.md": {
  id: "2023/2023-01-20-mt-ventoux.md",
  slug: "2023/2023-01-20-mt-ventoux",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2023/2023-01-21-lion-kiss.md": {
  id: "2023/2023-01-21-lion-kiss.md",
  slug: "2023/2023-01-21-lion-kiss",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2023/2023-01-21-lny-eve-dinner.md": {
  id: "2023/2023-01-21-lny-eve-dinner.md",
  slug: "2023/2023-01-21-lny-eve-dinner",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2023/2023-01-21-lunar-new-year-eve.md": {
  id: "2023/2023-01-21-lunar-new-year-eve.md",
  slug: "2023/2023-01-21-lunar-new-year-eve",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2023/2023-01-21-summer.md": {
  id: "2023/2023-01-21-summer.md",
  slug: "2023/2023-01-21-summer",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2023/2023-01-22-cny-dinner.md": {
  id: "2023/2023-01-22-cny-dinner.md",
  slug: "2023/2023-01-22-cny-dinner",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2023/2023-01-23-bakkwa-burger.md": {
  id: "2023/2023-01-23-bakkwa-burger.md",
  slug: "2023/2023-01-23-bakkwa-burger",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2023/2023-01-24-cny-lunch.md": {
  id: "2023/2023-01-24-cny-lunch.md",
  slug: "2023/2023-01-24-cny-lunch",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2023/2023-01-24-dream.md": {
  id: "2023/2023-01-24-dream.md",
  slug: "2023/2023-01-24-dream",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2023/2023-01-25-mozarella-burger.md": {
  id: "2023/2023-01-25-mozarella-burger.md",
  slug: "2023/2023-01-25-mozarella-burger",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2023/2023-01-25-xopp.md": {
  id: "2023/2023-01-25-xopp.md",
  slug: "2023/2023-01-25-xopp",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2023/2023-01-26-australia-day.md": {
  id: "2023/2023-01-26-australia-day.md",
  slug: "2023/2023-01-26-australia-day",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2023/2023-01-27-cape-formentor.md": {
  id: "2023/2023-01-27-cape-formentor.md",
  slug: "2023/2023-01-27-cape-formentor",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2023/2023-01-28-china-doll.md": {
  id: "2023/2023-01-28-china-doll.md",
  slug: "2023/2023-01-28-china-doll",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2023/2023-01-28-wallis.md": {
  id: "2023/2023-01-28-wallis.md",
  slug: "2023/2023-01-28-wallis",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2023/2023-01-29-zeal-north.md": {
  id: "2023/2023-01-29-zeal-north.md",
  slug: "2023/2023-01-29-zeal-north",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2023/2023-01-30-home-network.md": {
  id: "2023/2023-01-30-home-network.md",
  slug: "2023/2023-01-30-home-network",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2023/2023-01-31-three-cheongsams.md": {
  id: "2023/2023-01-31-three-cheongsams.md",
  slug: "2023/2023-01-31-three-cheongsams",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2023/2023-02-01-eastwood.md": {
  id: "2023/2023-02-01-eastwood.md",
  slug: "2023/2023-02-01-eastwood",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2023/2023-02-01-target.md": {
  id: "2023/2023-02-01-target.md",
  slug: "2023/2023-02-01-target",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2023/2023-02-04-mopoke.md": {
  id: "2023/2023-02-04-mopoke.md",
  slug: "2023/2023-02-04-mopoke",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2023/2023-02-04-nanyang.md": {
  id: "2023/2023-02-04-nanyang.md",
  slug: "2023/2023-02-04-nanyang",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2023/2023-02-05-temasek-cny.md": {
  id: "2023/2023-02-05-temasek-cny.md",
  slug: "2023/2023-02-05-temasek-cny",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2023/2023-02-05-two-cheongsams.md": {
  id: "2023/2023-02-05-two-cheongsams.md",
  slug: "2023/2023-02-05-two-cheongsams",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2023/2023-02-06-kueh bangkit.md": {
  id: "2023/2023-02-06-kueh bangkit.md",
  slug: "2023/2023-02-06-kueh-bangkit",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2023/2023-02-06-summer-outfit.md": {
  id: "2023/2023-02-06-summer-outfit.md",
  slug: "2023/2023-02-06-summer-outfit",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2023/2023-02-07-masak-masak.md": {
  id: "2023/2023-02-07-masak-masak.md",
  slug: "2023/2023-02-07-masak-masak",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2023/2023-02-07-nails.md": {
  id: "2023/2023-02-07-nails.md",
  slug: "2023/2023-02-07-nails",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2023/2023-02-07-school-outfit.md": {
  id: "2023/2023-02-07-school-outfit.md",
  slug: "2023/2023-02-07-school-outfit",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2023/2023-02-10-charlie-chan.md": {
  id: "2023/2023-02-10-charlie-chan.md",
  slug: "2023/2023-02-10-charlie-chan",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2023/2023-02-10-marcs.md": {
  id: "2023/2023-02-10-marcs.md",
  slug: "2023/2023-02-10-marcs",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2023/2023-02-12-language-models.md": {
  id: "2023/2023-02-12-language-models.md",
  slug: "2023/2023-02-12-language-models",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2023/2023-02-13-burwood-yumcha.md": {
  id: "2023/2023-02-13-burwood-yumcha.md",
  slug: "2023/2023-02-13-burwood-yumcha",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2023/2023-02-13-plaid.md": {
  id: "2023/2023-02-13-plaid.md",
  slug: "2023/2023-02-13-plaid",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2023/2023-02-14-margaret-birthday.md": {
  id: "2023/2023-02-14-margaret-birthday.md",
  slug: "2023/2023-02-14-margaret-birthday",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2023/2023-02-15-gumshara.md": {
  id: "2023/2023-02-15-gumshara.md",
  slug: "2023/2023-02-15-gumshara",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2023/2023-02-15-katherine.md": {
  id: "2023/2023-02-15-katherine.md",
  slug: "2023/2023-02-15-katherine",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2023/2023-02-16-peach-polka-dot.md": {
  id: "2023/2023-02-16-peach-polka-dot.md",
  slug: "2023/2023-02-16-peach-polka-dot",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2023/2023-02-17-axi.md": {
  id: "2023/2023-02-17-axi.md",
  slug: "2023/2023-02-17-axi",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2023/2023-02-17-cindy-birthday.md": {
  id: "2023/2023-02-17-cindy-birthday.md",
  slug: "2023/2023-02-17-cindy-birthday",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2023/2023-02-17-sarong.md": {
  id: "2023/2023-02-17-sarong.md",
  slug: "2023/2023-02-17-sarong",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2023/2023-02-18-chatgpt.md": {
  id: "2023/2023-02-18-chatgpt.md",
  slug: "2023/2023-02-18-chatgpt",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2023/2023-02-18-heroes-of-hollywood.md": {
  id: "2023/2023-02-18-heroes-of-hollywood.md",
  slug: "2023/2023-02-18-heroes-of-hollywood",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2023/2023-02-18-mink-pink.md": {
  id: "2023/2023-02-18-mink-pink.md",
  slug: "2023/2023-02-18-mink-pink",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2023/2023-02-19-ho-jiak-strathfield.md": {
  id: "2023/2023-02-19-ho-jiak-strathfield.md",
  slug: "2023/2023-02-19-ho-jiak-strathfield",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2023/2023-02-19-yours-truly.md": {
  id: "2023/2023-02-19-yours-truly.md",
  slug: "2023/2023-02-19-yours-truly",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2023/2023-02-20-world-pride.md": {
  id: "2023/2023-02-20-world-pride.md",
  slug: "2023/2023-02-20-world-pride",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2023/2023-02-21-emperors-garden.md": {
  id: "2023/2023-02-21-emperors-garden.md",
  slug: "2023/2023-02-21-emperors-garden",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2023/2023-02-22-masak-masak.md": {
  id: "2023/2023-02-22-masak-masak.md",
  slug: "2023/2023-02-22-masak-masak",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2023/2023-02-23-yee-sang.md": {
  id: "2023/2023-02-23-yee-sang.md",
  slug: "2023/2023-02-23-yee-sang",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2023/2023-02-24-dyke-bar.md": {
  id: "2023/2023-02-24-dyke-bar.md",
  slug: "2023/2023-02-24-dyke-bar",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2023/2023-02-24-mr-fat-duck.md": {
  id: "2023/2023-02-24-mr-fat-duck.md",
  slug: "2023/2023-02-24-mr-fat-duck",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2023/2023-02-25-kl-flavors.md": {
  id: "2023/2023-02-25-kl-flavors.md",
  slug: "2023/2023-02-25-kl-flavors",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2023/2023-02-25-transparent.md": {
  id: "2023/2023-02-25-transparent.md",
  slug: "2023/2023-02-25-transparent",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2023/2023-02-26-february-babies.md": {
  id: "2023/2023-02-26-february-babies.md",
  slug: "2023/2023-02-26-february-babies",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2023/2023-02-26-ghanda-shift.md": {
  id: "2023/2023-02-26-ghanda-shift.md",
  slug: "2023/2023-02-26-ghanda-shift",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2023/2023-02-27-durango.md": {
  id: "2023/2023-02-27-durango.md",
  slug: "2023/2023-02-27-durango",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2023/2023-02-27-egan-poke-bowl.md": {
  id: "2023/2023-02-27-egan-poke-bowl.md",
  slug: "2023/2023-02-27-egan-poke-bowl",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
"2023/2023-02-28-flower-blouse.md": {
  id: "2023/2023-02-28-flower-blouse.md",
  slug: "2023/2023-02-28-flower-blouse",
  body: string,
  collection: "blog",
  data: InferEntrySchema<"blog">
},
},

	};

	type ContentConfig = typeof import("../src/content/config");
}
