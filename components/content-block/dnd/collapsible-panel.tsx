'use client'

import { ChevronDownIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import DragHandle from './drag-handle'
import { forwardRef } from 'react'
import { Collapsible as CollapsiblePrimitive } from "@base-ui/react/collapsible"
import { type BlockData } from "../types"


type CollapsiblePanelProps = CollapsiblePrimitive.Root.Props & {
  block: BlockData;
}

const CollapsiblePanel = forwardRef<HTMLDivElement, CollapsiblePanelProps>(({ block, className, ...props }, forwardRef) => {

  return (
    <Collapsible ref={forwardRef} key={block.id} className={cn("flex flex-col gap-2 border mb-2", className)} {...props}>
      <div className='flex items-center justify-between p-2 bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-900'>
        <div className='flex items-center text-lg'>
          <DragHandle id={block.id} />
          <div className="text-xs mr-2">{String(block.id).padStart(2, '0')}</div>
          <div className="text-sm dark:text-muted font-semibold bg-zinc-100 px-3 border border-transparent rounded-sm">{block?.content?.title}</div>
        </div>
        <CollapsibleTrigger render={<Button variant='ghost' size='icon-sm' />} className='group'>
          <ChevronDownIcon className='text-muted-foreground transition-transform group-data-[state=open]:rotate-180' />
          <span className='sr-only'>Toggle</span>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent
        className={cn('data-closed:animate-collapsible-up data-starting-style:animate-collapsible-down data-open:animate-collapsible-down data-ending-style:animate-collapsible-up [--radix-collapsible-content-height:var(--collapsible-content-height)]', 'p-4')}
      >
        <div className='group relative w-full'>
          <label
            htmlFor='full-name'
            className='origin-start text-muted-foreground group-focus-within:text-foreground has-[+input:not(:placeholder-shown)]:text-foreground absolute top-1/2 block -translate-y-1/2 cursor-text px-2 text-sm transition-all group-focus-within:pointer-events-none group-focus-within:top-0 group-focus-within:cursor-default group-focus-within:text-xs group-focus-within:font-medium has-[+input:not(:placeholder-shown)]:pointer-events-none has-[+input:not(:placeholder-shown)]:top-0 has-[+input:not(:placeholder-shown)]:cursor-default has-[+input:not(:placeholder-shown)]:text-xs has-[+input:not(:placeholder-shown)]:font-medium'
          >
            <span className='bg-background inline-flex px-1'>Full Name</span>
          </label>
          <Input id='full-name' type='text' placeholder=' ' className='dark:bg-background' />
        </div>
        <div className='group relative w-full space-y-2'>
          <label
            htmlFor='address'
            className='origin-start text-muted-foreground group-focus-within:text-foreground has-[+textarea:not(:placeholder-shown)]:text-foreground has-aria-invalid:ring-destructive/20 dark:has-aria-invalid:ring-destructive/40 has-aria-invalid:border-destructive absolute top-0 block translate-y-2 cursor-text px-2 text-sm transition-all group-focus-within:pointer-events-none group-focus-within:-translate-y-1/2 group-focus-within:cursor-default group-focus-within:text-xs group-focus-within:font-medium has-[+textarea:not(:placeholder-shown)]:pointer-events-none has-[+textarea:not(:placeholder-shown)]:-translate-y-1/2 has-[+textarea:not(:placeholder-shown)]:cursor-default has-[+textarea:not(:placeholder-shown)]:text-xs has-[+textarea:not(:placeholder-shown)]:font-medium'
          >
            <span className='bg-background inline-flex px-1'>Address</span>
          </label>
          <Textarea id='address' placeholder=' ' className='!bg-background' />
        </div>
        <div className='group relative w-full'>
          <label
            htmlFor='pin-code'
            className='origin-start text-muted-foreground group-focus-within:text-foreground has-[+input:not(:placeholder-shown)]:text-foreground absolute top-1/2 block -translate-y-1/2 cursor-text px-2 text-sm transition-all group-focus-within:pointer-events-none group-focus-within:top-0 group-focus-within:cursor-default group-focus-within:text-xs group-focus-within:font-medium has-[+input:not(:placeholder-shown)]:pointer-events-none has-[+input:not(:placeholder-shown)]:top-0 has-[+input:not(:placeholder-shown)]:cursor-default has-[+input:not(:placeholder-shown)]:text-xs has-[+input:not(:placeholder-shown)]:font-medium'
          >
            <span className='bg-background inline-flex px-1'>Pin Code</span>
          </label>
          <Input id='pin-code' type='number' placeholder=' ' className='dark:bg-background' />
        </div>
        <div className='group relative w-full'>
          <label
            htmlFor='city-name'
            className='origin-start text-muted-foreground group-focus-within:text-foreground has-[+input:not(:placeholder-shown)]:text-foreground absolute top-1/2 block -translate-y-1/2 cursor-text px-2 text-sm transition-all group-focus-within:pointer-events-none group-focus-within:top-0 group-focus-within:cursor-default group-focus-within:text-xs group-focus-within:font-medium has-[+input:not(:placeholder-shown)]:pointer-events-none has-[+input:not(:placeholder-shown)]:top-0 has-[+input:not(:placeholder-shown)]:cursor-default has-[+input:not(:placeholder-shown)]:text-xs has-[+input:not(:placeholder-shown)]:font-medium'
          >
            <span className='bg-background inline-flex px-1'>City</span>
          </label>
          <Input id='city-name' type='text' placeholder=' ' className='dark:bg-background' />
        </div>
        <div className='group relative w-full'>
          <label
            htmlFor='landmark'
            className='origin-start text-muted-foreground group-focus-within:text-foreground has-[+input:not(:placeholder-shown)]:text-foreground absolute top-1/2 block -translate-y-1/2 cursor-text px-2 text-sm transition-all group-focus-within:pointer-events-none group-focus-within:top-0 group-focus-within:cursor-default group-focus-within:text-xs group-focus-within:font-medium has-[+input:not(:placeholder-shown)]:pointer-events-none has-[+input:not(:placeholder-shown)]:top-0 has-[+input:not(:placeholder-shown)]:cursor-default has-[+input:not(:placeholder-shown)]:text-xs has-[+input:not(:placeholder-shown)]:font-medium'
          >
            <span className='bg-background inline-flex px-1'>Landmark</span>
          </label>
          <Input id='landmark' type='text' placeholder=' ' className='dark:bg-background' />
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
})

export default CollapsiblePanel
