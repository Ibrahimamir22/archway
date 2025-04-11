import React, { useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';

const TestPage: NextPage = () => {
  const [testResult, setTestResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const testBackendConnection = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/test-backend');
      const data = await response.json();
      setTestResult(data);
    } catch (e: any) {
      setError(e.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  const testDirectSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/direct-submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Test User',
          email: 'test@example.com',
          phone: '01123456789',
          message: 'Test message from diagnostics page'
        })
      });
      const data = await response.json();
      setTestResult(data);
    } catch (e: any) {
      setError(e.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Head>
        <title>Backend Connection Test</title>
      </Head>
      
      <h1 className="text-3xl font-bold mb-6">Backend Connectivity Test</h1>
      
      <div className="space-y-4 mb-8">
        <button
          onClick={testBackendConnection}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded mr-4"
        >
          {loading ? 'Testing...' : 'Test Backend Connection'}
        </button>
        
        <button
          onClick={testDirectSubmit}
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          {loading ? 'Testing...' : 'Test Contact Form Submission'}
        </button>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg mb-6">
          <h2 className="font-bold mb-2">Error</h2>
          <p>{error}</p>
        </div>
      )}
      
      {testResult && (
        <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
          <h2 className="font-bold mb-2">Test Result</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
            {JSON.stringify(testResult, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default TestPage; 