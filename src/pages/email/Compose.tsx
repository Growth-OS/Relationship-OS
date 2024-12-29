import { SendEmailForm } from "@/components/email/SendEmailForm";

const ComposePage = () => {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Compose Email</h1>
      <SendEmailForm />
    </div>
  );
};

export default ComposePage;