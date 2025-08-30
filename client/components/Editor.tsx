import React from 'react';
import Editor, { OnMount } from '@monaco-editor/react';

interface CodeEditorProps {
  code: string;
  onChange: (value: string | undefined) => void;
  filename: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ code, onChange, filename }) => {
  const handleEditorDidMount: OnMount = (editor, monaco) => {
    // Configure editor settings here if needed
    monaco.editor.defineTheme('rails-gym-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'keyword', foreground: 'CC7832' },
        { token: 'string', foreground: 'A5C261' },
        { token: 'comment', foreground: 'BC9458', fontStyle: 'italic' },
      ],
      colors: {
        'editor.background': '#1e293b', // matches slate-800
      }
    });
    monaco.editor.setTheme('rails-gym-dark');
  };

  return (
    <div className="h-full w-full flex flex-col overflow-hidden">
      <div className="bg-slate-900 text-slate-400 text-xs px-4 py-2 flex items-center border-b border-slate-700 font-mono flex-shrink-0">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 2H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
        </svg>
        {filename}
      </div>
      <div className="flex-1 relative overflow-hidden">
         <Editor
            height="100%"
            defaultLanguage="ruby"
            value={code}
            theme="rails-gym-dark"
            onChange={onChange}
            onMount={handleEditorDidMount}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              scrollBeyondLastLine: false,
              automaticLayout: true,
              fontFamily: "'Menlo', 'Monaco', 'Courier New', monospace",
              padding: { top: 16 }
            }}
          />
      </div>
    </div>
  );
};

export default CodeEditor;