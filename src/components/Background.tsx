export default function Background() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute -top-40 -left-32 h-[620px] w-[620px] rounded-full bg-[#0079CB]/18 blur-[140px] animate-float" />
      <div
        className="absolute top-1/3 -right-40 h-[720px] w-[720px] rounded-full bg-[#7c3aed]/12 blur-[160px] animate-float"
        style={{ animationDelay: '2s', animationDuration: '9s' }}
      />
      <div
        className="absolute bottom-[-10%] left-1/4 h-[560px] w-[560px] rounded-full bg-[#0ed8f6]/10 blur-[140px] animate-pulse-soft"
        style={{ animationDuration: '10s' }}
      />
    </div>
  );
}
