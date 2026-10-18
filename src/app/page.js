import axios from "axios";
import Link from "next/link";

export default async function Home({ searchParams }) {
  const key = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  const q = (await searchParams)?.q || "";

  let movies = [];
  let shows = [];

  if (q) {
    const [m, t] = await Promise.all([
      axios.get(
        `https://api.themoviedb.org/3/search/movie?api_key=${key}&query=${encodeURIComponent(q)}`
      ),
      axios.get(
        `https://api.themoviedb.org/3/search/tv?api_key=${key}&query=${encodeURIComponent(q)}`
      ),
    ]);
    movies = m.data.results || [];
    shows = t.data.results || [];
  } else {
    const [m, t] = await Promise.all([
      axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${key}`),
      axios.get(`https://api.themoviedb.org/3/tv/popular?api_key=${key}`),
    ]);
    movies = m.data.results || [];
    shows = t.data.results || [];
  }

  const grid = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
    gap: 14,
  };

  function Poster({ item, href }) {
    const name = item.title || item.name;
    if (!item.poster_path) return null;
    return (
      <Link href={href} style={{ color: "#ddd", textDecoration: "none" }}>
        <img
          src={`https://image.tmdb.org/t/p/w342${item.poster_path}`}
          alt={name}
          style={{
            width: "100%",
            borderRadius: 8,
            aspectRatio: "2 / 3",
            objectFit: "cover",
            display: "block",
            background: "#151515",
          }}
        />
        <div style={{ fontSize: 13, marginTop: 6 }}>{name}</div>
      </Link>
    );
  }

  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: 20 }}>
      <div
        style={{
          display: "flex",
          gap: 12,
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <Link href="/" style={{ color: "#fff", textDecoration: "none", fontWeight: 700 }}>
          watch
        </Link>
        <form style={{ flex: 1 }}>
          <input
            name="q"
            defaultValue={q}
            placeholder="search..."
            style={{
              width: "100%",
              maxWidth: 320,
              padding: "8px 12px",
              borderRadius: 8,
              border: "1px solid #333",
              background: "#141414",
              color: "#fff",
            }}
          />
        </form>
      </div>

      <h2 style={{ fontSize: 16, marginBottom: 10 }}>Movies</h2>
      <div style={{ ...grid, marginBottom: 28 }}>
        {movies.map((m) => (
          <Poster key={m.id} item={m} href={`/movie/${m.id}`} />
        ))}
      </div>

      <h2 style={{ fontSize: 16, marginBottom: 10 }}>TV</h2>
      <div style={grid}>
        {shows.map((s) => (
          <Poster key={s.id} item={s} href={`/tv/${s.id}?s=1&e=1`} />
        ))}
      </div>
    </main>
  );
}