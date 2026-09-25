export default function Footer({ name }) {
  const year = new Date().getFullYear();
  
  return (
    <footer className="py-8 border-t border-border">
      <div className="container mx-auto px-6 max-w-5xl flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-sm font-semibold tracking-wide uppercase">
          {name}
        </p>
        
        <p className="text-sm text-secondary">
          Built with React + Vite + Tailwind CSS
        </p>
        
        <p className="text-sm font-mono text-secondary">
          &copy; {year}
        </p>
      </div>
    </footer>
  );
}
