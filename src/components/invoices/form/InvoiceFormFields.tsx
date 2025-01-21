import { UseFormReturn } from "react-hook-form";
import { CompanySection } from "./sections/CompanySection";
import { ClientSection } from "./sections/ClientSection";
import { InvoiceDetailsSection } from "./sections/InvoiceDetailsSection";
import { InvoiceItemsField } from "./InvoiceItemsField";

interface InvoiceFormFieldsProps {
  form: UseFormReturn<any>;
}

export const InvoiceFormFields = ({ form }: InvoiceFormFieldsProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <InvoiceDetailsSection form={form} />
        <CompanySection form={form} />
        <ClientSection form={form} />
      </div>
      <InvoiceItemsField form={form} />
    </div>
  );
};