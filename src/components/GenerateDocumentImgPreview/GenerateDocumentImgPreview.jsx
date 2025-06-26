import SVGSelector from "../common-components/SVGSelector";

const GenerateDocumentImgPreview = ({
  files,
  setFiles,
  fieldName,
  setFieldValue,
  showRemoveIcon,
}) => {
  const handleFileRemove = (index, currentFiles, setFiles, fieldName) => {
    if (showRemoveIcon) {
      const updatedFiles = currentFiles?.filter(
        (a, fileIndex) => fileIndex !== index,
      );
      setFiles(updatedFiles);
      setFieldValue(fieldName, updatedFiles);
    }
  };

  return files?.map((file, index) => {
    let imageUrl = null;

    if (file && file.fileAttachments?.[0] instanceof Blob) {
      imageUrl = URL.createObjectURL(file.fileAttachments[0]);
    } else if (file instanceof Blob) {
      imageUrl = URL.createObjectURL(file);
    }

    return (
      <div
        key={index}
        className="relative flex flex-col items-center mt-2 mr-2"
      >
        {" "}
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={`file-preview-${index}`}
            className="h-[15rem] w-[15rem] object-contain bg-[var(--text-white-black)] border border-gray-300 rounded"
          />
        ) : null}
        {showRemoveIcon ? (
          <button
            type="button"
            onClick={() => handleFileRemove(index, files, setFiles, fieldName)}
            className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs p-2"
          >
            <SVGSelector
              name="cross-svg"
              pathStroke={"currentColor"}
              svgHeight={16}
              svgWidth={16}
            />
          </button>
        ) : null}
        <span className="text-xs text-gray-600 mt-1">
          {file?.fileAttachments?.[0]?.name}
        </span>
      </div>
    );
  });
};
export default GenerateDocumentImgPreview;
