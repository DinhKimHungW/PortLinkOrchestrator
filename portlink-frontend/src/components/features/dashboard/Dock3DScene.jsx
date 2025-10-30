import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Card } from '../../ui';
import { useTranslation } from '../../../i18n/LanguageProvider';

export default function Dock3DScene() {
  const t = useTranslation();
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return () => {};

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#f0f9ff');

    const camera = new THREE.PerspectiveCamera(45, mount.clientWidth / 220, 0.1, 1000);
    camera.position.set(6, 6, 6);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mount.clientWidth, 220);
    mount.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const directional = new THREE.DirectionalLight(0xffffff, 0.6);
    directional.position.set(5, 10, 7.5);
    scene.add(directional);

    const berthGeometry = new THREE.BoxGeometry(6, 0.2, 2);
    const berthMaterial = new THREE.MeshStandardMaterial({ color: '#0ea5e9' });
    const berth = new THREE.Mesh(berthGeometry, berthMaterial);
    berth.position.y = -0.5;
    scene.add(berth);

    const shipGeometry = new THREE.BoxGeometry(1.5, 0.6, 0.8);
    const shipMaterial = new THREE.MeshStandardMaterial({ color: '#1d4ed8' });
    const ship = new THREE.Mesh(shipGeometry, shipMaterial);
    ship.position.set(0, -0.1, 0);
    scene.add(ship);

    const craneGeometry = new THREE.BoxGeometry(0.2, 2, 0.2);
    const craneMaterial = new THREE.MeshStandardMaterial({ color: '#f59e0b' });
    const crane = new THREE.Mesh(craneGeometry, craneMaterial);
    crane.position.set(-1.5, 0.5, 0);
    scene.add(crane);

    const hookGeometry = new THREE.BoxGeometry(0.2, 0.6, 0.2);
    const hookMaterial = new THREE.MeshStandardMaterial({ color: '#f97316' });
    const hook = new THREE.Mesh(hookGeometry, hookMaterial);
    hook.position.set(-1.5, -0.6, 0);
    scene.add(hook);

    let frameId;
    const animate = () => {
      ship.rotation.y += 0.0025;
      hook.position.y = -0.6 + Math.sin(Date.now() * 0.002) * 0.3;
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / 220;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, 220);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      mount.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return (
    <Card>
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-lg font-semibold">{t('dashboard.digitalTwinTitle')}</h2>
        <span className="text-xs uppercase tracking-wide text-sky-600">{t('dashboard.digitalTwinBadge')}</span>
      </div>
      <div ref={mountRef} className="h-56 w-full" />
    </Card>
  );
}
