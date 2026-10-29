import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SiteSettingsSchema, type SiteSettings } from '../../lib/schemas';
import { Input, Textarea } from './ui/Input';
import { Button } from './ui/Button';

interface SettingsFormProps {
  initialSettings: SiteSettings;
}

export default function SettingsForm({ initialSettings }: SettingsFormProps) {
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SiteSettings>({
    resolver: zodResolver(SiteSettingsSchema),
    defaultValues: initialSettings,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'statement_lines' as never,
  });

  const onSubmit = async (data: SiteSettings) => {
    setSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const json = await res.json();
      if (!res.ok) {
        setErrorMsg(json.error || 'Failed to update settings');
      } else {
        setSuccessMsg('Settings saved successfully!');
        setTimeout(() => setSuccessMsg(null), 4000);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error while saving settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-4xl pb-12">
      {successMsg && (
        <div className="p-4 bg-emerald-500/10 text-emerald-300 rounded-2xl text-sm flex items-center justify-between transition-all">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>{successMsg}</span>
          </div>
          <button
            type="button"
            onClick={() => setSuccessMsg(null)}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-emerald-400 hover:text-white hover:bg-emerald-500/20 active:scale-95 transition-all"
          >
            &times;
          </button>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-rose-500/10 text-rose-300 rounded-2xl text-sm flex items-center justify-between transition-all">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-400"></span>
            <span>{errorMsg}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorMsg(null)}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-rose-400 hover:text-white hover:bg-rose-500/20 active:scale-95 transition-all"
          >
            &times;
          </button>
        </div>
      )}

      {/* General & SEO */}
      <div className="p-6 md:p-8 bg-[#1f1d26] rounded-[28px] space-y-6 shadow-xl border border-white/[0.04]">
        <h2 className="text-lg font-heading font-extrabold text-white pb-3 border-b border-white/[0.06] flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-[#f6db00]"></span>
          General & Metadata
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input
            label="Site Title"
            {...register('site_title')}
            error={errors.site_title?.message}
            required
          />
          <Input
            label="Brand Name"
            {...register('brand_name')}
            error={errors.brand_name?.message}
            required
          />
          <div className="md:col-span-2">
            <Textarea
              label="Meta Description"
              rows={2}
              {...register('meta_description')}
              error={errors.meta_description?.message}
              required
            />
          </div>
          <Input
            label="OG Title"
            {...register('og_title')}
            error={errors.og_title?.message}
            required
          />
          <Input
            label="OG Image URL"
            {...register('og_image')}
            error={errors.og_image?.message}
            required
          />
          <div className="md:col-span-2">
            <Textarea
              label="OG Description"
              rows={2}
              {...register('og_description')}
              error={errors.og_description?.message}
              required
            />
          </div>
        </div>
      </div>

      {/* Contact & Social Links */}
      <div className="p-6 md:p-8 bg-[#1f1d26] rounded-[28px] space-y-6 shadow-xl border border-white/[0.04]">
        <h2 className="text-lg font-heading font-extrabold text-white pb-3 border-b border-white/[0.06] flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-[#f6db00]"></span>
          Contact & Social Links
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input
            label="Contact Email"
            type="email"
            placeholder="viqar@example.com"
            {...register('email')}
            error={errors.email?.message}
          />
          <Input
            label="Contact / Booking URL (Optional)"
            placeholder="https://cal.com/viqar or mailto:viqar@example.com"
            {...register('contact_url')}
            error={errors.contact_url?.message}
          />
          <Input
            label="GitHub Profile URL"
            placeholder="https://github.com/username"
            {...register('github_url')}
            error={errors.github_url?.message}
          />
          <Input
            label="LinkedIn Profile URL"
            placeholder="https://linkedin.com/in/username"
            {...register('linkedin_url')}
            error={errors.linkedin_url?.message}
          />
          <div className="md:col-span-2">
            <Input
              label="Instagram Profile URL (Optional)"
              placeholder="https://instagram.com/username"
              {...register('instagram_url')}
              error={errors.instagram_url?.message}
            />
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="p-6 md:p-8 bg-[#1f1d26] rounded-[28px] space-y-6 shadow-xl border border-white/[0.04]">
        <h2 className="text-lg font-heading font-extrabold text-white pb-3 border-b border-white/[0.06] flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-[#f6db00]"></span>
          Hero Section
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input
            label="Hero Lead Text"
            {...register('hero_lead')}
            error={errors.hero_lead?.message}
            required
          />
          <Input
            label="Hero Highlight Word"
            {...register('hero_word')}
            error={errors.hero_word?.message}
            required
          />
        </div>
      </div>

      {/* Statement Section */}
      <div className="p-6 md:p-8 bg-[#1f1d26] rounded-[28px] space-y-6 shadow-xl border border-white/[0.04]">
        <h2 className="text-lg font-heading font-extrabold text-white pb-3 border-b border-white/[0.06] flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-[#f6db00]"></span>
          Statement Section
        </h2>
        <div className="space-y-5">
          <Input
            label="Statement Lead"
            {...register('statement_lead')}
            error={errors.statement_lead?.message}
            required
          />

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-xs font-semibold text-[#aaa7b4] uppercase tracking-wider">
                Statement Lines ({fields.length})
              </label>
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={() => append('New statement line' as never)}
              >
                + Add Line
              </Button>
            </div>
            {errors.statement_lines && (
              <p className="text-xs text-rose-400 mb-2 font-medium">
                {errors.statement_lines.message}
              </p>
            )}
            <div className="space-y-3">
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-3">
                  <span className="text-xs font-mono text-[#5d5a67] w-6 text-right select-none">
                    {index + 1}.
                  </span>
                  <input
                    className="flex-1 px-4 py-2.5 bg-white/[0.04] focus:bg-white/[0.07] text-white rounded-[14px] text-sm outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-[#f6db00] transition-all min-h-[44px]"
                    {...register(`statement_lines.${index}` as const)}
                  />
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center text-[#aaa7b4] hover:text-rose-400 hover:bg-rose-500/10 active:scale-[0.98] transition-all"
                    title="Remove line"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Section Leads */}
      <div className="p-6 md:p-8 bg-[#1f1d26] rounded-[28px] space-y-6 shadow-xl border border-white/[0.04]">
        <h2 className="text-lg font-heading font-extrabold text-white pb-3 border-b border-white/[0.06] flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-[#f6db00]"></span>
          Section Lead Texts
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input
            label="Work Section Lead"
            {...register('work_lead')}
            error={errors.work_lead?.message}
            required
          />
          <Input
            label="Again Section Lead"
            {...register('again_lead')}
            error={errors.again_lead?.message}
            required
          />
          <Input
            label="Capabilities Lead"
            {...register('capabilities_lead')}
            error={errors.capabilities_lead?.message}
            required
          />
          <Input
            label="Method Section Lead"
            {...register('method_lead')}
            error={errors.method_lead?.message}
            required
          />
          <div className="md:col-span-2">
            <Input
              label="Contact Section Lead"
              {...register('contact_lead')}
              error={errors.contact_lead?.message}
              required
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="submit" loading={saving} size="lg">
          Save Settings
        </Button>
      </div>
    </form>
  );
}
