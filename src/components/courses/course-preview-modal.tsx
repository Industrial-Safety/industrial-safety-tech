"use client";

import { useState } from "react";
import { PlayCircle, X } from "lucide-react";
import { Image as ImageIcon } from "lucide-react";

interface CoursePreviewModalProps {
  videoUrl?: string | null;
  coverImageUrl?: string | null;
  courseTitle?: string;
}

export function CoursePreviewModal({ videoUrl, coverImageUrl, courseTitle }: CoursePreviewModalProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Thumbnail con botón play */}
      <div
        className={`relative h-56 w-full border-b border-slate-700 bg-slate-800 flex items-center justify-center ${videoUrl ? "cursor-pointer" : ""}`}
        onClick={() => videoUrl && setOpen(true)}
      >
        {coverImageUrl ? (
          <img
            src={coverImageUrl}
            alt={courseTitle ?? "Curso"}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <ImageIcon className="h-16 w-16 text-slate-600" />
        )}
        <div className="absolute inset-0 bg-slate-950/40 hover:bg-slate-950/20 transition-colors flex items-center justify-center">
          <div className={`h-16 w-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center transition-transform ${videoUrl ? "hover:scale-110" : "opacity-50"}`}>
            <PlayCircle className="h-10 w-10 text-white" />
          </div>
        </div>
        <div className="absolute bottom-4 left-0 w-full text-center">
          <span className="text-white font-semibold text-sm drop-shadow-md">
            {videoUrl ? "Vista previa de este curso" : "Sin vista previa disponible"}
          </span>
        </div>
      </div>

      {/* Modal */}
      {open && videoUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative w-full max-w-3xl bg-slate-900 rounded-xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700">
              <span className="text-white font-semibold text-sm truncate">{courseTitle ?? "Vista previa"}</span>
              <button
                onClick={() => setOpen(false)}
                className="text-slate-400 hover:text-white transition-colors ml-4 flex-shrink-0"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="bg-black aspect-video w-full">
              <video
                src={videoUrl}
                controls
                autoPlay
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
