"use client";

import { createCategoryAction } from "@/app/trips/[id]/packing-lists/actions";
import { Option, CategorySelectProps } from "@/app/lib/types";
import { buildOptions } from "@/app/utils/formatSelectOption";
import { useState } from "react";
import CreatableSelect from "react-select/creatable";

export function CategorySelect({
  userId,
  categories = [],
  tripId,
  packingListId,
  onChange,
  value,
}: CategorySelectProps) {
  const categoryOptions = buildOptions(categories);
  const [options, setOptions] = useState<Option[]>(categoryOptions);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = (inputValue: string) => {
    setIsLoading(true);
    setTimeout(async () => {
      const newOption = await createCategoryAction(
        userId,
        inputValue,
        tripId,
        packingListId
      );
      setIsLoading(false);
      setOptions((prev) => [...prev, newOption]);
      onChange(newOption);
    }, 1000);
  };

  return (
    <CreatableSelect
      isClearable
      isDisabled={isLoading}
      isLoading={isLoading}
      onChange={(opt) => onChange(opt as Option | null)}
      onCreateOption={handleCreate}
      options={options}
      value={value}
    />
  );
}
