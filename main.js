// Vietnamese Mid-Autumn Festival Scene - Enhanced
const canvas = document.querySelector('.webgl')
const scene = new THREE.Scene()
const loader = new THREE.GLTFLoader()
const textureLoader = new THREE.TextureLoader()

// Sizes
const sizes = { width: window.innerWidth, height: window.innerHeight }

// Camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.set(-14, 8, 20)
scene.add(camera)

// Controls
const controls = new THREE.OrbitControls(camera, canvas)
controls.enableDamping = true
controls.enableZoom = true
controls.minDistance = 12
controls.maxDistance = 28
controls.minPolarAngle = Math.PI / 6
controls.maxPolarAngle = Math.PI / 2.2

// Renderer with shadows
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true })
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.outputEncoding = THREE.sRGBEncoding
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

// 🎵 Audio setup
let lanternClickBuffer = null
let listener = new THREE.AudioListener()
camera.add(listener)

// 🌌 Beautiful gradient night sky
const createSkyGradient = () => {
    const canvas = document.createElement('canvas')
    canvas.width = 2
    canvas.height = 256
    const ctx = canvas.getContext('2d')
    const gradient = ctx.createLinearGradient(0, 0, 0, 256)
    gradient.addColorStop(0, '#1a0033')
    gradient.addColorStop(0.5, '#330066')
    gradient.addColorStop(1, '#0D0D1A')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 2, 256)
    return new THREE.CanvasTexture(canvas)
}

const skyTexture = createSkyGradient()
scene.background = skyTexture

// ✨ Starfield
const createStars = () => {
    const starGeo = new THREE.BufferGeometry()
    const starCount = 1500
    const positions = new Float32Array(starCount * 3)
    
    for(let i = 0; i < starCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 150
        positions[i + 1] = Math.random() * 50 + 10
        positions[i + 2] = (Math.random() - 0.5) * 150
    }
    
    starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const starMat = new THREE.PointsMaterial({
        color: 0xFFFFFF,
        size: 0.15,
        transparent: true,
        opacity: 0.8
    })
    
    return new THREE.Points(starGeo, starMat)
}

const stars = createStars()
scene.add(stars)

// 🌙 Enhanced Moon with glow
const createMoon = () => {
    const moonGroup = new THREE.Group()
    
    // Main moon with crater texture
    const moonGeo = new THREE.SphereGeometry(2.5, 64, 64)
    const moonMat = new THREE.MeshStandardMaterial({ 
        color: '#FFF8DC',
        emissive: '#FFE4B5',
        emissiveIntensity: 0.6,
        roughness: 0.8
    })
    const moon = new THREE.Mesh(moonGeo, moonMat)
    
    // Glow effect
    const glowGeo = new THREE.SphereGeometry(3.2, 32, 32)
    const glowMat = new THREE.MeshBasicMaterial({
        color: '#FFE4B5',
        transparent: true,
        opacity: 0.15,
        side: THREE.BackSide
    })
    const glow = new THREE.Mesh(glowGeo, glowMat)
    
    moonGroup.add(moon, glow)
    moonGroup.position.set(-12, 12, -18)
    return moonGroup
}

const moonGroup = createMoon()
scene.add(moonGroup)

// 💡 Enhanced Lighting
const ambient = new THREE.AmbientLight('#6495ED', 0.3)
scene.add(ambient)

const moonLight = new THREE.DirectionalLight('#FFF8DC', 0.8)
moonLight.position.set(-12, 12, -18)
moonLight.castShadow = true
moonLight.shadow.mapSize.width = 2048
moonLight.shadow.mapSize.height = 2048
moonLight.shadow.camera.far = 50
scene.add(moonLight)

