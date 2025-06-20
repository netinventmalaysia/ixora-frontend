import { Controller, useFormContext } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import { CalendarDaysIcon } from '@heroicons/react/24/outline';

type DatePickerFieldProps = {
    name: string;
    label: string;
    placeholder?: string;
    requiredMessage?: string;
    dateFormat?: string;
    showTimeSelect?: boolean;
    minDate?: Date;
    maxDate?: Date;
};

export default function DatePickerField({
    name,
    label,
    placeholder = 'Select a date',
    requiredMessage,
    dateFormat,
    showTimeSelect = false,
    minDate,
    maxDate
}: DatePickerFieldProps) {
    const {
        control,
        formState: { errors },
    } = useFormContext();

    const error = errors[name]?.message as string | undefined;

    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <Controller
                control={control}
                name={name}
                rules={{ required: requiredMessage }}
                render={({ field }) => (
                    <div className="relative w-full">
                        <DatePicker
                            selected={field.value}
                            onChange={(date) => field.onChange(date)}
                            dateFormat={dateFormat || 'yyyy-MM-dd'}
                            showTimeSelect={showTimeSelect}
                            minDate={minDate}
                            maxDate={maxDate}
                            placeholderText={placeholder}
                            className="w-full rounded-md border border-gray-300 pl-10 pr-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                        />
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <CalendarDaysIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </div>
                    </div>
                )}
            />
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>
    );
}
