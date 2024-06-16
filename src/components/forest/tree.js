import React from 'react';
import { useGLTF } from '@react-three/drei';
import TreeImage from './image/tree.glb'

function Tree(props) {
  const gltf = useGLTF(TreeImage);
  return (
    <primitive object={gltf.scene} position={props.position} scale={[0.1, 0.1, 0.1]} />
  );
}

export default Tree;
