<template>
    <div ref="canvasContainer" class="canvas-container"></div>
</template>

<script>
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default {
    name: "ThreeModelViewer",
    props: {
        modelPath: {
            type: String,
            required: true, // 模型路径
        },
    },
    mounted() {
        this.initThree();
    },
    methods: {
        initThree() {
            // 获取容器
            const container = this.$refs.canvasContainer;

            // 初始化场景、相机、渲染器
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(
                75,
                container.clientWidth / container.clientHeight,
                0.1,
                1000
            );
            const renderer = new THREE.WebGLRenderer({ antialias: true });
            renderer.setSize(container.clientWidth, container.clientHeight);
            container.appendChild(renderer.domElement);

            // 添加光源
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
            scene.add(ambientLight);
            const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
            directionalLight.position.set(5, 5, 5);
            scene.add(directionalLight);

            // 加载模型
            const loader = new GLTFLoader();
            loader.load(
                this.modelPath,
                (gltf) => {
                    scene.add(gltf.scene);
                    gltf.scene.position.set(0, 0, 0);
                    gltf.scene.scale.set(1, 1, 1);
                },
                undefined,
                (error) => {
                    console.error("Error loading model:", error);
                }
            );

            // 添加轨道控制
            const controls = new OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;

            // 设置相机位置
            camera.position.set(2, 2, 5);
            camera.lookAt(0, 0, 0);

            // 渲染循环
            const animate = () => {
                requestAnimationFrame(animate);
                controls.update();
                renderer.render(scene, camera);
            };
            animate();

            // 响应窗口大小变化
            window.addEventListener("resize", () => {
                camera.aspect = container.clientWidth / container.clientHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(container.clientWidth, container.clientHeight);
            });
        },
    },
};
</script>

<style scoped>
.canvas-container {
    width: 100%;
    height: 100%;
    overflow: hidden;
}
</style>