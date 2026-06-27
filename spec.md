# Specification

## Summary
**Goal:** Fix multi-line Markdown fenced code block (triple backticks) editing and rendering so code blocks display correctly in both the article reader and editor preview.

**Planned changes:**
- Update Markdown rendering in the Article reader page and Editor preview to preserve newlines and indentation inside fenced code blocks and prevent collapsing into a single line.
- Ensure code blocks handle long lines without removing line breaks (provide consistent wrapping behavior or horizontal scrolling).
- Add a dedicated editor toolbar action to insert a fenced code block template (triple backticks) and place the cursor inside it, while keeping the existing inline code action unchanged.
- Harden fenced code block parsing to reliably recognize CRLF newlines, optional language specifiers (e.g., ```js), and gracefully render an unterminated final code block as a code block instead of plain text.

**User-visible outcome:** Users can write and read articles with properly formatted multi-line code blocks (including indentation), preview them accurately in the editor, and insert fenced code blocks from the toolbar without manually typing triple backticks.
