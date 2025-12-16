import type { Producto, Usuario } from './interfaces'

const STORAGE_KEY = 'miTiendaGamerDB_v3'
type DB = { productos: Producto[]; usuarios: Usuario[] }

const seed: DB = {
  productos: [
    { 
      id:1, 
      nombre:'PlayStation 5',
      descripcion:'Consola PS5 edición estándar',
      precio:649990, 
      imagenUrl: 'https://clsonyb2c.vtexassets.com/arquivos/ids/465172-800-800?v=638658958190900000&width=800&height=800&aspect=true',
      stock:10, 
      categoria:'Consolas',
      oferta:false },
    { 
      id:2,
      nombre:'Xbox Series X',
      descripcion:'Consola de próxima generación',
      precio:350000,
      imagenUrl:'https://i5.walmartimages.com/asr/fd9cc3cc-3533-4eec-a87d-e6abcc77aae7.0e7d395789bb5e75eb627b80cfe78b13.jpeg',
      stock:15,
      categoria:'Consolas',
      oferta:true },
    { 
      id:3,
      nombre:'Nintendo Switch OLED',
      descripcion:'Modelo OLED 7"', 
      precio:399990, 
      imagenUrl:'https://media.solotodo.com/media/products/1473681_picture_1634002127.jpg',
      stock:8,
      categoria:'Consolas',
      oferta:false },
  
    { 
      id:4,
      nombre:'The Last of Us Part I',
      descripcion:'Acción y aventura',
      precio:69990,
      imagenUrl:'https://image.api.playstation.com/vulcan/ap/rnd/202206/0719/nsB47QdrajA2tz9ZDtPX1dPr.png',
      stock:20,
      categoria:'Juegos',
      oferta:true },

    { 
      id:5,
      nombre:'Halo Infinite',
      descripcion:'Shooter icónico de Xbox',
      precio:59990,
      imagenUrl:'https://store-images.s-microsoft.com/image/apps.56579.14158640560789719.0ace7ee4-abf5-4ad7-83ca-06d62c241bf1.335bbd79-8495-44cf-9732-0fd940a03c17?q=90&w=177&h=177',
      stock:25,
      categoria:'Juegos',
      oferta:false },
    { 
      id:6,
      nombre:'Teclado Mecánico RGB',
      descripcion:'Switch rojo gamer',
      precio:28990, 
      imagenUrl:'https://images-cdn.ubuy.com.sa/64497d52a7848c3d495df453-redragon-k556-rgb-led-backlit-wired.jpg',
      stock:30,
      categoria:'Periféricos',
      oferta:true },

    {
      id:7,
      nombre:'Mouse Gamer 16000 DPI',
      descripcion:'Ergonómico, RGB',
      precio:29990,
      imagenUrl:'https://http2.mlstatic.com/D_NQ_NP_700630-MLU78175831151_082024-O.webp',
      stock:40,
      categoria:'Periféricos',
      oferta:false },

    {
      id: 8,
      nombre: 'Uncharted 4: A Thief\'s End',
      descripcion: 'Aventura épica de acción',
      precio: 49990,
      imagenUrl: 'https://juegosdigitaleschile.com/files/images/productos/1538764920-uncharted-4-el-desenlace-del-ladron-ps4.jpg',
      stock: 20,
      categoria: 'Juegos',
      oferta: true
      }
  ],
  usuarios: [
    { id:1, nombre:'Admin', email:'admin@mitienda.cl', rol:'admin' },
    { id:2, nombre:'Cliente Demo', email:'cliente@mitienda.cl', rol:'cliente' }
  ]
}

function load(): DB {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) { localStorage.setItem(STORAGE_KEY, JSON.stringify(seed)); return structuredClone(seed) }
  try { return JSON.parse(raw) } catch { localStorage.setItem(STORAGE_KEY, JSON.stringify(seed)); return structuredClone(seed) }
}
function save(db: DB){ localStorage.setItem(STORAGE_KEY, JSON.stringify(db)) }

// Productos
export function getProductos(): Producto[] { return load().productos }
export function getProductoById(id:number): Producto | undefined { return load().productos.find(p=>p.id===id) }
export function getCategorias(): string[] { return Array.from(new Set(load().productos.map(p=>p.categoria))) }
export function getProductosPorCategoria(cat:string): Producto[] { return load().productos.filter(p=>p.categoria===cat) }
export function getOfertas(): Producto[] { return load().productos.filter(p=>p.oferta) }
export function searchProductos(q:string): Producto[] {
  const t=q.toLowerCase(); return load().productos.filter(p=>[p.nombre,p.descripcion,p.categoria].some(x=>x.toLowerCase().includes(t)))
}
export function createProducto(data: Omit<Producto,'id'>){ const db=load(); const next=(db.productos.at(-1)?.id??0)+1; db.productos.push({...data,id:next}); save(db) }
export function updateProducto(id:number, partial: Partial<Producto>){ const db=load(); const i=db.productos.findIndex(p=>p.id===id); if(i>-1){db.productos[i]={...db.productos[i],...partial}; save(db)} }
export function deleteProducto(id:number){ const db=load(); db.productos=db.productos.filter(p=>p.id!==id); save(db) }

// Usuarios
export function getUsuarios(): Usuario[] { return load().usuarios }
export function createUsuario(u: Omit<Usuario,'id'>){ const db=load(); const next=(db.usuarios.at(-1)?.id??0)+1; db.usuarios.push({...u,id:next}); save(db) }
export function updateUsuario(id:number, partial: Partial<Usuario>){ const db=load(); const i=db.usuarios.findIndex(u=>u.id===id); if(i>-1){db.usuarios[i]={...db.usuarios[i],...partial}; save(db)} }
export function deleteUsuario(id:number){ const db=load(); db.usuarios=db.usuarios.filter(u=>u.id!==id); save(db) }
