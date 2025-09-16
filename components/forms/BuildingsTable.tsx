import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import Button from 'todo/components/forms/Button';
import SelectField from 'todo/components/forms/SelectField';
import InputText from 'todo/components/forms/InputText';
import Heading from 'todo/components/forms/Heading';
import { buildingUseOptions } from 'todo/components/data/SelectionList';

export type BuildingsTableProps = {
  name?: string; // field array name, default 'buildings'
  title?: string;
  description?: string;
  initialRow?: { buildingUse?: string; openArea?: string | number; closeArea?: string | number; processingFee?: number };
  showHeader?: boolean;
};

export default function BuildingsTable({
  name = 'buildings',
  title = 'Buildings',
  description = "Add one or more building entries",
  initialRow = { buildingUse: '', openArea: '', closeArea: '', processingFee: 140 },
  showHeader = true,
}: BuildingsTableProps) {
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({ control, name });

  return (
    <div>
      {showHeader && (
        <div className="flex justify-between items-center mb-2">
          <div>
            <Heading level={3}>{title}</Heading>
            {description && <p className="text-xs text-gray-600">{description}</p>}
          </div>
          <Button type="button" variant="secondary" onClick={() => append(initialRow)}>
            + Add Building
          </Button>
        </div>
      )}

      {fields.length === 0 ? (
        <p className="text-sm text-gray-600">No buildings added yet. Click "+ Add Building" to start.</p>
      ) : (
        <div className="overflow-auto border rounded">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-2 py-2 text-left">Use</th>
                <th className="px-2 py-2 text-left">Open Area (m²)</th>
                <th className="px-2 py-2 text-left">Close Area (m²)</th>
                <th className="px-2 py-2 text-left">Processing Fee (RM)</th>
                <th className="px-2 py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {fields.map((f, idx) => {
                const base = `${name}.${idx}`;
                return (
                  <tr key={f.id} className="border-t align-top">
                    <td className="px-2 py-2 min-w-[220px]">
                      <SelectField id={`${base}.buildingUse`} name={`${base}.buildingUse`} label="" options={buildingUseOptions} placeholder="Select use" requiredMessage="Required" />
                    </td>
                    <td className="px-2 py-2 min-w-[180px]">
                      <InputText id={`${base}.openArea`} name={`${base}.openArea`} label="" type="number" placeholder="0" />
                      <p className="text-[11px] text-gray-500 mt-1">x RM 0.75</p>
                    </td>
                    <td className="px-2 py-2 min-w-[180px]">
                      <InputText id={`${base}.closeArea`} name={`${base}.closeArea`} label="" type="number" placeholder="0" />
                      <p className="text-[11px] text-gray-500 mt-1">x RM 1.50</p>
                    </td>
                    <td className="px-2 py-2 min-w-[180px]">
                      <InputText id={`${base}.processingFee`} name={`${base}.processingFee`} label="" type="number" prefix="RM" readOnly rightElement={<span className="text-xs text-gray-500">Auto</span>} />
                      <p className="text-[11px] text-gray-500 mt-1">Min RM 140</p>
                    </td>
                    <td className="px-2 py-2">
                      <Button type="button" variant="ghost" onClick={() => remove(idx)}>Remove</Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
