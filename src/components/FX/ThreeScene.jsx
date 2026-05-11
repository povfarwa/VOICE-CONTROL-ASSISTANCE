// ── ThreeScene ──────────────────────────────────────────────────────────────
// Three.js 3D background: floating holographic wireframe geometry +
// animated star field.  Camera gently follows cursor for depth.

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function ThreeScene() {
  const mountRef = useRef(null)

  useEffect(() => {
    const el = mountRef.current
    if (!el) return

    // ── Renderer ──────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x000000, 0)
    el.appendChild(renderer.domElement)

    // ── Scene / Camera ────────────────────────────────────────────────
    const scene  = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 6

    // ── Star field ────────────────────────────────────────────────────
    const starGeo = new THREE.BufferGeometry()
    const starCount = 1800
    const starPos = new Float32Array(starCount * 3)
    for (let i = 0; i < starCount * 3; i++) {
      starPos[i] = (Math.random() - 0.5) * 200
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3))
    const starMat  = new THREE.PointsMaterial({ color: 0x00b4ff, size: 0.12, transparent: true, opacity: 0.6 })
    scene.add(new THREE.Points(starGeo, starMat))

    // ── Floating wireframe objects ─────────────────────────────────────
    const objects = []
    const geometries = [
      new THREE.IcosahedronGeometry(0.7, 0),
      new THREE.OctahedronGeometry(0.6, 0),
      new THREE.TetrahedronGeometry(0.5, 0),
      new THREE.IcosahedronGeometry(0.4, 1),
      new THREE.OctahedronGeometry(0.5, 0),
    ]

    const matCyan   = new THREE.MeshBasicMaterial({ color: 0x00b4ff, wireframe: true, transparent: true, opacity: 0.18 })
    const matViolet = new THREE.MeshBasicMaterial({ color: 0x7c3aed, wireframe: true, transparent: true, opacity: 0.15 })
    const matGreen  = new THREE.MeshBasicMaterial({ color: 0x00ffaa, wireframe: true, transparent: true, opacity: 0.12 })
    const mats = [matCyan, matViolet, matGreen, matCyan, matViolet]

    geometries.forEach((geo, i) => {
      const mesh = new THREE.Mesh(geo, mats[i % mats.length])
      mesh.position.set(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 4,
      )
      mesh.userData.rotX = (Math.random() - 0.5) * 0.006
      mesh.userData.rotY = (Math.random() - 0.5) * 0.008
      mesh.userData.floatOffset = Math.random() * Math.PI * 2
      scene.add(mesh)
      objects.push(mesh)
    })

    // ── Mouse parallax ────────────────────────────────────────────────
    const mouse = { x: 0, y: 0 }
    const onMove = (e) => {
      mouse.x = (e.clientX / window.innerWidth  - 0.5) * 2
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', onMove)

    // ── Resize ────────────────────────────────────────────────────────
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', onResize)

    // ── Animate ───────────────────────────────────────────────────────
    let frame = 0, raf
    const animate = () => {
      raf = requestAnimationFrame(animate)
      frame++

      // Camera gently follows mouse
      camera.position.x += (mouse.x * 0.6 - camera.position.x) * 0.04
      camera.position.y += (-mouse.y * 0.4 - camera.position.y) * 0.04
      camera.lookAt(0, 0, 0)

      // Rotate + float each object
      objects.forEach((obj) => {
        obj.rotation.x += obj.userData.rotX
        obj.rotation.y += obj.userData.rotY
        obj.position.y += Math.sin(frame * 0.015 + obj.userData.floatOffset) * 0.003
      })

      // Twinkle stars
      starMat.opacity = 0.45 + 0.2 * Math.sin(frame * 0.01)

      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
      el.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <div
      ref={mountRef}
      style={{
        position: 'fixed', inset: 0, zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  )
}