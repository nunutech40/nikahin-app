export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-50">
      <div className="text-center space-y-6">
        <h1 className="text-6xl font-serif font-bold text-zinc-900 tracking-tighter">
          NIKAHIN.
        </h1>
        <p className="text-xl text-zinc-600 italic font-medium">
          Gatot Engine: <span className="text-emerald-600">Online & Ready to Render.</span>
        </p>
        <div className="pt-12 border-t border-zinc-200">
          <p className="text-xs text-zinc-400 uppercase tracking-[0.3em]">
            Chapter Lead: Rizka Fajar Nugraha
          </p>
        </div>
      </div>
    </main>
  );
}