import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ContactLinkSchema, type ContactLink } from '../../lib/schemas';
import { Input, Textarea } from './ui/Input';
import { Button } from './ui/Button';

interface ContactFormProps {
  contactLink?: (ContactLink & { id?: string }) | null;
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export default function ContactForm({
  contactLink,
  isOpen,
  onClose,
  onSaved,
}: ContactFormProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const defaultValues: Partial<ContactLink> = {
    slug: '',
    label: '',
    href: '',
    description: '',
    icon_svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg>',
    external: true,
    sort_order: 10,
    status: 'draft',
  };

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<ContactLink>({
    resolver: zodResolver(ContactLinkSchema),
    defaultValues: contactLink || defaultValues,
  });

  const liveSvg = watch('icon_svg');

  useEffect(() => {
    if (contactLink) {
      reset(contactLink);
    } else {
      reset(defaultValues);
    }
    setServerError(null);
  }, [contactLink, isOpen, reset]);

  if (!isOpen) return null;

  const onSubmit = async (data: ContactLink) => {
    setSubmitting(true);
    setServerError(null);

    try {
      const isEdit = Boolean(contactLink?.id);
      const url = '/api/admin/contact';
      const method = isEdit ? 'PUT' : 'POST';
      const body = isEdit ? { ...data, id: contactLink?.id } : data;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const json = await res.json();
      if (!res.ok) {
        setServerError(json.error || 'Failed to save contact link');
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
            {contactLink?.id ? 'Edit Contact Link' : 'Create Contact Link'}
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
              label="Label"
              placeholder="e.g. GitHub / LinkedIn / Email"
              {...register('label')}
              error={errors.label?.message}
              required
            />
            <Input
              label="Slug"
              placeholder="e.g. github"
              {...register('slug')}
              error={errors.slug?.message}
              required
            />
          </div>

          <Input
            label="URL / Href"
            placeholder="https://github.com/..."
            {...register('href')}
            error={errors.href?.message}
            required
          />

          <Input
            label="Description / Handle"
            placeholder="e.g. @viqar"
            {...register('description')}
            error={errors.description?.message}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
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

            <div className="flex items-center gap-2 pt-5">
              <input
                type="checkbox"
                id="external"
                {...register('external')}
                className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="external" className="text-xs text-slate-300 font-medium">
                Open in new tab (external link)
              </label>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Icon SVG
              </label>
              <span className="text-xs text-slate-500">Vector graphic</span>
            </div>
            <Textarea
              rows={4}
              placeholder="<svg ...>...</svg>"
              {...register('icon_svg')}
              error={errors.icon_svg?.message}
              required
            />
          </div>

          {liveSvg && (
            <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700 flex items-center gap-3">
              <span className="text-xs text-slate-400 font-medium">SVG Preview:</span>
              <div
                className="w-6 h-6 flex items-center justify-center text-cyan-400"
                dangerouslySetInnerHTML={{ __html: liveSvg }}
              />
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" loading={submitting}>
              {contactLink?.id ? 'Save Changes' : 'Create Contact Link'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
