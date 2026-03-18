import { getNewsroomPost, getAllSlugs } from "@/lib/mdx";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, User, Clock, Share2 } from "lucide-react";
import { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import { generateTitle, generateDescription } from "@/lib/seo";

interface NewsroomPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate static params for all newsroom posts
export async function generateStaticParams() {
  const slugs = getAllSlugs();
  return slugs.map((slug: string) => ({ slug }));
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: NewsroomPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getNewsroomPost(slug);

  if (!post) {
    return {
      title: generateTitle("Newsroom Post Not Found"),
    };
  }

  return {
    title: generateTitle(`${post.title} Newsroom Update`),
    description: generateDescription(post.description),
    keywords: post.tags?.join(", "),
    authors: post.author ? [{ name: post.author }] : undefined,
    openGraph: {
      title: generateTitle(post.title),
      description: generateDescription(post.description),
      type: "article",
      publishedTime: post.date,
      authors: post.author ? [post.author] : undefined,
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: generateTitle(post.title),
      description: generateDescription(post.description),
    },
  };
}

// Custom MDX components

export default async function NewsroomPostPage({
  params,
}: NewsroomPostPageProps) {
  const { slug } = await params;
  const post = getNewsroomPost(slug);

  if (!post) {
    notFound();
  }

  const readingTime = 5; // Approximate reading time

  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-6 py-12">
      {/* Back Navigation */}
      <div className="mb-8">
        <Link href="/newsroom">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Newsroom
          </Button>
        </Link>
      </div>

      {/* Article Header */}
      <header className="mb-12">
        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
          {post.title}
        </h1>

        {/* Description */}
        <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
          {post.description}
        </p>

        {/* Meta Information */}
        <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground border-b pb-6">
          {post.author && (
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>{post.author}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <span>
              {new Date(post.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{readingTime} min read</span>
          </div>
        </div>
      </header>

      {/* Article Content */}
      <article className="prose prose-lg max-w-none prose-neutral dark:prose-invert">
        <div className="prose prose-lg max-w-none">
          <pre>{post.content}</pre>
        </div>
      </article>

      {/* Article Footer */}
      <footer className="mt-16 pt-8 border-t">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div>
            <h3 className="font-semibold mb-2">Enjoyed this article?</h3>
            <p className="text-muted-foreground text-sm">
              Share it with your network or subscribe for more insights.
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/contact">
              <Button size="sm">Subscribe</Button>
            </Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
