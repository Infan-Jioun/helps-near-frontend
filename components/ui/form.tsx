/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import * as React from "react"
import {
  Controller,
  FormProvider,
  useFormContext,
  type UseFormReturn,
} from "react-hook-form"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

const FormFieldContext = React.createContext<string | undefined>(undefined)

type FormProps = UseFormReturn<any> & {
  children: React.ReactNode
}

function Form({ children, ...props }: FormProps) {
  return <FormProvider {...props}>{children}</FormProvider>
}

function FormField(props: React.ComponentProps<typeof Controller>) {
  return (
    <Controller
      {...props}
      render={(controllerProps) => (
        <FormFieldContext.Provider value={props.name?.toString()}>
          {props.render(controllerProps)}
        </FormFieldContext.Provider>
      )}
    />
  )
}

function FormItem({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="form-item" className={cn("grid gap-1", className)} {...props} />
  )
}

function FormLabel({
  className,
  ...props
}: React.ComponentProps<typeof Label>) {
  return <Label className={cn(className)} {...props} />
}

function FormControl({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="form-control" className={cn("flex flex-col gap-1", className)} {...props} />
  )
}

function FormMessage({
  className,
  children,
  ...props
}: React.ComponentProps<"p">) {
  const fieldName = React.useContext(FormFieldContext)
  const { formState } = useFormContext()
  const fieldError = fieldName
    ? (formState.errors[fieldName] as { message?: string } | undefined)
    : undefined
  const message = children ?? fieldError?.message

  if (!message) {
    return null
  }

  return (
    <p className={cn("text-xs text-destructive", className)} {...props}>
      {message}
    </p>
  )
}

export { Form, FormField, FormItem, FormLabel, FormControl, FormMessage }