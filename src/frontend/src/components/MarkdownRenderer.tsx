import type React from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

// Force cast to the expected style record type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const syntaxStyle = vscDarkPlus as unknown as {
  [key: string]: React.CSSProperties;
};

// Static remark plugins array — never recreated
const remarkPlugins = [remarkGfm];

// Static components object — defined once outside the component
const components = {
  // Images with max-width and rounded corners
  img({
    src,
    alt,
    title,
    ...props
  }: React.ImgHTMLAttributes<HTMLImageElement>) {
    const label = alt || title || "图片";
    // biome-ignore lint/a11y/useAltText: alt and aria-label are set via label variable
    return (
      <img
        src={src}
        alt={label}
        aria-label={label}
        title={title}
        className="max-w-full rounded-xl my-6 shadow-lg border-2 border-dark-border"
        loading="lazy"
        {...props}
      />
    );
  },

  // Code blocks with syntax highlighting
  code({
    inline,
    className: codeClassName,
    children,
    ...props
  }: {
    inline?: boolean;
    className?: string;
    children?: React.ReactNode;
  } & React.HTMLAttributes<HTMLElement>) {
    const match = /language-(\w+)/.exec(codeClassName || "");
    const language = match ? match[1] : "";

    if (!inline && language) {
      return (
        <div className="my-6 rounded-xl overflow-hidden border-2 border-dark-border shadow-lg">
          <div className="bg-dark-surface px-4 py-2 text-xs text-dark-text-secondary font-mono border-b border-dark-muted flex items-center justify-between">
            <span>{language}</span>
            <span className="text-dark-text-secondary">code</span>
          </div>
          <SyntaxHighlighter
            // @ts-expect-error react-syntax-highlighter style prop type mismatch
            style={syntaxStyle}
            language={language}
            PreTag="div"
            customStyle={{
              margin: 0,
              borderRadius: 0,
              fontSize: "0.875rem",
              lineHeight: "1.6",
              padding: "1.5rem",
            }}
            {...props}
          >
            {String(children).replace(/\n$/, "")}
          </SyntaxHighlighter>
        </div>
      );
    }

    // Inline code or code block without language
    if (!inline) {
      return (
        <div className="my-6 rounded-xl overflow-hidden border-2 border-dark-border shadow-lg">
          <SyntaxHighlighter
            // @ts-expect-error react-syntax-highlighter style prop type mismatch
            style={syntaxStyle}
            language="text"
            PreTag="div"
            customStyle={{
              margin: 0,
              borderRadius: 0,
              fontSize: "0.875rem",
              lineHeight: "1.6",
              padding: "1.5rem",
            }}
            {...props}
          >
            {String(children).replace(/\n$/, "")}
          </SyntaxHighlighter>
        </div>
      );
    }

    // Inline code
    return (
      <code
        className="bg-dark-surface border border-dark-border rounded-md px-2 py-1 font-mono text-sm text-dark-success shadow-sm"
        {...props}
      >
        {children}
      </code>
    );
  },

  // Tables with borders and header styling
  table({ children }: React.TableHTMLAttributes<HTMLTableElement>) {
    return (
      <div className="my-6 overflow-x-auto rounded-xl border-2 border-dark-border shadow-lg">
        <table className="w-full border-collapse">{children}</table>
      </div>
    );
  },

  thead({ children }: React.HTMLAttributes<HTMLTableSectionElement>) {
    return (
      <thead className="bg-theme-primary/20 border-b-2 border-dark-border">
        {children}
      </thead>
    );
  },

  th({ children }: React.ThHTMLAttributes<HTMLTableHeaderCellElement>) {
    return (
      <th className="px-4 py-3 text-left text-dark-text font-bold border-r border-dark-muted last:border-r-0">
        {children}
      </th>
    );
  },

  td({ children }: React.TdHTMLAttributes<HTMLTableDataCellElement>) {
    return (
      <td className="px-4 py-3 text-dark-text border-r border-dark-muted/50 last:border-r-0 border-b border-dark-muted/30">
        {children}
      </td>
    );
  },

  tr({ children }: React.HTMLAttributes<HTMLTableRowElement>) {
    return (
      <tr className="even:bg-dark-surface/50 hover:bg-theme-primary/5 transition-colors duration-200">
        {children}
      </tr>
    );
  },

  // Task lists (checkboxes)
  input({
    type,
    checked,
    ...props
  }: React.InputHTMLAttributes<HTMLInputElement>) {
    if (type === "checkbox") {
      return (
        <input
          type="checkbox"
          checked={checked}
          readOnly
          className="mr-2 h-4 w-4 rounded border-dark-border bg-dark-surface text-theme-primary focus:ring-theme-primary cursor-default"
          {...props}
        />
      );
    }
    return <input type={type} {...props} />;
  },

  // Headings
  h1({ children }: React.HTMLAttributes<HTMLHeadingElement>) {
    return (
      <h1 className="text-4xl font-bold text-dark-text mb-6 mt-12 border-b-4 border-theme-primary pb-4 leading-tight">
        {children}
      </h1>
    );
  },

  h2({ children }: React.HTMLAttributes<HTMLHeadingElement>) {
    return (
      <h2 className="text-3xl font-bold text-dark-text mb-5 mt-10 border-b-2 border-theme-primary/50 pb-3 leading-tight">
        {children}
      </h2>
    );
  },

  h3({ children }: React.HTMLAttributes<HTMLHeadingElement>) {
    return (
      <h3 className="text-2xl font-bold text-dark-text mb-4 mt-8 border-b-2 border-theme-primary/30 pb-2 leading-tight">
        {children}
      </h3>
    );
  },

  h4({ children }: React.HTMLAttributes<HTMLHeadingElement>) {
    return (
      <h4 className="text-xl font-bold text-dark-text mb-3 mt-6 leading-tight">
        {children}
      </h4>
    );
  },

  h5({ children }: React.HTMLAttributes<HTMLHeadingElement>) {
    return (
      <h5 className="text-lg font-bold text-dark-text mb-2 mt-4 leading-tight">
        {children}
      </h5>
    );
  },

  h6({ children }: React.HTMLAttributes<HTMLHeadingElement>) {
    return (
      <h6 className="text-base font-bold text-dark-text mb-2 mt-4 leading-tight">
        {children}
      </h6>
    );
  },

  // Paragraphs
  p({ children }: React.HTMLAttributes<HTMLParagraphElement>) {
    return (
      <p className="mb-6 leading-relaxed text-dark-text whitespace-pre-wrap">
        {children}
      </p>
    );
  },

  // Links
  a({
    href,
    children,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-theme-primary hover:text-theme-secondary underline decoration-2 underline-offset-2 transition-colors duration-300 font-medium"
        {...props}
      >
        {children}
      </a>
    );
  },

  // Blockquotes
  blockquote({ children }: React.BlockquoteHTMLAttributes<HTMLQuoteElement>) {
    return (
      <blockquote className="border-l-4 border-theme-primary pl-6 py-3 mb-6 bg-theme-primary/10 rounded-r-xl shadow-lg">
        <div className="text-dark-text italic text-lg leading-relaxed">
          {children}
        </div>
      </blockquote>
    );
  },

  // Lists
  ul({ children }: React.HTMLAttributes<HTMLUListElement>) {
    return (
      <ul className="list-disc list-inside mb-6 ml-4 space-y-2">{children}</ul>
    );
  },

  ol({ children }: React.HTMLAttributes<HTMLOListElement>) {
    return (
      <ol className="list-decimal list-inside mb-6 ml-4 space-y-2">
        {children}
      </ol>
    );
  },

  li({ children }: React.LiHTMLAttributes<HTMLLIElement>) {
    return <li className="text-dark-text leading-relaxed">{children}</li>;
  },

  // Horizontal rule
  hr(props: React.HTMLAttributes<HTMLHRElement>) {
    return <hr className="border-t-2 border-dark-border my-8" {...props} />;
  },

  // Strong and emphasis
  strong({ children }: React.HTMLAttributes<HTMLElement>) {
    return <strong className="font-bold text-dark-text">{children}</strong>;
  },

  em({ children }: React.HTMLAttributes<HTMLElement>) {
    return <em className="italic text-dark-text">{children}</em>;
  },

  // Strikethrough (del)
  del({ children }: React.HTMLAttributes<HTMLElement>) {
    return (
      <del className="line-through text-dark-text-secondary decoration-2">
        {children}
      </del>
    );
  },

  // Pre (wrapper for code blocks, handled by code component)
  pre({ children }: React.HTMLAttributes<HTMLPreElement>) {
    return <>{children}</>;
  },
};

export default function MarkdownRenderer({
  content,
  className = "",
}: MarkdownRendererProps) {
  if (!content) {
    return (
      <p className="text-dark-text-secondary italic">
        预览区域 - 开始输入以查看渲染效果
      </p>
    );
  }

  return (
    <div className={`markdown-rendered ${className}`}>
      <ReactMarkdown remarkPlugins={remarkPlugins} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
