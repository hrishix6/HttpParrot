import { useAppSelector } from '@/common/hoooks';
import { selectBodyType } from '../../tabs/redux/tabs.reducer';
import { FormdataBody } from './formdata.body';
import { TextBody } from './text.body';
import { BodySectionHeader } from './body.section.header';

export function BodyForm() {
  const bodyType = useAppSelector(selectBodyType);

  return (
    <section className="flex-1 flex flex-col overflow-hidden">
      <BodySectionHeader bodyType={bodyType} />
      {['formdata', 'url_encoded'].includes(bodyType) ? (
        <FormdataBody />
      ) : (
        <TextBody />
      )}
    </section>
  );
}
