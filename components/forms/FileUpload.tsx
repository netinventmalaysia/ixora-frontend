import { useState, useRef } from "react";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { useFormContext, useWatch } from "react-hook-form";
import { uploadCertificate } from "@/services/api";
import clsx from "clsx";

type FileUploadFieldProps = {
  name: string;
  label?: string;
  buttonText?: string;
  folder?: string;
  description?: string;
  accept?: string;
  requiredMessage?: string;
  onUploadSuccess?: (filePath: string) => void;
};

export default function FileUploadField({
  name,
  label = "Upload a file",
  buttonText = "Select File",
  folder = "business",
  description = "PNG, JPG, PDF up to 10MB",
  accept = "application/pdf,image/*",
  requiredMessage,
  onUploadSuccess,
}: FileUploadFieldProps) {
  const { setValue, trigger, register, control, formState: { errors } } = useFormContext();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string>("");
  const [uploading, setUploading] = useState(false);

  // Watch current form value to support showing an existing uploaded file (e.g., from draft defaultValues)
  const currentValue = useWatch({ control, name }) as string | undefined;

  const isImage = (p: string) => /\.(png|jpe?g|gif|bmp|webp|svg)$/i.test(p);
  const isPdf = (p: string) => /\.(pdf)$/i.test(p);
  const buildUploadUrl = (p: string) => {
    if (!p) return '';
    // Absolute URLs stay as-is
    if (/^https?:\/\//i.test(p)) return p;
    const base = (process.env.NEXT_PUBLIC_API_URL || 'https://ixora-api.mbmb.gov.my').replace(/\/$/, '');
    let path = String(p).replace(/^\/+/, '');
    if (!/^uploads\/file\//i.test(path)) path = `uploads/file/${path}`;
    return `${base}/${path}`;
  };

  const handleFileUpload = async (file: File) => {
    setSelectedFileName(file.name);
    setUploading(true);

    try {
      const uploadedPath = await uploadCertificate(file, folder);
      setValue(name, uploadedPath, { shouldValidate: true });
      await trigger(name);
      onUploadSuccess?.(uploadedPath);
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileUpload(file);
  };

  return (
    <div className="col-span-full">
      <label className="block text-sm font-medium text-gray-900">{label}</label>

      <div
        className={clsx(
          "mt-2 flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10 text-center",
          "hover:border-indigo-500 hover:bg-gray-50 cursor-pointer transition-colors"
        )}
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <PhotoIcon className="mx-auto h-12 w-12 text-gray-300" />
        <div className="mt-4 flex text-sm text-gray-600 items-center gap-1">
          <span className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 hover:text-indigo-500">
            {uploading ? "Uploading..." : buttonText}
          </span>
          <span>or drag and drop</span>
        </div>

        {description && (
          <p className="text-xs text-gray-500">{description}</p>
        )}

        {selectedFileName && (
          <p className="mt-2 text-xs text-gray-700 truncate w-40">
            Selected: {selectedFileName}
          </p>
        )}

        {errors[name] && (
          <p className="text-xs text-red-500 mt-1">
            {errors[name]?.message as string}
          </p>
        )}
      </div>

      {/* Existing file preview (from form value) */}
      {currentValue && (
        <div className="mt-3 border rounded-md p-3 bg-gray-50">
          <p className="text-xs text-gray-600 mb-2">Current file:</p>
          {isPdf(currentValue) ? (
            <div className="w-full">
              <div className="h-64 w-full border rounded bg-white overflow-hidden">
                <iframe
                  src={buildUploadUrl(currentValue)}
                  className="w-full h-full"
                  title={`${label} preview`}
                />
              </div>
              <a
                href={buildUploadUrl(currentValue)}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-indigo-600 hover:underline mt-2 inline-block"
              >
                Open PDF in new tab
              </a>
            </div>
          ) : isImage(currentValue) ? (
            <div className="flex items-center gap-3">
              <img
                src={buildUploadUrl(currentValue)}
                alt={`${label} preview`}
                className="h-24 w-auto rounded border bg-white"
              />
              <a
                href={buildUploadUrl(currentValue)}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-indigo-600 hover:underline"
              >
                Open image
              </a>
            </div>
          ) : (
            <a
              href={buildUploadUrl(currentValue)}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-indigo-600 hover:underline"
            >
              Open file
            </a>
          )}
        </div>
      )}

      <input
        type="file"
        ref={inputRef}
        accept={accept}
        className="hidden"
        onChange={handleFileSelect}
        disabled={uploading}
      />

      <input
        type="hidden"
        {...register(name, requiredMessage ? { required: requiredMessage } : {})}
      />
    </div>
  );
}
