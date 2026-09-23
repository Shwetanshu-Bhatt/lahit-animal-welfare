export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const { id } = await params;
  const fallback = {
    title: 'Rescue Story',
    description: 'Read a LAHIT Animal Welfare rescue story and recovery update.',
    alternates: { canonical: `/rescues/${id}/` },
  };

  try {
    const [{ default: connectDB }, { default: Rescue }] = await Promise.all([
      import('@/lib/mongodb'),
      import('@/models/Rescue'),
    ]);
    await connectDB();
    const story = await Rescue.findOne({ _id: id, published: true }).lean();
    if (!story) return fallback;

    return {
      title: `${story.name} | Rescue Story`,
      description: `${story.name}'s rescue and recovery story from ${story.location}, Uttarakhand, shared by LAHIT Animal Welfare.`,
      alternates: { canonical: `/rescues/${story._id}/` },
      openGraph: {
        type: 'article',
        title: `${story.name} | Rescue Story`,
        description: story.story?.slice(0, 160),
        images: [story.afterImage, story.beforeImage].filter(Boolean),
      },
    };
  } catch {
    return fallback;
  }
}

export default function RescueStoryLayout({ children }) {
  return children;
}
