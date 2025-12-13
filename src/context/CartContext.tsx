import React,{ createContext, useContext, useReducer, useEffect, useMemo } from 'react'
import type { Producto } from '../data/interfaces'

type Item = Producto & { qty: number }
interface State { items: Item[] }
type Action = { type:'add', item:Producto } | { type:'remove', id:number } | { type:'clear' }
const STORAGE = 'cartMiTienda_v2'

function reducer(state:State, action:Action):State {
  switch(action.type){
    case 'add':{
      const idx = state.items.findIndex(i=>i.id===action.item.id)
      if(idx>=0){ const copy=[...state.items]; copy[idx]={...copy[idx],qty:copy[idx].qty+1}; return {items:copy} }
      return {items:[...state.items,{...action.item,qty:1}]}
    }
    case 'remove': return {items:state.items.filter(i=>i.id!==action.id)}
    case 'clear': return {items:[]}
    default: return state
  }
}
const Ctx = createContext<{state:State,total:number,qty:number,dispatch:React.Dispatch<Action>}|null>(null)

export function CartProvider({children}:{children:React.ReactNode}){
  const [state,dispatch]=useReducer(reducer,{items:[]},()=>{
    const raw=localStorage.getItem(STORAGE); return raw?JSON.parse(raw):{items:[]}
  })
  useEffect(()=>{localStorage.setItem(STORAGE,JSON.stringify(state))},[state])
  const total=useMemo(()=>state.items.reduce((a,i)=>a+i.precio*i.qty,0),[state.items])
  const qty=useMemo(()=>state.items.reduce((a,i)=>a+i.qty,0),[state.items])
  const value=useMemo(()=>({state,total,qty,dispatch}),[state,total,qty])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
export function useCart(){ const ctx=useContext(Ctx); if(!ctx) throw new Error('useCart must be used within CartProvider'); return ctx }
