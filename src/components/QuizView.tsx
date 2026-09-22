import { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  RotateCcw, 
  Award, 
  Wrench, 
  GraduationCap, 
  DollarSign, 
  Check,
  TrendingUp, 
  Clock, 
  Users,
  Compass,
  Download,
  Loader2,
  ExternalLink,
  Info
} from 'lucide-react';
import { QUIZ_QUESTIONS, VOCATIONAL_PROFILES } from '../data/quizData';
import { ProfileCategory, VocationalProfileResult } from '../types';
import { generateVocationalPdf } from '../utils/generatePdfReport';

interface QuizViewProps {
  onBackToHome: () => void;
  onExploreSalaries: () => void;
}

export const QuizView = ({ onBackToHome, onExploreSalaries }: QuizViewProps) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, ProfileCategory>>({});
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [resultProfile, setResultProfile] = useState<VocationalProfileResult | null>(null);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState<boolean>(false);

  // Scroll to top when step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep, isFinished]);

  const currentQuestion = QUIZ_QUESTIONS[currentStep];
  const progressPercent = Math.round(((currentStep + 1) / QUIZ_QUESTIONS.length) * 100);
  const totalQuestions = QUIZ_QUESTIONS.length;

  const handleSelectOption = (category: ProfileCategory) => {
    const updatedAnswers = {
      ...answers,
      [currentQuestion.id]: category
    };
    setAnswers(updatedAnswers);

    // If on last question, compute result
    if (currentStep + 1 >= totalQuestions) {
      calculateFinalResults(updatedAnswers);
    } else {
      // Auto-advance with small pleasant delay
      setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 220);
    }
  };

  const calculateFinalResults = (finalAnswers: Record<number, ProfileCategory>) => {
    const counts: Record<string, number> = {};
    Object.values(finalAnswers).forEach(cat => {
      counts[cat] = (counts[cat] || 0) + 1;
    });

    let topCategory: ProfileCategory = 'ingenieria_mineria';
    let maxCount = -1;

    for (const cat in counts) {
      if (counts[cat] > maxCount) {
        maxCount = counts[cat];
        topCategory = cat as ProfileCategory;
      }
    }

    const profile = VOCATIONAL_PROFILES[topCategory] || VOCATIONAL_PROFILES.ingenieria_mineria;
    setResultProfile(profile);
    setIsFinished(true);
  };

  const handleRestart = () => {
    setAnswers({});
    setCurrentStep(0);
    setIsFinished(false);
    setResultProfile(null);
  };

  const handleDownloadPdf = async () => {
    if (!resultProfile || isDownloadingPdf) return;
    try {
      setIsDownloadingPdf(true);
      await generateVocationalPdf(resultProfile);
    } catch (err) {
      console.error('Error generating PDF:', err);
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/60 pb-16">
      
      {/* Top Floating App Bar */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <button
            onClick={onBackToHome}
            className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors p-1.5 -ml-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al Portal</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-teal-800 bg-teal-50 border border-teal-200/80 px-2.5 py-1 rounded-full">
              Test Vocacional (15 Preguntas)
            </span>
          </div>
        </div>

        {/* Progress bar (only active during test) */}
        {!isFinished && (
          <div className="w-full bg-slate-100 h-1.5 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-teal-500 to-emerald-400 h-full transition-all duration-300 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        )}
      </div>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10">
        
        {!isFinished ? (
          /* ================================================================= */
          /* QUESTION CARD SCREEN                                              */
          /* ================================================================= */
          <div className="space-y-6">
            
            {/* Header / Counter */}
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-bold text-teal-700 uppercase tracking-wider flex items-center gap-1.5">
                <Compass className="w-4 h-4" />
                Pregunta {currentStep + 1} de {totalQuestions}
              </span>
              <span className="bg-slate-200/80 px-2.5 py-0.5 rounded-full font-medium text-slate-700">
                {progressPercent}% completado
              </span>
            </div>

            {/* Question Container Card */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-5 sm:p-8">
              
              {/* Context / Situation */}
              {currentQuestion.situation && (
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                  <span>Situación:</span>
                  <span className="text-slate-700 normal-case font-medium">{currentQuestion.situation}</span>
                </div>
              )}

              {/* Question Headline */}
              <h2 className="text-lg sm:text-2xl font-extrabold text-slate-900 leading-snug">
                {currentQuestion.question}
              </h2>

              {/* 4 Clickable Options */}
              <div className="mt-6 space-y-3">
                {currentQuestion.options.map((option, idx) => {
                  const isSelected = answers[currentQuestion.id] === option.category;
                  const letters = ['A', 'B', 'C', 'D'];

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(option.category)}
                      className={`w-full text-left p-4 sm:p-5 rounded-2xl border-2 transition-all flex items-start gap-3.5 cursor-pointer group ${
                        isSelected
                          ? 'border-teal-600 bg-teal-50/80 shadow-xs ring-2 ring-teal-500/20'
                          : 'border-slate-200 hover:border-teal-400 bg-white hover:bg-slate-50/70'
                      }`}
                    >
                      {/* Letter badge / check indicator */}
                      <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-teal-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 group-hover:bg-teal-100 group-hover:text-teal-800'
                      }`}>
                        {isSelected ? <Check className="w-4 h-4 stroke-[3]" /> : letters[idx]}
                      </span>

                      <div className="flex-1 pt-0.5">
                        <p className={`text-sm sm:text-base leading-relaxed ${
                          isSelected ? 'font-bold text-teal-950' : 'font-medium text-slate-800'
                        }`}>
                          {option.text}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

            </div>

            {/* Navigation Buttons: Previous & Skip */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
                disabled={currentStep === 0}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                  currentStep === 0 
                    ? 'opacity-0 pointer-events-none' 
                    : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
                }`}
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Pregunta Anterior</span>
              </button>

              {answers[currentQuestion.id] && (
                <button
                  onClick={() => {
                    if (currentStep + 1 < totalQuestions) {
                      setCurrentStep(prev => prev + 1);
                    } else {
                      calculateFinalResults(answers);
                    }
                  }}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-teal-700 hover:bg-teal-800 shadow-sm transition-all cursor-pointer"
                >
                  <span>{currentStep + 1 === totalQuestions ? 'Ver Resultados' : 'Siguiente'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>

          </div>
        ) : (
          /* ================================================================= */
          /* RESULTS SCREEN: EXACTLY WHAT THE USER REQUESTED                   */
          /* "mira esta es tu posibilidad de carrera tecnica y la otra carrera */
          /* universitaria con sueldos prom asi"                               */
          /* ================================================================= */
          resultProfile && (
            <div className="space-y-8 animate-fade-in">
              
              {/* Celebration Hero Badge */}
              <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl text-center border border-slate-800 relative overflow-hidden">
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold mb-3">
                  <Award className="w-4 h-4 text-emerald-400" />
                  ¡Diagnóstico Vocacional Completado!
                </div>

                <h2 className="text-xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white max-w-2xl mx-auto">
                  Mira, esta es tu posibilidad de carrera técnica y tu carrera universitaria
                </h2>

                <p className="mt-2 text-sm sm:text-base text-teal-200 font-semibold">
                  Área Vocacional: {resultProfile.title}
                </p>

                <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
                  {resultProfile.description}
                </p>
              </div>

              {/* ============================================================= */}
              {/* THE TWO MAIN MATCHES: TÉCNICA vs UNIVERSITARIA                */}
              {/* ============================================================= */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                
                {/* 1. POSIBILIDAD DE CARRERA TÉCNICA */}
                <div className="bg-white rounded-3xl border-2 border-teal-500/60 shadow-lg p-5 sm:p-7 flex flex-col justify-between relative overflow-hidden">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="inline-flex items-center gap-1.5 bg-teal-600 text-white text-[11px] font-extrabold uppercase px-3 py-1 rounded-full tracking-wider">
                      <Wrench className="w-3.5 h-3.5" />
                      <span>Ruta Técnica (3 años)</span>
                    </div>
                    {resultProfile.recommendedTechnical.rank && (
                      <span className="text-[10px] font-extrabold bg-teal-100 text-teal-900 border border-teal-300 px-2 py-0.5 rounded-full">
                        Puesto #{resultProfile.recommendedTechnical.rank} Nacional MTPE
                      </span>
                    )}
                  </div>

                  <div>
                    <div className="text-teal-800 font-extrabold text-xs uppercase tracking-wider mb-1">
                      Tu Posibilidad Técnica
                    </div>

                    <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-snug">
                      {resultProfile.recommendedTechnical.name}
                    </h3>

                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      {resultProfile.recommendedTechnical.description}
                    </p>

                    {/* Official Salary Box */}
                    <div className="mt-4 p-4 rounded-2xl bg-teal-50/80 border border-teal-200/70 space-y-2.5">
                      <div className="flex items-baseline justify-between">
                        <span className="text-xs font-bold text-teal-950">
                          Sueldo promedio (-30 años):
                        </span>
                        <span className="text-lg sm:text-xl font-black text-teal-800">
                          {resultProfile.recommendedTechnical.avgYoung}
                        </span>
                      </div>
                      
                      <div className="flex items-baseline justify-between text-xs text-teal-900/90 pt-1.5 border-t border-teal-200/50">
                        <span className="font-semibold">Proyección (+30 años):</span>
                        <span className="font-extrabold text-slate-900 text-sm">
                          {resultProfile.recommendedTechnical.avgAdult}
                        </span>
                      </div>

                      <div className="flex items-baseline justify-between text-[11px] pt-1.5 border-t border-teal-200/40 text-teal-800">
                        <span className="font-medium">Mínimo - Máximo (+30 años):</span>
                        <span className="font-bold text-slate-900">
                          {resultProfile.recommendedTechnical.rangeAdult || resultProfile.recommendedTechnical.rangeYoung}
                        </span>
                      </div>
                    </div>

                    {/* Key Institutions */}
                    <div className="mt-4">
                      <span className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5">
                        Institutos Sugeridos:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {resultProfile.recommendedTechnical.keyInstitutes.map((inst, i) => (
                          <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 font-semibold text-xs border border-slate-200">
                            {inst}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
                    <Clock className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <span>Rápida inserción laboral, independencia económica y alta demanda</span>
                  </div>
                </div>

                {/* 2. POSIBILIDAD DE CARRERA UNIVERSITARIA */}
                <div className="bg-white rounded-3xl border-2 border-blue-600/60 shadow-lg p-5 sm:p-7 flex flex-col justify-between relative overflow-hidden">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="inline-flex items-center gap-1.5 bg-blue-900 text-white text-[11px] font-extrabold uppercase px-3 py-1 rounded-full tracking-wider">
                      <GraduationCap className="w-3.5 h-3.5" />
                      <span>Ruta Universitaria (5 años)</span>
                    </div>
                    {resultProfile.recommendedUniversity.rank && (
                      <span className="text-[10px] font-extrabold bg-blue-100 text-blue-900 border border-blue-300 px-2 py-0.5 rounded-full">
                        Puesto #{resultProfile.recommendedUniversity.rank} Nacional MTPE
                      </span>
                    )}
                  </div>

                  <div>
                    <div className="text-blue-900 font-extrabold text-xs uppercase tracking-wider mb-1">
                      Tu Posibilidad Universitaria
                    </div>

                    <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-snug">
                      {resultProfile.recommendedUniversity.name}
                    </h3>

                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      {resultProfile.recommendedUniversity.description}
                    </p>

                    {/* Official Salary Box */}
                    <div className="mt-4 p-4 rounded-2xl bg-blue-50/80 border border-blue-200/70 space-y-2.5">
                      <div className="flex items-baseline justify-between">
                        <span className="text-xs font-bold text-blue-950">
                          Sueldo promedio (-30 años):
                        </span>
                        <span className="text-lg sm:text-xl font-black text-blue-900">
                          {resultProfile.recommendedUniversity.avgYoung}
                        </span>
                      </div>
                      
                      <div className="flex items-baseline justify-between text-xs text-blue-900/90 pt-1.5 border-t border-blue-200/50">
                        <span className="font-semibold">Proyección (+30 años):</span>
                        <span className="font-extrabold text-slate-900 text-sm">
                          {resultProfile.recommendedUniversity.avgAdult}
                        </span>
                      </div>

                      <div className="flex items-baseline justify-between text-[11px] pt-1.5 border-t border-blue-200/40 text-blue-800">
                        <span className="font-medium">Mínimo - Máximo (+30 años):</span>
                        <span className="font-bold text-slate-900">
                          {resultProfile.recommendedUniversity.rangeAdult || resultProfile.recommendedUniversity.rangeYoung}
                        </span>
                      </div>
                    </div>

                    {/* Key Universities */}
                    <div className="mt-4">
                      <span className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5">
                        Universidades Sugeridas:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {resultProfile.recommendedUniversity.keyUniversities.map((uni, i) => (
                          <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 font-semibold text-xs border border-slate-200">
                            {uni}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
                    <TrendingUp className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                    <span>Liderazgo estratégico, titulación profesional colegiada y posgrados</span>
                  </div>
                </div>

              </div>

              {/* Comparative Insight Notice */}
              <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 border border-slate-800 flex items-start gap-3 shadow-md">
                <Info className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm text-slate-300 space-y-1">
                  <p className="font-bold text-white">
                    Análisis Comparativo del Mercado Laboral (MTPE - Planilla Electrónica):
                  </p>
                  <p className="text-slate-400 leading-relaxed text-xs">
                    Ambas rutas son válidas y exitosas. Las carreras técnicas de 3 años permiten incorporarse de inmediato a operaciones de alta remuneración (minería, transporte e industria pesada). Por su parte, la carrera universitaria requiere mayor inversión de tiempo pero ofrece una curva de crecimiento exponencial para cargos de jefatura y gerencia hacia los 30+ años.
                  </p>
                </div>
              </div>

              {/* Skills & Talents Matrix */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 sm:p-7">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600" />
                  Competencias y Fortalezas Clave de tu Perfil
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {resultProfile.skills.map((skill, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs sm:text-sm text-slate-800 bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0" />
                      <span>{skill}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Student Mentors in our Collective with Real Clickable Social Media Links */}
              {resultProfile.allyContacts.length > 0 && (
                <div className="bg-gradient-to-r from-teal-50 via-slate-50 to-blue-50 rounded-3xl border border-teal-200/80 p-5 sm:p-7 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-teal-950 uppercase tracking-wider">
                      <Users className="w-4 h-4 text-teal-700" />
                      <span>Representantes en el Valle del Huascarán para tu Perfil</span>
                    </div>
                    <span className="text-[11px] text-teal-700 font-semibold">
                      ¡Contáctalos directamente para orientación vocacional!
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                    Estudiantes universitarios y técnicos de nuestro colectivo en Yungay, Huaraz y Lima que ya recorren este camino. Haz clic en sus redes sociales para hacerles preguntas:
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {resultProfile.allyContacts.map((contact, i) => (
                      <div key={i} className="bg-white rounded-2xl p-4 border border-teal-200/80 shadow-xs flex flex-col justify-between gap-3 hover:border-teal-400 transition-colors">
                        <div>
                          <div className="font-extrabold text-slate-900 text-sm">{contact.name}</div>
                          <div className="text-xs text-teal-700 font-semibold mt-0.5">{contact.career}</div>
                          <div className="text-[11px] text-slate-500 font-medium">{contact.institution}</div>
                        </div>

                        {/* Social Network Buttons Side-by-Side */}
                        <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">
                            Redes:
                          </span>

                          {contact.facebook && (
                            <a
                              href={contact.facebook}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1877F2] text-white text-xs font-bold hover:bg-[#166fe5] shadow-[0_2px_6px_rgba(24,119,242,0.35)] hover:shadow-[0_4px_12px_rgba(24,119,242,0.45)] ring-2 ring-blue-400/30 hover:ring-blue-400/60 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
                              title={`Abrir Facebook de ${contact.name}`}
                            >
                              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                              <span>Facebook</span>
                              <ExternalLink className="w-2.5 h-2.5 opacity-80" />
                            </a>
                          )}

                          {contact.instagram && (
                            <a
                              href={contact.instagram}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] text-white text-xs font-bold hover:opacity-95 shadow-[0_2px_6px_rgba(225,48,108,0.35)] hover:shadow-[0_4px_12px_rgba(225,48,108,0.45)] ring-2 ring-pink-400/30 hover:ring-pink-400/60 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
                              title={`Abrir Instagram de ${contact.name}`}
                            >
                              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                              <span>Instagram</span>
                              <ExternalLink className="w-2.5 h-2.5 opacity-80" />
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Bottom Action Controls: Descargar PDF prominente */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                
                {/* PROMINENT PDF DOWNLOAD BUTTON */}
                <button
                  onClick={handleDownloadPdf}
                  disabled={isDownloadingPdf}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full text-sm font-extrabold bg-gradient-to-r from-teal-700 via-teal-800 to-emerald-800 text-white hover:from-teal-600 hover:to-emerald-700 shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isDownloadingPdf ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-teal-300" />
                      <span>Generando PDF Oficial Huascarán...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 text-emerald-300" />
                      <span>Descargar mis Resultados en PDF</span>
                    </>
                  )}
                </button>

                <button
                  onClick={onExploreSalaries}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-full text-xs sm:text-sm font-bold bg-white text-slate-800 border border-slate-300 hover:bg-slate-50 transition-all cursor-pointer shadow-2xs"
                >
                  <DollarSign className="w-4 h-4 text-teal-700" />
                  <span>Explorar Todos los Sueldos Oficiales</span>
                </button>

                <button
                  onClick={handleRestart}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-full text-xs sm:text-sm font-bold text-teal-800 bg-teal-100/70 hover:bg-teal-100 transition-all cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reiniciar Test</span>
                </button>

              </div>

            </div>
          )
        )}

      </main>

    </div>
  );
};
