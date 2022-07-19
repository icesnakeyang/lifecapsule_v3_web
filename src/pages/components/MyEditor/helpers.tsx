// for export data to HTML
export const getOptions = () => {
  return {
    blockStyleFn: (block: any) => {
      const type = block.getType();
      if (type === "header-two") {
        return {
          element: "h2",
          attributes: {
            className: "article_header",
          },
        };
      }
      if (type === "blockquote") {
        return {
          element: "p",
          attributes: {
            className: "article_blockquote",
          },
        };
      }
      if (type === "unstyled") {
        return {
          element: "p",
          attributes: {
            className: "article_paragraph",
          },
        };
      }
    },

    inlineStyles: {
      // Override default element (`strong`).
      BOLD: { element: "span", attributes: { className: "custom_bold" } },
      // BOLD: { element: "span", attributes: { className: "custom_bold" } },
      ITALIC: { element: "span", attributes: { className: "custom_italic" } },
      // Use camel-case. Units (`px`) will be added where necessary.
      HEADERONE: {
        // Add custom attributes. You can also use React-style `className`.
        attributes: { className: "foo" },
        // Use camel-case. Units (`px`) will be added where necessary.
        style: { fontSize: 12 },
      },
      // Use a custom inline style. Default element is `span`.
      // CUSTOM_BTN: { element: "p", attributes: { className: "custom_btn" } }
    },

    entityStyleFn: (entity: any) => {
      const entityType = entity.get("type").toLowerCase();
      if (entityType === "custom_btn") {
        return {
          element: "div",
          attributes: {
            className: entityType,
          },
        };
      }
      if (entityType === "link") {
        const { url } = entity.getData();
        return {
          element: "a",
          attributes: {
            className: "custom_link",
            href: url,
          },
        };
      }
    },
  };
};
