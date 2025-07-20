import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react';
import { CheckIcon } from '@heroicons/react/24/outline';
import Button from '@/components/forms/Button';

type ConfirmSelectDialogProps = {
  isOpen: boolean;
  title: string;
  message: string;
  options: string[];
  defaultValue?: string;
  onConfirm: (value: string) => void;
  onClose: () => void;
};

export default function ConfirmSelectDialog({
  isOpen,
  title,
  message,
  options,
  defaultValue,
  onConfirm,
  onClose,
}: ConfirmSelectDialogProps) {
  const [selected, setSelected] = useState(defaultValue || '');

  useEffect(() => {
    setSelected(defaultValue || '');
  }, [defaultValue, isOpen]);

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
      />

      <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center sm:p-0">
        <DialogPanel
          transition
          className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-sm sm:p-6 data-closed:sm:translate-y-0 data-closed:sm:scale-95"
        >
          <div>
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-indigo-100">
              <CheckIcon className="size-6 text-indigo-600" />
            </div>
            <div className="mt-3 text-center sm:mt-5">
              <DialogTitle
                as="h3"
                className="text-base font-semibold text-gray-900"
              >
                {title}
              </DialogTitle>
              <div className="mt-2">
                <p className="text-sm text-gray-500">{message}</p>
              </div>
              <div className="mt-4">
                <select
                  value={selected}
                  onChange={(e) => setSelected(e.target.value)}
                  className="w-full border rounded p-2 text-sm"
                >
                  <option value="">Select role...</option>
                  {options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="mt-5 sm:mt-6 flex gap-2">
            <Button onClick={onClose} variant="secondary" className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={() => selected && onConfirm(selected)}
              disabled={!selected}
              className="flex-1"
            >
              Confirm
            </Button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
