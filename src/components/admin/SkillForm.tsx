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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-6 my-8 max-h-[90vh] overflow-y-auto admin-scrollbar">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <h3 className="text-lg font-bold text-white">
            {skill?.id ? 'Edit Skill' : 'Create New Skill'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white text-xl font-bold p-1"
          >
            &times;
          </button>
        </div>

        {serverError && (
          <div className="p-3.5 bg-red-950/80 border border-red-800 text-red-300 rounded-lg text-xs">
            {serverError}
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
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Status
              </label>
              <select
                {...register('status')}
                className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Logo SVG
              </label>
              <span className="text-xs text-slate-500">Raw SVG string</span>
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
            <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700 flex items-center gap-3">
              <span className="text-xs text-slate-400 font-medium">SVG Preview:</span>
              <div
                className="w-8 h-8 flex items-center justify-center text-blue-400"
                dangerouslySetInnerHTML={{ __html: liveSvg }}
              />
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <Button type="button" variant="ghost" onClick={onClose}>
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
