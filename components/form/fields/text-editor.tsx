"use client"

// import { ComponentProps, useState, useEffect } from "react"
// import { Block } from "@blocknote/core"
import { BlockNoteEditor, PartialBlock } from "@blocknote/core"
import { useCreateBlockNote } from "@blocknote/react"
import { BlockNoteView } from "@blocknote/shadcn"
import "@blocknote/shadcn/style.css"
import { useTheme } from "next-themes"

import "./text-editor.css"
import { useFieldContext } from "../form.hook";
import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@/components/ui/field"
import { FieldInfo } from '../partials/field-info'
import { INITIAL_BLOCK_VALUE } from "@/app/dashboard/posts/_components/post-form.constant"
import { useEffect, useMemo } from "react"

type Theme = "light" | "dark";

type TextEditorFieldProps = {
  label?: string;
  description?: string;
};


export const TextEditorField = ({ label, description }: TextEditorFieldProps) => {
  // Can be a string containing JSON array of blocks, or directly an object `{ content, content_html, content_blocks }`
  // We'll manage the state as the whole object required in MongoDB schema.
  type TextEditorValue = {
    content?: string;
    content_html?: string;
    content_blocks?: PartialBlock[];
  };

  const field = useFieldContext<TextEditorValue | undefined>();
  const { resolvedTheme = "light" } = useTheme();

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  // Parse the initial value safely
  const initialContent = field.state.value?.content_blocks;

  // const validInitialContent = Array.isArray(initialContent) && initialContent.length > 0 && initialContent[0].type
  //   ? initialContent as PartialBlock[]
  //   : INITIAL_BLOCK_VALUE as PartialBlock[]

  const validInitialContent = Array.isArray(initialContent) && initialContent.length > 0 && initialContent[0].type
      ? initialContent as PartialBlock[]
      : INITIAL_BLOCK_VALUE as PartialBlock[]

  const editor = useCreateBlockNote({
    initialContent: validInitialContent,
  });





  // const editor = useMemo(() => {
  //   // if (initialContent === "loading") {
  //   //   return undefined;
  //   // }

  //   const validInitialContent = Array.isArray(initialContent) && initialContent.length > 0 && initialContent[0].type
  //     ? initialContent as PartialBlock[]
  //     : INITIAL_BLOCK_VALUE as PartialBlock[]

  //   return BlockNoteEditor.create({ initialContent: validInitialContent });

  //   // return useCreateBlockNote({
  //   //   initialContent: validInitialContent
  //   // })
  // }, [initialContent]);

  // // // Sets the initial document JSON
  // // // useEffect(() => setBlocks(editor.document), []);

  const handleChange = async () => {
    // Generate both HTML and JSON formats
    const blocks = editor.document;
    const content = JSON.stringify(blocks);
    const content_html = await editor.blocksToHTMLLossy(blocks);

    // Update the react-form field with the complex object structure
    field.handleChange({
      content: content,
      content_html: content_html,
      content_blocks: blocks,
    });
  };

  return (
    <>
      <Field data-invalid={isInvalid}>
        {label && (
          <FieldLabel htmlFor={field.name}>
            {label}
          </FieldLabel>
        )}
        <div
          className="group field-sizing-content min-h-[500px] w-full resize-none rounded-xl border border-input py-4 text-base transition-colors outline-none placeholder:text-muted-foreground group has-focus-visible:border-ring has-focus-visible:ring-[3px] has-focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/20 md:text-sm dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 overflow-x-hidden"
        >
          <BlockNoteView
            editor={editor}
            onChange={handleChange}
            theme={resolvedTheme as Theme}
            shadCNComponents={{}}
          />
        </div>

        {/* <div className={"item bordered"}>
          <pre>
            <code>{JSON.stringify(editor.document, null, 2)}</code>
          </pre>
        </div> */}

        {description && (
          <FieldDescription>
            {description}
          </FieldDescription>
        )}
        <FieldInfo field={field} />
      </Field>
    </>
  )
}