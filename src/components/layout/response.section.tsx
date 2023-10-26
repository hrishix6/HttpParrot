import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResponseBody } from '../domain/response.section/response.body';
import { ResponseHeaders } from '../domain/response.section/response.headers';
import { ResponseSectionHeader } from '../domain/response.section/response.section.header';

export function ResponseSection() {
  const [tab, setCurrentTab] = useState<string>('response');

  return (
    <section className="flex-1 flex flex-col overflow-hidden p-2">
      <ResponseSectionHeader />
      <div className="flex-1 flex flex-col text-sm overflow-y-auto mt-1">
        <Tabs
          value={tab}
          onValueChange={(e) => {
            setCurrentTab(e);
          }}
          className="flex-1 flex flex-col overflow-hidden pt-2"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="response">Response</TabsTrigger>
            <TabsTrigger value="headers">Headers</TabsTrigger>
          </TabsList>

          {tab == 'response' && (
            <TabsContent
              className="flex-1 overflow-hidden flex flex-col"
              value="response"
            >
              <ResponseBody />
            </TabsContent>
          )}
          {tab === 'headers' && (
            <TabsContent
              className="flex-1 overflow-hidden flex flex-col"
              value="headers"
            >
              <ResponseHeaders />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </section>
  );
}
