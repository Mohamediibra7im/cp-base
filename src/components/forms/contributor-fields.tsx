"use client";

import { RetroFieldset } from "./retro-fieldset";
import { TERMINAL_INPUT_CLS, TERMINAL_LABEL_CLS } from "./field-styles";

export interface ContributorInfo {
  name: string;
  email: string;
  cfHandle: string;
}

/**
 * The "Contributor Info" fieldset shared by the new-template and edit-request
 * forms: required name + email, optional Codeforces handle.
 */
export function ContributorFields({
  value,
  onChange,
}: {
  value: ContributorInfo;
  onChange: (patch: Partial<ContributorInfo>) => void;
}) {
  return (
    <RetroFieldset legend="Contributor Info">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className={TERMINAL_LABEL_CLS}>Name *</label>
          <input
            type="text"
            value={value.name}
            onChange={(e) => onChange({ name: e.target.value })}
            placeholder="Your name"
            className={TERMINAL_INPUT_CLS}
            required
          />
        </div>
        <div className="space-y-1.5">
          <label className={TERMINAL_LABEL_CLS}>Email *</label>
          <input
            type="email"
            value={value.email}
            onChange={(e) => onChange({ email: e.target.value })}
            placeholder="your@email.com"
            className={TERMINAL_INPUT_CLS}
            required
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className={TERMINAL_LABEL_CLS}>Codeforces Handle (optional)</label>
        <input
          type="text"
          value={value.cfHandle}
          onChange={(e) => onChange({ cfHandle: e.target.value })}
          placeholder="tourist"
          className={`${TERMINAL_INPUT_CLS} sm:w-1/2`}
        />
      </div>
    </RetroFieldset>
  );
}
