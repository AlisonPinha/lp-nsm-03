import { Quote, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import draKellyImg from "@/assets/dra-kelly.png";
import drHumbertoImg from "@/assets/dr-humberto.png";
import drRaiImg from "@/assets/dr-rai.png";

declare global {
  interface Window {
    YT: {
      Player: new (
        elementId: string,
        config: {
          videoId: string;
          playerVars?: Record<string, number | string>;
          events?: {
            onReady?: (event: { target: YTPlayer }) => void;
            onStateChange?: (event: { data: number; target: YTPlayer }) => void;
          };
        }
      ) => YTPlayer;
      PlayerState: {
        PLAYING: number;
      };
    };
    onYouTubeIframeAPIReady: () => void;
  }
}

interface YTPlayer {
  pauseVideo: () => void;
  playVideo: () => void;
  destroy: () => void;
}

const featuredCases = [
  {
    name: "Dra. Kelly",
    specialty: "Dermatofuncional | Especialista em Glúteos",
    youtubeId: "v-FXGOmJ-GQ",
    thumbnail: draKellyImg,
    quote: "Antes de implementar as ferramentas da NSM, eu não tinha quase agendamento de pacientes de alto valor.",
    result: "2 a 3 agendamentos semanais",
    metric: "+200% agendamentos"
  },
  {
    name: "Dr. Humberto Filho",
    specialty: "Ortodontia | Especialista em Invisalign | Referência na Bahia",
    youtubeId: "grkLbWT0DNU",
    thumbnail: drHumbertoImg,
    quote: "Depois de passar por várias agências e gestores de tráfego sem resultado, eu finalmente encontrei na NSM uma equipe que sabe investir o dinheiro do jeito certo e transformar investimento em resultado real.",
    result: "126 consultas em 12 meses",
    metric: "+126 consultas"
  },
  {
    name: "Dr. Raí Paschoto",
    specialty: "Odontologia | Especialista em Lentes de Resina",
    youtubeId: "boNr9AtPhLc",
    thumbnail: drRaiImg,
    quote: "Além de uma equipe sempre presente e atenciosa, a NSM entregou resultados já no primeiro mês, mostrando eficiência desde o início do projeto.",
    result: "De R$ 6 mil para R$ 39 mil em 35 dias",
    metric: "6,5x faturamento"
  }
];

const CasesSection = () => {
  const [apiReady, setApiReady] = useState(false);
  const [activeVideos, setActiveVideos] = useState<Set<string>>(new Set());
  const playersRef = useRef<Map<string, YTPlayer>>(new Map());
  const containerRefs = useRef<Map<string, HTMLDivElement | null>>(new Map());

  useEffect(() => {
    if (window.YT && window.YT.Player) {
      setApiReady(true);
      return;
    }

    const existingScript = document.querySelector('script[src="https://www.youtube.com/iframe_api"]');
    if (!existingScript) {
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;
      document.body.appendChild(script);
    }

    window.onYouTubeIframeAPIReady = () => {
      setApiReady(true);
    };

    return () => {
      playersRef.current.forEach((player) => {
        try { player.destroy(); } catch (e) { /* noop */ }
      });
    };
  }, []);

  const startVideo = (youtubeId: string) => {
    setActiveVideos((prev) => new Set(prev).add(youtubeId));

    setTimeout(() => {
      if (!apiReady || playersRef.current.has(youtubeId)) return;

      const containerId = `yt-player-${youtubeId}`;
      const player = new window.YT.Player(containerId, {
        videoId: youtubeId,
        playerVars: { rel: 0, modestbranding: 1, playsinline: 1, autoplay: 1 },
        events: {
          onStateChange: (event) => {
            if (event.data === window.YT.PlayerState.PLAYING) {
              playersRef.current.forEach((otherPlayer, videoId) => {
                if (videoId !== youtubeId) {
                  try { otherPlayer.pauseVideo(); } catch (e) { /* noop */ }
                }
              });
            }
          },
        },
      });
      playersRef.current.set(youtubeId, player);
    }, 100);
  };

  const setContainerRef = (youtubeId: string) => (el: HTMLDivElement | null) => {
    containerRefs.current.set(youtubeId, el);
  };

  return (
    <section className="section-dark py-24 md:py-32" id="cases">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <p className="section-label">(03) Resultados</p>
          <h2 className="font-display text-2xl md:text-3xl font-medium">
            Clínicas que implementaram{" "}
            <span className="text-nsm-green">nosso sistema</span>
          </h2>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {featuredCases.map((caseItem, index) => (
            <div key={index} className="card-dark p-8 md:p-10">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="md:w-1/3">
                  <div className="relative aspect-[9/16] rounded-xl overflow-hidden border border-white/[0.06]">
                    {activeVideos.has(caseItem.youtubeId) ? (
                      <div
                        ref={setContainerRef(caseItem.youtubeId)}
                        id={`yt-player-${caseItem.youtubeId}`}
                        className="w-full h-full"
                      />
                    ) : (
                      <button
                        onClick={() => startVideo(caseItem.youtubeId)}
                        className="relative w-full h-full group cursor-pointer"
                      >
                        <img
                          src={caseItem.thumbnail}
                          alt={caseItem.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition-colors">
                          <div className="w-16 h-16 rounded-full bg-nsm-green/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Play className="w-7 h-7 text-nsm-dark-1 ml-1" />
                          </div>
                        </div>
                      </button>
                    )}
                  </div>
                </div>

                <div className="md:w-2/3 space-y-5">
                  <Quote className="w-8 h-8 text-nsm-green/20" />

                  <div>
                    <h3 className="font-display text-xl font-semibold text-white">{caseItem.name}</h3>
                    <p className="text-white/40 text-sm font-body">{caseItem.specialty}</p>
                  </div>

                  <blockquote className="text-lg text-white/70 leading-relaxed font-body">
                    "{caseItem.quote}"
                  </blockquote>

                  <p className="text-white/40 text-sm font-body leading-relaxed">
                    Resultado alcançado:{" "}
                    <strong className="text-nsm-green">{caseItem.result}</strong>
                  </p>

                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-nsm-green/10 border border-nsm-green/20 rounded-full">
                    <span className="text-nsm-green text-sm font-semibold">{caseItem.metric}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CasesSection;
