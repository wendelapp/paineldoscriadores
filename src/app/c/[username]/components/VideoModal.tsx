"use client";

interface VideoModalProps {
  videoAberto: string | null;
  onFechar: () => void;
}

export default function VideoModal({ videoAberto, onFechar }: VideoModalProps) {
  if (!videoAberto) return null;

  const getYouTubeEmbedUrl = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 
      ? `https://www.youtube.com/embed/${match[2]}?autoplay=1` 
      : url;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4 animate-in fade-in duration-200">
      <button onClick={onFechar} className="absolute top-6 left-6 text-white bg-zinc-900/50 px-4 py-2 rounded-full border border-zinc-700 cursor-pointer hover:bg-zinc-800 transition-colors">Voltar</button>
      <div className="w-full max-w-100 aspect-9/16 bg-black rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl flex items-center justify-center">
        {videoAberto.includes("youtube.com") || videoAberto.includes("youtu.be") ? (
          <iframe src={getYouTubeEmbedUrl(videoAberto)} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
        ) : (
          <img src={videoAberto} className="w-full h-full object-contain" alt="Mídia ampliada" />
        )}
      </div>
    </div>
  );
}