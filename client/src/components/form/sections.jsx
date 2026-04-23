import { Field, RadioGroup, CheckboxGroup } from '../ui/Field.jsx';
import { RATINGS, RATINGS_NA } from '../../lib/schema.js';

export function SectionHeader({ step, title, subtitle }) {
  return (
    <div className="mb-5">
      <div className="text-xs font-semibold uppercase tracking-widest text-gold-500">
        Section {step}
      </div>
      <h2 className="text-2xl font-bold mt-1">{title}</h2>
      {subtitle && <p className="opacity-70 mt-1 text-sm">{subtitle}</p>}
    </div>
  );
}

function err(form, name) {
  return form.formState.errors?.[name]?.message;
}

function setVal(form, name, v) {
  form.setValue(name, v, { shouldValidate: true });
}

export function HeaderFields({ form, errors }) {
  const { register } = form;
  return (
    <div className="grid sm:grid-cols-2 gap-4 mb-6 card">
      <Field label="Company Name" required error={errors.companyName?.message}>
        <input className="input" placeholder="e.g. Sharma & Co." {...register('companyName')} />
      </Field>
      <Field label="Date">
        <input type="date" className="input" {...register('date')} />
      </Field>
      <Field label="Tenant Name">
        <input className="input" placeholder="Your full name" {...register('tenantName')} />
      </Field>
      <Field label="Phone">
        <input className="input" placeholder="+91 …" {...register('phone')} />
      </Field>
    </div>
  );
}

// Section 1 — Overall Satisfaction
export function Section1({ form }) {
  const { watch, register } = form;
  const score = watch('satisfactionScore') ?? 7;
  const recommend = watch('wouldRecommend');
  return (
    <div className="card">
      <SectionHeader step={1} title="Overall Satisfaction" subtitle="A quick temperature check." />
      <Field label={`Satisfaction: ${score}/10`} required>
        <input
          type="range" min={1} max={10} step={1} value={score}
          onChange={(e) => setVal(form, 'satisfactionScore', Number(e.target.value))}
          className="satisfaction"
          style={{ '--pct': `${((score - 1) / 9) * 100}%` }}
        />
        <div className="flex justify-between text-xs opacity-60 mt-2">
          <span>Very Dissatisfied</span>
          <span>Very Satisfied</span>
        </div>
      </Field>
      <div className="mt-5">
        <Field label="Would you recommend this office?" required error={err(form, 'wouldRecommend')}>
          <RadioGroup
            options={['Yes', 'No']}
            value={recommend}
            onChange={(v) => setVal(form, 'wouldRecommend', v)}
            columns="grid-cols-2 max-w-xs"
          />
        </Field>
      </div>
      <div className="mt-5">
        <Field label="Reason (optional)">
          <textarea className="textarea" placeholder="Share a quick reason…" {...register('recommendReason')} />
        </Field>
      </div>
    </div>
  );
}

function RatingRow({ form, name, label, options = RATINGS }) {
  return (
    <Field label={label} required error={err(form, name)}>
      <RadioGroup options={options} value={form.watch(name)} onChange={(v) => setVal(form, name, v)} />
    </Field>
  );
}

// Section 2 — Space & Infrastructure
export function Section2({ form }) {
  const { register } = form;
  return (
    <div className="card">
      <SectionHeader step={2} title="Space & Infrastructure" />
      <div className="grid gap-5">
        <RatingRow form={form} name="officeSize" label="Office size & layout" />
        <RatingRow form={form} name="furnitureComfort" label="Furniture comfort & sufficiency" />
        <Field label="Issues with lighting, ventilation, or AC (optional)">
          <textarea className="textarea" {...register('infraIssues')} />
        </Field>
        <Field label="One improvement suggestion (optional)">
          <textarea className="textarea" {...register('improvementSuggestion')} />
        </Field>
      </div>
    </div>
  );
}

// Section 3 — Maintenance & Cleanliness
export function Section3({ form }) {
  const { register } = form;
  return (
    <div className="card">
      <SectionHeader step={3} title="Maintenance & Cleanliness" />
      <div className="grid gap-5">
        <RatingRow form={form} name="commonAreaCleanliness" label="Common areas cleanliness" />
        <Field label="Maintenance resolution speed" required error={err(form, 'maintenanceSpeed')}>
          <RadioGroup
            options={['Very Fast', 'Acceptable', 'Slow']}
            value={form.watch('maintenanceSpeed')}
            onChange={(v) => setVal(form, 'maintenanceSpeed', v)}
            columns="grid-cols-3"
          />
        </Field>
        <Field label="Recurring problems — water leakage, electricity, etc. (optional)">
          <textarea className="textarea" {...register('recurringProblems')} />
        </Field>
      </div>
    </div>
  );
}

