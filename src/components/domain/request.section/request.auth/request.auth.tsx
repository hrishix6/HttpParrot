import { useAppSelector } from '@/common/hoooks';
import { AuthSectionHeader } from './auth.section.header';
import { selectAuthType } from '../../tabs/redux/tabs.reducer';
import { TokenAuth } from './token.auth';
import { BasicAuth } from './basic.auth';

export function RequestAuth() {
  const authType = useAppSelector(selectAuthType);

  let authComponent;
  switch (authType) {
    case 'basic':
      authComponent = <BasicAuth />;
      break;
    case 'token':
      authComponent = <TokenAuth />;
      break;
    default:
      authComponent = <></>;
  }

  return (
    <section className="flex-1 flex flex-col overflow-hidden">
      <AuthSectionHeader authType={authType} />
      <div className="px-1 mt-2 flex-1 flex flex-col overflow-hidden">
        {authComponent}
      </div>
    </section>
  );
}
