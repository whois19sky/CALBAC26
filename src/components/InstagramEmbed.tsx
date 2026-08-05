"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    instgrm?: {
      Embeds: { process: () => void };
    };
  }
}

/**
 * Renders real Instagram posts using Instagram's official public embed
 * (the same embed code you get from a post's "Embed" share option) - no API
 * keys, no Facebook app review, no OAuth. Just needs public post URLs.
 */
export default function InstagramEmbed({ postUrls }: { postUrls: string[] }) {
  const loadedScript = useRef(false);

  useEffect(() => {
    if (postUrls.length === 0) return;

    if (!loadedScript.current) {
      const script = document.createElement("script");
      script.src = "https://www.instagram.com/embed.js";
      script.async = true;
      script.onload = () => window.instgrm?.Embeds.process();
      document.body.appendChild(script);
      loadedScript.current = true;
    } else {
      // Script already loaded from a previous mount - just re-process embeds
      window.instgrm?.Embeds.process();
    }
  }, [postUrls]);

  if (postUrls.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {postUrls.map((url, i) => (
        <blockquote
          key={i}
          className="instagram-media"
          data-instgrm-permalink={url}
          data-instgrm-version="14"
          style={{ margin: "0 auto", maxWidth: "100%" }}
        />
      ))}
    </div>
  );
}
