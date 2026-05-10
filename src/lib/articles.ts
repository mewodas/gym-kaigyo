import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { Article, ArticleMeta } from "./types";

export type { Article, ArticleMeta } from "./types";
export { getCategoryLabel, CATEGORY_LABELS } from "./types";

const CONTENT_DIR = path.join(process.cwd(), "content");

export function getAllArticles(): ArticleMeta[] {
  const articles: ArticleMeta[] = [];

  const categories = fs.readdirSync(CONTENT_DIR).filter((f) =>
    fs.statSync(path.join(CONTENT_DIR, f)).isDirectory()
  );

  for (const category of categories) {
    const categoryDir = path.join(CONTENT_DIR, category);
    const files = fs.readdirSync(categoryDir).filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));

    for (const file of files) {
      const slug = file.replace(/\.mdx?$/, "");
      const filePath = path.join(categoryDir, file);
      const raw = fs.readFileSync(filePath, "utf-8");
      const { data } = matter(raw);

      articles.push({
        slug,
        category,
        title: data.title ?? "",
        description: data.description ?? "",
        date: data.date ?? "",
        tags: data.tags ?? [],
      });
    }
  }

  return articles.sort((a, b) => (a.date > b.date ? -1 : 1));
}

export function getArticlesByCategory(category: string): ArticleMeta[] {
  return getAllArticles().filter((a) => a.category === category);
}

export function getRelatedArticles(
  category: string,
  slug: string,
  limit = 3
): ArticleMeta[] {
  const sameCategory = getAllArticles().filter(
    (a) => a.category === category && a.slug !== slug
  );
  if (sameCategory.length >= limit) return sameCategory.slice(0, limit);

  const others = getAllArticles().filter(
    (a) => a.category !== category
  );
  return [...sameCategory, ...others].slice(0, limit);
}

export function getArticle(category: string, slug: string): Article | null {
  const extensions = [".mdx", ".md"];
  for (const ext of extensions) {
    const filePath = path.join(CONTENT_DIR, category, slug + ext);
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf-8");
      const { data, content } = matter(raw);
      return {
        slug,
        category,
        title: data.title ?? "",
        description: data.description ?? "",
        date: data.date ?? "",
        tags: data.tags ?? [],
        content,
      };
    }
  }
  return null;
}

export function getAllSlugs(): { category: string; slug: string }[] {
  const result: { category: string; slug: string }[] = [];
  const categories = fs.readdirSync(CONTENT_DIR).filter((f) =>
    fs.statSync(path.join(CONTENT_DIR, f)).isDirectory()
  );
  for (const category of categories) {
    const categoryDir = path.join(CONTENT_DIR, category);
    const files = fs.readdirSync(categoryDir).filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));
    for (const file of files) {
      result.push({ category, slug: file.replace(/\.mdx?$/, "") });
    }
  }
  return result;
}
