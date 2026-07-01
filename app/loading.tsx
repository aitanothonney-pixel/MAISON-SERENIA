export default function Loading() {
  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-[9999]">
      <div className="relative flex items-center justify-center">
        {/* Spinner ring */}
        <div
          className="absolute rounded-full border border-[#C9A96E] animate-spin"
          style={{
            width: '90px',
            height: '90px',
            borderTopColor: 'transparent',
            borderRightColor: 'transparent',
          }}
        />
        {/* MS letters */}
        <p
          className="text-black text-3xl font-bold tracking-widest animate-pulse"
          style={{ fontFamily: 'var(--font-playfair, Georgia, serif)' }}
        >
          MS
        </p>
      </div>
    </div>
  );
}
