import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Section, FadeIn } from './ui/Layout';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { toast } from 'sonner';
import { Heart, Plus, X, Image as ImageIcon, Video, Loader2, Trash2 } from 'lucide-react';
import { supabase, uploadMedia } from '../lib/supabase';
import { MediaItem } from '../lib/types';
import { formatFileSize } from '../lib/utils';

export const SubmissionForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    message: '',
    memory: '',
    hint: '',
  });
  const [mediaItems, setMediaItems] = useState<LocalMedia[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  interface LocalMedia {
    file: File;
    preview: string;
    type: 'image' | 'video';
    size: number;
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newMedia: LocalMedia[] = [];
    
    files.forEach(file => {
      if (file.size > 50 * 1024 * 1024) {
        toast.error(`${file.name} is too large (>50MB). Please select a smaller file.`);
        return;
      }
      const type = file.type.startsWith('image/') ? 'image' : file.type.startsWith('video/') ? 'video' : null;
      if (!type) {
        toast.error(`${file.name} is not a supported format.`);
        return;
      };
      
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.message || !formData.hint) {
      toast.error('Please fill in the message and a hint!');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const uploadedMedia: MediaItem[] = [];
      
      // Robust media upload with progress feedback
      for (let i = 0; i < mediaItems.length; i++) {
        const item = mediaItems[i];
        setUploadProgress(`Uploading ${item.type} ${i + 1}/${mediaItems.length}...`);
        try {
          const publicUrl = await uploadMedia(item.file);
          uploadedMedia.push({ url: publicUrl, type: item.type });
        } catch (uploadError: any) {
          throw new Error(`Media upload failed: ${uploadError.message}`);
        }
      }

      setUploadProgress('Sending your message...');
      const { error } = await supabase
        .from('contributions')
        .insert([{
          message: formData.message,
          memory: formData.memory,
          author_name: formData.name,
          hint: formData.hint,
          media: uploadedMedia
        }]);

      if (error) throw error;

      setAlreadySubmitted(true);
      
      toast.success('Thank you! Your message has been added to the story. ❤️');
      setFormData({ name: '', message: '', memory: '', hint: '' });
      setMediaItems([]);
    } catch (err: any) {
      console.error('Submission error:', err);
      toast.error(err.message || 'Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
      setUploadProgress('');
    }
  };

  if (alreadySubmitted) {
    return (
      <Section className="bg-white text-center">
        <div className="flex justify-center mb-6">
           <Heart className="text-[#FF2D55]" fill="#FF2D55" size={40} />
        </div>
        <h2 className="text-4xl md:text-5xl font-light text-[#1D1D1F] mb-4">
          Thank You! ❤️
        </h2>
        <p className="text-[#1D1D1F]/50 max-w-lg mx-auto">
          Your message has been received. Ruth is going to be so happy!
        </p>
      </Section>
    );
  }

  return (
    <Section className="bg-white">
      <FadeIn>
        <div className="flex justify-center mb-6">
          <Heart className="text-[#FF2D55]" fill="#FF2D55" size={40} />
        </div>
        <h2 className="text-4xl md:text-5xl font-light text-[#1D1D1F] mb-4 text-center">
          Leave a Note
        </h2>
        <p className="text-center text-[#1D1D1F]/50 mb-12 max-w-lg mx-auto">
          Let us make Ruth's day unforgettable. Share a memory or a message that reminds you of her.
        </p>
      </FadeIn>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="w-full max-w-xl space-y-6 bg-[#FFF6F9]/50 p-8 md:p-12 rounded-[32px] border border-[#FF2D55]/10"
      >
        <div className="space-y-2">
          <Label htmlFor="name" className="text-xs uppercase tracking-widest text-[#FF2D55]">Your Name (Optional)</Label>
          <Input
            id="name"
            placeholder="How she knows you..."
            className="rounded-xl border-[#FF2D55]/10 focus:border-[#FF2D55] bg-white"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="message" className="text-xs uppercase tracking-widest text-[#FF2D55]">Your Message *</Label>
          <Textarea
            id="message"
            placeholder="Write something beautiful..."
            className="rounded-xl border-[#FF2D55]/10 focus:border-[#FF2D55] bg-white min-h-[120px]"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="memory" className="text-xs uppercase tracking-widest text-[#FF2D55]">A Shared Memory</Label>
          <Input
            id="memory"
            placeholder="That time we..."
            className="rounded-xl border-[#FF2D55]/10 focus:border-[#FF2D55] bg-white"
            value={formData.memory}
            onChange={(e) => setFormData({ ...formData, memory: e.target.value })}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
             <Label className="text-xs uppercase tracking-widest text-[#FF2D55]">Add Photos or Videos</Label>
             {mediaItems.length > 0 && (
               <button 
                 type="button" 
                 onClick={clearAllMedia}
                 className="text-[10px] uppercase tracking-tighter text-[#FF2D55]/60 hover:text-[#FF2D55] transition-colors flex items-center gap-1"
               >
                 <Trash2 size={10} /> Clear All
               </button>
             )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {mediaItems.map((item, idx) => (
              <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-[#FF2D55]/10 group bg-black/5 shadow-sm">
                {item.type === 'image' ? (
                  <img src={item.preview} className="w-full h-full object-cover" alt="" />
                ) : (
                  <video src={item.preview} className="w-full h-full object-cover" />
                )}
                
                {/* Removal UI - Always visible on mobile/hover */}
                <div className="absolute inset-x-0 bottom-0 bg-black/40 backdrop-blur-sm p-1.5 flex items-center justify-between opacity-100 group-hover:bg-black/60 transition-colors">
                   <span className="text-[9px] text-white/90 font-medium truncate max-w-[50%]">
                     {formatFileSize(item.size)}
                   </span>
                   <button 
                    type="button"
                    onClick={() => removeMedia(idx)}
                    className="p-1.5 bg-[#FF2D55] text-white rounded-lg hover:bg-[#E6294D] transition-colors shadow-sm active:scale-95"
                    title="Remove file"
                  >
                    <X size={12} strokeWidth={3} />
                  </button>
                </div>
              </div>
            ))}
            
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="aspect-square border-2 border-dashed border-[#FF2D55]/20 rounded-xl flex flex-col items-center justify-center gap-1 hover:bg-[#FF2D55]/5 hover:border-[#FF2D55]/40 transition-all group active:scale-95"
            >
              <div className="p-2 bg-[#FF2D55]/5 rounded-full group-hover:bg-[#FF2D55]/10 transition-colors">
                <Plus size={20} className="text-[#FF2D55]" />
              </div>
              <span className="text-[10px] font-medium text-[#FF2D55]/70">Add File</span>
            </button>
          </div>
          
          <p className="text-[10px] text-[#1D1D1F]/40 italic mt-2">
            Max 50MB per file. Images and videos only. 📸
          </p>

          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            multiple 
            accept="image/*,video/*" 
            onChange={handleFileChange} 
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="hint" className="text-xs uppercase tracking-widest text-[#FF2D55]">Hint for the Game *</Label>
          <Input
            id="hint"
            placeholder="Something only you two know..."
            className="rounded-xl border-[#FF2D55]/10 focus:border-[#FF2D55] bg-white"
            value={formData.hint}
            onChange={(e) => setFormData({ ...formData, hint: e.target.value })}
          />
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-6 rounded-full bg-[#FF2D55] hover:bg-[#E6294D] text-white text-lg font-medium shadow-lg shadow-[#FF2D55]/20 flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              <span>{uploadProgress || 'Sending...'}</span>
            </>
          ) : 'Send with Love'}
        </Button>
      </motion.form>
    </Section>
  );
};