import { DetailedHTMLProps, HTMLAttributes, InputHTMLAttributes } from "react"
import { clx } from "../../../utils/comp"
import { IInputLabel, InputLabel } from "../InputLabel"

interface IRadio extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>{
    containerProps?:HTMLAttributes<HTMLDivElement>
    checkedContainerProps?:HTMLAttributes<HTMLDivElement>
    label:string
    labelProps?:IInputLabel
}
export const Radio=({checked=false,label,type:_,className,containerProps,labelProps,checkedContainerProps, ...props}:IRadio)=>{
    const {className:containerClassName, ...container}=containerProps??{}
    const {className:checkedContainerClassName, ...checkedContainer}=checkedContainerProps??{}
    const {className:labelClassName, ...labelP}=labelProps??{}
    props={
        ...props,
        ...(props.onChange instanceof Function ? {checked}:{})
    }
    return(
       <div className="group flex items-center max-w-max">
            <div className={clx("border-2 z-0 relative w-5 h-5 rounded-full group-hover:border-primary ",containerClassName, checked ? "border-primary":"")} {...container}>
                {
                    checked && <div className={clx("w-2 h-2 bg-gray absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-primary rounded-full", checkedContainerClassName)} {...checkedContainer}></div>
                }
                <input type="radio"  className={clx("absolute z-1 w-full h-full opacity-0", className)} {...props}/>
            </div>
            <InputLabel className={clx("ml-4 group-hover:text-primary", labelClassName, checked? "text-primary":"")} {...labelP}>{label}</InputLabel>
       </div>
    )
}