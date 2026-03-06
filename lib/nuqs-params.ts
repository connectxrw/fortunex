import { useQueryStates } from "nuqs";
import {
  createLoader,
  type Options,
  parseAsBoolean,
  parseAsJson,
  parseAsString,
} from "nuqs/server";
import z from "zod";

const schema = z.object({
  images: z.array(z.string()),
  title: z.string(),
  ctaLink: z.string().optional(),
  ctaLabel: z.string().optional(),
  content: z.string(),
  price: z.string().optional(),
  currency: z.string().optional(),
  open: z.boolean(),
});

const searchParams = {
  q: parseAsString.withDefault(""),
  search: parseAsString.withDefault(""),
  category: parseAsString.withDefault("restaurant"),
  subcategory: parseAsString.withDefault(""),
  status: parseAsString.withDefault("all"),
  post: parseAsString.withDefault(""),
  ai: parseAsBoolean.withDefault(false),
  nearMe: parseAsBoolean.withDefault(false),
  preview: parseAsJson(schema).withDefault({
    images: [],
    title: "",
    ctaLink: "",
    ctaLabel: "",
    content: "",
    price: "",
    currency: "RWF",
    open: false,
  } as z.infer<typeof schema>),
};

export const loadFilters = createLoader(searchParams);

export const useFilters = (options: Options = {}) =>
  useQueryStates(searchParams, {
    ...options,
    shallow: false,
  });
