'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Minus, Forward, SendHorizontal, Loader2 } from 'lucide-react';
import { RequestData, ResponseData, HttpMethod } from '@/types';

const HTTP_METHODS: HttpMethod[] = [
  { value: 'GET', label: 'GET', color: 'text-blue-600' },
  { value: 'POST', label: 'POST', color: 'text-green-600' },
  { value: 'PUT', label: 'PUT', color: 'text-orange-600' },
  { value: 'DELETE', label: 'DELETE', color: 'text-red-600' },
  { value: 'PATCH', label: 'PATCH', color: 'text-purple-600' },
  { value: 'HEAD', label: 'HEAD', color: 'text-gray-600' },
  { value: 'OPTIONS', label: 'OPTIONS', color: 'text-indigo-600' },
];

interface Props {
  onSendRequest: (request: RequestData) => Promise<ResponseData>;
  loading: boolean;
}

interface HeaderPair {
  key: string;
  value: string;
}

export default function RequestForm({ onSendRequest, loading }: Props) {
  const [method, setMethod] = useState('GET');
  const [url, setUrl] = useState('');
  const [headers, setHeaders] = useState<HeaderPair[]>([{ key: '', value: '' }]);
  const [body, setBody] = useState('');

  const addHeader = useCallback(() => {
    setHeaders(prev => [...prev, { key: '', value: '' }]);
  }, []);

  const removeHeader = useCallback((index: number) => {
    setHeaders(prev => prev.filter((_, i) => i !== index));
  }, []);

  const updateHeader = useCallback((index: number, field: 'key' | 'value', value: string) => {
    setHeaders(prev => prev.map((header, i) => 
      i === index ? { ...header, [field]: value } : header
    ));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) return;
    
    const headerObj = headers.reduce((acc, { key, value }) => {
      if (key.trim() && value.trim()) {
        acc[key.trim()] = value.trim();
      }
      return acc;
    }, {} as Record<string, string>);

    const requestData: RequestData = {
      method,
      url: url.trim(),
      headers: headerObj,
      body: body.trim() || undefined,
    };

    await onSendRequest(requestData);
  };

  const selectedMethod = HTTP_METHODS.find(m => m.value === method);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Forward className="h-5 w-5" />
          Request
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Method and URL */}
          <div className="space-y-2">
            <Label htmlFor="url">URL</Label>
            <div className="flex gap-2">
              <Select value={method} onValueChange={setMethod}>
                <SelectTrigger className="w-32">
                  <SelectValue>
                    <span className={selectedMethod?.color}>
                      {selectedMethod?.label}
                    </span>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {HTTP_METHODS.map(method => (
                    <SelectItem key={method.value} value={method.value}>
                      <span className={method.color}>{method.label}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                id="url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://api.example.com/endpoint"
                className="flex-1"
                required
              />
            </div>
          </div>

          {/* Headers */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Headers</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addHeader}
                className="flex items-center gap-1"
              >
                <Plus className="h-4 w-4" />
                Add Header
              </Button>
            </div>
            <div className="space-y-2">
              {headers.map((header, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="Key"
                    value={header.key}
                    onChange={(e) => updateHeader(index, 'key', e.target.value)}
                    className="flex-1"
                  />
                  <Input
                    placeholder="Value"
                    value={header.value}
                    onChange={(e) => updateHeader(index, 'value', e.target.value)}
                    className="flex-1"
                  />
                  {headers.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeHeader(index)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Body */}
          {method !== 'GET' && method !== 'HEAD' && (
            <div className="space-y-2">
              <Label htmlFor="body">Request Body (JSON)</Label>
              <Textarea
                id="body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder='{"key": "value"}'
                className="min-h-32 font-mono text-sm"
              />
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading || !url.trim()}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <SendHorizontal className="mr-2 h-4 w-4" />
                Send Request
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}