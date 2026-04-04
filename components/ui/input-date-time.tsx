"use client"

import { ChangeEvent, ComponentProps, forwardRef, useImperativeHandle, useRef, useState } from "react"
import { format, add, startOfDay } from "date-fns"

import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { CalendarIcon, Clock2Icon } from "lucide-react"
import { InputGroup, InputGroupAddon, InputGroupInput } from "./input-group"




const InputDateTime = forwardRef((props: ComponentProps<"input">, ref) => {
  const [date, setDate] = useState<string | undefined>(props.value as string)
  const [isOpen, setIsOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Expose specific methods to the parent component's ref
  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef?.current?.focus();
    },
    // Add other native-like methods if needed
    getValue: () => date,
  }));

  const handleDateChange = (newDate: Date | undefined) => {
    const isodate = newDate?.toISOString()
    setDate(isodate)

    // Mimic the native event structure for consistency
    if (props.onChange) {
      props.onChange((
        {
          target: {
            name: props.name || '',
            value: newDate?.toISOString() || '', // Use ISO string for consistent value
          },
        } as React.ChangeEvent<HTMLInputElement>
      ));
    }
  };

  const handleTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const time = e.target.value;
    const [hours, minutes] = (time || '').split(":").map((str) => parseInt(str, 10));

    const _date = date
      ? new Date(date)
      : new Date()

    const isodate = _date?.toISOString()
    const datetime = add(startOfDay(isodate), { hours, minutes })

    if (props.onChange) {
      props.onChange((
        {
          target: {
            name: props.name || '',
            value: datetime?.toISOString() || '', // Use ISO string for consistent value
          },
        } as React.ChangeEvent<HTMLInputElement>
      ))
    }
  }

  const toggleCalendar = () => setIsOpen(!isOpen);


  return (
    <>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger nativeButton={false} render={<InputGroup />}>
          <InputGroupInput
            {...props} // Spread other native props
            ref={inputRef}
            id={props.id}
            type="text" // Use text to control the display format, don't use native date type here
            onClick={toggleCalendar}
            onFocus={props.onFocus}
            onBlur={props.onBlur}
            className={cn(props.className)}
            readOnly // Prevent manual typing to enforce picker usage for this example
            value={date ? format(new Date(date), "PPP p") : ""}
          />
          <InputGroupAddon align="inline-end">
            {/* <Clock2Icon className="text-muted-foreground" /> */}
            <CalendarIcon className="mr-2 h-4 w-4" />
          </InputGroupAddon>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            captionLayout="dropdown"
            selected={date ? new Date(date) : undefined}
            onSelect={handleDateChange}
            className="w-full"
            autoFocus
          />

          <InputGroup>
            <InputGroupInput
              id="time"
              type="time"
              step="1"
              defaultValue="00:00"
              className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
              onChange={handleTimeChange}
            />
            <InputGroupAddon>
              <Clock2Icon className="text-muted-foreground" />
            </InputGroupAddon>
          </InputGroup>
        </PopoverContent>
      </Popover>
    </>
  )
})

InputDateTime.displayName = "InputDateTime"

export { InputDateTime }