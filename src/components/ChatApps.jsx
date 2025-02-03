import React, { useState, useCallback, useMemo } from 'react';
import { apiCall } from '../utils/api';

const ChatApp = () => {
  const IFRAME_BASE_URL=import.meta.env.VITE_IFRAME_BASE_URL
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiResponse, setAIResponse] = useState(null);
  const [graphPrompt, setGraphPrompt] = useState('');
  const [iframeSrc, setIframeSrc] = useState('');
  const [graphLoading, setGraphLoading] = useState(false);
  const [graphError, setGraphError] = useState('');  
  const [file, setFile] = useState(null);
  const [fileUploaded, setFileUploaded] = useState(false);

  const handleFileChange = useCallback((e) => {
    setFile(e.target.files[0]);
  }, []);

  const handleFileUpload = useCallback(async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      await apiCall('/upload-csv/', 'POST', formData, {
        'Content-Type': 'multipart/form-data',
      });
      setFileUploaded(true); 
      alert('File uploaded successfully');
    } catch (error) {
      alert('Error uploading file');
    }
  }, [file]);

  const handleInputChange = useCallback((e) => {
    setInput(e.target.value);
  }, []);

  const handleSendMessage = useCallback(async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage = { text: input, sender: 'user' };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await apiCall('/prompt/', 'POST', { prompt: input });

      const aiMessage = { text: response.aiResponse, sender: 'ai' };
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
      setAIResponse(response);
    } catch (error) {
      setMessages((prevMessages) => [...prevMessages, { text: 'Insufficient Data', sender: 'ai' }]);
    } finally {
      setLoading(false);
    }
  }, [input]);

  const handleGraphPromptChange = useCallback((e) => {
    setGraphPrompt(e.target.value);
  }, []);

  const handleGraphSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!aiResponse) {
      setGraphError('No AI response available for graph generation.');
      return;
    }

    setGraphLoading(true);
    setGraphError(''); 
    setIframeSrc('');

    const result = JSON.stringify(aiResponse);

    try {
      const response = await apiCall('/prompt/getGraphBytes/', 'POST', {
        graph_prompt: graphPrompt,
        df: result,
      });

      if (response && response.graph) {
        setIframeSrc(IFRAME_BASE_URL);
      } else {
        setGraphError('No graph found in the response.');
      }
    } catch (err) {
      setGraphError('An error occurred while fetching the graph.');
    } finally {
      setGraphLoading(false);
    }
  }, [aiResponse, graphPrompt]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); 
      handleSendMessage(e); 
    }
  };

  const renderTable = useMemo(() => {
    if (Array.isArray(aiResponse) && aiResponse.length > 0 && typeof aiResponse[0] === 'object') {
      const columns = Object.keys(aiResponse[0]);
      return (
        <table className="min-w-full table-auto border-collapse shadow-lg rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-700 text-white">
              {columns.map((col, index) => (
                <th key={index} className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-600">
            {aiResponse.map((row, rowIndex) => (
              <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-gray-900' : 'bg-gray-800'}>
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {row[col]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      );
    }
    return <p className="text-gray-400 text-center py-4">No tabular data available in the response.</p>;
  }, [aiResponse]);

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <div className="w-1/4 bg-gray-800 p-6 overflow-y-auto flex-shrink-0">
        <h2 className="text-xl font-semibold mb-4">Chat History</h2>
        <div className="space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg ${msg.sender === 'ai' ? 'bg-gray-700 text-white' : 'bg-blue-600 text-white'}`}
            >
              <p>{msg.text}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 pb-20">
        
        <div className="mb-8">
          <div className="flex flex-col items-center gap-4">
            <h3 className="text-2xl font-semibold text-white dark:text-gray-200">Visualize Data</h3>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="border border-gray-600 rounded-lg px-4 py-2 w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 text-white"
            />
            <button
              onClick={handleFileUpload}
              disabled={!file}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Upload CSV Dataset
            </button>
          </div>
        </div>

        
        <div className="mb-8 space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.sender === 'ai' ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`max-w-[70%] p-4 rounded-lg shadow-lg transition-all ${msg.sender === 'ai' ? 'bg-gray-800 text-white' : 'bg-blue-600 text-white'}`}
              >
                <p>{msg.text}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="max-w-[70%] p-4 bg-gray-800 border border-gray-600 rounded-lg shadow-lg text-gray-300">
                <p>AI is typing...</p>
              </div>
            </div>
          )}
        </div>

        
        {aiResponse && renderTable}

        
        {graphError && (
          <div className="mt-4 text-red-500">{graphError}</div>
        )}

       
        {iframeSrc && (
          <div className="mt-8 rounded-lg shadow-lg overflow-hidden">
            <iframe
              src={iframeSrc}
              title="Generated Graph"
              className="w-full h-96 border-0"
            />
          </div>
        )}

        
        {fileUploaded && (
          <form className="flex gap-4 mt-8" onSubmit={handleSendMessage}>
            <textarea
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Ask me about dataset..."
              rows={1}
              className="flex-1 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 text-white resize-none"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="spinner-border animate-spin"></div>
              ) : (
                <span className="text-white text-xl">&#8593;</span> 
              )}
            </button>
          </form>
        )}

        
        {aiResponse && (
          <form className="flex gap-4 mt-4" onSubmit={handleGraphSubmit}>
            <input
              type="text"
              value={graphPrompt}
              onChange={handleGraphPromptChange}
              placeholder="Generate graph..."
              className="flex-1 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 text-white"
            />
            <button
              type="submit"
              disabled={graphLoading}
              className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {graphLoading ? 'Loading Graph...' : 'Generate Graph'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ChatApp;
