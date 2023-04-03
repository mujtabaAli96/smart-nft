import React from 'react'
import {GLTFModel,AmbientLight,DirectionLight} from 'react-3d-viewer'

export const GLTFModelLoader = ({src}) => {
  return(
    <GLTFModel src={src} width={600} onProgress={() => <h3>Loading..</h3>}>
        <AmbientLight color={0xffffff}/>
        <DirectionLight color={0xffffff} position={{x:100,y:200,z:100}}/>
        <DirectionLight color={0xffffff} position={{x:-100,y:200,z:-100}}/>
    </GLTFModel>
  )
}