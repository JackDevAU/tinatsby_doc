
import React from "react";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import { useTina, tinaField, useEditState } from "tinacms/dist/react";

const ContentTemplate = ({ pageContext }) => {
  const { edit } = useEditState()

  const { query, variables, parsedMdx } = pageContext;

  const { data } = useTina({
    query: query,
    variables: variables,
    data: parsedMdx,
  });
  
  if(edit){
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
  }
  
  return (
    <div>
      <TinaMarkdown content={data} />
    </div>
  );
};

export default ContentTemplate;
