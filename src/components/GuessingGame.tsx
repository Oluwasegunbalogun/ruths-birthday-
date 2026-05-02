import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Section, FadeIn } from './ui/Layout';
import { Contribution } from '../lib/types';
import { toast } from 'sonner';
import { ArrowLeft, HelpCircle, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';

interface GuessingGameProps {
  contributions?: Contribution[];
  onComplete?: () => void;
}

export const GuessingGame: React.FC<GuessingGameProps> = ({ contributions = [], onComplete }) => {
  // Only use dynamic contributions from DB
  const allMessages = contributions.map(c => ({
    id: c.id,
    author: c.author_name || 'Someone special',
    text: c.message,
    hint: c.hint
  })).filter(m => m.text && m.hint);

  // State reset on every refresh (persistence removed)
  const [currentIndex, setCurrentIndex] = useState(0);
  const [guess, setGuess] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  // Handle completion state
  useEffect(() => {
    if (isFinished && onComplete) {
      onComplete();
    }
  }, [isFinished, onComplete]);

  if (allMessages.length === 0) {
    return (
      <Section className="bg-transparent">
        <FadeIn>
          <div className="text-center space-y-4 py-20">
            <HelpCircle className="mx-auto text-[#FF2D55]" size={64} />
            <h2 className="text-4xl font-bold text-white drop-shadow-md">Waiting for Messages</h2>
            <p className="text-white font-medium drop-shadow-sm">No messages have been added to the game yet.</p>
            <Button onClick={onComplete} className="rounded-full bg-[#FF2D55] text-white px-8 font-bold">Continue the Journey</Button>
          </div>
        </FadeIn>
      </Section>
    );
  }

  const currentMessage = allMessages[currentIndex] || allMessages[0];

  const handleGuess = () => {
    if (revealed) return;
    if (!guess.trim()) {
      toast.error('Please type a guess!');
      return;
    }

    const author = currentMessage.author.toLowerCase().trim();
    const userGuess = guess.toLowerCase().trim();
    
    if (userGuess === author || (author.includes(userGuess) && userGuess.length > 3)) {
      setIsCorrect(true);
      setScore(prev => prev + 1);
      toast.success('Correct! You know them so well! 💖');
      setTimeout(() => {
        nextQuestion();
      }, 2000);
    } else {
      setIsCorrect(false);
      const newWrongCount = wrongGuesses + 1;
      setWrongGuesses(newWrongCount);
      
      if (newWrongCount >= 3) {
        toast.error('3 wrong guesses. The answer is being revealed...');
        setTimeout(() => {
          setRevealed(true);
          setIsCorrect(null);
        }, 1000);
      } else {
        toast.error(`Not quite! ${3 - newWrongCount} attempts left. 🤔`);
        setTimeout(() => setIsCorrect(null), 1000);
      }
    }
  };

  const nextQuestion = () => {
    if (currentIndex < allMessages.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setGuess('');
      setIsCorrect(null);
      setWrongGuesses(0);
      setRevealed(false);
    } else {
      setIsFinished(true);
      if (onComplete) onComplete();
    }
  };

  const prevQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setGuess('');
      setIsCorrect(null);
      setWrongGuesses(0);
      setRevealed(false);
    }
  };

  if (isFinished) {
    return (
      <Section className="bg-transparent">
        <FadeIn>
          <div className="text-center space-y-8 py-20">
            <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto text-green-500 border border-green-500/30">
               <motion.div
                 initial={{ scale: 0 }}
                 animate={{ scale: 1 }}
                 transition={{ type: "spring", damping: 10 }}
                 className="text-4xl"
               >
                 🏆
               </motion.div>
            </div>
            <div className="space-y-4">
              <h2 className="text-5xl md:text-6xl font-black text-white drop-shadow-lg">Game Master!</h2>
              <p className="text-2xl font-bold text-white/90 drop-shadow-md">You correctly guessed {score} out of {allMessages.length} messages!</p>
            </div>
            <div className="pt-8">
               <p className="text-[#FF2D55] animate-bounce font-black text-xl drop-shadow-lg">Scroll down to see the full messages 💖</p>
            </div>
          </div>
        </FadeIn>
      </Section>
    );
  }

  return (
    <Section className="bg-transparent">
      <FadeIn>
        <div className="space-y-4 mb-12">
          <h2 className="text-5xl md:text-7xl font-black text-white text-center tracking-tight drop-shadow-lg">
            Who wrote this?
          </h2>
          <div className="flex items-center justify-center gap-4">
            <span className="h-[2px] w-12 bg-[#FF2D55]" />
            <p className="text-white uppercase tracking-[0.4em] text-sm font-black drop-shadow-sm">
              The Guessing Game
            </p>
            <span className="h-[2px] w-12 bg-[#FF2D55]" />
          </div>
        </div>
      </FadeIn>

      <div className="max-w-2xl w-full mx-auto px-4 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className={`p-10 md:p-14 rounded-[48px] border backdrop-blur-md transition-all duration-500 shadow-2xl ${
              isCorrect === true ? 'border-green-400 bg-green-500/20 ring-4 ring-green-100/20' :
              isCorrect === false ? 'border-red-400 animate-shake bg-red-500/20' :
              revealed ? 'border-amber-400 bg-amber-500/20' :
              'border-white/20 bg-black/40'
            }`}
          >
            <div className="mb-8 flex justify-between items-start">
               <span className="text-xs font-black text-[#FF2D55] uppercase tracking-[0.2em] drop-shadow-sm">Message</span>
               {wrongGuesses > 0 && !revealed && !isCorrect && (
                 <div className="flex items-center gap-1 text-red-500 text-xs font-black uppercase tracking-wider drop-shadow-md">
                   <AlertCircle size={14} />
                   <span>{3 - wrongGuesses} attempts left</span>
                 </div>
               )}
            </div>
            
            <p className="text-3xl md:text-4xl font-bold italic mb-12 leading-relaxed text-white drop-shadow-lg">
              "{currentMessage.text}"
            </p>

            <div className="space-y-8">
              {revealed ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-8 bg-amber-500/20 border border-amber-500/30 rounded-3xl text-center space-y-6 shadow-xl"
                >
                  <div className="flex justify-center">
                    <div className="w-16 h-16 bg-amber-500/30 rounded-full flex items-center justify-center text-amber-500">
                      <HelpCircle size={32} />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-black text-amber-500 uppercase tracking-[0.2em] drop-shadow-sm">The Mystery Author was</span>
                    <h3 className="text-4xl font-black text-white drop-shadow-md">{currentMessage.author}</h3>
                  </div>
                  <Button 
                    onClick={nextQuestion}
                    className="rounded-full bg-amber-500 hover:bg-amber-600 text-white px-8 py-6 h-auto text-xl font-bold border-none shadow-lg shadow-amber-500/40"
                  >
                    Next Message
                  </Button>
                </motion.div>
              ) : (
                <>
                  <div className="p-6 bg-white/10 rounded-3xl border border-white/10 space-y-2 shadow-inner">
                    <span className="text-xs font-black text-[#FF2D55] uppercase tracking-[0.2em] drop-shadow-sm">The Hint</span>
                    <p className="text-white text-xl font-bold leading-relaxed drop-shadow-md">{currentMessage.hint}</p>
                  </div>

                  <div className="space-y-6">
                    <div className="flex flex-col md:flex-row gap-4">
                      <input
                        type="text"
                        value={guess}
                        onChange={(e) => setGuess(e.target.value)}
                        placeholder="Who do you think it is?"
                        className="flex-1 px-8 py-5 rounded-full border border-white/20 bg-black/40 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#FF2D55] text-xl font-bold transition-all shadow-xl"
                        onKeyDown={(e) => e.key === 'Enter' && handleGuess()}
                      />
                      <button
                        onClick={handleGuess}
                        className="px-10 py-5 bg-[#FF2D55] text-white rounded-full font-black text-lg shadow-xl shadow-[#FF2D55]/40 hover:bg-[#E6294D] active:scale-95 transition-all border-none"
                      >
                        Check
                      </button>
                    </div>
                    
                    <div className="flex justify-center gap-4">
                      <Button
                        variant="ghost"
                        onClick={prevQuestion}
                        disabled={currentIndex === 0}
                        className="text-white hover:text-[#FF2D55] gap-2 font-black disabled:opacity-0 transition-opacity drop-shadow-md"
                      >
                        <ArrowLeft size={16} />
                        <span>Previous</span>
                      </Button>
                      
                      {wrongGuesses > 0 && (
                        <Button
                          variant="ghost"
                          onClick={() => {
                            if(confirm("Reveal the answer? This won't count towards your score.")) {
                              setRevealed(true);
                            }
                          }}
                          className="text-white/60 hover:text-amber-500 gap-2 font-black text-xs uppercase tracking-[0.2em] drop-shadow-md"
                        >
                          I'm stuck
                        </Button>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="mt-12 flex items-center justify-between px-6 text-white font-black">
          <div className="flex items-center gap-3">
            <span className="text-[#FF2D55] uppercase text-xs tracking-widest font-black drop-shadow-sm">Progress</span>
            <div className="flex gap-1.5">
               {allMessages.map((_, i) => (
                 <div key={i} className={`w-2 h-2 rounded-full shadow-sm ${i === currentIndex ? 'bg-[#FF2D55] scale-125' : i < currentIndex ? 'bg-[#FF2D55]/60' : 'bg-white/20'}`} />
               ))}
            </div>
            <span className="text-white text-sm drop-shadow-sm">{currentIndex + 1} / {allMessages.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#FF2D55] uppercase text-xs tracking-widest font-black drop-shadow-sm">Score</span>
            <span className="text-white text-lg font-black drop-shadow-md">{score} pts</span>
          </div>
        </div>
      </div>
    </Section>
  );
};