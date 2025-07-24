'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResponseData } from '@/types';
import { Activity, Clock, Info } from 'lucide-react';

interface Props {
  response?: ResponseData;
}

export default function ResponseViewer({ response }: Props) {
  if (!response) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Response
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64 text-muted-foreground">
          Send a request to see the response
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = (status: number) => {
    if (status === 0) return 'bg-gray-500';
    if (status < 300) return 'bg-green-500';
    if (status < 400) return 'bg-blue-500';
    if (status < 500) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const formatJSON = (data: any) => {
    try {
      return JSON.stringify(data, null, 2);
    } catch {
      return String(data);
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Response
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={`${getStatusColor(response.status)} text-white`}>
              {response.status} {response.statusText}
            </Badge>
            {response.duration && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {response.duration}ms
              </Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="body" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="body">Body</TabsTrigger>
            <TabsTrigger value="headers">Headers</TabsTrigger>
            <TabsTrigger value="info">Info</TabsTrigger>
          </TabsList>
          
          <TabsContent value="body" className="mt-4">
            <div className="bg-muted rounded-md p-4 max-h-96 overflow-auto">
              <pre className="text-sm font-mono whitespace-pre-wrap">
                {formatJSON(response.data)}
              </pre>
            </div>
          </TabsContent>
          
          <TabsContent value="headers" className="mt-4">
            <div className="space-y-2">
              {Object.entries(response.headers || {}).map(([key, value]) => (
                <div key={key} className="flex gap-2 text-sm">
                  <span className="font-medium text-muted-foreground min-w-32">
                    {key}:
                  </span>
                  <span className="font-mono">{String(value)}</span>
                </div>
              ))}
              {Object.keys(response.headers || {}).length === 0 && (
                <p className="text-muted-foreground text-sm">No headers</p>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="info" className="mt-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Request Information</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex gap-2">
                  <span className="font-medium text-muted-foreground min-w-20">Status:</span>
                  <Badge variant="outline" className={`${getStatusColor(response.status)} text-white`}>
                    {response.status} {response.statusText}
                  </Badge>
                </div>
                {response.duration && (
                  <div className="flex gap-2">
                    <span className="font-medium text-muted-foreground min-w-20">Duration:</span>
                    <span>{response.duration}ms</span>
                  </div>
                )}
                <div className="flex gap-2">
                  <span className="font-medium text-muted-foreground min-w-20">Size:</span>
                  <span>{new Blob([formatJSON(response.data)]).size} bytes</span>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}