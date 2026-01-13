import React from "react";
import { AlertCircle } from "lucide-react";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
    label: string;
    error?: string;
    icon?: React.ReactNode;
    isTextArea?: boolean;
    helperText?: string;
    rows?: number;
}

export default function FormInput({
    label,
    error,
    icon,
    isTextArea = false,
    helperText,
    className = "",
    ...props
}: FormInputProps) {
    const InputComponent = isTextArea ? 'textarea' : 'input';

    return (
        <div className="w-full space-y-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
            <div className="flex justify-between items-center px-1">
                <label className="text-[13px] font-semibold text-slate-700 flex items-center gap-1.5">
                    {icon && <span className="text-slate-400">{icon}</span>}
                    {label}
                    {props.required && <span className="text-red-400">*</span>}
                </label>

                {/* Character Count for direct feedback */}
                {typeof props.value === 'string' && props.maxLength && (
                    <span className={`text-[10px] font-medium ${props.value.length > props.maxLength * 0.9 ? 'text-amber-500' : 'text-slate-400'
                        }`}>
                        {props.value.length}/{props.maxLength}
                    </span>
                )}
            </div>

            <div className="relative group">
                <InputComponent
                    {...props as any}
                    className={`
                        w-full px-4 py-2.5 rounded-xl border-2 outline-none transition-all duration-200
                        text-sm text-slate-900 placeholder:text-slate-300
                        ${error
                            ? "border-red-200 bg-red-50/30 focus:border-red-500 focus:ring-4 focus:ring-red-50"
                            : "border-slate-100 bg-white hover:border-slate-200 focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/10"
                        }
                        ${className}
                    `}
                />

                {error && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 animate-in zoom-in duration-200">
                        <AlertCircle className="w-4 h-4" />
                    </div>
                )}
            </div>

            {error ? (
                <p className="text-[11px] font-medium text-red-500 flex items-center gap-1 px-1 animate-in slide-in-from-top-1">
                    {error}
                </p>
            ) : helperText ? (
                <p className="text-[11px] text-slate-400 px-1 italic">
                    {helperText}
                </p>
            ) : null}
        </div>
    );
}
