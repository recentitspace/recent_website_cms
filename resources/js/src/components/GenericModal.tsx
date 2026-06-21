import React, { Fragment, ReactNode } from "react";
import {
    Transition,
    Dialog,
    DialogPanel,
    TransitionChild,
} from "@headlessui/react";
import { LucideIcon, X } from "lucide-react";

interface GenericModalProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    title: string;
    subtitle?: string;
    icon?: LucideIcon;
    children: ReactNode;
    maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full";
}

const GenericModal: React.FC<GenericModalProps> = ({
    isOpen,
    setIsOpen,
    title,
    subtitle,
    icon: Icon,
    children,
    maxWidth = "lg",
}) => {
    const handleClose = () => {
        setIsOpen(false);
    };

    const maxWidthClasses = {
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-lg",
        xl: "max-w-xl",
        "2xl": "max-w-2xl",
        "3xl": "max-w-3xl",
        full: "max-w-full",
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-[999]" onClose={() => {}}>
                <TransitionChild
                    as={Fragment}
                    enter="ease-out duration-150"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-[2px]" />
                </TransitionChild>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-screen items-start justify-center px-4 py-6">
                        <DialogPanel
                            className={`w-full ${maxWidthClasses[maxWidth]} overflow-hidden rounded-2xl border border-gray-200 bg-white text-gray-900 shadow-2xl dark:border-[#232a3b] dark:bg-[#1a2236] dark:text-gray-100`}
                        >
                            <div className="border-b border-gray-200 bg-gradient-to-r from-primary/5 via-white to-white px-5 py-4 dark:border-[#232a3b] dark:from-primary/10 dark:via-[#232a3b] dark:to-[#232a3b]">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex min-w-0 items-start gap-3">
                                        {Icon && (
                                            <span className="mt-0.5 rounded-xl bg-primary/10 p-2 text-primary">
                                                <Icon size={18} />
                                            </span>
                                        )}
                                        <div className="min-w-0">
                                            <h5 className="text-lg font-bold text-gray-900 dark:text-white">
                                                {title}
                                            </h5>
                                            {subtitle && (
                                                <p className="mt-1 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                                                    {subtitle}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleClose}
                                        type="button"
                                        className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-white/10 dark:hover:text-white"
                                        aria-label="Close"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                            <div className="max-h-[min(75vh,800px)] overflow-y-auto bg-white p-5 dark:bg-[#202940]">
                                {children}
                            </div>
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default GenericModal;
