import React, { PropsWithChildren, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IRootState } from "./store";
import {
    toggleRTL,
    toggleTheme,
    toggleLocale,
    toggleMenu,
    toggleLayout,
    toggleAnimation,
    toggleNavbar,
    toggleSemidark,
} from "./store/themeConfigSlice";
import store from "./store";
import { Toaster } from "./components/Toaster";
import GlobalModalManager from "./components/GlobalModalManager";
import { useOrganization } from "./contexts/OrganizationContext";

function App({ children }: PropsWithChildren) {
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(
            toggleTheme(localStorage.getItem("theme") || themeConfig.theme)
        );
        dispatch(toggleMenu(localStorage.getItem("menu") || themeConfig.menu));
        dispatch(
            toggleLayout(localStorage.getItem("layout") || themeConfig.layout)
        );
        dispatch(
            toggleRTL(localStorage.getItem("rtlClass") || themeConfig.rtlClass)
        );
        dispatch(
            toggleAnimation(
                localStorage.getItem("animation") || themeConfig.animation
            )
        );
        dispatch(
            toggleNavbar(localStorage.getItem("navbar") || themeConfig.navbar)
        );
        dispatch(
            toggleLocale(
                localStorage.getItem("i18nextLng") || themeConfig.locale
            )
        );
        dispatch(
            toggleSemidark(
                localStorage.getItem("semidark") || themeConfig.semidark
            )
        );
    }, [
        dispatch,
        themeConfig.theme,
        themeConfig.menu,
        themeConfig.layout,
        themeConfig.rtlClass,
        themeConfig.animation,
        themeConfig.navbar,
        themeConfig.locale,
        themeConfig.semidark,
        themeConfig.semidark,
    ]);

    // Dynamic Title Logic
    const { organization } = useOrganization();
    useEffect(() => {
        const pageTitle = themeConfig.pageTitle;
        const orgName = organization?.name || 'CMS';

        if (pageTitle) {
            document.title = `${pageTitle} | ${orgName}`;
        } else {
            document.title = orgName;
        }
    }, [themeConfig.pageTitle, organization?.name]);

    return (
        <div
            className={`${
                (store.getState().themeConfig.sidebar && "toggle-sidebar") || ""
            } ${themeConfig.menu} ${themeConfig.layout} ${
                themeConfig.rtlClass
            } main-section antialiased relative font-nunito text-sm font-normal`}
        >
            {children}
            <Toaster position="top-right" />
            <GlobalModalManager />
        </div>
    );
}

export default App;
