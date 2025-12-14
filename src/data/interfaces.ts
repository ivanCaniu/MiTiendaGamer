export interface Producto {
  id: number
  nombre: string
  descripcion: string
  precio: number
  stock: number
  imagen: string
  categoria: string
  oferta?: boolean
}
export interface Usuario {
  id: number
  nombre: string
  email: string
  rol: 'cliente' | 'admin'
}
export interface Admin extends Usuario {
  permisos: string[]
}
