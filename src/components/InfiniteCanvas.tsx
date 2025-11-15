import { useState, useEffect, useRef } from 'react';
import { User } from '../lib/supabase';
import UserCard from './UserCard';

interface InfiniteCanvasProps {
  users: User[];
  onUserClick: (user: User) => void;
}

export default function InfiniteCanvas({ users, onUserClick }: InfiniteCanvasProps) {
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);

  const radius = 400;

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * -0.001;
    const newZoom = Math.min(Math.max(0.3, zoom + delta), 2);
    setZoom(newZoom);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === canvasRef.current || (e.target as HTMLElement).closest('.canvas-background')) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDragging(false);
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, []);

  return (
    <div
      ref={canvasRef}
      className="w-full h-full overflow-hidden cursor-move bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative"
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div className="canvas-background absolute inset-0">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
          opacity: 0.3
        }} />
      </div>

      <div
        className="absolute"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: 'center center',
          transition: isDragging ? 'none' : 'transform 0.1s ease-out',
          left: '50%',
          top: '50%',
        }}
      >
        <div className="relative" style={{ width: 0, height: 0 }}>
          <div
            className="absolute rounded-full border-2 border-cyan-500/30"
            style={{
              width: radius * 2,
              height: radius * 2,
              left: -radius,
              top: -radius,
            }}
          />

          <div
            className="absolute rounded-full border border-cyan-400/20"
            style={{
              width: (radius * 2) + 100,
              height: (radius * 2) + 100,
              left: -radius - 50,
              top: -radius - 50,
            }}
          />

          <div className="absolute w-4 h-4 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/50" style={{
            left: -8,
            top: -8,
          }} />

          {users.map((user, index) => {
            const angle = (user.position_angle * Math.PI) / 180;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;

            return (
              <div
                key={user.id}
                className="absolute"
                style={{
                  left: x - 80,
                  top: y - 80,
                  animation: `fadeIn 0.5s ease-out ${index * 0.05}s both`,
                }}
              >
                <UserCard user={user} onClick={() => onUserClick(user)} />
              </div>
            );
          })}
        </div>
      </div>

      <div className="absolute bottom-4 left-4 bg-black/50 text-white px-4 py-2 rounded-lg text-sm backdrop-blur-sm">
        <p>Scroll to zoom • Drag to pan</p>
        <p className="text-cyan-400">{users.length} members in the circle</p>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
