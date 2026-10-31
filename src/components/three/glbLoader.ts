import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import type { Group as ThreeGroup } from "three";

const configureLoader = (loader: GLTFLoader) => {
  loader.setMeshoptDecoder(MeshoptDecoder);
  return loader;
};

export function useOptimizedGLB(url: string): { scene: ThreeGroup } {
  const gltf = useLoader(GLTFLoader, url, configureLoader) as {
    scene: ThreeGroup;
  };
  return gltf;
}
