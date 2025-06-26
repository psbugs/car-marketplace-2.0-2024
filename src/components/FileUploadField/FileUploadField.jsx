import { Field } from "formik";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { uploadFileAttachments } from "../../redux/TestDriveSlice";
import { getEdgeClass } from "../../utils";
import SVGSelector from "../common-components/SVGSelector";
import GenerateDocumentImgPreview from "../GenerateDocumentImgPreview/GenerateDocumentImgPreview";

const FileUploadField = ({
  label,
  name,
  files,
  setFiles,
  values,
  noOfFilesAllowed,
  contentMessage,
  setFieldValue,
  isTradeInForm,
}) => {
  const { edge } = useSelector((state) => state.uiConfig);
  const inputFieldClass = `${getEdgeClass(edge)} w-full bg-transparent text-sm py-3 px-4 pr-11 h-[48px]`;
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const handleFileChange = async (
    event,
    fieldName = false,
    currentFiles = [],
    setFiles = false,
  ) => {
    const fileAttachments = Array.from(event.target.files);
    if (!fileAttachments.length) return;
    try {
      let latestFiles = [...currentFiles];
      for (const file of fileAttachments) {
        const res = await dispatch(
          uploadFileAttachments({ name: file.name, file }),
        ).unwrap();
        latestFiles.push({
          fileAttachments: [file],
          xIdentity: res?.headers?.["x-identity"],
        });
        if (latestFiles.length > noOfFilesAllowed) {
          latestFiles = latestFiles.slice(-noOfFilesAllowed);
        }
      }
      setFiles([...latestFiles]);
      setFieldValue(fieldName, [...latestFiles]);
    } catch (error) {
      console.error("File upload failed:", error);
    }
  };

  const isDisabled =
    files?.length === noOfFilesAllowed ||
    values?.[name]?.length === noOfFilesAllowed;

  return (
    <div className="flex-auto my-2">
      <div className="flex justify-between items-center mb-2">
        <label
          className="flex items-center mb-2 text-sm text-[#8b8a8b] max-md:text-xs"
          htmlFor={name}
        >
          {t(`/vehicleDetails.${label}`)}
        </label>
        <span className="text-sm text-[#8b8a8b] max-md:text-xs">
          {files?.length
            ? files?.length
            : values?.[name]?.length
              ? values?.[name]?.length
              : 0}{" "}
          {t("/vehicleDetails.of")} {noOfFilesAllowed}{" "}
          {t("/vehicleDetails.images")}
        </span>
      </div>
      <Field name={name} className={inputFieldClass}>
        {() => (
          <>
            <label
              htmlFor={name}
              className={`${getEdgeClass(edge)} py-2 px-4 cursor-pointer flex items-center gap-2 border border-dashed text-[#8b8a8b] border-[#8b8a8b] text-sm h-[6rem] justify-center ${
                isDisabled ? "hidden" : ""
              }`}
            >
              <SVGSelector
                name="upload-doc-svg"
                pathStroke={"currentColor"}
                svgHeight={22}
                svgWidth={22}
              />
              {files?.length === 0 &&
              (values?.[name]?.length === 0 || values?.[name] === null)
                ? t(`/vehicleDetails.${contentMessage}`)
                : noOfFilesAllowed > 2 || noOfFilesAllowed < 10
                  ? t("/vehicleDetails.Add more files")
                  : t("/vehicleDetails.Add one more file")}
            </label>
            <input
              id={name}
              name={name}
              type="file"
              multiple
              accept="image/jpeg, image/jpg"
              disabled={isDisabled}
              className="hidden"
              onChange={(event) =>
                handleFileChange(event, name, files, setFiles)
              }
            />
            {files?.length > 0 || values?.[name]?.length > 0 ? (
              <div
                className={`${isTradeInForm ? "grid-cols-4" : "grid-cols-2"} grid gap-2 mt-2`}
              >
                <GenerateDocumentImgPreview
                  files={
                    files?.length
                      ? files
                      : values?.[name]?.length
                        ? values[name]
                        : []
                  }
                  setFiles={setFiles}
                  fieldName={name}
                  setFieldValue={setFieldValue}
                  showRemoveIcon={true}
                />
              </div>
            ) : null}
          </>
        )}
      </Field>
    </div>
  );
};
export default FileUploadField;
