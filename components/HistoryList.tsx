'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ApiRequestRecord } from '@/types';
import { History, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { format } from 'date-fns';

interface Props {
  onSelectRequest: (request: ApiRequestRecord) => void;
}

interface HistoryResponse {
  requests: ApiRequestRecord[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  message?: string;
}

export default function HistoryList({ onSelectRequest }: Props) {
  const [history, setHistory] = useState<HistoryResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchHistory = async (page: number = 1) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/history?page=${page}&limit=10`);
      const data = await response.json();
      setHistory(data);
      setCurrentPage(page);
    } catch (error) {
      console.error('Failed to fetch history:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const getMethodColor = (method: string) => {
    switch (method.toUpperCase()) {
      case 'GET': return 'bg-blue-500';
      case 'POST': return 'bg-green-500';
      case 'PUT': return 'bg-orange-500';
      case 'DELETE': return 'bg-red-500';
      case 'PATCH': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: number) => {
    if (status === 0) return 'text-gray-500';
    if (status < 300) return 'text-green-600';
    if (status < 400) return 'text-blue-600';
    if (status < 500) return 'text-orange-600';
    return 'text-red-600';
  };

  const truncateUrl = (url: string, maxLength: number = 40) => {
    return url.length > maxLength ? `${url.substring(0, maxLength)}...` : url;
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          Request History
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-96">
          {loading ? (
            <div className="flex items-center justify-center h-32 text-muted-foreground">
              Loading history...
            </div>
          ) : !history || history.requests.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-muted-foreground">
              {history?.message || 'No requests yet'}
            </div>
          ) : (
            <div className="space-y-2 p-4">
              {history.requests.map((request) => (
                <div
                  key={request.id}
                  className="border rounded-lg p-3 hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => onSelectRequest(request)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge className={`${getMethodColor(request.method)} text-white text-xs`}>
                        {request.method}
                      </Badge>
                      <span className="text-sm font-medium">
                        {truncateUrl(request.url)}
                      </span>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      {format(new Date(request.createdAt), 'MMM dd, HH:mm:ss')}
                    </span>
                    {request.response && (
                      <span className={getStatusColor(request.response.status)}>
                        {request.response.status} {request.response.statusText}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
        
        {history && history.pagination.totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchHistory(currentPage - 1)}
              disabled={currentPage <= 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {history.pagination.totalPages}
            </span>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchHistory(currentPage + 1)}
              disabled={currentPage >= history.pagination.totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}