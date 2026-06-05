import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/seo/site-config";
import { courses } from "@/lib/data/courses";
import { quizzes } from "@/lib/data/quizzes";
import { tracks } from "@/lib/data/tracks";
import { labs } from "@/lib/labs";
import { getExamRouteSlugs } from "@/lib/data/exams/pools";
import { certificationPaths } from "@/lib/data/pro-modules/paths";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/parcours`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/cours`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/examens`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${base}/labs`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/tarifs`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/dashboard`, lastModified: now, changeFrequency: "daily", priority: 0.5 },
  ];

  const trackRoutes = tracks.map((t) => ({
    url: `${base}/parcours/${t.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const courseRoutes = courses.flatMap((c) =>
    c.modules.flatMap((m) =>
      m.lessons.map((l) => ({
        url: `${base}/cours/${c.slug}/${l.slug}`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.75,
      }))
    )
  );

  const quizRoutes = quizzes.map((q) => ({
    url: `${base}/quiz/${q.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const labRoutes = labs.map((l) => ({
    url: `${base}/labs/${l.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.65,
  }));

  const examRoutes = getExamRouteSlugs().map((slug) => ({
    url: `${base}/examens/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const certPathRoutes = certificationPaths.map((p) => ({
    url: `${base}/certification/${p.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  return [...staticRoutes, ...trackRoutes, ...courseRoutes, ...quizRoutes, ...labRoutes, ...examRoutes, ...certPathRoutes];
}
