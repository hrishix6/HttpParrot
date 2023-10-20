import { Footer } from './components/layout/footer';
import { Header } from './components/layout/header';
import { Main } from './components/layout/main';
import { RequestSection } from './components/layout/request.section';
import { ResponseSection } from './components/layout/response.section';
import { Sidebar } from './components/layout/sidebar';
import { ThemeWrapper } from './components/domain/theme/theme.wrapper';
import { ActivitySection } from './components/layout/activity.section';

function App() {
  return (
    <ThemeWrapper>
      <div className="flex flex-col h-screen overflow-hidden">
        <Header />
        <Main>
          <Sidebar>
            <ActivitySection />
          </Sidebar>
          <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
            <RequestSection />
            <ResponseSection />
          </div>
        </Main>
        <Footer />
      </div>
    </ThemeWrapper>
  );
}

export default App;
