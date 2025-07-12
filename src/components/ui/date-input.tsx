"use client";

import * as React from "react";

import { format, parse, isValid } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "./button";
import { Calendar } from "./calendar";
import { Input } from "./input";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

export interface DateInputProps {
  /** The current date value */
  value?: Date;
  /** Callback when date changes */
  onChange?: (date: Date | undefined) => void;
  /** Placeholder text for the input */
  placeholder?: string;
  /** Date format for display (default: "PPP") */
  dateFormat?: string;
  /** Input date format for parsing user input (default: "yyyy-MM-dd") */
  inputDateFormat?: string;
  /** Disable the input */
  disabled?: boolean;
  /** Required field */
  required?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Minimum selectable date */
  minDate?: Date;
  /** Maximum selectable date */
  maxDate?: Date;
  /** Show today button in calendar */
  showToday?: boolean;
  /** Show clear button */
  showClear?: boolean;
  /** Name attribute for forms */
  name?: string;
  /** Error state */
  error?: boolean;
  /** Error message */
  errorMessage?: string;
  /** Custom input props */
  inputProps?: Omit<
    React.ComponentProps<"input">,
    "value" | "onChange" | "type"
  >;
  /** Custom calendar props */
  calendarProps?: Omit<
    React.ComponentProps<typeof Calendar>,
    "mode" | "selected" | "onSelect"
  >;
  /** Enable month and year dropdowns in calendar */
  showMonthYearPicker?: boolean;
}

const DateInput = React.forwardRef<HTMLInputElement, DateInputProps>(
  (
    {
      value,
      onChange,
      placeholder = "Pick a date",
      dateFormat = "PPP",
      inputDateFormat = "yyyy-MM-dd",
      disabled = false,
      required = false,
      className,
      minDate,
      maxDate,
      showToday = true,
      showClear = true,
      showMonthYearPicker = false,
      name,
      error = false,
      errorMessage,
      inputProps,
      calendarProps,
      ...props
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(false);
    const [inputValue, setInputValue] = React.useState("");
    const [inputError, setInputError] = React.useState<string | null>(null);
    const [month, setMonth] = React.useState<Date | undefined>(value);

    // Format date for display
    const formatDisplayDate = React.useCallback(
      (date: Date | undefined) => {
        if (!date) return "";
        try {
          return format(date, dateFormat);
        } catch {
          return "";
        }
      },
      [dateFormat]
    );

    // Update input value when value prop changes
    React.useEffect(() => {
      setInputValue(formatDisplayDate(value));
      setInputError(null);
      setMonth(value);
    }, [value, formatDisplayDate]);

    // Handle input change for manual date entry
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setInputValue(newValue);
      setInputError(null);

      if (!newValue.trim()) {
        onChange?.(undefined);
        return;
      }

      // Try to parse the input value
      try {
        const parsedDate = parse(newValue, inputDateFormat, new Date());
        if (isValid(parsedDate)) {
          // Check date constraints
          if (minDate && parsedDate < minDate) {
            setInputError(`Date must be after ${format(minDate, dateFormat)}`);
            return;
          }
          if (maxDate && parsedDate > maxDate) {
            setInputError(`Date must be before ${format(maxDate, dateFormat)}`);
            return;
          }
          onChange?.(parsedDate);
        } else {
          // Try parsing with display format as fallback
          const fallbackDate = parse(newValue, dateFormat, new Date());
          if (isValid(fallbackDate)) {
            onChange?.(fallbackDate);
          }
        }
      } catch {
        // Invalid date format - we'll show error on blur
      }
    };

    // Handle input blur to validate and show errors
    const handleInputBlur = () => {
      if (!inputValue.trim()) {
        setInputError(null);
        return;
      }

      try {
        const parsedDate = parse(inputValue, inputDateFormat, new Date());
        const fallbackDate = parse(inputValue, dateFormat, new Date());

        if (!isValid(parsedDate) && !isValid(fallbackDate)) {
          setInputError(`Invalid date format. Use ${inputDateFormat}`);
        }
      } catch {
        setInputError(`Invalid date format. Use ${inputDateFormat}`);
      }
    };

    // Handle calendar date selection
    const handleDateSelect = (selectedDate: Date | undefined) => {
      onChange?.(selectedDate);
      setMonth(selectedDate);
      setOpen(false);
      setInputError(null);
    };

    // Handle today button click
    const handleTodayClick = () => {
      const today = new Date();
      handleDateSelect(today);
    };

    // Handle clear button click
    const handleClearClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      setInputValue("");
      onChange?.(undefined);
      setInputError(null);
    };

    // Prepare calendar disabled dates
    const calendarDisabled = React.useMemo(() => {
      if (minDate || maxDate) {
        return (date: Date) => {
          if (minDate && date < minDate) return true;
          if (maxDate && date > maxDate) return true;
          return false;
        };
      }
      return undefined;
    }, [minDate, maxDate]);

    const hasError = error || !!inputError || !!errorMessage;

    return (
      <div className={cn("relative", className)}>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <div className="relative">
              <Input
                ref={ref}
                name={name}
                value={inputValue}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                placeholder={placeholder}
                disabled={disabled}
                required={required}
                className={cn(
                  "pr-10",
                  hasError &&
                    "aria-invalid:border-destructive aria-invalid:ring-destructive/20",
                  inputProps?.className
                )}
                aria-invalid={hasError}
                {...inputProps}
                {...props}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                disabled={disabled}
                onClick={() => setOpen(!open)}
                tabIndex={-1}
              >
                <CalendarIcon className="h-4 w-4" />
                <span className="sr-only">Open calendar</span>
              </Button>
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={value}
              onSelect={handleDateSelect}
              disabled={calendarDisabled}
              captionLayout={showMonthYearPicker ? "dropdown" : "label"}
              month={month}
              onMonthChange={setMonth}
              {...calendarProps}
            />
            {(showToday || showClear) && (
              <div className="flex items-center justify-between border-t p-3">
                {showToday && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleTodayClick}
                    disabled={
                      (minDate && new Date() < minDate) ||
                      (maxDate && new Date() > maxDate)
                    }
                  >
                    Today
                  </Button>
                )}
                {showClear && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearClick}
                    disabled={!value}
                    className={cn(!showToday && "ml-auto")}
                  >
                    Clear
                  </Button>
                )}
              </div>
            )}
          </PopoverContent>
        </Popover>

        {/* Error message */}
        {(inputError || errorMessage) && (
          <p className="text-destructive mt-1 text-sm">
            {inputError || errorMessage}
          </p>
        )}
      </div>
    );
  }
);

DateInput.displayName = "DateInput";

export { DateInput };
