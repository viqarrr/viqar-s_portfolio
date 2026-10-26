import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CredentialSchema, type Credential } from '../../lib/schemas';
import { Input, Textarea } from './ui/Input';
import { Button } from './ui/Button';

interface CredentialFormProps {
  credential?: (Credential & { id?: string }) | null;
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export default function CredentialForm({
  credential,
  isOpen,
  onClose,
  onSaved,
}: CredentialFormProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const defaultValues: Partial<Credential> = {
    slug: '',
    kind: 'Award',
    level: 'International',
    year: '2024',
    scope_label: 'Global',
    scope_icon_svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"/></svg>',
    award: 'First Place',
    name: 'Hackathon Winner',
    issuer: 'Tech Conference',
    description: 'Awarded for extraordinary execution in design and engineering.',
    image_src: '/images/recognitions/award.webp',
    image_width: 800,
    image_height: 600,
    image_alt: 'Award Certificate',
    sort_order: 10,
    status: 'draft',
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Credential>({
    resolver: zodResolver(CredentialSchema),
    defaultValues: credential || defaultValues,
  });

  useEffect(() => {
    if (credential) {
      reset(credential);
    } else {
      reset(defaultValues);
    }
    setServerError(null);
  }, [credential, isOpen, reset]);

  if (!isOpen) return null;

  const onSubmit = async (data: Credential) => {
    setSubmitting(true);
    setServerError(null);

    try {
      const isEdit = Boolean(credential?.id);
      const url = '/api/admin/credentials';
      const method = isEdit ? 'PUT' : 'POST';
      const body = isEdit ? { ...data, id: credential?.id } : data;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const json = await res.json();
      if (!res.ok) {
        setServerError(json.error || 'Failed to save credential');
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
            {credential?.id ? 'Edit Credential' : 'Create New Credential'}
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
              label="Award / Honour Name"
              placeholder="e.g. Best Mobile UI"
              {...register('name')}
              error={errors.name?.message}
              required
            />
            <Input
              label="Slug"
              placeholder="e.g. best-mobile-ui"
              {...register('slug')}
              error={errors.slug?.message}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              label="Award Title"
              placeholder="e.g. Winner"
              {...register('award')}
              error={errors.award?.message}
              required
            />
            <Input
              label="Issuer / Organization"
              placeholder="e.g. Design Awards"
              {...register('issuer')}
              error={errors.issuer?.message}
              required
            />
            <Input
              label="Year"
              placeholder="2024"
              {...register('year')}
              error={errors.year?.message}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              label="Kind"
              placeholder="e.g. Award / Certificate"
              {...register('kind')}
              error={errors.kind?.message}
              required
            />
            <Input
              label="Level"
              placeholder="e.g. International"
              {...register('level')}
              error={errors.level?.message}
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
            label="Description"
            rows={2}
            placeholder="Brief recognition details..."
            {...register('description')}
            error={errors.description?.message}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Scope Label"
              placeholder="e.g. Global"
              {...register('scope_label')}
              error={errors.scope_label?.message}
              required
            />
            <Input
              label="Scope Icon SVG"
              placeholder="<svg ...>...</svg>"
              {...register('scope_icon_svg')}
              error={errors.scope_icon_svg?.message}
              required
            />
          </div>

          <div className="border-t border-slate-800 pt-4 space-y-4">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Certificate Image
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Image URL or Path"
                placeholder="/images/recognitions/cert.webp"
                {...register('image_src')}
                error={errors.image_src?.message}
                required
              />
              <Input
                label="Image Alt"
                placeholder="Certificate scan"
                {...register('image_alt')}
                error={errors.image_alt?.message}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
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
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" loading={submitting}>
              {credential?.id ? 'Save Changes' : 'Create Credential'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
