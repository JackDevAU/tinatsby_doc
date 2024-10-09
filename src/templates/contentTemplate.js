"use client";
import React from "react";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import { useTina, tinaField } from "tinacms/dist/react";

const ContentTemplate = ({ pageContext }) => {
  const { query, variables, parsedMdx } = pageContext;

  const { data } = useTina({
    query: query,
    variables: variables,
    data: parsedMdx,
  });

  return (
    <div>
      <h1 data-tina-field={tinaField(data?.post, "title")}>
        {data?.post?.title}
      </h1>

      <div data-tina-field={tinaField(data?.post, "body")}>
        <TinaMarkdown content={data?.post?.body} />
      </div>
    </div>
  );
};

export default ContentTemplate;