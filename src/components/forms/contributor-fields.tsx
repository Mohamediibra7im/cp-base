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
 * forms. Name and email are pulled from the signed-in account and shown
 * read-only — the server derives identity from the session, so these can't be
 * spoofed. Only the optional Codeforces handle is editable.
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
          <label className={TERMINAL_LABEL_CLS}>Name</label>
          <input
            type="text"
            value={value.name}
            readOnly
            disabled
            className={`${TERMINAL_INPUT_CLS} opacity-70 cursor-not-allowed`}
          />
        </div>
        <div className="space-y-1.5">
          <label className={TERMINAL_LABEL_CLS}>Email</label>
          <input
            type="email"
            value={value.email}
            readOnly
            disabled
            className={`${TERMINAL_INPUT_CLS} opacity-70 cursor-not-allowed`}
          />
        </div>
      </div>

      <p className="text-[10px] text-muted-foreground/50">
        Submitting as your account. Name and email are taken from your profile.
      </p>

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
