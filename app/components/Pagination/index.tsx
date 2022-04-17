import React from "react"

interface IPagination{
    data:Array<any>,
    pageLength:number,
    children:(x: {
        data: any[];
        currentIndex: number;
        next: () => void;
        prev: () => void;
        goToPage: (pageIndex: number) => void;
    })=>any
}

export const Paginate=({data, pageLength, children}:IPagination)=>{
    const dataString=JSON.stringify(data)
    const getPageCount=(dataCount:number, pageLength:number)=>{
        const restPage=dataCount % pageLength
        return ((dataCount - restPage) / pageLength) + (restPage > 0 ? 1 : 0)
    }

    const [current, setCurrent]=React.useState<{
        pageData:Array<any>,
        currentPageIndex:number
    }>({
        pageData:data.slice(0, pageLength),
        currentPageIndex:1
    })

    const goToPage=(pageIndex:number, pageData?:any)=>{
        pageData=pageData??data
        if(pageData.length){
            const pages=getPageCount(pageData.length, pageLength)
            if(pageIndex>=1 && pageIndex<=pages){
                setCurrent({
                    pageData:pageData.slice((pageIndex-1)*pageLength, pageIndex*pageLength),
                    currentPageIndex:pageIndex
                })
            }
        }else{
            setCurrent({
                pageData:[],
                currentPageIndex:1
            })
        }
    }
    React.useEffect(()=>{
        goToPage(current.currentPageIndex)
    }, [pageLength])

    React.useEffect(()=>{
        goToPage(1, data)
    }, [dataString])
    return(
        children({
            data:current.pageData, currentIndex:current.currentPageIndex, next:()=>goToPage(current.currentPageIndex + 1), prev:()=>goToPage(current.currentPageIndex - 1), goToPage
        })
    )
}