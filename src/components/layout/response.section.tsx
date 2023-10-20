import { useEffect, useState } from 'react';
import { useAppSelector } from '../../redux/hoooks';
import { selectformattedRequestInfo } from '../../redux/request.section/request.section.reducer';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResponseBody } from '../domain/response.section/response.body';

export function ResponseSection() {
  const [tab, setCurrentTab] = useState<string>('response');

  return (
    <section className="flex-1 flex flex-col overflow-hidden p-2">
      <section className="flex gap-2 items-center">
        <p>
          Status {' : '} <span className="text-semibold">200</span> {' , '}
        </p>
        <p>
          Size {' : '} <span className="text-semibold">200</span>
          {' , '}
        </p>
        <p>
          Time {' : '} <span className="text-semibold">200</span>
        </p>
        <Button className="ml-auto">Copy</Button>
      </section>
      <div className="flex-1 flex flex-col text-sm overflow-y-auto">
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
              Response Headers
            </TabsContent>
          )}
        </Tabs>
      </div>
    </section>
  );
}
