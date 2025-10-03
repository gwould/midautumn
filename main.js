// Mid-Autumn Festival Scene
const canvas = document.querySelector('.webgl')
const scene = new THREE.Scene()
const textureLoader = new THREE.TextureLoader()
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// Create festival title
const titleElement = document.createElement('div')
titleElement.className = 'festival-title'
titleElement.textContent = '🎑 Mid-Autumn Festival'
document.body.appendChild(titleElement)

// Create instructions
const instructionsElement = document.createElement('div')
instructionsElement.className = 'instructions'
instructionsElement.textContent = 'Drag to look around • Scroll to zoom'
document.body.appendChild(instructionsElement)

// Base camera
const camera = new THREE.PerspectiveCamera(15, sizes.width / sizes.height, 0.1, 100)
camera.position.x = -14
camera.position.y = 6  
camera.position.z = 16
scene.add(camera)

// Controls
const controls = new THREE.OrbitControls(camera, canvas)
controls.enableDamping = true
controls.enableZoom = true
controls.enablePan = true
controls.minDistance = 8
controls.maxDistance = 25
controls.minPolarAngle = Math.PI / 6
controls.maxPolarAngle = Math.PI / 2

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true
})

renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.outputEncoding = THREE.sRGBEncoding
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

// Create night sky background
const createStars = () => {
    const starGeometry = new THREE.BufferGeometry()
    const starCount = 2000
    const positions = new Float32Array(starCount * 3)
    
    for(let i = 0; i < starCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 200
        positions[i + 1] = Math.random() * 100
        positions[i + 2] = (Math.random() - 0.5) * 200
    }
    
    starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const starMaterial = new THREE.PointsMaterial({
        color: 0xFFFFFF,
        size: 0.1,
        transparent: true
    })
    
    return new THREE.Points(starGeometry, starMaterial)
}

const stars = createStars()
scene.add(stars)

// Create moon
const createMoon = () => {
    const moonGroup = new THREE.Group()
    
    // Main moon sphere
    const moonGeometry = new THREE.SphereGeometry(3, 64, 64)
    const moonMaterial = new THREE.MeshStandardMaterial({
        color: 0xFFF8DC,
        emissive: 0xFFE4B5,
        emissiveIntensity: 0.3,
        roughness: 0.8,
        metalness: 0.1
    })
    const moon = new THREE.Mesh(moonGeometry, moonMaterial)
    
    // Moon glow
    const glowGeometry = new THREE.SphereGeometry(3.5, 32, 32)
    const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0xFFE4B5,
        transparent: true,
        opacity: 0.1,
        side: THREE.BackSide
    })
    const glow = new THREE.Mesh(glowGeometry, glowMaterial)
    
    moonGroup.add(moon, glow)
    moonGroup.position.set(-15, 15, -20)
    
    return moonGroup
}

const moon = createMoon()
scene.add(moon)

// Enhanced lighting for festival atmosphere
const ambientLight = new THREE.AmbientLight(0x404040, 0.4)
scene.add(ambientLight)

// Moon light
const moonLight = new THREE.DirectionalLight(0xFFE4B5, 1)
moonLight.position.set(-15, 15, -20)
moonLight.castShadow = true
moonLight.shadow.mapSize.width = 2048
moonLight.shadow.mapSize.height = 2048
scene.add(moonLight)

// Additional warm lights
const warmLight1 = new THREE.PointLight(0xFF4500, 0.8, 10)
warmLight1.position.set(5, 3, 5)
scene.add(warmLight1)

const warmLight2 = new THREE.PointLight(0xFFD700, 0.6, 8)
warmLight2.position.set(-5, 2, -5)
scene.add(warmLight2)

