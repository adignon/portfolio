import React from 'react';


export const useForm=(formDatas={}):Array<any>=>{
    const [form, setForm]=React.useState(formDatas);
    const handleForm=function (e:any, value:any, name:any){
        const target=e.target ? e.target: e.currentTarget;
        if(value){
            setForm(prev=>({...prev, [(name ?? target.name)]: value}))
        }else{
            if(target.hasOwnProperty("checked"))
                setForm(prev=>({...prev, [name ?? target.name]: target.checked}))
            else
                setForm(prev=>({...prev, [name ?? target.name]: target.value}))
        }
    }
    return [form, handleForm];
}

export interface IForm{
  value?:any
  checked?:any
  vSchema?:any,
  customValidation?:(value:any, form?:any)=>boolean,
  help?:string,
  sameAs?:string,
  skipValidation?:boolean,
  errorMessage?:string,
  transformValue?:(value:any, form?:any)=>any,
}

export interface IFormDatas{
  [name:string]:IForm
}

let prevFormData:any;

export interface IFormOptions{ handlePersist?:(newData:any)=>any, useStorage:boolean, storageKey:string, storageObject?:Storage, useStringifyMethod?:boolean, strictCopy?:boolean}

//Send "_form" key vSchema to validate hole form
export const useFormValid=(formDatas:IFormDatas, validate=true,options?:IFormOptions, routerChangeParams?:Array<any>):Array<any>=>{
        let {handlePersist, useStorage, storageKey, storageObject, useStringifyMethod, strictCopy=true}:any=options ?? {}
        storageObject=storageObject ??  (typeof window==="undefined" ? {} : sessionStorage)
        const getStoreValue=(keys?:Array<string>)=>{
            
            if(useStorage && typeof storageKey==="string" && storageObject && storageObject?.getItem instanceof Function && storageObject?.setItem instanceof Function){

                let data:any=  storageObject.getItem(storageKey)
                let parsedData=useStringifyMethod ? JSON.parse(data):data
                if(strictCopy){
                    let d:any={}
                    for(let i in parsedData){
                        if(keys){
                            if(keys.includes(i)) d[i]=parsedData[i];
                        }else{
                            d[i]=parsedData[i]
                        }
                    }
                    return d;
                }
                return parsedData
            }
            return {}
        }
        //Local Storage
        const [form, setForm]:any=React.useState({...getStoreValue(Object.keys(formDatas)),...formDatas})
        
        const getHelperTextOn=(prop:string)=>{
            if(form[prop].valid===false){
                return form[prop].errorMessage ?? form[prop].error.message ?? "Erreur de validation de ce champ."
            }else{
                if(Boolean(form[prop].value.length) && form[prop].valid){
                    return ""
                }else{
                    return form[prop].help ?? ""
                }
            }
        }
        const isErrorOn=(prop:any)=>!form[prop] || form[prop].valid ===undefined ? undefined : isNaN(form[prop].valid)? false : !form[prop].valid

        //Validate form witj joi
        const validateForm=(joiSchema:any, value:any, fieldData:IForm)=>{
            if(validate){

                //handleCustom validation
                //if no custom validation defined set valid to true
                const customValidationResult=fieldData?.customValidation instanceof Function ? fieldData.customValidation(value, getValues()) : true;
                //if schema defined
                
                if(joiSchema){
                if(Boolean(value)){
                        const result=joiSchema.validate(value);
                        //if there is an error return valid:false
                        if(result.error){
                            return {valid: false, error: result.error}
                        }
                }else{
                        return {valid:undefined}
                }
                
                }
                if(fieldData && fieldData.sameAs){
                    if((value!==form[fieldData.sameAs].value)){
                        return {valid: false, error: {message:"Champs non conformes."}}; 
                    }
                }
                return {valid:customValidationResult }
            }else{
                return {}
            }
        }

        //Add field to form
        const editField=(name:string, config:IForm)=>{
            setForm((prev:any)=>({...prev, [name]:config}))
        }

        const editFields=(data:{[name:string]:IForm})=>{
            setForm((prev:any)=>({...prev, ...data}))
        }
        

        //Eval if form valid
        const isFormValid=()=>{
            return !Boolean(Object.keys(getErrors()).length)
        }
        

        //form smart handler 
        const handleForm=function (e:any){
            const target= e.target
            if(target){
                if(target.hasOwnProperty("checked"))
                    setForm((prev:any)=>{
                        const value=prev[target.name]?.transformValue instanceof Function ? prev[target.name]!.transformValue(target.checked, prev) :target.checked
                        //Copy store datas to the new form if existing
                        let d=getStoreValue(Object.keys(formDatas))
                        d=({
                            ...prev,
                            ...d,
                            [ target.name]: {...prev[ target.name], value , ...(validate && !prev.skipValidation ? validateForm(prev[( target.name)] && prev[( target.name)].vSchema ? prev[( target.name)].vSchema : undefined, value, prev[( target.name)]) : {})}})
                        saveToStore(d)
                        if(prev._form?.vSchema){
                            d["_form"]={...prev._form, ...validateForm(form._form.vSchema, getValues(d), prev._form)}
                        }
                        if(handlePersist instanceof Function) return handlePersist(d);
                        return d
                    
                    })
                else
                    setForm((prev:any)=>{
                        
                        const value=prev[target.name]?.transformValue instanceof Function ? prev[target.name]!.transformValue(target.value, prev) :target.value
                        let d=getStoreValue(Object.keys(formDatas))
                        d=({...prev,...d, [ target.name]: {...prev[ target.name], value, ...(validate && !prev.skipValidation ? validateForm(prev[( target.name)] && prev[( target.name)].vSchema ?  prev[( target.name)].vSchema : undefined, value, prev[( target.name)]) :{})} })
                        saveToStore(d)
                        if(prev._form?.vSchema){
                            d["_form"]={...prev._form, ...validateForm(form._form.vSchema, getValues(d), form._form)}
                        }

                        if(handlePersist instanceof Function) return handlePersist(d)
                        
                        return d
                    })
            } 
        }

        //Get form values as key value paires
        const getValues=(datas:any={...getStoreValue(Object.keys(formDatas)), ...form}):{[key:string]:string}=>{
            let d:any={}
            for(let i in datas){
                if(i==="_form") continue;
                d[i]=datas[i].value
            }
            return d;
        }


        //get all form errors
        const getErrors=(datas:any={...getStoreValue(Object.keys(formDatas)), ...form}):{[x:string]:string}=>{
            let d:any={}
            for(let i in datas){
                let error:any;
                if(datas[i].error) {
                    error=datas[i].error
                }else{
                    let v=validateForm(datas[i].vSchema, datas[i].value, datas[i])

                    error=v.error;
                    datas[i]['valid']=v.valid
                }
                if(!datas[i].valid){
                    d[i]=datas[i].errorMessage ?? error?.message ?? ""
                }
            }
            return d;
        }

        //Reset form to initial values
        const reset=(values:any={})=>{
            saveToStore({...getStoreValue(), ...formDatas, ...values})
            setForm({...getStoreValue(), ...formDatas, ...values})
            
        }

        //Save form data to a Storage object or interface
        const saveToStore=(d:any)=>{
            if(useStorage && typeof storageKey==="string" && storageObject && storageObject?.getItem instanceof Function && storageObject?.setItem instanceof Function){
                let data:any=  storageObject.getItem(storageKey)
                data=data ? useStringifyMethod ? JSON.parse(data) : data: {}
                data={...data, ...d}
                storageObject.setItem(storageKey,  useStringifyMethod ? JSON.stringify(data):data)
                return data
            }
            return d

        }

        //Form handler based on value or function
        const handleFormValue=function (name:any, value:any|((prevState:any, prev?:any)=>any)){

            setForm((prev:any)=>{
                value=value instanceof Function ? value(prev[name], prev) : value
                value=prev[name]?.transformValue instanceof Function ? prev[name]?.transformValue(value, prev) :value
                let d=getStoreValue(Object.keys(formDatas))
                d= {...prev,...d, [(name)]: {...prev[(name)], value, ...(validate && !prev.skipValidation ? validateForm((prev[(name)] ? prev[(name)].vSchema : undefined) , value, prev[(name)]) : {})}}
                if(handlePersist instanceof Function) return handlePersist(d)
                saveToStore(d)
                if(prev._form?.vSchema){
                    d["_form"]={...prev._form, ...validateForm(form._form.vSchema, getValues(d), form._form)}
                }
                return d
            })
        }


        //Form handler array
        const handleFormValues=function (values:{[x:string]:((prevState:any, prev?:any)=>any)|any}){

            setForm((prev:any)=>{
                let d={...prev,...getStoreValue(Object.keys(formDatas))};
                for(let i in values){
                    let value=values[i];
                    value=value instanceof Function ? value(prev[i],prev) : value
                    value=prev[i]?.transformValue instanceof Function ? prev[i]?.transformValue(value, d) :value
                    d= {...d, [i]: {...prev[i], value, ...(validate && !prev.skipValidation ? validateForm((prev[i] ? prev[i].vSchema : undefined) , value, prev[i]) : {})}}
                }
                if(handlePersist instanceof Function) return handlePersist(d)
                saveToStore(d)
                if(prev._form?.vSchema){
                    d["_form"]={...prev._form, ...validateForm(form._form.vSchema, getValues(d), form._form)}
                }
                return d
            })
        }


        //Clear Storage object
        const clearStore=()=>{
            
            if(useStorage && typeof storageKey==="string" && storageObject && storageObject?.getItem instanceof Function && storageObject?.setItem instanceof Function ){
                const localStorageData=storageObject.getItem(storageKey)
                const localStorageDatas=localStorageData ? useStringifyMethod ? JSON.parse(localStorageData) : localStorageData  : null
                const formDataKeys=Object.keys(formDatas)
                const newD:any={}
                for(let i in localStorageDatas){
                    if(!formDataKeys.includes(i)){
                        newD[i]=localStorageDatas[i];
                    }
                }
                if(Object.keys(newD).length){
                    storageObject.setItem(storageKey, newD)
                }else{
                    storageObject.removeItem(storageKey)
                }
            }
            
        }
        const getHandlePropsFor=(
            key:"name",
            c:(x:{[x:string]:any})=>any=(x:any)=>x
        )=>{
            if(form[key]){
                const d={
                    ...(typeof form[key].value==="boolean" ? {checked:form[key].value}:{value:form[key].value}),
                    helperText:getHelperTextOn(key),
                    error:isErrorOn(key),
                    onChange:handleForm,
                    name:key
                }
                return c(d)
            }
            return{}
        }

        //Initialize form from storage object
        React.useEffect(()=>{
            if(useStorage && typeof storageKey==="string" && storageObject && storageObject?.getItem instanceof Function && storageObject?.setItem instanceof Function){
                const localStorageData:any=storageObject.getItem(storageKey)
                const localStorageDataParsed:any=localStorageData? useStringifyMethod ? JSON.parse(localStorageData) : localStorageData :null
                const k={...localStorageDataParsed, ...form}
                //if not store   recopy means if form !== {}
                storageObject.setItem(storageKey, useStringifyMethod ? JSON.stringify(k) : k)
            }
        }, [])

        React.useEffect(()=>{
            const d={...getStoreValue(Object.keys(formDatas)),...formDatas}
            if(JSON.stringify(d)!==JSON.stringify(form)){
                setForm(d)
            }
        }, [...(routerChangeParams??[])])

        return [form, {form:getHandlePropsFor,editFields, handleForm, handleFormValue,editField, handleFormValues,getHelperTextOn, isErrorOn, getErrors, isFormValid, clearStore, getValues, reset}];
}