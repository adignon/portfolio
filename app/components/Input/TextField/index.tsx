import React, { HTMLAttributes } from "react"
import { clx, pp } from "../../../utils/comp"
import { InputLabel } from "../InputLabel"

export interface ITextFieldBase extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>{
}
export const TextFieldBase=React.forwardRef(({...inputProps}:ITextFieldBase, ref)=>{
    const {className:inputClassName, ...input}=pp(inputProps)
    return(
        <input ref={ref} className={clx("p-2 w-full outline-none block",inputClassName)} {...input}/>
    )
})

export interface ITextField extends ITextFieldBase{
    variant?:"outlined",
    color?:"primary"|"secondary",
    label:string
    labelVariant?:"standard",
    ref?:React.LegacyRef<HTMLInputElement> | undefined,
    disabledAutoFocus?:boolean
    error?:boolean
    helperText?:string
    onFocus?:(x:any)=>any,
    onBlur?:(x:any)=>any,
}

export const TextField=({helperText="", onFocus, onBlur,error, ref,disabledAutoFocus=false, variant="outlined", label, labelVariant="standard",className,  ...props}:ITextField)=>{
    const [focused, setFocused]=React.useState(false)
    const classes={
        input:{
            outlined:{
                className:{
                    general:clx("border rounded border-gray-500 "),
                    main:clx("border-gray-500  hover:border-primary group-hover:border-primary", focused?"!border-primary":"",className),
                    error:" border-red-500 text-red-500"
                },
                
            }
        },
        label:{
            standard:{
                className:{
                    general:clx("text-sm pb-2 group-hover:text-primary", focused ? "text-primary":""),
                    error:"text-red-500"
                }
            }
        },
        helperText:{
            className:{
                general:"text-xs",
                main:clx(focused ? "text-primary":"", "transition group-hover:text-primary"),
                error:"text-red-500"
            }
        }
        
    }

    
    const inputRef:any=ref ?? React.useRef<HTMLInputElement>()
    React.useEffect(()=>{
        if(!disabledAutoFocus && inputRef){
            if(focused && inputRef.current){
                inputRef.current.focus()
            }else{
                inputRef.current?.blur()
            }
        }
    }, [focused])

    return(
        <div className="group">
            <div className="mb-1">
                <InputLabel 
                    className={clx(
                        classes.label[labelVariant].className.general,
                        error ? classes.label[labelVariant].className.error :""
                    )}
                >
                    {label}
                </InputLabel>
            </div>
            <div>
                <TextFieldBase
                    onFocus={(e)=>{
                        if(!disabledAutoFocus) setFocused(true);
                        if(onFocus instanceof Function) onFocus(e)
                    }}
                    onBlur={(e)=>{
                        if(!disabledAutoFocus) setFocused(false);
                        if(onBlur instanceof Function) onBlur(e)
                    }}
                    className={clx(classes.input[variant].className.general, classes.input[variant].className[error ?"error":"main"])}
                    {...props}
                />
            </div>
            {
                Boolean(helperText) ?
                <p 
                    className={clx(
                        classes.helperText.className.general,
                        classes.helperText.className[error ? "error":"main"]
                    )}
                >
                    {helperText}
                </p>
                :<></>
            }
        </div>
    )
}