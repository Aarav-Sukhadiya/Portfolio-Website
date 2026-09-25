export default function Experience({ experience }) {
  return (
    <section id="experience" className="py-24">
      <div className="container mx-auto px-6 max-w-5xl">
        <h2 className="text-3xl font-bold mb-16 tracking-tight">Experience</h2>
        
        <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-px before:bg-border">
          {experience.map((item, idx) => (
            <div key={item.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
              {/* Timeline dot */}
              <div className="flex items-center justify-center w-10 h-10  border-4 border-background bg-accent absolute left-0 md:left-1/2 -translate-x-1/2 shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-sm z-10"></div>
              
              <div className="w-full md:w-5/12 pl-14 md:pl-0 md:px-8">
                <div className="p-6 bg-surface border border-border  group-hover:border-accent/50 transition-colors">
                  <span className="block font-mono text-sm text-accent mb-2">{item.year}</span>
                  <h4 className="text-xl font-bold mb-1">{item.role}</h4>
                  <h5 className="text-primary/70 font-medium mb-4">{item.company}</h5>
                  <p className="text-secondary leading-relaxed text-sm">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
