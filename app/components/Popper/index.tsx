import React, { HTMLAttributes, useState } from 'react';
import { usePopper } from 'react-popper';
import { clx } from '../../utils/comp';
export interface IPopper extends HTMLAttributes<HTMLDivElement>{
    btnRef:React.LegacyRef<HTMLButtonElement>
    children:React.ReactNode,
    arrowProps?:React.ReactNode
}
export const Popper = ({btnRef:referenceElement, children, arrowProps, ...props}:IPopper) => {
    const [popperElement, setPopperElement]:any  = useState(null);
    const [arrowElement, setArrowElement]:any  = useState(null);
    const { styles, attributes } = usePopper(referenceElement as any, popperElement, {
      modifiers: [{ name: 'arrow', options: { element: arrowElement } }],
    });
    const {style,className, ...divProps}=props??{}
    //@ts-ignore
    attributes.popper={
        ...attributes.popper,
        ...divProps,
        className:clx(attributes.popper?.className, className)
    }
    const {style:arrowStyle,className:arrowClassName, ...arrowProp}:any=arrowProps??{}
    return (
        <div ref={setPopperElement} style={{...styles.popper, ...style}} {...attributes.popper} >
            {children}
            <div ref={setArrowElement} className={clx("", arrowClassName)} style={{...styles.arrow, ...(arrowStyle??{})}} {...arrowProp}/>
      </div>
    );
  };