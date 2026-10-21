'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { X, Send, CheckCircle2, Loader2, Phone, Mail } from 'lucide-react';
import { FINANCING_PREFERENCES } from '@/lib/types';
import type { FinancingPreference, LeadSource } from '@/lib/types';
import { FINANCING_LABELS, normalizeKenyanPhone } from '@/lib/utils/leads';
import { loadStudentSnapshot } from '@/lib/utils/studentSnapshot';

type Prefill = { clusterPoints?: number; meanGrade?: string; hefBand?: number };

interface ExpressInquiryModalProps {
  source: LeadSource;
  /** Fixed university. Omit and pass `universityOptions` to let the student choose. */
  universityId?: string;
  universityName?: string;
  universityOptions?: { id: string; name: string }[];
  courseOptions?: string[];
  defaultCourse?: string;
  /** Explicit KCSE result to attach; otherwise the last calculator result in this browser is used. */
  prefill?: Prefill;
  triggerLabel?: string;
  triggerClassName?: string;
  triggerStyle?: React.CSSProperties;
  /** Shown if online enquiries are unavailable, so the student is never left at a dead end. */
  fallbackContact?: { email?: string; phone?: string };
}

type Status = 'idle' | 'submitting' | 'success' | 'error';

interface FormState {
  studentName: string;
  phone: string;
  email: string;
  universityId: string;
  targetCourse: string;
  financingPreference: FinancingPreference;
  consent: boolean;
  includeResults: boolean;
  company: string; // honeypot
}

const EMPTY_FORM: FormState = {
  studentName: '',
  phone: '',
  email: '',
  universityId: '',
  targetCourse: '',
  financingPreference: 'undecided',
  consent: false,
  includeResults: true,
  company: '',
};

