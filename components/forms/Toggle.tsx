import { Field, Label, Description, Switch } from "@headlessui/react";

export interface ToggleProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}
export default function Toggle({ label, description, checked, onChange }: ToggleProps) {
  return (
    <Field className="flex items-center justify-between">
      <span className="flex grow flex-col">
        <Label as="span" passive className="text-sm/6 font-medium text-gray-900">
          {label}
        </Label>
        <Description as="span" className="text-sm text-gray-500">
          {description}
        </Description>
      </span>
      <Switch
        checked={checked}
        onChange={(checked) => onChange(checked)}
        className="group relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 focus:outline-hidden data-checked:bg-indigo-600"
      >
        <span
          aria-hidden="true"
          className="pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out group-data-checked:translate-x-5"
        />
      </Switch>
    </Field>
  );
}