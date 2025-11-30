import { useState, useRef, useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface SlidingGalleryProps {
  images: string[];
}

export default function SlidingGallery({ images }: SlidingGalleryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [dragPosition, setDragPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleStart = (clientY: number) => {
    setIsDragging(true);
    setStartY(clientY - dragPosition);
  };

  const handleMove = (clientY: number) => {
    if (!isDragging) return;
    
    const newPosition = clientY - startY;
    const maxHeight = window.innerHeight * 0.85;
    
    // Constrain between 0 and maxHeight
    const constrainedPosition = Math.max(0, Math.min(newPosition, maxHeight));
    setDragPosition(constrainedPosition);
    
    // Auto-open if dragged up more than 100px
    if (constrainedPosition > 100) {
      setIsOpen(true);
    }
  };

  const handleEnd = () => {
    setIsDragging(false);
    
    // Snap to open or closed based on position
    if (dragPosition < 150) {
      setDragPosition(0);
      setIsOpen(false);
    } else {
      setDragPosition(window.innerHeight * 0.7);
      setIsOpen(true);
    }
  };

  const toggleGallery = () => {
    if (isOpen) {
      setDragPosition(0);
      setIsOpen(false);
    } else {
      setDragPosition(window.innerHeight * 0.7);
      setIsOpen(true);
    }
  };

  const openLightbox = (index: number) => {
    setSelectedImage(index);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const navigateLightbox = (direction: "prev" | "next") => {
    if (selectedImage === null) return;
    
    if (direction === "prev") {
      setSelectedImage(selectedImage > 0 ? selectedImage - 1 : images.length - 1);
    } else {
      setSelectedImage(selectedImage < images.length - 1 ? selectedImage + 1 : 0);
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => handleMove(e.clientY);
    const handleTouchMove = (e: TouchEvent) => handleMove(e.touches[0].clientY);
    const handleMouseUp = () => handleEnd();
    const handleTouchEnd = () => handleEnd();

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("touchmove", handleTouchMove, { passive: false });
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("touchend", handleTouchEnd);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isDragging, startY, dragPosition]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImage === null) return;
      
      if (e.key === "Escape") {
        closeLightbox();
      } else if (e.key === "ArrowLeft") {
        navigateLightbox("prev");
      } else if (e.key === "ArrowRight") {
        navigateLightbox("next");
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedImage]);

  if (images.length === 0) return null;

  return (
    <>
      {/* Lightbox */}
      {selectedImage !== null && (
        <div
          className="fixed inset-0 bg-black/95 z-[60] flex items-center justify-center"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 p-2 text-white hover:bg-white/10 rounded-full transition-colors z-10"
            aria-label="Close lightbox"
          >
            <X className="w-8 h-8" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              navigateLightbox("prev");
            }}
            className="absolute left-4 p-3 text-white hover:bg-white/10 rounded-full transition-colors"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          <img
            src={images[selectedImage]}
            alt={`Gallery image ${selectedImage + 1}`}
            className="max-w-[90vw] max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          <button
            onClick={(e) => {
              e.stopPropagation();
              navigateLightbox("next");
            }}
            className="absolute right-4 p-3 text-white hover:bg-white/10 rounded-full transition-colors"
            aria-label="Next image"
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm font-mono">
            {selectedImage + 1} / {images.length}
          </div>
        </div>
      )}

      {/* Overlay backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
          onClick={toggleGallery}
        />
      )}

      {/* Sliding panel */}
      <div
        ref={containerRef}
        className="fixed bottom-0 left-0 right-0 bg-background border-t-4 border-foreground shadow-2xl z-50"
        style={{
          transform: `translateY(calc(100% - ${dragPosition}px - 56px))`,
          transition: isDragging ? "none" : "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          maxHeight: "85vh",
        }}
      >
        {/* Drag handle */}
        <div
          className="h-14 flex items-center justify-center cursor-grab active:cursor-grabbing bg-foreground/5 hover:bg-foreground/10 transition-colors border-b border-foreground/10"
          onMouseDown={(e) => handleStart(e.clientY)}
          onTouchStart={(e) => handleStart(e.touches[0].clientY)}
        >
          <div className="flex flex-col items-center gap-1">
            <div className="w-16 h-1.5 bg-foreground/40 rounded-full" />
            <span className="text-xs text-muted-foreground font-mono uppercase tracking-wider">
              {isOpen ? "Drag to close" : "Drag to view gallery"}
            </span>
          </div>
        </div>

        {/* Gallery content */}
        <div 
          className="overflow-y-auto overscroll-contain" 
          style={{ height: "calc(85vh - 56px)" }}
        >
          <div className="container py-8 md:py-12">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-3xl md:text-4xl font-serif font-bold mb-1">Gallery</h3>
                <p className="text-sm text-muted-foreground font-mono">
                  {images.length} {images.length === 1 ? "image" : "images"}
                </p>
              </div>
              <button
                onClick={toggleGallery}
                className="p-3 hover:bg-foreground/5 rounded-full transition-colors"
                aria-label="Close gallery"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => openLightbox(index)}
                  className="group aspect-[3/4] overflow-hidden bg-muted rounded-sm relative focus:outline-none focus:ring-2 focus:ring-foreground/50"
                >
                  <img
                    src={image}
                    alt={`Gallery image ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                    <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm font-mono">
                      Click to enlarge
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Trigger bar when closed */}
      {!isOpen && (
        <div
          className="fixed bottom-0 left-0 right-0 h-14 bg-foreground cursor-pointer z-40 flex items-center justify-center hover:bg-foreground/90 transition-colors group"
          onClick={toggleGallery}
        >
          <div className="flex flex-col items-center gap-1">
            <div className="w-16 h-1.5 bg-background rounded-full" />
            <span className="text-xs text-background font-mono uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
              View Gallery ({images.length})
            </span>
          </div>
        </div>
      )}
    </>
  );
}
