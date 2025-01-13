import { UseFormReturn } from "react-hook-form";
import { CompanySection } from "./sections/CompanySection";
import { ClientSection } from "./sections/ClientSection";
import { InvoiceDetailsSection } from "./sections/InvoiceDetailsSection";

interface InvoiceFormFieldsProps {
  form: UseFormReturn<any>;
}

export const InvoiceFormFields = ({ form }: InvoiceFormFieldsProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <InvoiceDetailsSection form={form} />
      <CompanySection form={form} />
      <ClientSection form={form} />
    </div>
  );
};