import axios from "axios";
import Link from "next/link";

export default async function WatchTV({ params, searchParams }) {
  const { id } = await params;
  const sp = await searchParams;
  const season = sp?.s || "1";
  const episode = sp?.e || "1";
  const key = process.env.NEXT_PUBLIC_TMDB_API_KEY;

  const { data: show } = await axios.get(
    `https://api.themoviedb.org/3/tv/${id}?api_key=${key}`
  );

  // cinesrc with sandbox, swap url if this url dies
  const src = `https://cinesrc.st/embed/tv/${id}?s=${season}&e=${episode}&autoplay=true`;

  const seasons = (show.seasons || []).filter((x) => x.season_number > 0);
  const thisSeason = seasons.find((x) => String(x.season_number) === String(season));
  const epTotal = thisSeason?.episode_count || 10;

  const chip = (active) => ({
    padding: "5px 9px",
    borderRadius: 6,
    background: active ? "#444" : "#1a1a1a",
    color: "#fff",
    textDecoration: "none",
    fontSize: 13,
  });

  return (
    <main style={{ maxWidth: 960, margin: "0 auto", padding: 20 }}>
      <Link href="/" style={{ color: "#bbb", fontSize: 14 }}>
        go back
      </Link>

      <h1 style={{ fontSize: 22, marginTop: 12 }}>
        {show.name} S{season}E{episode}
      </h1>
      {show.overview && (
        <p style={{ color: "#999", fontSize: 14, lineHeight: 1.45 }}>
          {show.overview}
        </p>
      )}

      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, margin: "12px 0 8px" }}>
        {seasons.map((s) => (
          <Link
            key={s.season_number}
            href={`/tv/${id}?s=${s.season_number}&e=1`}
            style={chip(String(s.season_number) === String(season))}
          >
            S{s.season_number}
          </Link>
        ))}
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
        {Array.from({ length: epTotal }, (_, i) => i + 1).map((ep) => (
          <Link
            key={ep}
            href={`/tv/${id}?s=${season}&e=${ep}`}
            style={chip(String(ep) === String(episode))}
          >
            E{ep}
          </Link>
        ))}
      </div>

      <div
        style={{
          width: "100%",
          aspectRatio: "16 / 9",
          background: "#000",
          borderRadius: 10,
          overflow: "hidden",
        }}
      >
        <iframe
          src={src}
          style={{ width: "100%", height: "100%", border: 0 }}
          allowFullScreen
          allow="autoplay; fullscreen; picture-in-picture"
          // sandbox to stop popunder ads
          sandbox="allow-scripts allow-same-origin allow-forms allow-presentation allow-pointer-lock allow-downloads allow-modals allow-orientation-lock"
          referrerPolicy="no-referrer"
        />
      </div>
    </main>
  );
}