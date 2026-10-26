import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ProjectSchema, type Project } from '../../lib/schemas';
import { Input, Textarea } from './ui/Input';
import { Button } from './ui/Button';

interface ProjectFormProps {
  project?: (Project & { id?: string }) | null;
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export default function ProjectForm({
  project,
  isOpen,
  onClose,
  onSaved,
}: ProjectFormProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const defaultValues: Partial<Project> = {
    slug: '',
    name: '',
    tag: '',
    line: '',
    image_src: '',
    image_srcset: '',
    image_sizes: '(max-width: 767px) 100vw, 50vw',
    image_width: 800,
    image_height: 600,
    image_alt: '',
    image_bg: '#1e293b',
    sort_order: 10,
    status: 'draft',
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Project>({
    resolver: zodResolver(ProjectSchema),
    defaultValues: project || defaultValues,
  });

  useEffect(() => {
    if (project) {
      reset(project);
    } else {
      reset(defaultValues);
    }
    setServerError(null);
  }, [project, isOpen, reset]);

  if (!isOpen) return null;

  const onSubmit = async (data: Project) => {
    setSubmitting(true);
    setServerError(null);

    try {
      const isEdit = Boolean(project?.id);
      const url = '/api/admin/projects';
      const method = isEdit ? 'PUT' : 'POST';
      const body = isEdit ? { ...data, id: project?.id } : data;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const json = await res.json();
      if (!res.ok) {
        setServerError(json.error || 'Failed to save project');
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
      <div className="bg-[#18171f] rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 my-8 max-h-[90vh] overflow-y-auto admin-scrollbar">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
          <h3 className="text-xl font-heading font-extrabold text-white tracking-tight">
            {project?.id ? 'Edit Project' : 'Create New Project'}
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
              label="Name"
              placeholder="e.g. Fintech Mobile App"
              {...register('name')}
              error={errors.name?.message}
              required
            />
            <Input
              label="Slug"
              placeholder="e.g. fintech-app"
              {...register('slug')}
              error={errors.slug?.message}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Tag / Category"
              placeholder="e.g. Product Design · Mobile"
              {...register('tag')}
              error={errors.tag?.message}
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

          <Textarea
            label="Tagline / Line"
            rows={2}
            placeholder="A short punchy description of the project"
            {...register('line')}
            error={errors.line?.message}
            required
          />

          <div className="border-t border-white/[0.06] pt-5 space-y-4">
            <h4 className="text-xs font-semibold text-[#aaa7b4] uppercase tracking-wider">
              Media & Dimensions
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Image Source (URL or Path)"
                placeholder="/images/work/project-1.webp"
                {...register('image_src')}
                error={errors.image_src?.message}
                required
              />
              <Input
                label="Image Alt Text"
                placeholder="Screenshot of mobile dashboard"
                {...register('image_alt')}
                error={errors.image_alt?.message}
                required
              />
            </div>

            <Input
              label="Image Srcset"
              placeholder="/images/work/project-1.webp 800w, /images/work/project-1@2x.webp 1600w"
              {...register('image_srcset')}
              error={errors.image_srcset?.message}
              required
            />

            <div className="grid grid-cols-3 gap-3">
              <Input
                label="Width (px)"
                type="number"
                {...register('image_width', { valueAsNumber: true })}
                error={errors.image_width?.message}
                required
              />
              <Input
                label="Height (px)"
                type="number"
                {...register('image_height', { valueAsNumber: true })}
                error={errors.image_height?.message}
                required
              />
              <Input
                label="Card BG (#hex)"
                placeholder="#1e293b"
                {...register('image_bg')}
                error={errors.image_bg?.message}
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-5 border-t border-white/[0.06]">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" loading={submitting}>
              {project?.id ? 'Save Changes' : 'Create Project'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
