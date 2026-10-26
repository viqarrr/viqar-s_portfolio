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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#18171f] rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6 my-8 max-h-[90vh] overflow-y-auto admin-scrollbar">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
          <h3 className="text-xl font-heading font-extrabold text-white tracking-tight">
            {contactLink?.id ? 'Edit Contact Link' : 'Create Contact Link'}
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

            <div className="flex items-center gap-3 pt-5 min-h-[44px]">
              <input
                type="checkbox"
                id="external"
                {...register('external')}
                className="w-5 h-5 rounded-lg bg-white/[0.06] border-0 text-[#6c3cff] focus:ring-[#6c3cff] cursor-pointer"
              />
              <label htmlFor="external" className="text-xs text-[#aaa7b4] font-medium cursor-pointer select-none">
                Open in new tab (external link)
              </label>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-[#aaa7b4] uppercase tracking-wider">
                Icon SVG
              </label>
              <span className="text-xs text-[#5d5a67]">Vector graphic</span>
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
              {contactLink?.id ? 'Save Changes' : 'Create Contact Link'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
