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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-6 my-8 max-h-[90vh] overflow-y-auto admin-scrollbar">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <h3 className="text-lg font-bold text-white">
            {project?.id ? 'Edit Project' : 'Create New Project'}
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

          <Textarea
            label="Tagline / Line"
            rows={2}
            placeholder="A short punchy description of the project"
            {...register('line')}
            error={errors.line?.message}
            required
          />

          <div className="border-t border-slate-800 pt-4 space-y-4">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
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

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <Button type="button" variant="ghost" onClick={onClose}>
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
