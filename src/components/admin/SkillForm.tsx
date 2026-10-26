import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SkillSchema, type Skill } from '../../lib/schemas';
import { Input, Textarea } from './ui/Input';
import { Button } from './ui/Button';

interface SkillFormProps {
  skill?: (Skill & { id?: string }) | null;
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export default function SkillForm({
  skill,
  isOpen,
  onClose,
  onSaved,
}: SkillFormProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const defaultValues: Partial<Skill> = {
    slug: '',
    name: '',
    category: 'Frontend',
    card_bg: '#1e293b',
    logo_svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg>',
    sort_order: 10,
    status: 'draft',
  };

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<Skill>({
    resolver: zodResolver(SkillSchema),
    defaultValues: skill || defaultValues,
  });

  const liveSvg = watch('logo_svg');

  useEffect(() => {
    if (skill) {
      reset(skill);
    } else {
      reset(defaultValues);
    }
    setServerError(null);
  }, [skill, isOpen, reset]);

  if (!isOpen) return null;

  const onSubmit = async (data: Skill) => {
    setSubmitting(true);
    setServerError(null);

    try {
      const isEdit = Boolean(skill?.id);
      const url = '/api/admin/skills';
      const method = isEdit ? 'PUT' : 'POST';
      const body = isEdit ? { ...data, id: skill?.id } : data;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const json = await res.json();
      if (!res.ok) {
        setServerError(json.error || 'Failed to save skill');
      } else {
        onSaved();
        onClose();
      }
    } catch (err: any) {
      setServerError(err.message || 'Network error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#18171f] rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6 my-8 max-h-[90vh] overflow-y-auto admin-scrollbar">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
          <h3 className="text-xl font-heading font-extrabold text-white tracking-tight">
            {skill?.id ? 'Edit Skill' : 'Create New Skill'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center text-[#aaa7b4] hover:text-white hover:bg-white/[0.06] active:scale-[0.98] transition-all"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {serverError && (
          <div className="p-4 bg-rose-500/10 text-rose-300 rounded-2xl text-xs font-medium flex items-center justify-between">
            <span>{serverError}</span>
            <button
              type="button"
              onClick={() => setServerError(null)}
              className="text-rose-400 hover:text-white"
            >
              &times;
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Skill Name"
              placeholder="e.g. React"
              {...register('name')}
              error={errors.name?.message}
              required
            />
            <Input
              label="Slug"
              placeholder="e.g. react"
              {...register('slug')}
              error={errors.slug?.message}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              label="Category"
              placeholder="Frontend"
              {...register('category')}
              error={errors.category?.message}
              required
            />
            <Input
              label="Card BG (#hex)"
              placeholder="#1e293b"
              {...register('card_bg')}
              error={errors.card_bg?.message}
              required
            />
            <div>
              <label className="block text-xs font-semibold text-[#aaa7b4] uppercase tracking-wider mb-2">
                Status
              </label>
              <select
                {...register('status')}
                className="w-full px-4 py-3 bg-white/[0.04] focus:bg-white/[0.07] text-white rounded-xl text-sm outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-[#6c3cff] min-h-[44px] transition-all"
              >
                <option value="draft" className="bg-[#18171f] text-white">Draft</option>
                <option value="published" className="bg-[#18171f] text-white">Published</option>
              </select>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-[#aaa7b4] uppercase tracking-wider">
                Logo SVG
              </label>
              <span className="text-xs text-[#5d5a67]">Raw SVG string</span>
            </div>
            <Textarea
              rows={4}
              placeholder="<svg ...>...</svg>"
              {...register('logo_svg')}
              error={errors.logo_svg?.message}
              required
            />
          </div>

          {liveSvg && (
            <div className="p-4 bg-white/[0.02] rounded-2xl flex items-center gap-4">
              <span className="text-xs text-[#aaa7b4] font-medium">SVG Preview:</span>
              <div
                className="w-9 h-9 flex items-center justify-center text-[#6c3cff]"
                dangerouslySetInnerHTML={{ __html: liveSvg }}
              />
            </div>
          )}

          <div className="flex justify-end gap-3 pt-5 border-t border-white/[0.06]">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" loading={submitting}>
              {skill?.id ? 'Save Changes' : 'Create Skill'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
