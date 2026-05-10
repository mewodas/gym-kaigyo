import { ArticleMeta, getCategoryLabel } from "./types";

const SITE_URL = "https://gym-kaigyo.jp";
const SITE_NAME = "ジム開業ラボ";
const SITE_LOGO = `${SITE_URL}/opengraph-image`;
const PUBLISHER_NAME = "ジム開業ラボ";

export function buildArticleJsonLd(article: ArticleMeta) {
  const url = `${SITE_URL}/${article.category}/${article.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    datePublished: article.date,
    dateModified: article.date,
    author: {
      "@type": "Organization",
      name: PUBLISHER_NAME,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: PUBLISHER_NAME,
      logo: {
        "@type": "ImageObject",
        url: SITE_LOGO,
      },
    },
    image: SITE_LOGO,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    articleSection: getCategoryLabel(article.category),
    keywords: article.tags.join(", "),
    inLanguage: "ja-JP",
  };
}

export function buildBreadcrumbJsonLd(article: ArticleMeta) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "ホーム",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: getCategoryLabel(article.category),
        item: `${SITE_URL}/${article.category}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: article.title,
        item: `${SITE_URL}/${article.category}/${article.slug}`,
      },
    ],
  };
}

export function buildWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    alternateName: "パーソナルジム開業マニュアル",
    url: SITE_URL,
    description:
      "実際に開業したオーナーが書く、パーソナルジム開業の完全ガイド。費用・器具・集客・AI活用まで実数字で解説。",
    inLanguage: "ja-JP",
    publisher: {
      "@type": "Organization",
      name: PUBLISHER_NAME,
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: SITE_LOGO,
      },
    },
  };
}

export function buildOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: PUBLISHER_NAME,
    url: SITE_URL,
    logo: SITE_LOGO,
    description: "パーソナルジム開業のリアルを、実際に開業したオーナーが解説するメディア。",
  };
}
