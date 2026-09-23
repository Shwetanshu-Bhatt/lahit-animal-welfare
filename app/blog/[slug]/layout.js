export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const fallback = {
    title: 'Rescue and Animal Welfare Update',
    description: 'Read a LAHIT Animal Welfare rescue and community update from Uttarakhand.',
    alternates: { canonical: `/blog/${slug}/` },
  };

  try {
    const [{ default: connectDB }, { default: Blog }] = await Promise.all([
      import('@/lib/mongodb'),
      import('@/models/Blog'),
    ]);
    await connectDB();
    const post = await Blog.findOne({ slug, published: true }).lean();
    if (!post) return fallback;

    return {
      title: post.title,
      description: post.excerpt,
      keywords: post.tags,
      alternates: { canonical: `/blog/${post.slug}/` },
      openGraph: {
        type: 'article',
        title: post.title,
        description: post.excerpt,
        publishedTime: post.createdAt?.toISOString(),
        authors: post.author ? [post.author] : undefined,
        images: post.coverImage ? [post.coverImage] : undefined,
      },
    };
  } catch {
    return fallback;
  }
}

export default function BlogPostLayout({ children }) {
  return children;
}
