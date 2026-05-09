import Link from "next/link";
import { ArticleMeta, getCategoryLabel } from "@/lib/articles";

export function ArticleCard({ article }: { article: ArticleMeta }) {
  return (
    <Link
      href={`/${article.category}/${article.slug}`}
      className="block border border-gray-200 rounded-lg p-5 hover:border-gray-400 hover:shadow-sm transition-all bg-white"
    >
      <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
        {getCategoryLabel(article.category)}
      </span>
      <h2 className="mt-2 font-bold text-gray-900 leading-snug">{article.title}</h2>
      <p className="mt-1 text-sm text-gray-500 line-clamp-2">{article.description}</p>
      {article.date && (
        <p className="mt-3 text-xs text-gray-400">{article.date}</p>
      )}
    </Link>
  );
}
