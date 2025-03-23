import React from "react";

interface StarRatingProps {
  rating: number;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  ratingsCount?: number;
}

export function StarRating({ 
  rating, 
  size = "md", 
  showText = true, 
  ratingsCount 
}: StarRatingProps) {
  const starSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  // Calculate the percentage of the partial star (for the last filled star)
  const fullStars = Math.floor(rating);
  const partialStar = rating - fullStars;

  return (
    <div className="flex items-center">
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <svg 
            key={i} 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="currentColor" 
            className={`${starSizes[size]} ${i < fullStars ? "text-chart-4" : "text-muted"}`}
          >
            <path 
              fillRule="evenodd" 
              d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" 
              clipRule="evenodd" 
            />
          </svg>
        ))}
      </div>
      {showText && (
        <span className={`ml-2 text-muted-foreground ${textSizes[size]}`}>
          {rating.toFixed(1)}
          {ratingsCount !== undefined && ` (${ratingsCount.toLocaleString()})`}
        </span>
      )}
    </div>
  );
}