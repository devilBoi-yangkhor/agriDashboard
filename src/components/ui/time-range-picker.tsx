// components/ui/time-range-picker.tsx
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Clock, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimeRange {
  start: string;
  end: string;
}

interface TimeRangePickerProps {
  value?: TimeRange;
  onChange?: (value: TimeRange) => void;
  className?: string;
}

export function TimeRangePicker({ value, onChange, className }: TimeRangePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [tempTimeRange, setTempTimeRange] = React.useState<TimeRange>(
    value || { start: "09:00", end: "17:00" }
  );
  const [selectedTimeRange, setSelectedTimeRange] = React.useState<TimeRange>(
    value || { start: "09:00", end: "17:00" }
  );

  const handleTempTimeChange = (type: "start" | "end", newTime: string) => {
    setTempTimeRange(prev => ({ ...prev, [type]: newTime }));
  };

  const handleOkayClick = () => {
    setSelectedTimeRange(tempTimeRange);
    onChange?.(tempTimeRange);
    setOpen(false);
  };

  const formatTimeDisplay = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${period}`;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !selectedTimeRange && "text-muted-foreground",
            className
          )}
        >
          <Clock className="mr-2 h-4 w-4" />
          {selectedTimeRange ? (
            `${formatTimeDisplay(selectedTimeRange.start)} - ${formatTimeDisplay(selectedTimeRange.end)}`
          ) : (
            <span>Select time range</span>
          )}
          <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="start">
        <div className="space-y-4">
          <h4 className="font-medium">Select Time Range</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-time">Start Time</Label>
              <Input
                id="start-time"
                type="time"
                value={tempTimeRange.start}
                onChange={(e) => handleTempTimeChange("start", e.target.value)}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-time">End Time</Label>
              <Input
                id="end-time"
                type="time"
                value={tempTimeRange.end}
                onChange={(e) => handleTempTimeChange("end", e.target.value)}
                className="w-full"
              />
            </div>
          </div>
          <div className="flex justify-between items-center pt-2">
            <span className="text-sm text-muted-foreground">
              {formatTimeDisplay(tempTimeRange.start)} - {formatTimeDisplay(tempTimeRange.end)}
            </span>
            <Button
              size="sm"
              onClick={handleOkayClick}
              variant="secondary"
            >
              Okay
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}