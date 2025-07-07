import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface PhoneInputProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  defaultCountry?: string;
}

const countryCodes = [
  { code: "+91", country: "IN", flag: "🇮🇳", name: "India" },
  { code: "+44", country: "GB", flag: "🇬🇧", name: "United Kingdom" },
];

const PhoneNumberInput = React.forwardRef<HTMLDivElement, PhoneInputProps>(
  (
    {
      className,
      placeholder = "Enter phone number",
      defaultCountry = "IN",
      value = "",
      onChange,
      disabled,
      ...props
    },
    ref
  ) => {
    const [selectedCountry, setSelectedCountry] = React.useState(() => {
      const country = countryCodes.find((c) => c.country === defaultCountry);
      return country || countryCodes[0];
    });

    const [phoneNumber, setPhoneNumber] = React.useState(() => {
      if (value && value.startsWith("+")) {
        // Extract country code and phone number from full value
        const matchedCountry = countryCodes.find((c) =>
          value.startsWith(c.code)
        );
        if (matchedCountry) {
          return value.slice(matchedCountry.code.length);
        }
      }
      return value;
    });

    React.useEffect(() => {
      if (value && value.startsWith("+")) {
        const matchedCountry = countryCodes.find((c) =>
          value.startsWith(c.code)
        );
        if (matchedCountry) {
          setSelectedCountry(matchedCountry);
          setPhoneNumber(value.slice(matchedCountry.code.length));
        }
      }
    }, [value]);

    const handleCountryChange = (countryCode: string) => {
      const country = countryCodes.find((c) => c.code === countryCode);
      if (country) {
        setSelectedCountry(country);
        const fullNumber = `${country.code}${phoneNumber}`;
        onChange?.(fullNumber);
      }
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newPhoneNumber = e.target.value.replace(/\D/g, ""); // Only allow digits
      setPhoneNumber(newPhoneNumber);
      if (selectedCountry) {
        const fullNumber = `${selectedCountry.code}${newPhoneNumber}`;
        onChange?.(fullNumber);
      }
    };

    return (
      <div ref={ref} className={cn("flex gap-2", className)} {...props}>
        <Select
          value={selectedCountry?.code ?? countryCodes[0]!.code}
          onValueChange={handleCountryChange}
          disabled={disabled ?? false}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue>
              {selectedCountry && (
                <div className="flex items-center gap-2">
                  <span>{selectedCountry.flag}</span>
                  <span className="text-sm">{selectedCountry.code}</span>
                </div>
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {countryCodes.map((country) => (
              <SelectItem key={country.country} value={country.code}>
                <div className="flex items-center gap-2">
                  <span>{country.flag}</span>
                  <span className="text-sm">{country.code}</span>
                  <span className="text-xs text-muted-foreground">
                    {country.name}
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <input
          type="tel"
          value={phoneNumber}
          onChange={handlePhoneChange}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
            "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
          )}
        />
      </div>
    );
  }
);

PhoneNumberInput.displayName = "PhoneNumberInput";

export { PhoneNumberInput };
