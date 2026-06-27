import React from 'react';

// Enhanced Markdown parser for comprehensive formatting support with fixed multi-line code block rendering and preserved formatting
export function parseMarkdown(content: string): React.ReactNode {
  if (!content) return null;

  // Normalize CRLF to LF for consistent parsing
  const normalizedContent = content.replace(/\r\n/g, '\n');

  // Split content into lines for processing while preserving original line breaks
  const lines = normalizedContent.split('\n');
  const elements: React.ReactNode[] = [];
  let currentParagraph: string[] = [];
  let inCodeBlock = false;
  let codeBlockContent: string[] = [];
  let codeBlockLanguage = '';

  const flushParagraph = () => {
    if (currentParagraph.length > 0) {
      const paragraphContent = currentParagraph.join('\n');
      elements.push(
        <p key={elements.length} className="mb-6 leading-relaxed text-dark-text whitespace-pre-wrap">
          {parseInlineMarkdown(paragraphContent)}
        </p>
      );
      currentParagraph = [];
    }
  };

  const flushCodeBlock = () => {
    if (codeBlockContent.length > 0) {
      elements.push(
        <pre key={elements.length} className="bg-dark-surface border-2 border-gray-500 rounded-xl p-4 mb-6 overflow-x-auto shadow-lg">
          <code className="text-green-400 font-mono text-sm leading-relaxed block whitespace-pre">
            {codeBlockContent.join('\n')}
          </code>
        </pre>
      );
      codeBlockContent = [];
      codeBlockLanguage = '';
    }
  };

  lines.forEach((line, index) => {
    // Handle code blocks - Fixed to preserve all line breaks and formatting for multi-line display
    // Match ``` with optional leading whitespace and optional language specifier
    const codeBlockMatch = line.match(/^\s*```(\w*)\s*$/);
    
    if (codeBlockMatch) {
      if (inCodeBlock) {
        // End code block - preserve all line breaks and formatting, ensure multi-line display
        flushParagraph();
        flushCodeBlock();
        inCodeBlock = false;
      } else {
        // Start code block
        flushParagraph();
        inCodeBlock = true;
        codeBlockLanguage = codeBlockMatch[1] || '';
      }
      return;
    }

    if (inCodeBlock) {
      // Preserve exact line content including indentation and formatting for multi-line display
      codeBlockContent.push(line);
      return;
    }

    // Handle headers with enhanced styling
    if (line.startsWith('### ')) {
      flushParagraph();
      elements.push(
        <h3 key={elements.length} className="text-2xl font-bold text-dark-text mb-4 mt-8 border-b-2 border-theme-primary/30 pb-2">
          {parseInlineMarkdown(line.substring(4))}
        </h3>
      );
      return;
    }

    if (line.startsWith('## ')) {
      flushParagraph();
      elements.push(
        <h2 key={elements.length} className="text-3xl font-bold text-dark-text mb-5 mt-10 border-b-2 border-theme-primary/50 pb-3">
          {parseInlineMarkdown(line.substring(3))}
        </h2>
      );
      return;
    }

    if (line.startsWith('# ')) {
      flushParagraph();
      elements.push(
        <h1 key={elements.length} className="text-4xl font-bold text-dark-text mb-6 mt-12 border-b-4 border-theme-primary pb-4">
          {parseInlineMarkdown(line.substring(2))}
        </h1>
      );
      return;
    }

    // Handle blockquotes with enhanced styling and preserved formatting
    if (line.startsWith('> ')) {
      flushParagraph();
      elements.push(
        <blockquote key={elements.length} className="border-l-4 border-theme-primary pl-6 py-3 mb-6 bg-theme-primary/10 rounded-r-xl shadow-lg">
          <p className="text-dark-text italic text-lg leading-relaxed whitespace-pre-wrap">
            {parseInlineMarkdown(line.substring(2))}
          </p>
        </blockquote>
      );
      return;
    }

    // Handle unordered lists
    if (line.match(/^\s*[-*+]\s+/)) {
      flushParagraph();
      const listContent = line.replace(/^\s*[-*+]\s+/, '');
      elements.push(
        <ul key={elements.length} className="list-disc list-inside mb-4 ml-4">
          <li className="text-dark-text mb-2 leading-relaxed whitespace-pre-wrap">
            {parseInlineMarkdown(listContent)}
          </li>
        </ul>
      );
      return;
    }

    // Handle ordered lists
    if (line.match(/^\s*\d+\.\s+/)) {
      flushParagraph();
      const listContent = line.replace(/^\s*\d+\.\s+/, '');
      elements.push(
        <ol key={elements.length} className="list-decimal list-inside mb-4 ml-4">
          <li className="text-dark-text mb-2 leading-relaxed whitespace-pre-wrap">
            {parseInlineMarkdown(listContent)}
          </li>
        </ol>
      );
      return;
    }

    // Handle horizontal rules
    if (line.match(/^---+$/) || line.match(/^\*\*\*+$/) || line.match(/^___+$/)) {
      flushParagraph();
      elements.push(
        <hr key={elements.length} className="border-t-2 border-gray-500 my-8" />
      );
      return;
    }

    // Handle empty lines - preserve them for proper spacing
    if (line.trim() === '') {
      if (currentParagraph.length > 0) {
        flushParagraph();
      }
      // Add a line break element to preserve spacing
      elements.push(
        <div key={elements.length} className="h-4"></div>
      );
      return;
    }

    // Add to current paragraph
    currentParagraph.push(line);
  });

  // Flush any remaining paragraph
  flushParagraph();

  // Flush any unterminated code block at EOF
  if (inCodeBlock) {
    flushCodeBlock();
  }

  return <div className="markdown-rendered prose prose-lg max-w-none">{elements}</div>;
}

// Enhanced inline Markdown formatting parser with improved link handling and preserved formatting
function parseInlineMarkdown(text: string): React.ReactNode {
  if (!text) return text;

  let key = 0;

  // Process inline formatting with proper precedence and nesting support
  const processText = (inputText: string): React.ReactNode[] => {
    const result: React.ReactNode[] = [];
    let remainingText = inputText;

    // Define patterns with proper typing and improved link regex
    interface MarkdownPattern {
      regex: RegExp;
      render: (match: RegExpMatchArray) => React.ReactNode;
    }

    const patterns: MarkdownPattern[] = [
      // Enhanced Links: [text](url) - Improved regex to handle various URL formats
      {
        regex: /\[([^\]]+)\]\(([^)]+)\)/g,
        render: (match: RegExpMatchArray) => {
          const linkText = match[1];
          const linkUrl = match[2];
          
          // Handle cases where URL might be incomplete or malformed
          let finalUrl = linkUrl;
          
          // If the URL is empty or just contains protocol separators
          if (!linkUrl || linkUrl.trim() === '' || linkUrl === 'https://' || linkUrl === 'http://') {
            // Use the link text as URL if it looks like a URL
            if (linkText && (linkText.startsWith('http://') || linkText.startsWith('https://') || linkText.includes('.'))) {
              finalUrl = linkText.startsWith('http') ? linkText : `https://${linkText}`;
            } else {
              finalUrl = '#'; // Fallback for invalid URLs
            }
          } else {
            // Clean up the URL
            finalUrl = linkUrl.trim();
            
            // Add protocol if missing
            if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://') && !finalUrl.startsWith('mailto:') && !finalUrl.startsWith('#')) {
              // Handle protocol-relative URLs
              if (finalUrl.startsWith('//')) {
                finalUrl = `https:${finalUrl}`;
              } else {
                finalUrl = `https://${finalUrl}`;
              }
            }
          }
          
          return (
            <a
              key={key++}
              href={finalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-theme-primary hover:text-theme-secondary underline decoration-2 underline-offset-2 transition-colors duration-300 font-medium"
            >
              {linkText}
            </a>
          );
        }
      },
      // Bold: **text** - process before italic to handle ***text***
      {
        regex: /\*\*([^*]+)\*\*/g,
        render: (match: RegExpMatchArray) => (
          <strong key={key++} className="font-bold text-dark-text">
            {processText(match[1])}
          </strong>
        )
      },
      // Strikethrough: ~~text~~
      {
        regex: /~~([^~]+)~~/g,
        render: (match: RegExpMatchArray) => (
          <span key={key++} className="line-through text-dark-text-secondary decoration-2">
            {processText(match[1])}
          </span>
        )
      },
      // Italic: *text* - process after bold and strikethrough
      {
        regex: /\*([^*]+)\*/g,
        render: (match: RegExpMatchArray) => (
          <em key={key++} className="italic text-dark-text">
            {processText(match[1])}
          </em>
        )
      },
      // Inline code: `code` - process last to avoid conflicts
      {
        regex: /`([^`]+)`/g,
        render: (match: RegExpMatchArray) => (
          <code key={key++} className="bg-dark-surface border border-gray-500 rounded-md px-2 py-1 font-mono text-sm text-green-400 shadow-sm">
            {match[1]}
          </code>
        )
      }
    ];

    // Process all patterns in order
    let processedText = remainingText;
    
    for (const pattern of patterns) {
      const parts: React.ReactNode[] = [];
      let lastIndex = 0;
      let match;
      
      // Reset regex lastIndex to ensure proper matching
      pattern.regex.lastIndex = 0;
      
      while ((match = pattern.regex.exec(processedText)) !== null) {
        // Add text before the match
        if (match.index > lastIndex) {
          const beforeText = processedText.substring(lastIndex, match.index);
          if (beforeText) {
            parts.push(beforeText);
          }
        }
        
        // Add the formatted element
        parts.push(pattern.render(match));
        
        lastIndex = match.index + match[0].length;
        
        // Prevent infinite loop for global regex
        if (!pattern.regex.global) {
          break;
        }
      }
      
      // Add remaining text
      if (lastIndex < processedText.length) {
        const remainingPart = processedText.substring(lastIndex);
        if (remainingPart) {
          parts.push(remainingPart);
        }
      }
      
      // If we found matches, update the processed text for next pattern
      if (parts.length > 0) {
        // For subsequent patterns, we need to process each part that's still a string
        const newParts: React.ReactNode[] = [];
        for (const part of parts) {
          if (typeof part === 'string') {
            // This part can still be processed by other patterns
            newParts.push(part);
          } else {
            // This part is already a React element, keep it as is
            newParts.push(part);
          }
        }
        
        // If we have React elements, we need to handle them differently
        if (newParts.some(part => typeof part !== 'string')) {
          result.push(...newParts);
          return result;
        } else {
          // All parts are still strings, continue processing
          processedText = newParts.join('');
        }
      }
    }
    
    // If no patterns matched, return the original text
    if (result.length === 0) {
      result.push(processedText);
    }
    
    return result;
  };

  const processedElements = processText(text);
  return processedElements.length === 1 ? processedElements[0] : <>{processedElements}</>;
}

// Helper function to strip Markdown for previews
export function stripMarkdown(content: string): string {
  if (!content) return '';

  return content
    // Remove headers
    .replace(/^#{1,6}\s+/gm, '')
    // Remove bold/italic
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    // Remove strikethrough
    .replace(/~~([^~]+)~~/g, '$1')
    // Remove inline code
    .replace(/`([^`]+)`/g, '$1')
    // Remove links
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove blockquotes
    .replace(/^>\s+/gm, '')
    // Remove code blocks
    .replace(/```[\s\S]*?```/g, '[代码块]')
    // Remove list markers
    .replace(/^\s*[-*+]\s+/gm, '')
    .replace(/^\s*\d+\.\s+/gm, '')
    // Remove horizontal rules
    .replace(/^---+$/gm, '')
    .replace(/^\*\*\*+$/gm, '')
    .replace(/^___+$/gm, '')
    // Clean up extra whitespace but preserve some structure
    .replace(/\n\s*\n/g, '\n')
    .trim();
}
