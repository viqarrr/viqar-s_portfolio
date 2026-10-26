import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ExperienceSchema, type Experience } from '../../lib/schemas';
import { Input, Textarea } from './ui/Input';
import { Button } from './ui/Button';

interface ExperienceFormProps {
  experience?: (Experience & { id?: string }) | null;
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

interface FormValues extends Omit<Experience, 'tags'> {
  tags_input: string;
}

export default function ExperienceForm({
  experience,
  isOpen,
  onClose,
  onSaved,
}: ExperienceFormProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const defaultValues: Partial<FormValues> = {
    slug: '',
    kind: 'Full-time',
    tag: 'Engineering',
    period: '2023 - Present',
    title: 'Senior Software Engineer',
    org: 'Tech Studio',
    description: 'Spearheaded modern frontend architecture and high-performance applications.',
    tags_input: 'TypeScript, React, Astro, Next.js',
    sort_order: 10,
    status: 'draft',
  };

  const {
    register,
    handleSubmit,
    reset,
  } = useForm<FormValues>({
    defaultValues: experience
      ? {
          ...experience,
          tags_input: experience.tags.join(', '),
        }
      : defaultValues,
  });

  useEffect(() => {
    if (experience) {
      reset({
        ...experience,
        tags_input: experience.tags.join(', '),
      });
    } else {
      reset(defaultValues);
    }
    setServerError(null);
  }, [experience, isOpen, reset]);

  if (!isOpen) return null;

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    setServerError(null);

    const parsedTags = values.tags_input
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const data: Experience = {
      slug: values.slug,
      kind: values.kind,
      tag: values.tag,
      period: values.period,
      title: values.title,
      org: values.org,
      description: values.description,
      tags: parsedTags.length > 0 ? parsedTags : ['General'],
      sort_order: Number(values.sort_order),
      status: values.status,
    };

    const valResult = ExperienceSchema.safeParse(data);
    if (!valResult.success) {
      setServerError(valResult.error.errors.map((e) => e.message).join(', '));
      setSubmitting(false);
      return;
    }

    try {
      const isEdit = Boolean(experience?.id);
      const url = '/api/admin/experiences';
      const method = isEdit ? 'PUT' : 'POST';
      const body = isEdit ? { ...data, id: experience?.id } : data;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const json = await res.json();
      if (!res.ok) {
        setServerError(json.error || 'Failed to save experience');
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
            {experience?.id ? 'Edit Experience' : 'Create New Experience'}
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
              label="Role / Title"
              placeholder="e.g. Senior Frontend Engineer"
              {...register('title', { required: 'Title is required' })}
              required
            />
            <Input
              label="Slug"
              placeholder="e.g. senior-frontend-engineer"
              {...register('slug', { required: 'Slug is required' })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Organization / Company"
              placeholder="e.g. Google"
              {...register('org', { required: 'Organization is required' })}
              required
            />
            <Input
              label="Period / Duration"
              placeholder="e.g. 2022 - 2024"
              {...register('period', { required: 'Period is required' })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Kind"
              placeholder="e.g. Full-time / Lead"
              {...register('kind', { required: 'Kind is required' })}
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

          <Input
            label="Section Tag"
            placeholder="e.g. Experience / Milestone"
            {...register('tag', { required: 'Tag is required' })}
            required
          />

          <Textarea
            label="Description"
            rows={3}
            placeholder="Key achievements and scope of responsibilities..."
            {...register('description', { required: 'Description is required' })}
            required
          />

          <Input
            label="Tags (comma-separated)"
            placeholder="React, TypeScript, GSAP, Architecture"
            {...register('tags_input', { required: 'Tags are required' })}
            required
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" loading={submitting}>
              {experience?.id ? 'Save Changes' : 'Create Experience'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
