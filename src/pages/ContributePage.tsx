import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Heart, ArrowRight, ArrowLeft, X, CheckCircle2, Video, Image as ImageIcon, Plus, Info, Loader2, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';
import { supabase, uploadMedia } from '../lib/supabase';
import { MediaItem } from '../lib/types';
import { formatFileSize } from '../lib/utils';

const STEPS = [
  'Welcome',
  'Message',
  'Memory',
  'Media',
  'Identity',
  'Confirmation'
];

interface LocalMedia {
  file: File;
  preview: string;
  type: 'image' | 'video';
  size: number;
}

export const ContributePage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    message: '',
    memory: '',
    authorName: '',
    hint: '',
  });

  const [mediaItems, setMediaItems] = useState<LocalMedia[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.title = "Ruth's Birthday Story | Contribute";
  }, []);

  const nextStep = () => {
    if (currentStep === 1 && !formData.message.trim()) {
      toast.error('Please write a message first ❤️');
      return;
    }
    if (currentStep === 4 && !formData.hint.trim()) {
       toast.error('A hint is needed for the guessing game! 🕵️‍♀️');
       return;
    }
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleBackNavigation = (e: React.MouseEvent) => {
    if (currentStep > 0) {
      e.preventDefault();
      prevStep();
    } else {
      navigate('/');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newMedia: LocalMedia[] = [];
    
    files.forEach(file => {
      // Increase limit to 50MB but warn about mobile stability
      if (file.size > 50 * 1024 * 1024) {
        toast.error(`${file.name} is too large! Please keep files under 50MB.`);
        return;
      }
      
      const type = file.type.startsWith('image/') ? 'image' : file.type.startsWith('video/') ? 'video' : null;
      if (!type) {
        toast.error(`${file.name} is not a supported image or video format.`);
        return;
      }

      newMedia.push({
        file,
        type,
        size: file.size,
        preview: URL.createObjectURL(file)
      });
    });

    setMediaItems(prev => [...prev, ...newMedia]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeMedia = (index: number) => {
    setMediaItems(prev => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].preview);
      updated.splice(index, 1);
      return updated;
    });
  };

  const clearAllMedia = () => {
    mediaItems.forEach(item => URL.revokeObjectURL(item.preview));
    setMediaItems([]);
  };

  const handleSubmit = async () => {
    if (!formData.message.trim()) {
      toast.error('Please write a message! ❤️');
      setCurrentStep(1);
      return;
    }
    if (!formData.hint.trim()) {
      toast.error('A hint is needed for the game! 🕵️‍♀️');
      return;
    }

    setIsSubmitting(true);
    try {
      const uploadedMedia: MediaItem[] = [];

      for (let i = 0; i < mediaItems.length; i++) {
        const item = mediaItems[i];
        const msg = `Uploading ${item.type} ${i + 1} of ${mediaItems.length}...`;
        setUploadProgress(msg);
        
        try {
          const publicUrl = await uploadMedia(item.file);
          uploadedMedia.push({
            url: publicUrl,
            type: item.type
          });
        } catch (uploadError: any) {
          console.error('File upload failed:', uploadError);
          throw new Error(`Failed to upload ${item.file.name}: ${uploadError.message}. Please try a smaller file or a different connection.`);
        }
      }

      setUploadProgress('Finalizing your submission...');
      const { error: insertError } = await supabase
        .from('contributions')
        .insert([{
          message: formData.message,
          memory: formData.memory,
          media: uploadedMedia,
          author_name: formData.authorName,
          hint: formData.hint,
        }]);

      if (insertError) {
        console.error('Insert error:', insertError);
        throw new Error(`Database submission failed: ${insertError.message}`);
      }

      toast.success('Your message has been added! ❤️');
      setCurrentStep(5); // Move to confirmation
    } catch (error: any) {
      console.error('Submission error:', error);
      toast.error(error.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
      setUploadProgress('');
    }
  };

  const variants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  return (
    <div className="min-h-screen bg-[#FFF6F9]/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 overflow-hidden relative">
      <div className="absolute top-8 left-8 z-20">
        <button 
          onClick={handleBackNavigation}
          className="text-[#1D1D1F]/40 hover:text-[#FF2D55] transition-colors flex items-center gap-2 font-light cursor-pointer"
        >
          <ArrowLeft size={18} />
          <span>Back</span>
        </button>
      </div>

      <div className="absolute top-0 left-0 w-full h-1 bg-[#FF2D55]/5">
        <motion.div 
          className="h-full bg-[#FF2D55]"
          initial={{ width: 0 }}
          animate={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      <div className="max-w-xl w-full">
        <AnimatePresence mode="wait">
          {currentStep === 0 && (
            <motion.div key="step0" {...variants} className="text-center space-y-8">
              <div className="flex justify-center">
                <div className="w-20 h-20 bg-[#FF2D55]/10 rounded-full flex items-center justify-center">
                  <Heart className="text-[#FF2D55]" fill="#FF2D55" size={40} />
                </div>
              </div>
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-light text-[#1D1D1F] leading-tight">
                  Let us make Ruth's day <span className="text-[#FF2D55]">unforgettable</span> ❤️
                </h1>
                <p className="text-[#1D1D1F]/50 text-lg font-light">
                  Your words and memories will be part of a beautiful cinematic experience created just for her.
                </p>
              </div>
              <Button 
                onClick={nextStep}
                className="px-12 py-7 rounded-full bg-[#FF2D55] hover:bg-[#E6294D] text-white text-xl font-light shadow-xl shadow-[#FF2D55]/20"
              >
                Start
              </Button>
            </motion.div>
          )}

          {currentStep === 1 && (
            <motion.div key="step1" {...variants} className="space-y-8 w-full">
              <div className="space-y-2">
                <span className="text-[#FF2D55] font-light tracking-[0.2em] uppercase text-xs">Step 01 / 05</span>
                <h2 className="text-3xl md:text-4xl font-light text-[#1D1D1F]">Write something beautiful</h2>
              </div>
              <Textarea 
                placeholder="Write your heart out..."
                className="min-h-[250px] text-xl font-light bg-white/50 border-none focus-visible:ring-1 focus-visible:ring-[#FF2D55]/20 rounded-[32px] p-8 shadow-inner"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
              <div className="flex justify-between items-center pt-4">
                <Button onClick={prevStep} variant="ghost" className="text-[#1D1D1F]/40 hover:text-[#FF2D55] font-light">Back</Button>
                <Button onClick={nextStep} className="rounded-full h-14 w-14 bg-[#FF2D55] hover:bg-[#E6294D] p-0 shadow-lg">
                  <ArrowRight size={24} />
                </Button>
              </div>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div key="step2" {...variants} className="space-y-8 w-full">
              <div className="space-y-2">
                <span className="text-[#FF2D55] font-light tracking-[0.2em] uppercase text-xs">Step 02 / 05</span>
                <h2 className="text-3xl md:text-4xl font-light text-[#1D1D1F]">What's your favorite memory with her?</h2>
              </div>
              <Textarea 
                placeholder="That time when we..."
                className="min-h-[150px] text-lg font-light bg-white/50 border-none focus-visible:ring-1 focus-visible:ring-[#FF2D55]/20 rounded-[32px] p-8 shadow-inner"
                value={formData.memory}
                onChange={(e) => setFormData({ ...formData, memory: e.target.value })}
              />
              <div className="flex justify-between pt-4">
                <Button onClick={prevStep} variant="ghost" className="text-[#1D1D1F]/40 hover:text-[#FF2D55] font-light">Back</Button>
                <Button onClick={nextStep} className="rounded-full h-14 w-14 bg-[#FF2D55] hover:bg-[#E6294D] p-0 shadow-lg">
                  <ArrowRight size={24} />
                </Button>
              </div>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div key="step3" {...variants} className="space-y-8 w-full">
              <div className="space-y-2">
                <span className="text-[#FF2D55] font-light tracking-[0.2em] uppercase text-xs">Step 03 / 05</span>
                <h2 className="text-3xl md:text-4xl font-light text-[#1D1D1F]">Share some visual moments</h2>
              </div>
              
              <div className="bg-[#FF2D55]/5 border border-[#FF2D55]/10 p-6 rounded-3xl flex items-start gap-4 mb-6">
                <Info className="text-[#FF2D55] shrink-0 mt-1" size={20} />
                <div className="space-y-2">
                  <p className="text-[#1D1D1F]/70 text-sm font-light leading-relaxed">
                    To make her day extra special, please upload a photo or video of yourself with Ruth, or a photo of yourself.
                  </p>
                  <p className="text-[#FF2D55]/70 text-[10px] font-medium">
                    Tip: For best results on mobile, choose high-quality photos. Videos should be under 50MB.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between mb-2 px-1">
                 <p className="text-xs font-light text-[#1D1D1F]/40">
                   {mediaItems.length} {mediaItems.length === 1 ? 'file' : 'files'} selected
                 </p>
                 {mediaItems.length > 0 && (
                   <button 
                    onClick={clearAllMedia}
                    className="text-[10px] uppercase tracking-tighter text-[#FF2D55]/60 hover:text-[#FF2D55] flex items-center gap-1"
                   >
                     <Trash2 size={10} /> Clear all
                   </button>
                 )}
              </div>

              <div className="grid grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {mediaItems.map((item, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative aspect-square rounded-2xl overflow-hidden shadow-sm group bg-black/5"
                  >
                    {item.type === 'image' ? (
                      <img src={item.preview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <video src={item.preview} className="w-full h-full object-cover" />
                    )}
                    
                    <div className="absolute inset-x-0 bottom-0 bg-black/40 backdrop-blur-md p-2 flex items-center justify-between">
                       <div className="flex flex-col">
                         <div className="flex items-center gap-1 text-[8px] text-white/70 uppercase tracking-tighter">
                           {item.type === 'image' ? <ImageIcon size={8} /> : <Video size={8} />}
                           {item.type}
                         </div>
                         <span className="text-[10px] text-white font-medium">{formatFileSize(item.size)}</span>
                       </div>
                       <button 
                        onClick={() => removeMedia(idx)}
                        className="w-8 h-8 bg-[#FF2D55] text-white rounded-xl flex items-center justify-center shadow-lg active:scale-90 transition-transform"
                      >
                        <X size={16} strokeWidth={3} />
                      </button>
                    </div>
                  </motion.div>
                ))}
                
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square border-2 border-dashed border-[#FF2D55]/10 rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-[#FF2D55]/5 hover:border-[#FF2D55]/30 transition-all active:scale-95"
                >
                  <div className="w-12 h-12 bg-[#FF2D55]/5 rounded-full flex items-center justify-center">
                    <Plus className="text-[#FF2D55]" size={24} />
                  </div>
                  <span className="text-xs font-light text-[#1D1D1F]/40">Add Media</span>
                </button>
              </div>

              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                multiple
                accept="image/*,video/*"
                onChange={handleFileChange}
              />

              <div className="flex justify-between pt-4">
                <Button onClick={prevStep} variant="ghost" className="text-[#1D1D1F]/40 hover:text-[#FF2D55] font-light">Back</Button>
                <Button onClick={nextStep} className="rounded-full h-14 w-14 bg-[#FF2D55] hover:bg-[#E6294D] p-0 shadow-lg">
                  <ArrowRight size={24} />
                </Button>
              </div>
            </motion.div>
          )}

          {currentStep === 4 && (
            <motion.div key="step4" {...variants} className="space-y-10 w-full">
              <div className="space-y-2 text-center">
                <span className="text-[#FF2D55] font-light tracking-[0.2em] uppercase text-xs">Step 04 / 05</span>
                <h2 className="text-3xl md:text-4xl font-light text-[#1D1D1F]">Who are you?</h2>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-widest text-[#FF2D55]/60 ml-4">Your Name (Optional)</Label>
                  <Input 
                    placeholder="e.g. Bestie for Life"
                    className="h-16 px-8 text-lg font-light bg-white/50 border-none focus-visible:ring-1 focus-visible:ring-[#FF2D55]/20 rounded-full shadow-inner"
                    value={formData.authorName}
                    onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-widest text-[#FF2D55]/60 ml-4">A Hint (Important! 🕵️‍♀️)</Label>
                  <Input 
                    placeholder="Something only you two know..."
                    className="h-16 px-8 text-lg font-light bg-white/50 border-none focus-visible:ring-1 focus-visible:ring-[#FF2D55]/20 rounded-full shadow-inner"
                    value={formData.hint}
                    onChange={(e) => setFormData({ ...formData, hint: e.target.value })}
                  />
                  <p className="text-[#1D1D1F]/30 text-[10px] ml-4 italic">This will be used for her guessing game!</p>
                </div>
              </div>

              <div className="flex flex-col gap-4 pt-4">
                <Button 
                  onClick={handleSubmit} 
                  disabled={isSubmitting}
                  className="w-full py-7 rounded-full bg-[#FF2D55] hover:bg-[#E6294D] text-white text-xl font-light shadow-xl shadow-[#FF2D55]/20 disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      <span>{uploadProgress || 'Sending love...'}</span>
                    </>
                  ) : 'Complete & Send 💌'}
                </Button>
                <Button onClick={prevStep} variant="ghost" className="text-[#1D1D1F]/40 hover:text-[#FF2D55] font-light">Wait, let me check something</Button>
              </div>
            </motion.div>
          )}

          {currentStep === 5 && (
            <motion.div key="step5" {...variants} className="text-center space-y-8">
              <div className="flex justify-center">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 10, stiffness: 100 }}
                  className="w-24 h-24 bg-[#FF2D55]/10 rounded-full flex items-center justify-center text-[#FF2D55]"
                >
                  <CheckCircle2 size={48} />
                </motion.div>
              </div>
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-light text-[#1D1D1F] leading-tight">
                  Your message is now part of <span className="text-[#FF2D55]">her story</span> ❤️
                </h1>
                <p className="text-[#1D1D1F]/50 text-lg font-light">
                  Thank you for adding your magic to her day. She's going to love this.
                </p>
              </div>
              <Button 
                onClick={() => navigate('/')}
                className="px-12 py-7 rounded-full bg-[#1D1D1F] hover:bg-black text-white text-xl font-light shadow-xl"
              >
                Back to Home
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};