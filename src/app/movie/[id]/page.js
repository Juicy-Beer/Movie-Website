import axios from "axios";
import Link from "next/link";

export default async function WatchMovie({ params }) {
  const { id } = await params;
  const key = process.env.NEXT_PUBLIC_TMDB_API_KEY;

  const { data: movie } = await axios.get(
    `https://api.themoviedb.org/3/movie/${id}?api_key=${key}`
  );

  // cinesrc with sandbox, swap url if this url dies
  const src = `https://cinesrc.st/embed/movie/${id}?autoplay=true`;

  return (
    <main style={{ maxWidth: 960, margin: "0 auto", padding: 20 }}>
      <Link href="/" style={{ color: "#bbb", fontSize: 14 }}>
        go back
      </Link>

      <h1 style={{ fontSize: 22, marginTop: 12 }}>{movie.title}</h1>
      {movie.overview && (
        <p style={{ color: "#999", fontSize: 14, lineHeight: 1.45 }}>
          {movie.overview}
        </p>
      )}

      <div
        style={{
          marginTop: 12,
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