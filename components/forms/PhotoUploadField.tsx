import { useState, useEffect } from 'react';
import { UserCircleIcon } from '@heroicons/react/24/solid';
import { useFormContext } from 'react-hook-form';
import { uploadCertificate } from '@/services/api';

type PhotoUploadFieldProps = {
  name: string;
  label?: string;
  buttonText?: string;
  folder?: string;
  requiredMessage?: string;
  onUpload?: (filePath: string) => void;
};
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL
const UPLOAD_BASE_URL = `${API_BASE_URL}/uploads/file/`;

export default function PhotoUploadField({
  name,
  label = 'Upload Certificate',
  buttonText = 'Select File',
  folder = 'business',
  requiredMessage,
  onUpload,
}: PhotoUploadFieldProps) {
  const { setValue, trigger, register, formState: { errors }, watch } = useFormContext();
  const [selectedFileName, setSelectedFileName] = useState<string>('');
  const [uploading, setUploading] = useState(false);

  const fileValue = watch(name);
  const uploadedUrl = fileValue ? `${UPLOAD_BASE_URL}${fileValue}` : '';

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFileName(file.name);
    setUploading(true);

    try {
      const uploadedPath = await uploadCertificate(file, folder);
      setValue(name, uploadedPath, { shouldValidate: true });
      await trigger(name);
      onUpload?.(uploadedPath);
    } catch (error) {
      console.error('Upload failed', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="col-span-full">
  <label className="block text-sm font-medium text-gray-900">{label}{requiredMessage && <span className="ml-0.5 text-red-600">*</span>}</label>
      <div className="mt-2 flex items-center gap-x-3">
        {uploadedUrl ? (
          <img
            src={uploadedUrl}
            alt="Uploaded"
            className="h-12 w-12 rounded-full object-cover ring-1 ring-gray-300"
          />
        ) : (
          <UserCircleIcon className="h-12 w-12 text-gray-300" />
        )}

        <div>
          <label className="cursor-pointer rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
            {uploading ? 'Uploading...' : buttonText}
            <input
              type="file"
              className="hidden"
              accept="application/pdf,image/*"
              onChange={handleFileChange}
              disabled={uploading}
            />
          </label>

          {selectedFileName && (
            <p className="mt-1 text-xs text-gray-500 truncate w-40">{selectedFileName}</p>
          )}

          {errors[name] && (
            <p className="text-xs text-red-500 mt-1">
              {errors[name]?.message as string}
            </p>
          )}
        </div>
      </div>

      <input
        type="hidden"
        {...register(name, requiredMessage ? { required: requiredMessage } : {})}
      />
    </div>
  );
}
