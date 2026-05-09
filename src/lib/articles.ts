import fs from "fs";
import path from "path";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "content");

export type Article = {
  slug: string;
  category: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  content: string;
};

export type ArticleMeta = Omit<Article, "content">;

const CATEGORY_LABELS: Record<string, string> = {
  kaigyo: "開業手順",
  hiyou: "費用・資金",
  kigu: "器具・設備",
  shukaku: "集客",
  gyomu: "業務・運営",
  horitsu: "法律・資格",
  "ai-keiei": "AI活用経営",
  fukugyou: "副業トレーナー",
};

export function getCategoryLabel(category: string): string {
  return CATEGORY_LABELS[category] ?? category;
}

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
