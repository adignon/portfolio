import React from "react"
type PageKeyT = {
    [x in "contactPage"]: any
}
export const PageDataContext=React.createContext({} as {
    data:PageKeyT,
    setPageData:(pageKey:keyof PageKeyT, data:any)=>void
})

interface IPageDataProvider{
    children?:React.ReactNode
}
export const PageDataProvider=({children}:IPageDataProvider)=>{
    const [data, setData]=React.useState<PageKeyT>({
        contactPage:undefined,
    })
    return(
        <PageDataContext.Provider value={{
            data,
            setPageData:(pageKey:keyof PageKeyT, data:any)=>setData(prev=>({...prev, [pageKey]:data}))
        }}>
            {children}
        </PageDataContext.Provider>
    )
}