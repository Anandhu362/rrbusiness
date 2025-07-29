// components/BackgroundDots.tsx
const BackgroundDots = () => {
    const dots = [
      { top: '30%', left: '15%' },
      { top: '60%', left: '40%' },
      { top: '45%', left: '80%' },
      { top: '70%', left: '70%' },
      { top: '20%', left: '55%' },
    ];
  
    return (
      <div className="absolute inset-0 -z-10">
        {dots.map((dot, i) => (
          <div
            key={i}
            className="floating-dot"
            style={{
              top: dot.top,
              left: dot.left,
              animationDelay: `${i * 1.2}s`,
            }}
          />
        ))}
      </div>
    );
  };
  
  export default BackgroundDots;
  