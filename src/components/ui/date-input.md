# DateInput Component

A comprehensive and dynamic date input component that combines a text input with a calendar picker, built with React, TypeScript, and integrated with the existing UI component system.

## Features

- 📅 **Calendar Picker**: Click the calendar icon to open a visual date picker
- ⌨️ **Manual Input**: Type dates directly with automatic parsing
- 🎯 **Date Constraints**: Set minimum and maximum selectable dates
- 🎨 **Customizable**: Flexible formatting and styling options
- ♿ **Accessible**: Full keyboard navigation and screen reader support
- 🔧 **Form Integration**: Works seamlessly with react-hook-form and Zod
- 🎭 **Error Handling**: Built-in validation with error messages
- 🧹 **Clear & Today**: Optional quick action buttons

## Basic Usage

```tsx
import { DateInput } from "@/components/ui/date-input";

function MyComponent() {
  const [date, setDate] = useState<Date>();

  return (
    <DateInput
      value={date}
      onChange={setDate}
      placeholder="Select a date"
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `Date \| undefined` | - | The current date value |
| `onChange` | `(date: Date \| undefined) => void` | - | Callback when date changes |
| `placeholder` | `string` | `"Pick a date"` | Placeholder text for the input |
| `dateFormat` | `string` | `"PPP"` | Date format for display (date-fns format) |
| `inputDateFormat` | `string` | `"yyyy-MM-dd"` | Input date format for parsing user input |
| `disabled` | `boolean` | `false` | Disable the input |
| `required` | `boolean` | `false` | Required field |
| `className` | `string` | - | Additional CSS classes |
| `minDate` | `Date` | - | Minimum selectable date |
| `maxDate` | `Date` | - | Maximum selectable date |
| `showToday` | `boolean` | `true` | Show today button in calendar |
| `showClear` | `boolean` | `true` | Show clear button |
| `showMonthYearPicker` | `boolean` | `false` | Enable month and year dropdowns in calendar |
| `name` | `string` | - | Name attribute for forms |
| `error` | `boolean` | `false` | Error state |
| `errorMessage` | `string` | - | Error message |
| `inputProps` | `object` | - | Additional props for the input element |
| `calendarProps` | `object` | - | Additional props for the calendar |

## Examples

### With Date Constraints

```tsx
const today = new Date();
const oneWeekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

<DateInput
  value={date}
  onChange={setDate}
  placeholder="Select appointment date"
  minDate={today}
  maxDate={oneWeekFromNow}
/>
```

### Custom Format

```tsx
<DateInput
  value={date}
  onChange={setDate}
  placeholder="MM/dd/yyyy format"
  dateFormat="MM/dd/yyyy"
  inputDateFormat="MM/dd/yyyy"
/>
```

### With Error State

```tsx
<DateInput
  value={date}
  onChange={setDate}
  placeholder="Required field"
  required
  error={!date}
  errorMessage={!date ? "Please select a date" : undefined}
/>
```

### With Month/Year Picker

```tsx
<DateInput
  value={date}
  onChange={setDate}
  placeholder="Select date with dropdowns"
  showMonthYearPicker={true}
/>
```

### Form Integration with react-hook-form

```tsx
import { Controller } from "react-hook-form";

<Controller
  name="appointmentDate"
  control={control}
  render={({ field }) => (
    <DateInput
      value={field.value}
      onChange={field.onChange}
      placeholder="Select appointment date"
      showMonthYearPicker={true}
      error={!!errors.appointmentDate}
      errorMessage={errors.appointmentDate?.message}
      inputProps={{
        name: field.name,
      }}
    />
  )}
/>
```

### Zod Schema Integration

```tsx
import { z } from "zod";

const schema = z.object({
  appointmentDate: z
    .date({
      message: "Please enter a valid date",
    })
    .refine(date => date !== undefined, "Appointment date is required"),
  followUpDate: z.date().optional(),
});
```

## Date Formats

The component uses `date-fns` for date formatting. Common format strings:

- `"PPP"` → January 1, 2024
- `"MM/dd/yyyy"` → 01/01/2024
- `"yyyy-MM-dd"` → 2024-01-01
- `"dd/MM/yyyy"` → 01/01/2024
- `"MMMM d, yyyy"` → January 1, 2024

See [date-fns format documentation](https://date-fns.org/docs/format) for more options.

## Input Parsing

The component automatically parses user input in multiple formats:

1. **Primary Format**: Uses `inputDateFormat` prop
2. **Display Format**: Falls back to `dateFormat` prop
3. **Validation**: Shows error if neither format matches

Users can type dates in formats like:
- `2024-01-01`
- `01/01/2024`
- `January 1, 2024`

## Keyboard Navigation

- **Tab**: Focus the input field
- **Enter/Space**: Open calendar when input is focused
- **Arrow Keys**: Navigate calendar dates
- **Enter**: Select highlighted date
- **Escape**: Close calendar

## Accessibility

The component follows WCAG guidelines:

- Proper ARIA labels and roles
- Keyboard navigation support
- Screen reader announcements
- Focus management
- Error state communication

## Calendar Navigation

### Month/Year Dropdowns

Enable quick navigation with month and year dropdowns by setting `showMonthYearPicker={true}`:

- **Month Dropdown**: Select any month of the current year
- **Year Dropdown**: Navigate to any year (with reasonable range limits)
- **Better UX**: Especially useful for selecting dates far from the current month (e.g., birth dates, historical dates)

The dropdowns are particularly useful for:
- Birth date selection (navigating far back in time)
- Appointment scheduling (jumping to specific months)
- Event planning (selecting future dates)

## Styling

The component uses Tailwind CSS classes and integrates with the existing design system. You can customize styling through:

- `className` prop for the wrapper
- `inputProps.className` for the input element
- `calendarProps` for calendar styling

## Dependencies

- `react` (19.0.0+)
- `date-fns` (4.1.0+)
- `react-day-picker` (9.8.0+)
- `lucide-react` (for icons)
- Existing UI components (`Button`, `Input`, `Popover`, `Calendar`)

## Browser Support

Compatible with all modern browsers that support ES2015+ and CSS Grid.