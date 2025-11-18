import React, { useState, useRef } from 'react';
import { ImagePinQuestion as ImagePinQuestionType } from '@/types/survey';

interface ImagePinQuestionProps {
  question: ImagePinQuestionType;
  onSubmit: (x: number, y: number) => void;
}

export default function ImagePinQuestion({ question, onSubmit }: ImagePinQuestionProps) {
  const [pinPosition, setPinPosition] = useState<{ x: number; y: number } | null>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (imageRef.current) {
      const rect = imageRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Normalize to percentage
      const xPercent = (x / rect.width) * 100;
      const yPercent = (y / rect.height) * 100;

      setPinPosition({ x: xPercent, y: yPercent });
    }
  };

  const handleSubmit = () => {
    if (pinPosition) {
      onSubmit(pinPosition.x, pinPosition.y);
    }
  };

  return (
    <div className="space-y-4">
      <div
        ref={imageRef}
        onClick={handleImageClick}
        className="relative w-full max-w-md mx-auto bg-gray-100 rounded-lg overflow-hidden cursor-crosshair border-2 border-gray-300"
        style={{ aspectRatio: '1 / 1.5' }}
      >
        {/* Placeholder body image - in production this would be an actual image */}
        <div className="w-full h-full flex items-center justify-center">
          <svg
            viewBox="0 0 200 300"
            className="w-full h-full"
            style={{ maxHeight: '500px' }}
          >
            {/* Simple body outline */}
            <ellipse cx="100" cy="40" rx="25" ry="30" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="2" />
            <rect x="75" y="70" width="50" height="80" rx="10" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="2" />
            <rect x="60" y="75" width="15" height="60" rx="7" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="2" />
            <rect x="125" y="75" width="15" height="60" rx="7" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="2" />
            <rect x="80" y="150" width="15" height="100" rx="7" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="2" />
            <rect x="105" y="150" width="15" height="100" rx="7" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="2" />

            {/* Labels */}
            <text x="100" y="35" textAnchor="middle" fontSize="10" fill="#6b7280">Head</text>
            <text x="100" y="110" textAnchor="middle" fontSize="10" fill="#6b7280">Torso</text>
            <text x="50" y="105" textAnchor="middle" fontSize="8" fill="#6b7280">Arm</text>
            <text x="150" y="105" textAnchor="middle" fontSize="8" fill="#6b7280">Arm</text>
            <text x="87" y="200" textAnchor="middle" fontSize="8" fill="#6b7280">Leg</text>
            <text x="112" y="200" textAnchor="middle" fontSize="8" fill="#6b7280">Leg</text>
          </svg>
        </div>

        {/* Pin marker */}
        {pinPosition && (
          <div
            className="absolute w-6 h-6 -ml-3 -mt-3 pointer-events-none"
            style={{
              left: `${pinPosition.x}%`,
              top: `${pinPosition.y}%`,
            }}
          >
            <svg viewBox="0 0 24 24" fill="red" className="drop-shadow-lg">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
          </div>
        )}
      </div>

      <p className="text-sm text-gray-600 text-center">
        {pinPosition
          ? `Selected position: ${Math.round(pinPosition.x)}%, ${Math.round(pinPosition.y)}%`
          : 'Click on the image to mark a location'}
      </p>

      <button
        onClick={handleSubmit}
        disabled={!pinPosition}
        className="w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
      >
        Confirm Selection
      </button>
    </div>
  );
}
