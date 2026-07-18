"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { useTerminalTheme } from "./theme-provider";
import { useAuth } from "./auth-provider";

export function LikeButton({
  templateId,
  initialLikes,
  initiallyLiked = false,
}: {
  templateId: number;
  initialLikes: number;
  initiallyLiked?: boolean;
}) {
  const { playClick, playSuccess, playBeep } = useTerminalTheme();
  const { user } = useAuth();
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(initiallyLiked);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Logged-in users get their liked state from the server (initiallyLiked prop);
    // it may resolve after mount once the session loads. Guests fall back to the
    // localStorage guard. Syncing to that async state here is intentional.
    if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLiked(initiallyLiked);
      return;
    }
    try {
      const likedTemplates = JSON.parse(localStorage.getItem("liked-templates") || "[]");
      if (Array.isArray(likedTemplates) && likedTemplates.includes(templateId)) {
        setLiked(true);
      }
    } catch (e) {
      console.error("Failed to read liked status from localStorage:", e);
    }
  }, [templateId, user, initiallyLiked]);

  const handleLikeToggle = async () => {
    if (loading) return;
    setLoading(true);
    playClick();

    const action = liked ? "unlike" : "like";
    try {
      const res = await fetch("/api/templates/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateId, action }),
      });

      if (res.ok) {
        const newLiked = !liked;
        setLiked(newLiked);
        setLikes((prev) => (newLiked ? prev + 1 : Math.max(0, prev - 1)));

        // Guests track their like locally; logged-in state lives server-side.
        if (!user) {
          const likedTemplates = JSON.parse(localStorage.getItem("liked-templates") || "[]");
          if (newLiked) {
            if (!likedTemplates.includes(templateId)) {
              likedTemplates.push(templateId);
            }
          } else {
            const index = likedTemplates.indexOf(templateId);
            if (index > -1) {
              likedTemplates.splice(index, 1);
            }
          }
          localStorage.setItem("liked-templates", JSON.stringify(likedTemplates));
        }

        if (newLiked) playSuccess();
      } else {
        playBeep(440, 0.15);
      }
    } catch (err) {
      console.error("Failed to toggle template like:", err);
      playBeep(440, 0.15);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLikeToggle}
      disabled={loading}
      className={`flex items-center gap-1.5 px-2.5 py-1 border text-[10px] uppercase font-mono font-bold tracking-wider transition-all rounded-none cursor-pointer disabled:opacity-50 select-none ${
        liked
          ? "border-destructive bg-destructive/10 text-destructive shadow-[0_0_8px_rgba(239,68,68,0.15)]"
          : "border-border text-muted-foreground/45 hover:text-destructive hover:border-destructive/40"
      }`}
    >
      <Heart className={`h-3 w-3 ${liked ? "fill-destructive" : ""}`} />
      <span>{liked ? "liked" : "like"}</span>
      <span className="text-[9px] opacity-60">[{likes}]</span>
    </button>
  );
}
