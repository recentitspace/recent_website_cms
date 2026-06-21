import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    ReactNode,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
    getAdvancedRedirectPath,
    getEditorRedirectPath,
    isEditorRoute,
    isWebsiteContentRoute,
} from "../lib/cmsContentRoutes";

export type CmsContentMode = "editor" | "advanced";

const STORAGE_KEY = "cms_content_mode";

interface CmsContentModeContextType {
    mode: CmsContentMode;
    setMode: (mode: CmsContentMode) => void;
    isWebsiteContentArea: boolean;
}

const CmsContentModeContext = createContext<CmsContentModeContextType | undefined>(
    undefined
);

export const useCmsContentMode = (): CmsContentModeContextType => {
    const context = useContext(CmsContentModeContext);

    if (!context) {
        throw new Error("useCmsContentMode must be used within CmsContentModeProvider");
    }

    return context;
};

interface CmsContentModeProviderProps {
    children: ReactNode;
}

export const CmsContentModeProvider: React.FC<CmsContentModeProviderProps> = ({
    children,
}) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [mode, setModeState] = useState<CmsContentMode>(() => {
        const stored = localStorage.getItem(STORAGE_KEY);

        return stored === "advanced" ? "advanced" : "editor";
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, mode);
    }, [mode]);

    const isWebsiteContentArea = useMemo(
        () => isWebsiteContentRoute(location.pathname),
        [location.pathname]
    );

    const setMode = useCallback(
        (nextMode: CmsContentMode) => {
            if (nextMode === mode) {
                return;
            }

            setModeState(nextMode);

            if (!isWebsiteContentRoute(location.pathname)) {
                return;
            }

            if (nextMode === "editor") {
                navigate(getEditorRedirectPath(location.pathname));
                return;
            }

            navigate(getAdvancedRedirectPath(location.pathname));
        },
        [location.pathname, mode, navigate]
    );

    const value = useMemo(
        () => ({
            mode,
            setMode,
            isWebsiteContentArea,
        }),
        [mode, setMode, isWebsiteContentArea]
    );

    return (
        <CmsContentModeContext.Provider value={value}>
            {children}
        </CmsContentModeContext.Provider>
    );
};
