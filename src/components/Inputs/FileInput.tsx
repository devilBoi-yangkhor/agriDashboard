import { CustomDragDrop } from "./CustomContainer";
import { useState } from "react";

interface FileInputProps {
  label: string;
}

const FileInput = ({ label, ...props }: FileInputProps) => {
  const [ownerLicense, setOwnerLicense] = useState<any[]>([]);

  function uploadFiles(f: any) {
    setOwnerLicense([...ownerLicense, ...f]);
  }

  function deleteFile(indexImg: number) {
    const updatedList = ownerLicense.filter((ele, index) => index !== indexImg);
    setOwnerLicense(updatedList);
  }

  return (
    <div className="w-full pt-3 pb-3">
      <div className="pb-[2px]">
        <label className="block text-sm font-medium text-black dark:text-white">
          {label}
        </label>
      </div>
      <CustomDragDrop
        ownerLicense={ownerLicense}
        onUpload={uploadFiles}
        onDelete={deleteFile}
        count={2}
        formats={["jpg", "jpeg", "png"]}
      />
    </div>
  );
}

export default FileInput;
