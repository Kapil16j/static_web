import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from 'react-three-fiber';
import { Box } from '@react-three/drei';

function Cube() {
    const meshRef = useRef();
    const [hovered, setHover] = useState(false);
    const [active, setActive] = useState(false);

    useFrame(() => {
        meshRef.current.rotation.x += 0.01;
        meshRef.current.rotation.y += 0.01;
    });

    return (
        <Box
            ref={meshRef}
            scale={active ? [2, 2, 2] : [1.5, 1.5, 1.5]}
            onClick={() => setActive(!active)}
            onPointerOver={() => setHover(true)}
            onPointerOut={() => setHover(false)}
        >
            <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
        </Box>
    );
}

function Mini() {
    return (
        <Canvas camera={{ position: [0, 0, 5] }}>
            <ambientLight />
            <pointLight position={[10, 10, 10]} />
            <Cube />
        </Canvas>
    );
}

export default Mini;
