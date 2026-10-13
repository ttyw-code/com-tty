import * as THREE from 'three'

const identity = (r: any) => r as THREE.Group

const wrapGeom = (geom: THREE.BufferGeometry) => {
  const g = new THREE.Group()
  g.add(new THREE.Mesh(geom, new THREE.MeshStandardMaterial()))
  return g
}

type LoaderFn = (url: string) => Promise<THREE.Group>

const promisify = (
  loader: any,
  url: string,
  extract: (r: any) => THREE.Group,
) =>
  new Promise<THREE.Group>((resolve, reject) => {
    loader.load(
      url,
      (r: any) => resolve(extract(r)),
      undefined,
      (e: any) => reject(e),
    )
  })

const loaders: Record<string, LoaderFn> = {
  '.obj': async (url) => {
    const { OBJLoader } = await import('three/addons/loaders/OBJLoader.js')
    return promisify(new OBJLoader(), url, identity)
  },
  '.gltf': async (url) => {
    const { GLTFLoader } = await import('three/addons/loaders/GLTFLoader.js')
    return promisify(new GLTFLoader(), url, (r) => r.scene)
  },
  '.glb': async (url) => {
    const { GLTFLoader } = await import('three/addons/loaders/GLTFLoader.js')
    return promisify(new GLTFLoader(), url, (r) => r.scene)
  },
  '.fbx': async (url) => {
    const { FBXLoader } = await import('three/addons/loaders/FBXLoader.js')
    return promisify(new FBXLoader(), url, identity)
  },
  '.stl': async (url) => {
    const { STLLoader } = await import('three/addons/loaders/STLLoader.js')
    return promisify(new STLLoader(), url, wrapGeom)
  },
  '.ply': async (url) => {
    const { PLYLoader } = await import('three/addons/loaders/PLYLoader.js')
    return promisify(new PLYLoader(), url, wrapGeom)
  },
  '.dae': async (url) => {
    const { ColladaLoader } = await import(
      'three/addons/loaders/ColladaLoader.js'
    )
    return promisify(new ColladaLoader(), url, (r) => r.scene)
  },
  '.3mf': async (url) => {
    const { ThreeMFLoader } = await import('three/addons/loaders/3MFLoader.js')
    return promisify(new ThreeMFLoader(), url, identity)
  },
  '.kmz': async (url) => {
    const { KMZLoader } = await import('three/addons/loaders/KMZLoader.js')
    return promisify(new KMZLoader(), url, identity)
  },
  '.vtk': async (url) => {
    const { VTKLoader } = await import('three/addons/loaders/VTKLoader.js')
    return promisify(new VTKLoader(), url, wrapGeom)
  },
  '.md2': async (url) => {
    const { MD2Loader } = await import('three/addons/loaders/MD2Loader.js')
    return promisify(new MD2Loader(), url, wrapGeom)
  },
  '.wrl': async (url) => {
    const { VRMLLoader } = await import('three/addons/loaders/VRMLLoader.js')
    return promisify(new VRMLLoader(), url, (r) => r.scene)
  },
  '.3ds': async (url) => {
    const { TDSLoader } = await import('three/addons/loaders/TDSLoader.js')
    return promisify(new TDSLoader(), url, identity)
  },
  '.amf': async (url) => {
    const { AMFLoader } = await import('three/addons/loaders/AMFLoader.js')
    return promisify(new AMFLoader(), url, identity)
  },
  '.dat': async (url) => {
    const { LDrawLoader } = await import('three/addons/loaders/LDrawLoader.js')
    return promisify(new LDrawLoader(), url, identity)
  },
  '.mpd': async (url) => {
    const { LDrawLoader } = await import('three/addons/loaders/LDrawLoader.js')
    return promisify(new LDrawLoader(), url, identity)
  },
  '.3dm': async (url) => {
    const { Rhino3dmLoader } = await import('three/addons/loaders/3DMLoader.js')
    return promisify(new Rhino3dmLoader(), url, identity)
  },
}

export const loadModel = async (url: string) => {
  const ext = '.' + url.split('.').pop()!.toLowerCase()
  const fn = loaders[ext]
  if (!fn) throw new Error(`Unsupported 3D format: ${ext}`)
  return fn(url)
}

export const loadObjModel = (url: string) => loaders['.obj'](url)
export const loadGLTFModel = (url: string) => loaders['.gltf'](url)
export const loadFBXModel = (url: string) => loaders['.fbx'](url)
export const loadSTLModel = (url: string) => loaders['.stl'](url)
export const loadPLYModel = (url: string) => loaders['.ply'](url)
export const loadColladaModel = (url: string) => loaders['.dae'](url)
export const load3MFModel = (url: string) => loaders['.3mf'](url)
export const loadKMZModel = (url: string) => loaders['.kmz'](url)
export const loadVTKModel = (url: string) => loaders['.vtk'](url)
export const loadMD2Model = (url: string) => loaders['.md2'](url)
export const loadVRMLModel = (url: string) => loaders['.wrl'](url)
export const loadTDSModel = (url: string) => loaders['.3ds'](url)
export const loadAMFModel = (url: string) => loaders['.amf'](url)
export const loadLDrawModel = (url: string) => loaders['.mpd'](url)
export const load3DMModel = (url: string) => loaders['.3dm'](url)
