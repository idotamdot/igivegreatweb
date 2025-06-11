import { useEffect, useRef } from 'react';

interface MatrixRain {
  x: number;
  y: number;
  speed: number;
  chars: string[];
  opacity: number;
}

export default function CyberMatrix() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dropsRef = useRef<MatrixRain[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    // Matrix characters including ethical/tech symbols
    const matrixChars = [
      '01', 'Ξ', '∞', '◊', '▲', '●', '■', '★', '♦', '◆', '▼', '◄', '►',
      'ETHICS', 'NEURAL', 'QUANTUM', 'INDEX', 'SEEK', 'NOT', 'EXPLOIT',
      '>', '<', '/', '\\', '|', '-', '+', '=', '*', '~', '^', '%', '$', '#'
    ];

    const initializeDrops = () => {
      const fontSize = 14;
      const columns = Math.floor(canvas.width / fontSize);
      dropsRef.current = [];

      for (let i = 0; i < columns; i++) {
        dropsRef.current.push({
          x: i * fontSize,
          y: Math.random() * canvas.height,
          speed: Math.random() * 3 + 1,
          chars: matrixChars.slice().sort(() => Math.random() - 0.5),
          opacity: Math.random() * 0.8 + 0.2
        });
      }
    };

    const animate = () => {
      // Create fade effect
      ctx.fillStyle = 'rgba(10, 10, 35, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      dropsRef.current.forEach((drop, index) => {
        // Cycle through different colors for variety
        const colors = ['#00ff41', '#ff006e', '#3a86ff', '#8b5cf6', '#00f5ff'];
        ctx.fillStyle = colors[index % colors.length];
        ctx.globalAlpha = drop.opacity;
        ctx.font = '14px monospace';

        // Draw the character
        const char = drop.chars[Math.floor(Math.random() * drop.chars.length)];
        ctx.fillText(char, drop.x, drop.y);

        // Move drop down
        drop.y += drop.speed;

        // Reset drop when it reaches bottom
        if (drop.y > canvas.height) {
          drop.y = -20;
          drop.x = Math.random() * canvas.width;
          drop.speed = Math.random() * 3 + 1;
          drop.opacity = Math.random() * 0.8 + 0.2;
        }

        // Occasionally change opacity for flicker effect
        if (Math.random() < 0.01) {
          drop.opacity = Math.random() * 0.8 + 0.2;
        }
      });

      ctx.globalAlpha = 1;
      requestAnimationFrame(animate);
    };

    resizeCanvas();
    initializeDrops();
    animate();

    const handleResize = () => {
      resizeCanvas();
      initializeDrops();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.3 }}
    />
  );
}