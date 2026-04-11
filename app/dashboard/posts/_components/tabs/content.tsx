/** @todo reminder to delete this file */
"use client"

import { useState } from "react"

// import "@blocknote/core/fonts/inter.css"
import { Block } from "@blocknote/core";
import { useCreateBlockNote } from "@blocknote/react"
import { BlockNoteView } from "@blocknote/shadcn"
import "@blocknote/shadcn/style.css"
import { useTheme } from "next-themes"

import "./content.css"

type Theme = "light" | "dark";


const TabItemContent = () => {
  const editor = useCreateBlockNote()
  const [blocks, setBlocks] = useState<Block[]>(editor.document)
  const { resolvedTheme = "light" } = useTheme()



  return (
    <>
      <div
        className="group field-sizing-content min-h-64 w-full resize-none rounded-xl border border-input py-4 text-base transition-colors outline-none placeholder:text-muted-foreground group has-focus-visible:border-ring has-focus-visible:ring-[3px] has-focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/20 md:text-sm dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40"
      >
        <BlockNoteView
          editor={editor}
          onChange={() => { setBlocks(editor.document) }}
          theme={resolvedTheme as Theme}
          shadCNComponents={
            {
              // Pass modified ShadCN components from your project here.
              // Otherwise, the default ShadCN components will be used.
            }
          }
        />
      </div>
      <div className={"item bordered"}>
        <pre>
          <code>{JSON.stringify(blocks, null, 2)}</code>
        </pre>
      </div>
    </>
  )
}

export default TabItemContent