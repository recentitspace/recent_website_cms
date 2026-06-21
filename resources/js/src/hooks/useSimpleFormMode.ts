import { useCmsContentMode } from "../contexts/CmsContentModeContext";

/** True when the user is in Simple (editor) mode on website content — hide technical fields. */
export const useSimpleFormMode = (): boolean => {
    const { mode, isWebsiteContentArea } = useCmsContentMode();
    return mode === "editor" && isWebsiteContentArea;
};
