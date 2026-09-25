export default function Contact({ social }) {
  return (
    <section id="contact" className="py-32 bg-surface/30">
      <div className="container mx-auto px-6 max-w-3xl text-center">
        <h2 className="text-sm font-mono text-accent mb-4 tracking-widest uppercase">Let's Build Something</h2>
        <h3 className="text-4xl md:text-5xl font-bold mb-8 tracking-tight">Have an interesting project? Let's talk.</h3>
        <p className="text-xl text-secondary mb-12 text-balance">
          I'm currently open to new opportunities. Whether you have a question or just want to say hi, I'll try my best to get back to you!
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
          <a 
            href={`mailto:${social.email}`}
            className="w-full sm:w-auto px-8 py-4 bg-primary text-background font-medium  hover:bg-gray-200 transition-colors text-lg"
          >
            Say Hello
          </a>
          <div className="flex gap-4">
            {social.github && (
              <a href={social.github} target="_blank" rel="noopener noreferrer" className="p-4 border border-border  hover:bg-surface transition-colors" aria-label="GitHub">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
              </a>
            )}
            {social.linkedin && (
              <a href={social.linkedin} target="_blank" rel="noopener noreferrer" className="p-4 border border-border  hover:bg-surface transition-colors" aria-label="LinkedIn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
            )}
          </div>
        </div>

        <div className="mt-24 pt-12 border-t border-border flex flex-col items-center opacity-60 hover:opacity-100 transition-opacity">
          <pre className="text-secondary font-mono text-[12px] md:text-sm leading-tight text-left mb-6 font-bold select-none text-accent">
{`       (  )   (   )  )
        ) (   )  (  (
        ( )  (    ) )
        _____________
       <_____________> ___
       |             |/ _ \\
       |               | | |
       |               |_| |
    ___|             |\\___/
   /    \\___________/    \\
   \\_____________________/`}
          </pre>
          <p className="text-secondary font-mono text-sm tracking-widest uppercase">
            Care for a cup of tea with me?
          </p>
        </div>
      </div>
    </section>
  );
}
