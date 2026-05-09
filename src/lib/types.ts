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

export const CATEGORY_LABELS: Record<string, string> = {
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
