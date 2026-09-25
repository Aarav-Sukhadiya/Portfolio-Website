export default function Education({ education }) {
  if (!education || education.length === 0) return null;

  return (
    <section className="py-12 bg-surface/30">
      <div className="container mx-auto px-6 max-w-5xl">
        <h2 className="text-2xl font-bold mb-8 tracking-tight">Education</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          {education.map((edu) => (
            <div key={edu.id} className="p-8 bg-surface/50 border border-border ">
              <div className="flex flex-col mb-4">
                <h3 className="text-xl font-bold leading-snug mb-2">{edu.degree}</h3>
                <h4 className="text-primary/80 font-medium">{edu.institution}</h4>
                <span className="font-mono text-sm text-accent mt-3">{edu.year}</span>
              </div>
              
              <div className="mt-4 pt-4 border-t border-border/50">
                <span className="block text-sm font-mono text-primary/60 mb-2">Focus Areas</span>
                <p className="text-secondary text-sm leading-relaxed">
                  {edu.coursework}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