// Section 4 — Facilities & Utilities
export function Section4({ form }) {
  return (
    <div className="card">
      <SectionHeader step={4} title="Facilities & Utilities" />
      <div className="grid gap-5 sm:grid-cols-2">
        <RatingRow form={form} name="internetQuality" label="Internet quality" options={RATINGS_NA} />
        <RatingRow form={form} name="powerBackup" label="Power backup sufficiency" />
        <RatingRow form={form} name="washroom" label="Washroom cleanliness & availability" />
        <RatingRow form={form} name="pantry" label="Pantry / kitchen adequacy" />
      </div>
    </div>
  );
}

// Section 5 — Noise & Environment
export function Section5({ form }) {
  const { watch, register } = form;
  return (
    <div className="card">
      <SectionHeader step={5} title="Noise & Environment" />
      <Field label="Disturbance from outside noise" required error={err(form, 'noiseDisturbance')}>
        <RadioGroup
          options={['Never', 'Sometimes', 'Frequently']}
          value={watch('noiseDisturbance')}
          onChange={(v) => setVal(form, 'noiseDisturbance', v)}
          columns="grid-cols-3"
        />
      </Field>
      <div className="mt-5">
        <Field label="Source of noise" required error={err(form, 'noiseSources')}>
          <CheckboxGroup
            options={['Traffic', 'Nearby shops', 'Construction', 'Other']}
            value={watch('noiseSources') || []}
            onChange={(v) => setVal(form, 'noiseSources', v)}
          />
        </Field>
      </div>
      {(watch('noiseSources') || []).includes('Other') && (
        <div className="mt-3">
          <Field label="Other source (optional)">
            <input className="input" {...register('noiseSourceOther')} />
          </Field>
        </div>
      )}
    </div>
  );
}

// Section 6 — Safety & Behavior
export function Section6({ form }) {
  const { watch, register } = form;
  return (
    <div className="card">
      <SectionHeader step={6} title="Safety & Behavior" />
      <Field label="Anti-social behavior noticed?" required error={err(form, 'antiSocialBehavior')}>
        <RadioGroup
          options={['No', 'Yes']}
          value={watch('antiSocialBehavior')}
          onChange={(v) => setVal(form, 'antiSocialBehavior', v)}
          columns="grid-cols-2 max-w-xs"
        />
      </Field>
      {watch('antiSocialBehavior') === 'Yes' && (
        <div className="mt-4">
          <Field label="Please describe (optional)">
            <textarea className="textarea" {...register('antiSocialDetails')} />
          </Field>
        </div>
      )}
      <div className="mt-5">
        <Field label="Comfortable during all business hours?" required error={err(form, 'comfortableAllHours')}>
          <RadioGroup
            options={['Yes', 'No']}
            value={watch('comfortableAllHours')}
            onChange={(v) => setVal(form, 'comfortableAllHours', v)}
            columns="grid-cols-2 max-w-xs"
          />
        </Field>
      </div>
    </div>
  );
}

// Section 7 — Location
export function Section7({ form }) {
  const { watch, register } = form;
  return (
    <div className="card">
      <SectionHeader step={7} title="Location Feedback" />
      <RatingRow form={form} name="locationRating" label="Rate the location" />
      <div className="mt-5">
        <Field label="Location challenges" required error={err(form, 'locationChallenges')}>
          <CheckboxGroup
            options={['Parking', 'Accessibility', 'Visibility', 'Other']}
            value={watch('locationChallenges') || []}
            onChange={(v) => setVal(form, 'locationChallenges', v)}
          />
        </Field>
      </div>
      {(watch('locationChallenges') || []).includes('Other') && (
        <div className="mt-3">
          <Field label="Other challenge (optional)">
            <input className="input" {...register('locationChallengeOther')} />
          </Field>
        </div>
      )}
    </div>
  );
}

// Section 8 — Staff Behavior
export function Section8({ form }) {
  const { register } = form;
  return (
    <div className="card">
      <SectionHeader step={8} title="Staff Behavior" />
      <RatingRow form={form} name="staffBehavior" label="Staff behavior rating" />
      <div className="mt-5">
        <Field label="Specific feedback about staff (optional)">
          <textarea className="textarea" {...register('staffFeedback')} />
        </Field>
      </div>
    </div>
  );
}

// Section 9 — Rent & Value
export function Section9({ form }) {
  const { watch, register } = form;
  return (
    <div className="card">
      <SectionHeader step={9} title="Rent & Value" />
      <Field label="Rent justified for facilities?" required error={err(form, 'rentJustified')}>
        <RadioGroup
          options={['Yes', 'No']}
          value={watch('rentJustified')}
          onChange={(v) => setVal(form, 'rentJustified', v)}
          columns="grid-cols-2 max-w-xs"
        />
      </Field>
      <div className="mt-5">
        <Field label="Compared to market, rent feels" required error={err(form, 'rentVsMarket')}>
          <RadioGroup
            options={['High', 'Fair', 'Low']}
            value={watch('rentVsMarket')}
            onChange={(v) => setVal(form, 'rentVsMarket', v)}
            columns="grid-cols-3"
          />
        </Field>
      </div>
      <div className="mt-5">
        <Field label="What additional service would justify higher rent? (optional)">
          <textarea className="textarea" {...register('justifyHigherRent')} />
        </Field>
      </div>
    </div>
  );
}