export default function ExpressInquiryModal({
  source,
  universityId,
  universityName,
  universityOptions,
  courseOptions,
  defaultCourse,
  prefill,
  triggerLabel = 'Request Admission Info',
  triggerClassName = 'btn btn-gold',
  triggerStyle,
  fallbackContact,
}: ExpressInquiryModalProps) {
  const uid = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [results, setResults] = useState<Prefill | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState('');
  const [notConfigured, setNotConfigured] = useState(false);

  const chooseUniversity = !universityId && !!universityOptions?.length;
  const selectedUniversityName =
    universityOptions?.find(u => u.id === form.universityId)?.name ?? universityName ?? 'the university';

  // Probe whether discrete display transition is actually supported (guards against Firefox bug 1882408)
  function canTransitionDisplay(): boolean {
    if (typeof window === 'undefined' || !window.CSS?.supports?.('transition-behavior', 'allow-discrete') || !document.body) {
      return false;
    }
    const probe = document.createElement('div');
    probe.style.cssText = 'transition: display 1s allow-discrete !important; display: block;';
    document.body.appendChild(probe);
    getComputedStyle(probe).display;
    probe.style.display = 'none';
    const supported = getComputedStyle(probe).display === 'block';
    probe.remove();
    return supported;
  }

  function supportsTopLayerExit(): boolean {
    return typeof window !== 'undefined' && Boolean(window.CSS?.supports?.('overlay', 'auto')) && canTransitionDisplay();
  }

  async function requestCloseDialog() {
    const dialog = dialogRef.current;
    if (!dialog || !dialog.open) {
      setOpen(false);
      return;
    }
    if (!supportsTopLayerExit()) {
      dialog.setAttribute('data-closing', '');
      const animations = dialog.getAnimations({ subtree: true });
      if (animations.length > 0) {
        await Promise.race([
          Promise.allSettled(animations.map(a => a.finished)),
          new Promise(r => setTimeout(r, 2000)),
        ]);
      }
      if (!dialog.hasAttribute('data-closing')) return;
      dialog.removeAttribute('data-closing');
    }
    dialog.close();
    setOpen(false);
  }

  // Open/close the native <dialog> and wire `cancel` + light-dismiss fallback (`light-dismiss-a-dialog` & `animate-to-from-top-layer`)
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleCancel = (event: Event) => {
      event.preventDefault();
      void requestCloseDialog();
    };

    const handleBackdropClick = (event: MouseEvent) => {
      if ('closedBy' in HTMLDialogElement.prototype) return;
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      const isDialogContent =
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width;
      if (isDialogContent) return;
      void requestCloseDialog();
    };

    dialog.addEventListener('cancel', handleCancel);
    dialog.addEventListener('click', handleBackdropClick);
    return () => {
      dialog.removeEventListener('cancel', handleCancel);
      dialog.removeEventListener('click', handleBackdropClick);
    };
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.removeAttribute('data-closing');
      dialog.showModal();
      requestAnimationFrame(() => nameRef.current?.focus());
    } else if (!open && dialog.open) {
      void requestCloseDialog();
    }
  }, [open]);

  function handleOpen() {
    let resolved: Prefill | null = null;
    if (prefill && (prefill.clusterPoints !== undefined || prefill.meanGrade)) {
      resolved = prefill;
    } else {
      const snap = loadStudentSnapshot();
      if (snap) {
        resolved = { clusterPoints: snap.bestClusterScore, meanGrade: snap.meanGrade, hefBand: snap.hefBand };
      }
    }
    setResults(resolved);
    setForm({
      ...EMPTY_FORM,
      universityId: universityId ?? universityOptions?.[0]?.id ?? '',
      targetCourse: defaultCourse ?? '',
      includeResults: !!resolved,
    });
    setStatus('idle');
    setFieldErrors({});
    setServerError('');
    setNotConfigured(false);
    setOpen(true);
  }

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm(prev => ({ ...prev, [key]: value }));
    if (fieldErrors[key]) setFieldErrors(prev => ({ ...prev, [key]: '' }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === 'submitting') return;

    const errs: Record<string, string> = {};
    if (form.studentName.trim().length < 2) errs.studentName = 'Enter your full name.';
    if (!normalizeKenyanPhone(form.phone)) errs.phone = 'Enter a valid Kenyan mobile number, e.g. 0712 345 678.';
    if (!form.universityId) errs.universityId = 'Please choose a university.';
    if (!form.consent) errs.consent = 'Please tick the box to agree to share your details.';
    setFieldErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setStatus('submitting');
    setServerError('');
    setNotConfigured(false);

    const attach = form.includeResults && results;
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          universityId: form.universityId,
          studentName: form.studentName,
          phone: form.phone,
          email: form.email,
          targetCourse: form.targetCourse,
          financingPreference: form.financingPreference,
          clusterPoints: attach ? results.clusterPoints : undefined,
          meanGrade: attach ? results.meanGrade : undefined,
          hefBand: attach ? results.hefBand : undefined,
          source,
          consent: form.consent,
          company: form.company,
        }),
      });
      const data: { error?: string; fieldErrors?: Record<string, string>; code?: string } = await res
        .json()
        .catch(() => ({}));

      if (res.ok) {
        setStatus('success');
        return;
      }
      setFieldErrors(data.fieldErrors ?? {});
      setServerError(data.error ?? 'Something went wrong. Please try again.');
      setNotConfigured(data.code === 'not_configured');
      setStatus('error');
    } catch {
      setServerError('Network problem. Check your connection and try again.');
      setStatus('error');
    }
  }

  const id = (name: string) => `${uid}-${name}`;
  const err = (name: string) => fieldErrors[name];
  const describe = (name: string) => (err(name) ? id(`${name}-err`) : undefined);
  const submitting = status === 'submitting';

  return (
    <>
      <button type="button" className={triggerClassName} style={triggerStyle} onClick={handleOpen}>
        <Send size={16} aria-hidden="true" /> {triggerLabel}
      </button>

      <dialog
        ref={dialogRef}
        className="chuo-enquiry"
        aria-labelledby={id('title')}
        onClose={() => setOpen(false)}
        {...({ closedby: 'any' } as any)}
      >
        <div style={{ padding: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, marginBottom: 6 }}>
            <h2 id={id('title')} style={{ fontFamily: 'var(--font-sans)', fontSize: '1.35rem', fontWeight: 700, letterSpacing: '-0.025em', margin: 0, color: 'var(--text-primary)' }}>
              {status === 'success' ? 'Enquiry sent' : `Request admission info${chooseUniversity ? '' : ` — ${selectedUniversityName}`}`}
            </h2>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => void requestCloseDialog()} aria-label="Close">
              <X size={18} aria-hidden="true" />
            </button>
          </div>

          {status === 'success' ? (
            <div role="status" style={{ textAlign: 'center', padding: '24px 0 8px' }}>
              <CheckCircle2 size={48} style={{ color: 'var(--success-text)', margin: '0 auto 12px' }} aria-hidden="true" />
              <p style={{ color: 'var(--text-primary)', fontWeight: 600, marginBottom: 8 }}>
                Your details were shared with {selectedUniversityName}.
              </p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: 20 }}>
                Their admissions team can now contact you on the phone number you gave. This is an enquiry, not an application:
                complete your official placement through KUCCPS or the university&apos;s own portal.
              </p>
              <button type="button" className="btn btn-navy" onClick={() => void requestCloseDialog()}>Done</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: 18 }}>
                Ask for the prospectus, fee structure or an admissions call. It takes under a minute.
              </p>

              {(serverError || err('_form')) && (
                <div role="alert" style={{ padding: '12px 14px', borderRadius: 10, marginBottom: 16, fontSize: '0.88rem',
                  background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.4)', color: 'var(--text-primary)' }}>
                  {serverError || err('_form')}
                  {notConfigured && (fallbackContact?.email || fallbackContact?.phone) && (
                    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 10 }}>
                      {fallbackContact.phone && (
                        <a href={`tel:${fallbackContact.phone}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 600 }}>
                          <Phone size={14} aria-hidden="true" /> {fallbackContact.phone}
                        </a>
                      )}
                      {fallbackContact.email && (
                        <a href={`mailto:${fallbackContact.email}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 600 }}>
                          <Mail size={14} aria-hidden="true" /> {fallbackContact.email}
                        </a>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Honeypot: hidden from people and assistive tech; bots fill it. */}
              <div aria-hidden="true" style={{ position: 'absolute', left: -9999, width: 1, height: 1, overflow: 'hidden' }}>
                <label htmlFor={id('company')}>Company</label>
                <input id={id('company')} name="company" tabIndex={-1} autoComplete="off"
                  value={form.company} onChange={e => set('company', e.target.value)} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {chooseUniversity && (
                  <div className="form-group">
                    <label className="form-label" htmlFor={id('uni')}>University *</label>
                    <select id={id('uni')} className="form-select" value={form.universityId}
                      onChange={e => set('universityId', e.target.value)}
                      aria-invalid={!!err('universityId')} aria-describedby={describe('universityId')}>
                      {universityOptions!.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                    </select>
                    {err('universityId') && <p id={id('universityId-err')} role="alert" style={errStyle}>{err('universityId')}</p>}
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label" htmlFor={id('name')}>Full name *</label>
                  <input ref={nameRef} id={id('name')} className="form-input" autoComplete="name" value={form.studentName}
                    onChange={e => set('studentName', e.target.value)} maxLength={80}
                    aria-invalid={!!err('studentName')} aria-describedby={describe('studentName')} />
                  {err('studentName') && <p id={id('studentName-err')} role="alert" style={errStyle}>{err('studentName')}</p>}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor={id('phone')}>Phone / WhatsApp *</label>
                  <input id={id('phone')} className="form-input" type="tel" inputMode="tel" autoComplete="tel"
                    placeholder="0712 345 678" value={form.phone} onChange={e => set('phone', e.target.value)}
                    aria-invalid={!!err('phone')} aria-describedby={describe('phone')} />
                  {err('phone') && <p id={id('phone-err')} role="alert" style={errStyle}>{err('phone')}</p>}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor={id('email')}>Email (optional)</label>
                  <input id={id('email')} className="form-input" type="email" autoComplete="email" value={form.email}
                    onChange={e => set('email', e.target.value)}
                    aria-invalid={!!err('email')} aria-describedby={describe('email')} />
                  {err('email') && <p id={id('email-err')} role="alert" style={errStyle}>{err('email')}</p>}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor={id('course')}>Programme you are interested in</label>
                  <input id={id('course')} className="form-input" list={courseOptions?.length ? id('courses') : undefined}
                    value={form.targetCourse} onChange={e => set('targetCourse', e.target.value)} maxLength={160}
                    placeholder="e.g. BSc Computer Science" />
                  {courseOptions?.length ? (
                    <datalist id={id('courses')}>{courseOptions.map(c => <option key={c} value={c} />)}</datalist>
                  ) : null}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor={id('fin')}>How do you plan to pay?</label>
                  <select id={id('fin')} className="form-select" value={form.financingPreference}
                    onChange={e => set('financingPreference', e.target.value as FinancingPreference)}>
                    {FINANCING_PREFERENCES.map(f => <option key={f} value={f}>{FINANCING_LABELS[f]}</option>)}
                  </select>
                </div>

                {results && (
                  <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: 12, borderRadius: 10,
                    background: 'var(--bg-secondary)', border: '1px solid var(--border-light)', fontSize: '0.86rem', cursor: 'pointer' }}>
                    <input type="checkbox" checked={form.includeResults} onChange={e => set('includeResults', e.target.checked)}
                      style={{ marginTop: 3 }} />
                    <span>
                      Include my calculator result so admissions can advise me properly:{' '}
                      <strong>
                        {[results.meanGrade && `Mean grade ${results.meanGrade}`,
                          results.clusterPoints !== undefined && `${results.clusterPoints.toFixed(1)}/48 cluster points`,
                          results.hefBand && `HEF Band ${results.hefBand}`].filter(Boolean).join(' · ')}
                      </strong>
                      <span style={{ display: 'block', color: 'var(--text-tertiary)', marginTop: 2 }}>
                        Self-reported by the calculator; not verified by KNEC or KUCCPS.
                      </span>
                    </span>
                  </label>
                )}

                <div>
                  <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: '0.84rem', lineHeight: 1.5, cursor: 'pointer' }}>
                    <input id={id('consent')} type="checkbox" checked={form.consent} onChange={e => set('consent', e.target.checked)}
                      style={{ marginTop: 3 }} aria-invalid={!!err('consent')} aria-describedby={describe('consent')} />
                    <span>
                      I agree that Chuo Connect may share my name, phone number and the details above with{' '}
                      <strong>{selectedUniversityName}</strong> so they can contact me about admission. See our{' '}
                      <a href="/privacy" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline' }}>privacy policy</a>.
                    </span>
                  </label>
                  {err('consent') && <p id={id('consent-err')} role="alert" style={errStyle}>{err('consent')}</p>}
                </div>
              </div>

              <button type="submit" className="btn btn-gold" disabled={submitting}
                style={{ width: '100%', justifyContent: 'center', marginTop: 20 }}>
                {submitting
                  ? <><Loader2 size={16} className="animate-spin" aria-hidden="true" /> Sending…</>
                  : <><Send size={16} aria-hidden="true" /> Send enquiry</>}
              </button>
            </form>
          )}
        </div>
      </dialog>
    </>
  );
}

const errStyle: React.CSSProperties = { color: 'var(--danger-text, #DC2626)', fontSize: '0.8rem', marginTop: 6 };