// 🏮 Vietnamese Star Lanterns (Đèn Ông Sao)
function createStarLantern(x, y, z, color) {
    const lanternGroup = new THREE.Group()
    
    // Star-shaped geometry
    const starShape = new THREE.Shape()
    const outerRadius = 0.4
    const innerRadius = 0.2
    const points = 5
    
    for(let i = 0; i < points * 2; i++) {
        const radius = i % 2 === 0 ? outerRadius : innerRadius
        const angle = (i * Math.PI) / points
        const x = radius * Math.sin(angle)
        const y = radius * Math.cos(angle)
        if(i === 0) starShape.moveTo(x, y)
        else starShape.lineTo(x, y)
    }
    starShape.closePath()
    
    const extrudeSettings = { depth: 0.2, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.01 }
    const starGeo = new THREE.ExtrudeGeometry(starShape, extrudeSettings)
    const starMat = new THREE.MeshStandardMaterial({
        color: color,
        emissive: color,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.9,
        roughness: 0.4,
        metalness: 0.2
    })
    
    const star = new THREE.Mesh(starGeo, starMat)
    star.castShadow = true
    
    // Hanging string
    const stringGeo = new THREE.CylinderGeometry(0.015, 0.015, 1.5, 8)
    const stringMat = new THREE.MeshStandardMaterial({ color: '#654321' })
    const string = new THREE.Mesh(stringGeo, stringMat)
    string.position.y = 1
    
    // Decorative tassel
    const tasselGeo = new THREE.ConeGeometry(0.08, 0.3, 8)
    const tasselMat = new THREE.MeshStandardMaterial({ color: '#FFD700' })
    const tassel = new THREE.Mesh(tasselGeo, tasselMat)
    tassel.position.y = -0.5
    
    // Point light
    const light = new THREE.PointLight(color, 2, 8)
    light.castShadow = true
    
    lanternGroup.add(star, string, tassel, light)
    lanternGroup.position.set(x, y, z)
    lanternGroup.userData.isLantern = true
    lanternGroup.userData.star = star
    
    return lanternGroup
}

// Place colorful Vietnamese lanterns
let lanterns = []
const lanternColors = ['#FF0000', '#FF1493', '#FFD700', '#00FF00', '#00CED1', '#FF6347']
const positions = [
    [2, 4, 0], [-3, 4, 1], [1, 3.5, -2], [-2, 3.5, -1],
    [4, 3.8, 2], [-4, 3.8, 2], [0, 4.2, 3], [3, 3.5, -3], [-3, 3.5, -3]
]

positions.forEach((pos, i) => {
    const color = lanternColors[i % lanternColors.length]
    const lantern = createStarLantern(pos[0], pos[1], pos[2], color)
    lanterns.push(lantern)
    scene.add(lantern)
})

// 🌳 Ground with textured pattern
const createGround = () => {
    const groundGeo = new THREE.PlaneGeometry(50, 50, 20, 20)
    
    // Create procedural texture for ground
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 512
    const ctx = canvas.getContext('2d')
    
    // Base color
    ctx.fillStyle = '#8B7355'
    ctx.fillRect(0, 0, 512, 512)
    
    // Add tile pattern
    ctx.strokeStyle = '#6B5345'
    ctx.lineWidth = 2
    const tileSize = 64
    for(let i = 0; i < 512; i += tileSize) {
        for(let j = 0; j < 512; j += tileSize) {
            ctx.strokeRect(i, j, tileSize, tileSize)
        }
    }
    
    const texture = new THREE.CanvasTexture(canvas)
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(4, 4)
    
    const groundMat = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.9,
        metalness: 0.1
    })
    
    const ground = new THREE.Mesh(groundGeo, groundMat)
    ground.rotation.x = -Math.PI / 2
    ground.receiveShadow = true
    return ground
}

const ground = createGround()
scene.add(ground)

// 🏠 Enhanced House with decorations
loader.load(
    'https://rawcdn.githack.com/ricardoolivaalonso/ThreeJS-Room12/cecbd1c77333b3c9ee23bb1eb41dee395e14ca3e/dist/model.glb',
    (gltf) => {
        const house = gltf.scene
        house.scale.set(1.2, 1.2, 1.2)
        house.traverse(child => {
            if (child.isMesh) {
                // Create wood texture
                const canvas = document.createElement('canvas')
                canvas.width = 256
                canvas.height = 256
                const ctx = canvas.getContext('2d')
                
                ctx.fillStyle = '#8B4513'
                ctx.fillRect(0, 0, 256, 256)
                
                // Wood grain
                for(let i = 0; i < 30; i++) {
                    ctx.strokeStyle = `rgba(101, 67, 33, ${Math.random() * 0.3})`
                    ctx.lineWidth = Math.random() * 3
                    ctx.beginPath()
                    ctx.moveTo(0, Math.random() * 256)
                    ctx.lineTo(256, Math.random() * 256)
                    ctx.stroke()
                }
                
                const woodTexture = new THREE.CanvasTexture(canvas)
                
                child.material = new THREE.MeshStandardMaterial({
                    map: woodTexture,
                    color: '#A0522D',
                    roughness: 0.7,
                    metalness: 0.1
                })
                child.castShadow = true
                child.receiveShadow = true
            }
        })
        scene.add(house)
        
        // Add red lanterns on house
        const houseLantern1 = createStarLantern(-2.5, 3, -2, '#FF0000')
        const houseLantern2 = createStarLantern(2.5, 3, -2, '#FF0000')
        scene.add(houseLantern1, houseLantern2)
        lanterns.push(houseLantern1, houseLantern2)
    }
)

