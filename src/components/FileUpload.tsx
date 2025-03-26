import React, { useRef, useState } from "react";
import { MdCancel } from "react-icons/md";

type FileUploadProps = {
  onChange: (file: File | null) => void;
};

const FileUpload = ({ onChange }: FileUploadProps) => {
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target;

    if (input.files?.length) {
      const uploadedFile = input.files[0];

      input.value = "";

      setFile(uploadedFile);
      onChange(uploadedFile);
    }
  };

  const removeFile = (event: React.MouseEvent) => {
    event.stopPropagation();
    setFile(null);
    onChange(null);
  };

  return (
    <div
      className="flex items-center justify-center border border-[#CBB6E5] rounded-md p-5 bg-white h-30 relative cursor-pointer"
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
      {file ? (
        <div className="flex items-center gap-2">
          <span className="text-gray-700">{file.name}</span>
          <MdCancel
            size={25}
            className="text-[#000853] cursor-pointer hover:text-[#ED4545]"
            onClick={removeFile}
          />
        </div>
      ) : (
        <>
          <span className="text-[#761BE4] underline">Upload a file</span>
          <span className="text-[#898DA9] hidden sm:inline sm:pl-[4px]">
            or drag and drop here
          </span>
        </>
      )}
    </div>
  );
};

export default FileUpload;
