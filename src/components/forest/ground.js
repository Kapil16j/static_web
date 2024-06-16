import React from 'react';
import { PlaneGeometry, MeshStandardMaterial, Mesh } from 'three';

function Ground() {
  const groundGeometry = new PlaneGeometry(100, 100);
  const groundMaterial = new MeshStandardMaterial({ color: 'green' });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
      <primitive object={groundGeometry} attach="geometry" />
      <primitive object={groundMaterial} attach="material" />
    </mesh>
  );
}

export default Ground;
