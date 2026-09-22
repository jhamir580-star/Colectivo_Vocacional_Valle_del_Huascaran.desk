import { useState, useRef, useEffect } from 'react';
import { 
  UserCheck, 
  GraduationCap, 
  MapPin, 
  Quote, 
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Building2
} from 'lucide-react';
import { ALLIES_DATA } from '../data/alliesData';
import { AllyInstitution } from '../types';
import { InstitutionLogo } from './InstitutionLogos';
import { StudentSocialLinks } from './SocialIcons';

export const AlliesSection = () => {
  // Default to first institution (UNI) as requested
  const [selectedAlly, setSelectedAlly] = useState<AllyInstitution>(ALLIES_DATA[0]);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  
  // Drag to scroll state for desktop mouse drag
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftPos, setScrollLeftPos] = useState(0);
  const [hasDragged, setHasDragged] = useState(false);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const tolerance = 6;
    setCanScrollLeft(el.scrollLeft > tolerance);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - tolerance);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll);
    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, []);

  const handleScroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = Math.max(el.clientWidth * 0.7, 240);
    el.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth'
    });
  };

  const handleSelectAlly = (ally: AllyInstitution, e: React.MouseEvent<HTMLButtonElement>) => {
    // If the user was dragging with mouse, prevent selection click
    if (hasDragged) {
      setHasDragged(false);
      return;
    }
    setSelectedAlly(ally);
    e.currentTarget.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest'
    });
  };

  // Mouse drag handlers for PC
  const onMouseDown = (e: React.MouseEvent) => {
    const el = scrollRef.current;
    if (!el) return;
    setIsMouseDown(true);
    setHasDragged(false);
    setStartX(e.pageX - el.offsetLeft);
    setScrollLeftPos(el.scrollLeft);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDown) return;
    const el = scrollRef.current;
    if (!el) return;
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startX);
    if (Math.abs(walk) > 5) {
      setHasDragged(true);
    }
    el.scrollLeft = scrollLeftPos - walk;
  };

  const onMouseUpOrLeave = () => {
    setIsMouseDown(false);
  };

  return (
    <section id="aliados" className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-xs font-semibold mb-3 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-teal-600" />
          Red Vocacional de Mentores y Estudiantes
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Instituciones Aliadas
        </h2>
        <p className="mt-2.5 text-sm sm:text-base text-slate-600">
          Jóvenes de las principales casas de estudio y formación del país unidos por la orientación de nuestra juventud.
        </p>
      </div>

      {/* Horizontal Carousel Controls */}
      <div className="flex items-center justify-between gap-3 mb-3 px-1 text-xs text-slate-500 font-medium">
        <div className="flex items-center gap-2">
          <Building2 className="w-3.5 h-3.5 text-teal-600" />
          <span className="text-slate-700 text-xs font-bold tracking-wide">
            Casas de Estudio y Formación
          </span>
          <span className="text-slate-400 text-[11px] font-normal">
            (7 instituciones)
          </span>
        </div>

        {/* Quick desktop/mobile navigation arrow buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => handleScroll('left')}
            disabled={!canScrollLeft}
            aria-label="Desplazar hacia la izquierda"
            className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-700 hover:text-teal-700 hover:border-teal-400 hover:bg-teal-50/50 shadow-2xs transition-all disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleScroll('right')}
            disabled={!canScrollRight}
            aria-label="Desplazar hacia la derecha"
            className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-700 hover:text-teal-700 hover:border-teal-400 hover:bg-teal-50/50 shadow-2xs transition-all disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Scrollable Slider Container */}
      <div className="relative mb-8 group">
        
        {/* Floating Left Arrow Button */}
        <button
          onClick={() => handleScroll('left')}
          disabled={!canScrollLeft}
          aria-label="Retroceder instituciones"
          className="absolute -left-2 sm:-left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/95 hover:bg-white text-slate-800 shadow-md border border-slate-200 flex items-center justify-center transition-all hover:scale-105 active:scale-95 disabled:opacity-0 disabled:pointer-events-none cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5 text-slate-700" />
        </button>

        {/* Floating Right Arrow Button */}
        <button
          onClick={() => handleScroll('right')}
          disabled={!canScrollRight}
          aria-label="Avanzar instituciones"
          className="absolute -right-2 sm:-right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/95 hover:bg-white text-slate-800 shadow-md border border-slate-200 flex items-center justify-center transition-all hover:scale-105 active:scale-95 disabled:opacity-0 disabled:pointer-events-none cursor-pointer"
        >
          <ChevronRight className="w-5 h-5 text-slate-700" />
        </button>

        {/* Edge gradient indicator fades */}
        <div 
          className={`pointer-events-none absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-slate-50 via-slate-50/60 to-transparent z-10 transition-opacity duration-200 ${
            canScrollLeft ? 'opacity-100' : 'opacity-0'
          }`} 
        />
        <div 
          className={`pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-slate-50 via-slate-50/60 to-transparent z-10 transition-opacity duration-200 ${
            canScrollRight ? 'opacity-100' : 'opacity-0'
          }`} 
        />

        {/* The Horizontal Track */}
        <div
          ref={scrollRef}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUpOrLeave}
          onMouseLeave={onMouseUpOrLeave}
          className={`flex items-stretch gap-3 overflow-x-auto py-2 px-1 snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
            isMouseDown ? 'cursor-grabbing select-none' : 'cursor-grab sm:cursor-auto'
          }`}
        >
          {ALLIES_DATA.map((ally, index) => {
            const isSelected = selectedAlly.id === ally.id;
            return (
              <button
                key={ally.id}
                onClick={(e) => handleSelectAlly(ally, e)}
                className={`w-[145px] sm:w-[165px] shrink-0 snap-start p-3 sm:p-3.5 rounded-2xl text-center transition-all flex flex-col items-center justify-between gap-2 border cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-b from-teal-50 via-white to-white border-teal-500 shadow-md ring-2 ring-teal-500/25 scale-[1.02]'
                    : 'bg-white border-slate-200 hover:border-teal-300 hover:bg-slate-50/80 shadow-xs'
                }`}
              >
                {/* Order pill & count */}
                <div className="w-full flex items-center justify-between">
                  <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-md ${
                    isSelected ? 'bg-teal-700 text-white' : 'bg-slate-100 text-slate-500'
                  }`}>
                    #{index + 1}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {ally.students.length} {ally.students.length === 1 ? 'miembro' : 'miembros'}
                  </span>
                </div>

                {/* Official Logo Badge */}
                <div className="transition-transform group-hover:scale-105 my-0.5">
                  <InstitutionLogo id={ally.id} className="w-12 h-12 sm:w-14 sm:h-14 drop-shadow-xs" />
                </div>

                {/* Institution Title */}
                <div className="w-full">
                  <span className={`block font-extrabold text-xs sm:text-sm tracking-tight leading-snug truncate ${
                    isSelected ? 'text-teal-950 font-black' : 'text-slate-800'
                  }`}>
                    {ally.shortName}
                  </span>
                  <span className="block text-[10px] text-slate-500 truncate mt-0.5 font-medium">
                    {ally.type.replace('Universidad ', 'Univ. ').replace('Instituto Superior ', 'Inst. ')}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Selection Details Card - immediately visible right underneath */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-200/50 p-5 sm:p-8 transition-all relative overflow-hidden">
        
        {/* Subtle accent bar at top */}
        <div 
          className="absolute top-0 left-0 right-0 h-1.5" 
          style={{ backgroundColor: selectedAlly.accentColor }}
        />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 pb-6 border-b border-slate-100">
          
          <div className="flex items-start gap-4">
            {/* Enlarged Official Logo */}
            <div className="shrink-0 pt-0.5">
              <InstitutionLogo id={selectedAlly.id} className="w-16 h-16 sm:w-20 sm:h-20 shadow-md" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span 
                  className="px-2.5 py-0.5 rounded-full text-xs font-bold text-white shadow-2xs"
                  style={{ backgroundColor: selectedAlly.accentColor }}
                >
                  {selectedAlly.type}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  Integrantes del Colectivo Vocacional Valle del Huascarán
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                {selectedAlly.fullName}
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-3xl leading-relaxed">
                {selectedAlly.summary}
              </p>
            </div>
          </div>

        </div>

        {/* Student Representatives List */}
        <div className="mt-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-teal-600" />
            <span>Estudiantes y Miembros de {selectedAlly.shortName} que Integran el Colectivo</span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedAlly.students.map((student, idx) => (
              <div 
                key={idx}
                className="bg-slate-50/90 hover:bg-slate-50 border border-slate-200/90 rounded-2xl p-4 sm:p-5 transition-all flex flex-col justify-between shadow-2xs hover:shadow-sm"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-11 h-11 rounded-full text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0"
                        style={{ backgroundColor: selectedAlly.accentColor }}
                      >
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <h5 className="font-extrabold text-slate-900 text-sm sm:text-base leading-snug">
                          {student.name}
                        </h5>
                        <div className="flex items-center gap-1.5 text-xs text-teal-800 font-semibold mt-0.5">
                          <GraduationCap className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                          <span>{student.career}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-white border border-slate-200 text-slate-700 shrink-0 uppercase tracking-wider">
                        {student.degreeType === 'universitaria' ? 'Universitario' : student.degreeType === 'tecnica' ? 'Técnico' : 'Castrense'}
                      </span>
                      <StudentSocialLinks 
                        facebook={student.facebook} 
                        instagram={student.instagram} 
                        memberName={student.name}
                      />
                    </div>
                  </div>

                  {student.campus && (
                    <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-2.5 ml-14">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>{student.campus}</span>
                    </div>
                  )}

                  {student.quote && (
                    <div className="mt-3.5 pt-3 border-t border-slate-200/70 relative">
                      <Quote className="w-3.5 h-3.5 text-teal-500/50 absolute left-0 top-3 -scale-x-100" />
                      <p className="text-xs text-slate-700 italic pl-5 leading-relaxed">
                        "{student.quote}"
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </section>
  );
};