// 🪙 Enhanced Mooncakes (Bánh Trung Thu) with details
function createMooncake(x, y, z) {
    const mooncakeGroup = new THREE.Group()
    
    // Base cake
    const cakeGeo = new THREE.CylinderGeometry(0.45, 0.45, 0.25, 32)
    
    // Create mooncake texture
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 256
    const ctx = canvas.getContext('2d')
    
    // Golden brown color
    ctx.fillStyle = '#DAA520'
    ctx.fillRect(0, 0, 256, 256)
    
    // Add pattern details
    ctx.strokeStyle = '#B8860B'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.arc(128, 128, 80, 0, Math.PI * 2)
    ctx.stroke()
    
    // Chinese character pattern
    ctx.font = 'bold 60px serif'
    ctx.fillStyle = '#8B4513'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('福', 128, 128)
    
    const cakeTexture = new THREE.CanvasTexture(canvas)
    
    const cakeMat = new THREE.MeshStandardMaterial({
        map: cakeTexture,
        color: '#FFD39B',
        roughness: 0.6,
        metalness: 0.2
    })
    
    const cake = new THREE.Mesh(cakeGeo, cakeMat)
    cake.castShadow = true
    
    // Decorative top pattern
    const patternGeo = new THREE.CylinderGeometry(0.43, 0.43, 0.03, 32)
    const patternMat = new THREE.MeshStandardMaterial({
        color: '#B8860B',
        roughness: 0.5
    })
    const pattern = new THREE.Mesh(patternGeo, patternMat)
    pattern.position.y = 0.14
    
    mooncakeGroup.add(cake, pattern)
    mooncakeGroup.position.set(x, y, z)
    return mooncakeGroup
}

// 🪑 Decorative table with cloth
const createTable = () => {
    const tableGroup = new THREE.Group()
    
    // Table top
    const topGeo = new THREE.BoxGeometry(3.5, 0.12, 2.5)
    const topMat = new THREE.MeshStandardMaterial({
        color: '#8B4513',
        roughness: 0.6,
        metalness: 0.1
    })
    const top = new THREE.Mesh(topGeo, topMat)
    top.position.y = 1
    top.castShadow = true
    top.receiveShadow = true
    
    // Table cloth
    const clothGeo = new THREE.BoxGeometry(3.6, 0.02, 2.6)
    const clothMat = new THREE.MeshStandardMaterial({
        color: '#DC143C',
        roughness: 0.8
    })
    const cloth = new THREE.Mesh(clothGeo, clothMat)
    cloth.position.y = 1.07
    
    // Legs
    const legGeo = new THREE.CylinderGeometry(0.08, 0.1, 1, 12)
    const legMat = new THREE.MeshStandardMaterial({ color: '#654321' })
    
    const legPositions = [[1.5, 0.5, 1.1], [-1.5, 0.5, 1.1], [1.5, 0.5, -1.1], [-1.5, 0.5, -1.1]]
    legPositions.forEach(pos => {
        const leg = new THREE.Mesh(legGeo, legMat)
        leg.position.set(...pos)
        leg.castShadow = true
        tableGroup.add(leg)
    })
    
    tableGroup.add(top, cloth)
    tableGroup.position.set(1, 0, 0.5)
    return tableGroup
}

const table = createTable()
scene.add(table)

// Add mooncakes on table
const mooncakePositions = [
    [0.5, 1.25, 0.5], [1, 1.25, 0.5], [1.5, 1.25, 0.5],
    [0.5, 1.25, 0], [1, 1.25, 0], [1.5, 1.25, 0],
    [0.7, 1.5, 0.2], [1.3, 1.5, 0.2]
]

mooncakePositions.forEach(pos => {
    const mooncake = createMooncake(...pos)
    scene.add(mooncake)
})

