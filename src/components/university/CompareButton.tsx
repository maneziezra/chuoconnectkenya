'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Scale, Check, X, ArrowRight } from 'lucide-react';
const STORAGE_KEY = 'cck_compare_list';

interface Props {
  universityId: string;
  universityName: string;
  universityAbbrev: string;
  fullWidth?: boolean;
}

export default function CompareButton({ universityId, universityName, universityAbbrev, fullWidth }: Props) {
  const [compareList, setCompareList] = useState<{ id: string; name: string; abbrev: string }[]>([]);
  const isIn = compareList.some(u => u.id === universityId);
  const canAdd = compareList.length < 3;

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setCompareList(JSON.parse(stored));
    } catch {}
  }, []);

  const toggle = () => {
    setCompareList(prev => {
      const next = isIn
        ? prev.filter(u => u.id !== universityId)
        : canAdd
          ? [...prev, { id: universityId, name: universityName, abbrev: universityAbbrev }]
          : prev;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  if (isIn) {
    return (
      <div style={{ display: 'flex', flexDirection: fullWidth ? 'column' : 'row', gap: 8, width: fullWidth ? '100%' : undefined }}>
        <button
          onClick={toggle}
          className="btn btn-outline btn-sm"
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            borderColor: 'var(--gold-primary)', color: 'var(--gold-primary)',
            width: fullWidth ? '100%' : undefined, justifyContent: fullWidth ? 'center' : undefined,
          }}
        >
          <Check size={14} /> Added ({compareList.length}/3) <X size={12} />
        </button>
        <Link
          href={`/compare?ids=${compareList.map(u => u.id).join(',')}`}
          className="btn btn-gold btn-sm"
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            width: fullWidth ? '100%' : undefined, justifyContent: fullWidth ? 'center' : undefined,
            textDecoration: 'none',
          }}
        >
          Compare Now <ArrowRight size={13} />
        </Link>
      </div>
    );
  }

  return (
    <button
      onClick={toggle}
      disabled={!canAdd}
      className="btn btn-outline btn-sm"
      title={!canAdd ? 'Maximum 3 campuses' : 'Add to comparison'}
      style={{
        display: 'flex', alignItems: 'center', gap: 6,
        width: fullWidth ? '100%' : undefined, justifyContent: fullWidth ? 'center' : undefined,
        opacity: !canAdd ? 0.5 : 1,
      }}
    >
      <Scale size={14} />
      {fullWidth ? 'Add to Comparison' : 'Compare'}
    </button>
  );
}
