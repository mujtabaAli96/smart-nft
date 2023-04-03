import React from "react"
import { GLTFModelLoader } from "./gltf"
const Model3dObjectLoader = ({ src, type }) => {
    return (
        <div>
            {
                (type == 'gltf') && <GLTFModelLoader src={src} />
            }
            {
                (type == 'glb') && <GLTFModelLoader src={src} />
            }
            {
                (type == 'fbx') && <FBXModelLoader src={src} />
            }
            {
                (type == 'obj') && <OBJModelLoader src={src} />
            }
        </div>
    )
}
export default Model3dObjectLoader