"use client";

import { useState, useCallback } from "react";
import { TemplatePersonalization } from "./template-personalization";
import { LanguageTabs } from "./language-tabs";

interface Code {
  language: string;
  code: string;
}

interface TemplateCodeSectionProps {
  templateId: number;
  templateTitle: string;
  templateSlug: string;
  defaultCodes: Code[];
}

export function TemplateCodeSection({
  templateId,
  templateTitle,
  templateSlug,
  defaultCodes,
}: TemplateCodeSectionProps) {
  const [currentCodes, setCurrentCodes] = useState<Code[]>(defaultCodes);

  // Default cpp code for custom code initial value
  const defaultCppCode = defaultCodes.find((c) => c.language === "cpp")?.code || defaultCodes[0]?.code || "";
  const currentLanguage = defaultCodes.find((c) => c.language === "cpp")?.language || defaultCodes[0]?.language || "cpp";

  const handleCodeChange = useCallback((newCode: string, isCustom: boolean) => {
    if (isCustom) {
      // Swap out the cpp code with custom code, keeping other languages intact
      setCurrentCodes(
        defaultCodes.map((c) => {
          if (c.language === currentLanguage) {
            return { ...c, code: newCode };
          }
          return c;
        })
      );
    } else {
      // Restore default codes
      setCurrentCodes(defaultCodes);
    }
  }, [defaultCodes, currentLanguage]);

  return (
    <div className="space-y-4">
      <TemplatePersonalization
        templateId={templateId}
        templateTitle={templateTitle}
        templateSlug={templateSlug}
        defaultCode={defaultCppCode}
        language={currentLanguage}
        onCodeChange={handleCodeChange}
      />

      <div className="font-mono text-xs">
        <div className="flex items-center gap-2 mb-4 font-bold select-none">
          <span className="text-primary">$</span>
          <span className="text-foreground">cat source_code/</span>
        </div>
        {/* Pass custom codes dynamically */}
        <LanguageTabs codes={currentCodes} templateId={templateId} />
      </div>
    </div>
  );
}
