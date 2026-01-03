import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { ZodType } from "zod";
import { zodValidator } from "@tanstack/zod-form-adapter";

interface AuthInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "value" | "onChange"
  > {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  name: any;
  validator?: ZodType;
  icon: LucideIcon;
  label?: string;
}

export function AuthInput({
  form,
  name,
  validator,
  icon: Icon,
  className,
  type,
  placeholder,
  ...props
}: AuthInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <form.Field
      name={name}
      validatorAdapter={zodValidator()}
      validators={{
        onChange: validator,
        onBlur: validator,
        onSubmit: validator, // <--- AQUI ESTÁ A CORREÇÃO: Valida ao tentar enviar!
      }}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      children={(field: any) => {
        const errorMsg =
          field.state.meta.errors.length > 0
            ? field.state.meta.errors[0]
            : null;
        const error = typeof errorMsg === "string" ? errorMsg : null;
        const hasError = !!error;

        return (
          <div className="w-full flex flex-col gap-1">
            <motion.div
              animate={hasError ? { x: [-10, 10, -10, 10, 0] } : {}}
              transition={{ duration: 0.4 }}
              className="relative group"
            >
              <div className="absolute left-2 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-[#CCFF00] transition-colors z-10 pointer-events-none">
                <Icon className="w-5 h-5" />
              </div>

              <input
                {...props}
                id={field.name}
                name={field.name}
                type={type}
                placeholder={placeholder}
                value={field.state.value}
                onBlur={(e) => {
                  setIsFocused(false);
                  field.handleBlur();
                  props.onBlur?.(e);
                }}
                onChange={(e) => field.handleChange(e.target.value)}
                onFocus={(e) => {
                  setIsFocused(true);
                  props.onFocus?.(e);
                }}
                className={cn(
                  "w-full h-12 pl-8 pr-3 bg-transparent text-white text-lg placeholder:text-white/30",
                  "border-0 border-b-2 border-white/20 rounded-none outline-none transition-all duration-300",
                  "focus:border-[#CCFF00] focus:shadow-[0_4px_12px_rgba(204,255,0,0.3)]",
                  hasError && "border-red-500 focus:border-red-500",
                  className
                )}
              />

              <AnimatePresence>
                {isFocused && !hasError && (
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    exit={{ scaleX: 0 }}
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#CCFF00] pointer-events-none"
                  />
                )}
              </AnimatePresence>
            </motion.div>

            <div className="min-h-[20px] overflow-hidden">
              {error && (
                <span className="text-red-500 text-xs font-medium block ml-1 animate-in fade-in slide-in-from-top-1">
                  {error}
                </span>
              )}
            </div>
          </div>
        );
      }}
    />
  );
}