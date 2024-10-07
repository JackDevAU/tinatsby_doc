import React, { useRef } from "react";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import { useTina } from 'tinacms/dist/react';

const ContentTemplate = ({ pageContext }) => {
    const { query, variables, parsedMdx } = pageContext;

    const { data } = useTina({
        query: query,
        variables: variables,
        data: parsedMdx,
    });

    // const refData = useRef(data);

    return (
        <div>
            <h1>Markdown test</h1>
            <TinaMarkdown content={parsedMdx} />
        </div>
    );
};

export default ContentTemplate;