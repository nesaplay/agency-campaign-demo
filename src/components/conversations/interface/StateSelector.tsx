import React, { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { US_STATES, USState } from "@/lib/constants/states";

interface StateSelectorProps {
  onSelect: (selectedStates: string[]) => void;
}

export function StateSelector({ onSelect }: StateSelectorProps) {
  const [open, setOpen] = useState(false);
  const [selectedValues, setSelectedValues] = useState<Set<string>>(new Set());

  const handleSelect = (state: USState) => {
    setSelectedValues((prev) => {
      const next = new Set(prev);
      if (next.has(state.abbreviation)) {
        next.delete(state.abbreviation);
      } else {
        next.add(state.abbreviation);
      }
      return next;
    });
    // Do not close popover on item select to allow multi-select
  };

  const handleConfirmSelection = () => {
    onSelect(Array.from(selectedValues));
    setOpen(false); // Close popover after confirming
  };

  const selectedCount = selectedValues.size;
  const buttonText =
    selectedCount > 0 ? `${selectedCount} State${selectedCount > 1 ? "s" : ""} Selected` : "Select States...";

  return (
    <div className="flex flex-col items-start space-y-2 mt-6">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[250px] justify-between !text-sm"
          >
            {buttonText}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[250px] p-0 bg-white dark:bg-slate-950 text-slate-950 dark:text-slate-50 shadow-md">
          <Command>
            <CommandInput placeholder="Search states..." />
            <CommandList>
              <CommandEmpty>No state found.</CommandEmpty>
              <CommandGroup>
                {US_STATES.map((state) => (
                  <CommandItem
                    key={state.abbreviation}
                    value={state.name} // Use name for searching
                    onSelect={() => handleSelect(state)}
                    className="flex items-center cursor-pointer !text-sm"
                  >
                    <Checkbox
                      id={`state-${state.abbreviation}`}
                      checked={selectedValues.has(state.abbreviation)}
                      onCheckedChange={() => handleSelect(state)} // Handle click on checkbox too
                      className="mr-2"
                      aria-label={`Select ${state.name}`}
                    />
                    <span>
                      {state.name} ({state.abbreviation})
                    </span>
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        selectedValues.has(state.abbreviation) ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
          {selectedCount > 0 && (
            <div className="p-2 border-t">
              <Button onClick={handleConfirmSelection} className="w-full !text-sm">
                Confirm Selection ({selectedCount})
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}
