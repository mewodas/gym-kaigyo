import { ArticleMeta, getCategoryLabel } from "./types";

const SITE_URL = "https://gym-kaigyo.jp";
const SITE_NAME = "ジム開業ラボ";
const OGP_IMAGE = `${SITE_URL}/opengraph-image`;
const PUBLISHER_NAME = "ジム開業ラボ";

const PUBLISHER_LOGO = {
  "@type": "ImageObject",
  url: OGP_IMAGE,
  width: 1200,
  height: 630,
};

const ARTICLE_IMAGE = {
  "@type": "ImageObject",
  url: OGP_IMAGE,
  width: 1200,
  height: 630,
};

export function buildArticleJsonLd(article: ArticleMeta) {
  const url = `${SITE_URL}/${article.category}/${article.slug}`;
  const dateIso = article.date
    ? new Date(article.date).toISOString()
    : new Date().toISOString();

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    image: ARTICLE_IMAGE,
    datePublished: dateIso,
    dateModified: dateIso,
    author: {
      "@type": "Person",
      name: "ジム開業ラボ オーナー",
      url: `${SITE_URL}/profile`,
    },
    publisher: {
      "@type": "Organization",
      name: PUBLISHER_NAME,
      url: SITE_URL,
      logo: PUBLISHER_LOGO,
    },
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
      logo: PUBLISHER_LOGO,
    },
  };
}

export function buildOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: PUBLISHER_NAME,
    url: SITE_URL,
    logo: PUBLISHER_LOGO,
    description:
      "パーソナルジム開業のリアルを、実際に開業したオーナーが解説するメディア。",
  };
}