// Create lanterns
const createLantern = (x, y, z, color) => {
    const lanternGroup = new THREE.Group()
    
    // Lantern body (cylindrical)
    const lanternGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.8, 16)
    const lanternMaterial = new THREE.MeshStandardMaterial({
        color: color,
        emissive: color,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.9
    })
    const lantern = new THREE.Mesh(lanternGeometry, lanternMaterial)
    
    // Lantern light
    const lanternLight = new THREE.PointLight(color, 1.5, 6)
    lanternLight.position.set(0, 0, 0)
    
    // Lantern top and bottom
    const topGeometry = new THREE.CylinderGeometry(0.35, 0.3, 0.1, 16)
    const topMaterial = new THREE.MeshStandardMaterial({ color: 0xFFD700 })
    const top = new THREE.Mesh(topGeometry, topMaterial)
    top.position.y = 0.45
    
    const bottomGeometry = new THREE.CylinderGeometry(0.3, 0.35, 0.1, 16)
    const bottom = new THREE.Mesh(bottomGeometry, topMaterial)
    bottom.position.y = -0.45
    
    // Hanging string
    const stringGeometry = new THREE.CylinderGeometry(0.02, 0.02, 2, 8)
    const stringMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 })
    const string = new THREE.Mesh(stringGeometry, stringMaterial)
    string.position.y = 1.5
    
    lanternGroup.add(lantern, lanternLight, top, bottom, string)
    lanternGroup.position.set(x, y, z)
    lanternGroup.userData = {
        originalY: y,
        swingSpeed: Math.random() * 0.5 + 0.5,
        swingAmount: Math.random() * 0.3 + 0.1
    }
    
    return lanternGroup
}

// Create multiple lanterns
const lanternColors = [0xFF0000, 0xFF8C00, 0xFFD700, 0x00FF00, 0x1E90FF, 0xFF69B4]
const lanterns = []

for(let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI * 2
    const radius = 8 + Math.random() * 4
    const x = Math.cos(angle) * radius
    const z = Math.sin(angle) * radius
    const y = 4 + Math.random() * 3
    const color = lanternColors[Math.floor(Math.random() * lanternColors.length)]
    
    const lantern = createLantern(x, y, z, color)
    lanterns.push(lantern)
    scene.add(lantern)
}

