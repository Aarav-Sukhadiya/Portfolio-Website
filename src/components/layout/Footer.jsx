export default function Footer({ name }) {
  const year = new Date().getFullYear();

  return (
    <footer className="py-8 border-t border-amber-400/10 bg-warm-bg">
      <div className="container mx-auto px-6 max-w-6xl flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-sm font-semibold tracking-wide uppercase text-stone-200">
          {name}
        </p>

        <p className="text-sm text-stone-500">
          Built with React + Vite + Tailwind CSS
        </p>

        <p className="text-sm font-mono text-stone-500">
          &copy; {year}
        </p>
      </div>
    </footer>
  );
}
