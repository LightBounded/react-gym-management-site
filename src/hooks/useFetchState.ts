import { useState, useEffect, Dispatch, SetStateAction } from "react"


const useFetchState = <T = unknown>(url: string): [T | null, Dispatch<SetStateAction<T | null>>] => {
    const [data, setData] = useState<T | null>(null)

    useEffect(() => {
        (async () => {
            const res = await fetch(url)
            setData(await res.json())
        })()
        
    }, [])

    return [data, setData]
}

export default useFetchState