// 🐉 Enhanced Lion/Dragon Dance figure
loader.load(
    'https://rawcdn.githack.com/KhronosGroup/glTF-Sample-Models/master/2.0/CesiumMan/glTF/CesiumMan.gltf',
    (gltf) => {
        const dragon = gltf.scene
        dragon.scale.set(1, 1, 1)
        dragon.position.set(-3, 0, 3)
        dragon.traverse(child => {
            if (child.isMesh) {
                child.material = new THREE.MeshStandardMaterial({
                    color: '#FF0000',
                    emissive: '#FF4500',
                    emissiveIntensity: 0.3,
                    roughness: 0.5,
                    metalness: 0.4
                })
                child.castShadow = true
            }
        })
        scene.add(dragon)
        
        // Animate dragon
        const animateDragon = () => {
            const time = Date.now() * 0.001
            dragon.position.y = Math.sin(time * 2) * 0.1
            dragon.rotation.y = Math.sin(time * 0.5) * 0.2
        }
        dragon.userData.animate = animateDragon
    }
)

// 🎋 Decorative bamboo
const createBamboo = (x, z) => {
    const bambooGroup = new THREE.Group()
    
    for(let i = 0; i < 3; i++) {
        const segmentGeo = new THREE.CylinderGeometry(0.1, 0.12, 1.5, 12)
        const segmentMat = new THREE.MeshStandardMaterial({
            color: '#556B2F',
            roughness: 0.7
        })
        const segment = new THREE.Mesh(segmentGeo, segmentMat)
        segment.position.y = i * 1.4
        segment.castShadow = true
        
        // Joint
        const jointGeo = new THREE.TorusGeometry(0.12, 0.03, 8, 12)
        const jointMat = new THREE.MeshStandardMaterial({ color: '#3B5323' })
        const joint = new THREE.Mesh(jointGeo, jointMat)
        joint.rotation.x = Math.PI / 2
        joint.position.y = i * 1.4 + 0.7
        
        bambooGroup.add(segment, joint)
    }
    
    // Leaves
    for(let i = 0; i < 5; i++) {
        const leafGeo = new THREE.ConeGeometry(0.2, 0.6, 3)
        const leafMat = new THREE.MeshStandardMaterial({ color: '#228B22' })
        const leaf = new THREE.Mesh(leafGeo, leafMat)
        leaf.position.set(
            Math.random() * 0.3 - 0.15,
            3 + Math.random() * 0.5,
            Math.random() * 0.3 - 0.15
        )
        leaf.rotation.z = Math.random() * Math.PI
        bambooGroup.add(leaf)
    }
    
    bambooGroup.position.set(x, 0, z)
    return bambooGroup
}

scene.add(createBamboo(5, -5))
scene.add(createBamboo(-5, -5))
scene.add(createBamboo(6, 5))
scene.add(createBamboo(-6, 5))

// ✨ Floating particles (fireflies)
const createParticles = () => {
    const particleCount = 80
    const particlesGeo = new THREE.BufferGeometry()
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)
    
    for(let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 30
        positions[i * 3 + 1] = Math.random() * 8
        positions[i * 3 + 2] = (Math.random() - 0.5) * 30
        
        const color = new THREE.Color(Math.random() > 0.5 ? '#FFD700' : '#FFA500')
        colors[i * 3] = color.r
        colors[i * 3 + 1] = color.g
        colors[i * 3 + 2] = color.b
    }
    
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    particlesGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    
    const particlesMat = new THREE.PointsMaterial({
        size: 0.12,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    })
    
    return new THREE.Points(particlesGeo, particlesMat)
}

const particles = createParticles()
scene.add(particles)

// 🎶 Festival Music
// 🎶 Festival Music
const backgroundSound = new THREE.Audio(listener)
const audioLoader = new THREE.AudioLoader()
audioLoader.load(
  'https://gwould.github.io/midautumn/assets/audio/lewlew.mp3', // đổi tên file cho ngắn gọn
  (buffer) => {
      backgroundSound.setBuffer(buffer)
      backgroundSound.setLoop(true)
      backgroundSound.setVolume(0.1)
      backgroundSound.play()
  }
)




// 🎵 Lantern click sound
audioLoader.load(
    'https://cdn.pixabay.com/download/audio/2022/02/23/audio_click-pop.mp3?filename=click-pop.mp3',
    (buffer) => { lanternClickBuffer = buffer }
)

// 🖱️ Interactive lantern clicks
const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()
window.addEventListener('click', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
    raycaster.setFromCamera(mouse, camera)
    
    const intersects = raycaster.intersectObjects(scene.children, true)
    if (intersects.length > 0) {
        let obj = intersects[0].object
        
        // Check if clicked object or its parent is a lantern
        while(obj) {
            if (obj.userData.isLantern && lanternClickBuffer) {
                const sound = new THREE.Audio(listener)
                sound.setBuffer(lanternClickBuffer)
                sound.setVolume(0.5)
                sound.play()
                
                if(obj.userData.star) {
                    obj.userData.star.material.emissiveIntensity = 3
                    setTimeout(() => { 
                        obj.userData.star.material.emissiveIntensity = 1.5 
                    }, 300)
                }
                break
            }
            obj = obj.parent
        }
    }
})

