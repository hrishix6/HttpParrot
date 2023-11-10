import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAppDispatch, useAppSelector } from '@/common/hoooks';
import {
  selectMethod,
  selectName,
  selectFormMode,
  selectRequestCollectionName,
  selectIsLocked,
  selectActiveTab
} from '../tabs/redux/tabs.reducer';
import { RequestMethod } from '@/common/types';
import { RequestQuery } from './request.query';
import {
  makeRequestActionAsync,
  setMethodAsync
} from '../tabs/redux/tabs.async.actions';
import { RequestHeaders } from './request.headers';
import { useState } from 'react';
import { RequestActionsDropDown } from './request.actions.dropdown';
import { RequestMetaHeader } from './request.meta.header';
import { BodyForm } from './request.body/body.form';
import { RequestUrl } from './request.url';
import { Loader2 } from 'lucide-react';
import { RequestAuth } from './request.auth';

export function RequestForm() {
  const mode = useAppSelector(selectFormMode);
  const activeRequestTab = useAppSelector(selectActiveTab);
  const name = useAppSelector(selectName);
  const collectionName = useAppSelector(selectRequestCollectionName);
  const method = useAppSelector(selectMethod);
  const lock = useAppSelector(selectIsLocked);
  const dispatch = useAppDispatch();

  const [tab, setCurrentTab] = useState<string>('query');

  const handleMakingRequest = (e: React.SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault();
    dispatch(makeRequestActionAsync(activeRequestTab));
  };

  return (
    <div className="flex-1 flex flex-col gap-1 overflow-hidden">
      <RequestMetaHeader
        mode={mode}
        request_name={name}
        collection={collectionName}
      />
      <section className="flex gap-1 px-1 pt-2">
        <div>
          <Select
            value={method}
            onValueChange={(e) => {
              console.log(e);
              dispatch(setMethodAsync(e as RequestMethod));
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Method" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value={'get'} defaultChecked>
                  Get
                </SelectItem>
                <SelectItem value={'post'}>Post</SelectItem>
                <SelectItem value={'put'}>Put</SelectItem>
                <SelectItem value={'patch'}>Patch</SelectItem>
                <SelectItem value={'delete'}>Delete</SelectItem>
                <SelectItem value={'options'}>Option</SelectItem>
                <SelectItem value={'Head'}>Head</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1">
          <RequestUrl />
        </div>
        <div className="flex items-center">
          <Button onClick={handleMakingRequest} disabled={lock}>
            {lock && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Send
          </Button>
          <RequestActionsDropDown />
        </div>
      </section>
      <section className="flex-1 flex flex-col overflow-hidden px-1 pt-2">
        <Tabs
          value={tab}
          onValueChange={(e) => {
            setCurrentTab(e);
          }}
          className="flex-1 flex flex-col overflow-hidden"
        >
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="query">Query</TabsTrigger>
            <TabsTrigger value="headers">Headers</TabsTrigger>
            <TabsTrigger value="body">Body</TabsTrigger>
            <TabsTrigger value="auth">Auth</TabsTrigger>
          </TabsList>

          {tab == 'query' && (
            <TabsContent
              className="flex-1 overflow-hidden flex flex-col"
              value="query"
            >
              <RequestQuery />
            </TabsContent>
          )}
          {tab === 'headers' && (
            <TabsContent
              className="flex-1 overflow-hidden flex flex-col"
              value="headers"
            >
              <RequestHeaders />
            </TabsContent>
          )}
          {tab === 'body' && (
            <TabsContent
              className="flex-1 overflow-hidden flex flex-col"
              value="body"
            >
              <BodyForm />
            </TabsContent>
          )}
          {tab === 'auth' && (
            <TabsContent
              className="flex-1 overflow-hidden flex flex-col"
              value="auth"
            >
              <RequestAuth />
            </TabsContent>
          )}
        </Tabs>
      </section>
    </div>
  );
}
