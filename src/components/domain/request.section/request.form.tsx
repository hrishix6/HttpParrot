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
  setMethod,
  selectName,
  selectFormMode,
  selectRequestCollectionName
} from './redux/request.section.reducer';
import { RequestMethod } from '@/common/types';
import { RequestQuery } from './request.query';
import { makeRequestActionAsync } from './redux/request.async.actions';
import { RequestHeaders } from './request.headers';
import { useState } from 'react';
import { RequestActionsDropDown } from './request.actions.dropdown';
import { RequestMetaHeader } from './request.meta.header';
import { BodyForm } from './request.body/body.form';
import { RequestUrl } from './request.url';

export function RequestForm() {
  const mode = useAppSelector(selectFormMode);
  const name = useAppSelector(selectName);
  const collectionName = useAppSelector(selectRequestCollectionName);
  const method = useAppSelector(selectMethod);
  const dispatch = useAppDispatch();

  const [tab, setCurrentTab] = useState<string>('query');

  const handleMakingRequest = (e: React.SyntheticEvent<HTMLButtonElement>) => {
    e.preventDefault();
    dispatch(makeRequestActionAsync());
  };

  return (
    <div className="flex-1 flex flex-col gap-1 overflow-hidden">
      <RequestMetaHeader
        mode={mode}
        request_name={name}
        collection={collectionName}
      />
      <section className="flex gap-2 px-2 pt-2">
        <div>
          <Select
            value={method}
            onValueChange={(e) => {
              console.log(e);
              dispatch(setMethod(e as RequestMethod));
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Method" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="get" defaultChecked>
                  Get
                </SelectItem>
                <SelectItem value="post">Post</SelectItem>
                <SelectItem value="delete">Delete</SelectItem>
                <SelectItem value="put">Put</SelectItem>
                <SelectItem value="patch">Patch</SelectItem>
                <SelectItem value="options">Options</SelectItem>
                <SelectItem value="head">Head</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1">
          <RequestUrl />
        </div>
        <div className="flex items-center">
          <Button onClick={handleMakingRequest}>Send</Button>
          <RequestActionsDropDown />
        </div>
      </section>
      <section className="flex-1 flex flex-col overflow-hidden px-2 pt-2">
        <Tabs
          value={tab}
          onValueChange={(e) => {
            setCurrentTab(e);
          }}
          className="flex-1 flex flex-col overflow-hidden"
        >
          <TabsList className="grid w-full grid-cols-4">
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
              Auth
            </TabsContent>
          )}
        </Tabs>
      </section>
    </div>
  );
}