// Create ground
const createGround = () => {
    const groundGeometry = new THREE.PlaneGeometry(50, 50, 20, 20)
    
    // Create a simple ground texture
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 512
    const ctx = canvas.getContext('2d')
    
    // Base color
    ctx.fillStyle = '#2F4F4F'
    ctx.fillRect(0, 0, 512, 512)
    
    // Add some texture
    for(let i = 0; i < 5000; i++) {
        const x = Math.random() * 512
        const y = Math.random() * 512
        const radius = Math.random() * 2
        const alpha = Math.random() * 0.1
        
        ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`
        ctx.beginPath()
        ctx.arc(x, y, radius, 0, Math.PI * 2)
        ctx.fill()
    }
    
    const groundTexture = new THREE.CanvasTexture(canvas)
    groundTexture.wrapS = THREE.RepeatWrapping
    groundTexture.wrapT = THREE.RepeatWrapping
    groundTexture.repeat.set(4, 4)
    
    const groundMaterial = new THREE.MeshStandardMaterial({
        map: groundTexture,
        roughness: 0.9,
        metalness: 0.1
    })
    
    const ground = new THREE.Mesh(groundGeometry, groundMaterial)
    ground.rotation.x = -Math.PI / 2
    ground.receiveShadow = true
    
    return ground
}

const ground = createGround()
scene.add(ground)

// Create mooncakes
const createMooncake = (x, y, z) => {
    const mooncakeGroup = new THREE.Group()
    
    // Mooncake base
    const cakeGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.2, 32)
    const cakeMaterial = new THREE.MeshStandardMaterial({
        color: 0xDAA520,
        roughness: 0.7,
        metalness: 0.1
    })
    const cake = new THREE.Mesh(cakeGeometry, cakeMaterial)
    
    // Pattern on top
    const patternGeometry = new THREE.CylinderGeometry(0.38, 0.38, 0.05, 32)
    const patternMaterial = new THREE.MeshStandardMaterial({
        color: 0x8B4513,
        roughness: 0.5
    })
    const pattern = new THREE.Mesh(patternGeometry, patternMaterial)
    pattern.position.y = 0.125
    
    mooncakeGroup.add(cake, pattern)
    mooncakeGroup.position.set(x, y, z)
    
    return mooncakeGroup
}

// Create a table with mooncakes
const createFestivalTable = () => {
    const tableGroup = new THREE.Group()
    
    // Table top
    const tableTopGeometry = new THREE.BoxGeometry(4, 0.1, 2)
    const tableTopMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 })
    const tableTop = new THREE.Mesh(tableTopGeometry, tableTopMaterial)
    tableTop.position.y = 1.05
    
    // Table legs
    const legGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1, 8)
    const legMaterial = new THREE.MeshStandardMaterial({ color: 0x654321 })
    
    const legPositions = [
        [1.5, 0.5, 0.8], [-1.5, 0.5, 0.8],
        [1.5, 0.5, -0.8], [-1.5, 0.5, -0.8]
    ]
    
    legPositions.forEach(pos => {
        const leg = new THREE.Mesh(legGeometry, legMaterial)
        leg.position.set(pos[0], pos[1], pos[2])
        tableGroup.add(leg)
    })
    
    tableGroup.add(tableTop)
    tableGroup.position.set(2, 0, 0)
    
    // Add mooncakes on table
    const mooncakePositions = [
        [0, 1.2, 0], [1, 1.2, 0.5], [-1, 1.2, -0.5],
        [0.5, 1.2, -0.3], [-0.5, 1.2, 0.3]
    ]
    
    mooncakePositions.forEach(pos => {
        const mooncake = createMooncake(pos[0], pos[1], pos[2])
        tableGroup.add(mooncake)
    })
    
    return tableGroup
}

const festivalTable = createFestivalTable()
scene.add(festivalTable)

// Create floating particles (fireflies)
const createFireflies = () => {
    const particleCount = 50
    const particlesGeometry = new THREE.BufferGeometry()
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)
    
    for(let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 20
        positions[i * 3 + 1] = Math.random() * 8
        positions[i * 3 + 2] = (Math.random() - 0.5) * 20
        
        // Yellow/orange colors for fireflies
        const color = new THREE.Color().setHSL(0.12 + Math.random() * 0.1, 1, 0.5)
        colors[i * 3] = color.r
        colors[i * 3 + 1] = color.g
        colors[i * 3 + 2] = color.b
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.1,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    })
    
    return new THREE.Points(particlesGeometry, particlesMaterial)
}

const fireflies = createFireflies()
scene.add(fireflies)

// Load main scene model
const loader = new THREE.GLTFLoader()

loader.load('https://rawcdn.githack.com/ricardoolivaalonso/ThreeJS-Room12/cecbd1c77333b3c9ee23bb1eb41dee395e14ca3e/dist/model.glb',
    (gltf) => {
        const model = gltf.scene
        model.traverse(child => {
            if (child.isMesh) {
                // Enhance materials for festival theme
                child.material = new THREE.MeshStandardMaterial({
                    color: 0x8B4513, // Wooden color
                    roughness: 0.7,
                    metalness: 0.1
                })
                child.castShadow = true
                child.receiveShadow = true
            }
        })
        scene.add(model)
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded')
    }
)

// Animation
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    
    // Update controls
    controls.update()
    
    // Animate lanterns - gentle swinging
    lanterns.forEach((lantern, index) => {
        const time = elapsedTime * lantern.userData.swingSpeed
        lantern.rotation.z = Math.sin(time) * lantern.userData.swingAmount
        lantern.position.y = lantern.userData.originalY + Math.sin(time * 0.7) * 0.1
        
        // Flicker lantern lights
        const light = lantern.children.find(child => child.isLight)
        if (light) {
            light.intensity = 1.5 + Math.sin(time * 5 + index) * 0.5
        }
    })
    
    // Animate moon - gentle rotation
    moon.rotation.y = elapsedTime * 0.05
    
    // Animate stars - slow rotation
    stars.rotation.y = elapsedTime * 0.01
    
    // Animate fireflies
    const positions = fireflies.geometry.attributes.position.array
    for(let i = 0; i < positions.length; i += 3) {
        positions[i] += Math.sin(elapsedTime + i) * 0.01
        positions[i + 1] += Math.cos(elapsedTime * 0.7 + i) * 0.01
        positions[i + 2] += Math.sin(elapsedTime * 0.5 + i) * 0.01
    }
    fireflies.geometry.attributes.position.needsUpdate = true
    
    // Render
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}

tick()

// Handle window resize
window.addEventListener('resize', () => {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})