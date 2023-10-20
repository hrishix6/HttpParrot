import { RequestForm } from '../domain/request.section/request.form';

export function RequestSection() {
  return (
    <section className="flex-1 flex flex-col border-b md:border-r overflow-hidden">
      <RequestForm />
    </section>
  );
}
