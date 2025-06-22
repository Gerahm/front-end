'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export default function NumberStepper({
  value: initialValue,
  onChange,
  className,
}: {
  value?: string;
  onChange: (value: number | undefined) => void;
  className?: string;
}) {
  const [value, setValue] = useState(initialValue || '');

  useEffect(() => {
    setValue(initialValue || '');
  }, [initialValue]);

  const updateValue = (newValue: number | undefined) => {
    setValue(newValue ? newValue.toString() : '');
    onChange(newValue);
  };

  const increase = () => {
    const currentValue = parseInt(value) || 0;
    updateValue(currentValue + 1);
  };

  const decrease = () => {
    const currentValue = parseInt(value) || 1;
    const newValue = Math.max(currentValue - 1, 1);
    updateValue(newValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setValue(inputValue);

    if (inputValue === '') {
      onChange(undefined);
    } else {
      const num = parseInt(inputValue, 10);
      if (!isNaN(num) && num > 0) {
        onChange(num);
      }
    }
  };

  return (
    <div className="flex items-center gap-1">
      <Button onClick={decrease} className="w-5 h-5" variant="ghost">
        –
      </Button>
      <span className="text-sm text-gray-500">$</span>
      <Input
        type="text"
        className={cn(
          'w-16 text-center  [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
          className
        )}
        maxLength={5}
        value={value}
        onChange={handleInputChange}
      />
      <Button onClick={increase} className="w-5 h-5" variant="ghost">
        ＋
      </Button>
    </div>
  );
}