// Section 10 — Management & Support
export function Section10({ form }) {
  const { register } = form;
  return (
    <div className="card">
      <SectionHeader step={10} title="Management & Support" />
      <div className="grid gap-5">
        <RatingRow form={form} name="managementResponsiveness" label="Responsiveness when raising issues" />
        <RatingRow form={form} name="communicationClarity" label="Communication clarity & timeliness" />
        <Field label="Suggestions to improve management support (optional)">
          <textarea className="textarea" {...register('managementSuggestions')} />
        </Field>
      </div>
    </div>
  );
}

// Section 11 — Future Needs & Expansion
export function Section11({ form }) {
  const { watch, register } = form;
  return (
    <div className="card">
      <SectionHeader step={11} title="Future Needs & Expansion" />
      <Field label="Plan to continue for the next 6–12 months?" required error={err(form, 'continuePlan')}>
        <RadioGroup
          options={['Yes', 'No', 'Not Sure']}
          value={watch('continuePlan')}
          onChange={(v) => setVal(form, 'continuePlan', v)}
          columns="grid-cols-3"
        />
      </Field>
      <div className="mt-5">
        <Field label="Future office size" required error={err(form, 'futureSpaceSize')}>
          <RadioGroup
            options={['Bigger', 'Same', 'Smaller']}
            value={watch('futureSpaceSize')}
            onChange={(v) => setVal(form, 'futureSpaceSize', v)}
            columns="grid-cols-3"
          />
        </Field>
      </div>
      <div className="mt-5">
        <Field label="Additional services needed" required error={err(form, 'additionalServices')}>
          <CheckboxGroup
            options={['Meeting Rooms', 'Reception Services', 'Storage Space', 'Parking', 'Other']}
            value={watch('additionalServices') || []}
            onChange={(v) => setVal(form, 'additionalServices', v)}
          />
        </Field>
      </div>
      {(watch('additionalServices') || []).includes('Other') && (
        <div className="mt-3">
          <Field label="Other service (optional)">
            <input className="input" {...register('additionalServicesOther')} />
          </Field>
        </div>
      )}
    </div>
  );
}

// Section 12 — Open feedback
export function Section12({ form }) {
  const { register } = form;
  return (
    <div className="card">
      <SectionHeader step={12} title="Open Feedback" subtitle="All three questions are optional." />
      <div className="grid gap-5">
        <Field label="What do you LIKE most?">
          <textarea className="textarea" {...register('likeMost')} />
        </Field>
        <Field label="What do you DISLIKE most?">
          <textarea className="textarea" {...register('dislikeMost')} />
        </Field>
        <Field label="If you were the owner, what would you change?">
          <textarea className="textarea" {...register('ownerChange')} />
        </Field>
      </div>
    </div>
  );
}

// Section 13 — Upgrade Interest
export function Section13({ form }) {
  const { watch } = form;
  return (
    <div className="card">
      <SectionHeader step={13} title="Upgrade Interest" />
      <Field label="If we upgrade interiors/services, willing to pay higher rent?" required error={err(form, 'upgradeWillingness')}>
        <RadioGroup
          options={['Yes', 'Maybe', 'No']}
          value={watch('upgradeWillingness')}
          onChange={(v) => setVal(form, 'upgradeWillingness', v)}
          columns="grid-cols-3"
        />
      </Field>
      <p className="mt-6 text-sm opacity-70">
        Thanks for sharing so much. One click to submit — you're done.
      </p>
    </div>
  );
}

export const ALL_SECTIONS = [
  Section1, Section2, Section3, Section4, Section5, Section6, Section7,
  Section8, Section9, Section10, Section11, Section12, Section13,
];

export const SECTION_TITLES = [
  'Overall Satisfaction', 'Space & Infrastructure', 'Maintenance & Cleanliness',
  'Facilities & Utilities', 'Noise & Environment', 'Safety & Behavior',
  'Location', 'Staff Behavior', 'Rent & Value', 'Management & Support',
  'Future Needs', 'Open Feedback', 'Upgrade Interest',
];

export const STEP_FIELDS = [
  ['satisfactionScore', 'wouldRecommend'],
  ['officeSize', 'furnitureComfort'],
  ['commonAreaCleanliness', 'maintenanceSpeed'],
  ['internetQuality', 'powerBackup', 'washroom', 'pantry'],
  ['noiseDisturbance', 'noiseSources'],
  ['antiSocialBehavior', 'comfortableAllHours'],
  ['locationRating', 'locationChallenges'],
  ['staffBehavior'],
  ['rentJustified', 'rentVsMarket'],
  ['managementResponsiveness', 'communicationClarity'],
  ['continuePlan', 'futureSpaceSize', 'additionalServices'],
  [],
  ['upgradeWillingness'],
];
