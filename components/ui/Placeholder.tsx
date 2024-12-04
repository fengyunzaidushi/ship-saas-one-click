interface PlaceholderProps {
    width: number;
    height: number;
    className?: string;
  }
  
  export function GradientPlaceholder({ width, height, className = '' }: PlaceholderProps) {
    return (
      <div 
        className={`relative overflow-hidden ${className}`}
        style={{ width, height }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300 animate-gradient" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer" />
      </div>
    );
  }