import {MdDone, MdRemove} from "react-icons/md"
import {DetailedHTMLProps,InputHTMLAttributes} from "react"
import {clx} from "../../../utils/comp"
export interface ICheckbox extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>{
    checked?:boolean
}
export const Checkbox=({checked, className, ...props}:ICheckbox)=>{
    const d=typeof checked==="boolean" ?{
        checked
    }:{}
    return(
        <div className={clx("w-5 h-5  border-gray-400 relative rounded overflow-hidden", (typeof checked ==="boolean" && checked ) || checked===undefined? "":"border-2")}>
            {
                 typeof checked ==="boolean" && checked ?
                <div className="absolute h-5 w-5   bg-primary top-0 left-0 flex justify-center items-center">
                    <MdDone className="text-xl text-white"/>
                </div>:<></>
            }
            {
                 typeof checked !=="boolean" && checked===undefined ?
                <div className="absolute h-5 w-5   bg-primary top-0 left-0 flex justify-center items-center">
                    <MdRemove className="text-xl text-white"/>
                </div>:<></>
            }
            <input type="checkbox" {...d} className={clx("absolute w-full h-full opacity-0", className)} {...props} checked={checked===undefined ? false : checked}/>
        </div>
    )
}