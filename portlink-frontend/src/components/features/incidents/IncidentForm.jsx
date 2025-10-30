import React, { useState } from 'react';
import { Button, Input, Select } from '../../ui';
import { useTranslation } from '../../../i18n/LanguageProvider';

const INCIDENT_TYPES = ['ShipDelay', 'Weather', 'CraneDown', 'BerthMaintenance'];

export default function IncidentForm({ onSubmit, assets = [], visits = [], submitting }) {
  const t = useTranslation();
  const [formState, setFormState] = useState({
    type: 'ShipDelay',
    assetId: '',
    visitId: '',
    delayMinutes: 60,
    reason: '',
  });

  const resetForm = () => {
    setFormState({ type: 'ShipDelay', assetId: '', visitId: '', delayMinutes: 60, reason: '' });
  };

  const handleChange = (field) => (event) => {
    const value = field === 'delayMinutes' ? Number(event.target.value) : event.target.value;
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!formState.type) return;
    onSubmit?.({
      type: formState.type,
      affected: {
        assetId: formState.assetId ? Number(formState.assetId) : undefined,
        visitId: formState.visitId ? Number(formState.visitId) : undefined,
      },
      delayMinutes: formState.delayMinutes,
      reason: formState.reason,
    });
    resetForm();
  };

  const typeOptions = INCIDENT_TYPES.map((key) => ({ value: key, label: t(`incident.typeOptions.${key}`) }));
  const assetOptions = assets.map((asset) => ({
    value: asset.assetId ?? asset.id,
    label: asset.name || asset.assetName || `${t('incident.affectedAsset')} ${asset.assetId ?? asset.id}`,
  }));
  const visitOptions = visits.map((visit) => ({
    value: visit.visitId ?? visit.id,
    label: visit.shipName || visit.name || `Visit ${visit.visitId ?? visit.id}`,
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Select label={t('incident.type')} value={formState.type} onChange={handleChange('type')} options={typeOptions} required />
      <Select
        label={t('incident.affectedAsset')}
        value={formState.assetId}
        onChange={handleChange('assetId')}
        options={assetOptions}
        allowEmpty
      />
      <Select
        label={t('incident.affectedVisit')}
        value={formState.visitId}
        onChange={handleChange('visitId')}
        options={visitOptions}
        allowEmpty
        placeholder="--"
      />
      <div>
        <label className="block text-sm font-medium text-gray-700">{t('incident.delayMinutes')}</label>
        <div className="mt-2 flex items-center gap-3">
          <input
            type="range"
            min="0"
            max="240"
            step="15"
            value={formState.delayMinutes}
            onChange={handleChange('delayMinutes')}
            className="w-full"
          />
          <Input
            type="number"
            value={formState.delayMinutes}
            onChange={handleChange('delayMinutes')}
            min="0"
            max="480"
            className="w-24"
          />
        </div>
        <span className="mt-1 block text-xs text-gray-500">{t('incident.delayHelper')}</span>
      </div>
      <label className="block text-sm font-medium text-gray-700">
        {t('incident.reason')}
        <textarea
          className="mt-1 block w-full rounded border border-gray-300 p-2 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
          rows="4"
          value={formState.reason}
          placeholder={t('incident.placeholderReason')}
          onChange={handleChange('reason')}
          required
        />
      </label>
      <div className="flex justify-end gap-2">
        <Button
          type="button"
          className="bg-gray-200 text-gray-800 hover:bg-gray-300"
          onClick={() => resetForm()}
        >
          {t('incident.cancel')}
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? t('auth.loggingIn') : t('incident.submit')}
        </Button>
      </div>
    </form>
  );
}