// 📏 Resize handler
window.addEventListener('resize', () => {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    renderer.setSize(sizes.width, sizes.height)
})

// 🎞️ Animation loop
const clock = new THREE.Clock()
const tick = () => {
    const elapsed = clock.getElapsedTime()
    
    // Animate lanterns - gentle swaying and flickering
    lanterns.forEach((lantern, i) => {
        lantern.rotation.y = Math.sin(elapsed * 0.5 + i) * 0.3
        lantern.position.y += Math.sin(elapsed * 2 + i) * 0.0008
        
        if(lantern.userData.star) {
            lantern.userData.star.material.emissiveIntensity = 1.5 + Math.sin(elapsed * 3 + i) * 0.4
        }
        
        // Animate light intensity
        const light = lantern.children.find(child => child.isLight)
        if(light) {
            light.intensity = 2 + Math.sin(elapsed * 4 + i) * 0.5
        }
    })
    
    // Moon glow pulse
    moonGroup.children[1].material.opacity = 0.15 + Math.sin(elapsed * 0.5) * 0.05
    
    // Rotate stars slowly
    stars.rotation.y = elapsed * 0.01
    
    // Animate particles
    const positions = particles.geometry.attributes.position.array
    for(let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += Math.sin(elapsed * 2 + i) * 0.01
        if(positions[i + 1] > 8) positions[i + 1] = 0
        if(positions[i + 1] < 0) positions[i + 1] = 8
    }
    particles.geometry.attributes.position.needsUpdate = true
    
    // Animate dragon if loaded
    scene.traverse(obj => {
        if(obj.userData.animate) {
            obj.userData.animate()
        }
    })
    
    controls.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}

tick()

// 🎆 Fireworks system
function createFirework(x, y, z, color) {
    const particleCount = 80
    const positions = new Float32Array(particleCount * 3)
    const velocities = []
    const colors = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount; i++) {
        const angle = Math.random() * Math.PI * 2
        const speed = Math.random() * 0.5 + 0.5
        const vx = Math.cos(angle) * speed
        const vy = Math.random() * 1.5 + 1
        const vz = Math.sin(angle) * speed

        positions.set([x, y, z], i * 3)
        velocities.push([vx, vy, vz])

        const c = new THREE.Color(color)
        colors.set([c.r, c.g, c.b], i * 3)
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const mat = new THREE.PointsMaterial({
        size: 0.12,
        vertexColors: true,
        transparent: true,
        opacity: 1,
        blending: THREE.AdditiveBlending
    })

    const points = new THREE.Points(geo, mat)
    scene.add(points)

    // Animate fireworks
    const start = Date.now()
    function animateFirework() {
        const elapsed = (Date.now() - start) / 1000
        const pos = geo.attributes.position.array

        for (let i = 0; i < particleCount; i++) {
            pos[i * 3] += velocities[i][0] * 0.1
            pos[i * 3 + 1] += velocities[i][1] * 0.1 - 0.02 * elapsed // gravity
            pos[i * 3 + 2] += velocities[i][2] * 0.1
        }
        geo.attributes.position.needsUpdate = true

        mat.opacity = Math.max(1 - elapsed * 0.7, 0)

        if (elapsed < 2) {
            requestAnimationFrame(animateFirework)
        } else {
            scene.remove(points)
        }
    }
    animateFirework()
}

// 🎆 Launch fireworks periodically
setInterval(() => {
    const colors = ['#FF0000', '#FFD700', '#00FF00', '#1E90FF', '#FF69B4', '#FFA500']
    const color = colors[Math.floor(Math.random() * colors.length)]
    createFirework(
        (Math.random() - 0.5) * 20,
        Math.random() * 8 + 10,
        (Math.random() - 0.5) * 20,
        color
    )
}, 5000) // every 5s
// 🎚 Music Toggle Button

const musicButton = document.getElementById('music-toggle')
let musicPlaying = false

musicButton.addEventListener('click', () => {
    if (!musicPlaying) {
        backgroundSound.play()
        musicButton.textContent = "🔇 Mute"
    } else {
        backgroundSound.stop()   // ✅ thay pause() bằng stop()
        musicButton.textContent = "🔊 Music"
    }
    musicPlaying = !musicPlaying
})
