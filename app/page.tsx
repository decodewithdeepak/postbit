'use client';

import { useState, useCallback } from 'react';
import RequestForm from '@/components/RequestForm';
import ResponseViewer from '@/components/ResponseViewer';
import HistoryList from '@/components/HistoryList';
import { RequestData, ResponseData, ApiRequestRecord } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

export default function Home() {
  const [response, setResponse] = useState<ResponseData | undefined>();
  const [loading, setLoading] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ApiRequestRecord | null>(null);

  const handleSendRequest = useCallback(async (requestData: RequestData): Promise<ResponseData> => {
    setLoading(true);
    setResponse(undefined);
    
    try {
      const response = await fetch('/api/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to send request');
      }
      
      setResponse(result.response);
      toast.success('Request sent successfully');
      return result.response;
    } catch (error: any) {
      const errorResponse: ResponseData = {
        status: 0,
        statusText: 'Error',
        headers: {},
        data: { error: error.message },
      };
      setResponse(errorResponse);
      toast.error('Failed to send request: ' + error.message);
      return errorResponse;
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSelectRequest = useCallback((request: ApiRequestRecord) => {
    setSelectedRequest(request);
    if (request.response) {
      setResponse(request.response);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Postbit</h1>
          <p className="text-muted-foreground">
            A powerful HTTP client for testing REST APIs and web services
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
          {/* Request Form */}
          <div className="lg:col-span-1">
            <RequestForm 
              onSendRequest={handleSendRequest} 
              loading={loading}
            />
          </div>
          
          {/* Response and History */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="response" className="h-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="response">Response</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>
              
              <TabsContent value="response" className="h-full mt-4">
                <ResponseViewer response={response} />
              </TabsContent>
              
              <TabsContent value="history" className="h-full mt-4">
                <HistoryList onSelectRequest={handleSelectRequest} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}