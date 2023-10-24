import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResponseBody } from '../domain/response.section/response.body';
import { useAppSelector } from '../../redux/hoooks';
import { selectResponseMetadata } from '../../redux/response.section/response.reducer';

export function ResponseSection() {
  const [tab, setCurrentTab] = useState<string>('response');
  const { size, status, time } = useAppSelector(selectResponseMetadata);

  return (
    <section className="flex-1 flex flex-col overflow-hidden p-2">
      <section className="flex gap-2 items-center">
        <p className="text-lg">
          Status {' : '} <span className="text-semibold">{status}</span> {' , '}
        </p>
        <p className="text-lg">
          Size {' : '} <span className="text-semibold">{size}</span>
          {' , '}
        </p>
        <p className="text-lg">
          Time {' : '} <span className="text-semibold">{time}</span>
        </p>
        <Button className="ml-auto">Copy</Button>
      </section>
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
              Response Headers
            </TabsContent>
          )}
        </Tabs>
      </div>
    </section>
  );
}
