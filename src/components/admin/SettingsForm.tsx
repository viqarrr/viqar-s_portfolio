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
        <div className="p-4 bg-emerald-950/80 border border-emerald-800 text-emerald-300 rounded-lg text-sm flex items-center justify-between">
          <span>{successMsg}</span>
          <button type="button" onClick={() => setSuccessMsg(null)} className="text-emerald-400 hover:text-emerald-200">
            &times;
          </button>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-red-950/80 border border-red-800 text-red-300 rounded-lg text-sm flex items-center justify-between">
          <span>{errorMsg}</span>
          <button type="button" onClick={() => setErrorMsg(null)} className="text-red-400 hover:text-red-200">
            &times;
          </button>
        </div>
      )}

      {/* General & SEO */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
        <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500"></span>
          General & Metadata
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

      {/* Hero Section */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
        <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-purple-500"></span>
          Hero Section
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
        <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          Statement Section
        </h2>
        <div className="space-y-4">
          <Input
            label="Statement Lead"
            {...register('statement_lead')}
            error={errors.statement_lead?.message}
            required
          />

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
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
              <p className="text-xs text-red-400 mb-2 font-medium">
                {errors.statement_lines.message}
              </p>
            )}
            <div className="space-y-2">
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-500 w-6 text-right">
                    {index + 1}.
                  </span>
                  <input
                    className="flex-1 px-3.5 py-2 bg-slate-800/90 border border-slate-700 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
                    {...register(`statement_lines.${index}` as const)}
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => remove(index)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-950/40"
                    title="Remove line"
                  >
                    &times;
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Section Leads */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
        <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-500"></span>
          Section Lead Texts
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
