"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { useCookieConsent } from "@/hooks/useCookieConsent";
import { ExternalLink } from "./ExternalLink";
import { SectionHeading } from "./ui";
import type { InstagramPost } from "@/lib/types";

interface InstagramGridProps {
  title: string;
  subtitle: string;
  handle: string;
  profileUrl: string;
  followLabel: string;
  embedFallback: string;
  embedCta: string;
  posts: InstagramPost[];
}

function MediaTile({
  post,
  large,
}: {
  post: InstagramPost;
  large?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const play = () => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = 0;
    void v.play();
  };

  const pause = () => {
    const v = videoRef.current;
    if (!v) return;
    v.pause();
  };

  const hasVideo = post.type === "video" && post.video;
  const hasImage = Boolean(post.image);

  return (
    <ExternalLink
      href={post.url}
      className={`group relative block overflow-hidden bg-media ${
        large ? "col-span-2 row-span-2" : ""
      }`}
      onMouseEnter={hasVideo ? play : undefined}
      onMouseLeave={hasVideo ? pause : undefined}
    >
      <div className="relative aspect-square w-full">
        {hasImage && (
          <Image
            src={post.image!}
            alt={post.caption ?? "24Shoots Instagram"}
            fill
            className={`object-cover transition duration-700 group-hover:scale-105 ${
              hasVideo ? "group-hover:opacity-0" : ""
            }`}
            sizes={
              large ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 50vw, 25vw"
            }
          />
        )}

        {hasVideo && (
          <video
            ref={videoRef}
            src={post.video!}
            muted
            loop
            playsInline
            preload="metadata"
            onError={(e) => {
              (e.target as HTMLVideoElement).style.display = "none";
            }}
            className={`absolute inset-0 h-full w-full object-cover transition duration-500 ${
              hasImage
                ? "opacity-0 group-hover:opacity-100"
                : "opacity-100 group-hover:scale-105"
            }`}
          />
        )}

        <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/25" />

        {post.type === "video" && (
          <div className="absolute left-3 top-3 rounded-sm border border-white/20 bg-black/50 px-2 py-1 text-[9px] font-semibold uppercase tracking-widest text-white backdrop-blur-sm">
            Reel
          </div>
        )}

        {post.caption && (
          <div className="absolute bottom-0 left-0 right-0 translate-y-full bg-gradient-to-t from-black/90 to-transparent p-4 transition duration-300 group-hover:translate-y-0">
            <p className="text-xs text-foreground/80">{post.caption}</p>
          </div>
        )}
      </div>
    </ExternalLink>
  );
}

function EmbedTile({
  post,
  large,
  embedFallback,
  embedCta,
}: {
  post: InstagramPost;
  large?: boolean;
  embedFallback: string;
  embedCta: string;
}) {
  const { allowsMarketing, ready } = useCookieConsent();

  useEffect(() => {
    if (!ready || !allowsMarketing) return;
    const existing = document.querySelector('script[src*="instagram.com/embed.js"]');
    if (existing) {
      // @ts-expect-error instgrm global from Instagram embed script
      window.instgrm?.Embeds?.process();
      return;
    }
    const script = document.createElement("script");
    script.src = "https://www.instagram.com/embed.js";
    script.async = true;
    document.body.appendChild(script);
  }, [post.url, ready, allowsMarketing]);

  if (!ready) {
    return (
      <div
        className={`flex aspect-square items-center justify-center bg-media ${large ? "col-span-2 row-span-2" : ""}`}
      />
    );
  }

  if (!allowsMarketing) {
    return (
      <div
        className={`flex aspect-square flex-col items-center justify-center gap-4 border border-border bg-surface p-6 text-center ${
          large ? "col-span-2 row-span-2" : ""
        }`}
      >
        <p className="text-xs leading-relaxed text-muted">{embedFallback}</p>
        <ExternalLink
          href={post.url}
          className="text-[10px] font-semibold uppercase tracking-widest text-accent hover:underline"
        >
          {embedCta}
        </ExternalLink>
      </div>
    );
  }

  return (
    <div
      className={`overflow-hidden bg-media ${large ? "col-span-2 row-span-2" : ""}`}
    >
      <blockquote
        className="instagram-media !m-0 !min-w-0 !w-full"
        data-instgrm-permalink={post.url}
        data-instgrm-version="14"
        style={{ background: "var(--color-media)", border: 0, margin: 0, padding: 0 }}
      />
    </div>
  );
}

export function InstagramGrid({
  title,
  subtitle,
  handle,
  profileUrl,
  followLabel,
  embedFallback,
  embedCta,
  posts,
}: InstagramGridProps) {
  return (
    <section className="section-rule-y bg-panel py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="mb-14 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading title={title} subtitle={subtitle} />
          <ExternalLink
            href={profileUrl}
            className="shrink-0 border border-white/20 bg-elevated px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.15em] text-foreground/90 transition hover:border-accent hover:text-accent"
          >
            {followLabel} @{handle}
          </ExternalLink>
        </div>

        <div className="grid grid-cols-2 auto-rows-fr gap-px bg-border md:grid-cols-4">
          {/* Con la primera pieza a 2×2, 5 piezas cierran la rejilla sin huecos */}
          {posts.slice(0, 5).map((post, i) =>
            post.embed ? (
              <EmbedTile
                key={post.id}
                post={post}
                large={i === 0}
                embedFallback={embedFallback}
                embedCta={embedCta}
              />
            ) : (
              <MediaTile key={post.id} post={post} large={i === 0} />
            )
          )}
        </div>
      </div>
    </section>
  );
}
