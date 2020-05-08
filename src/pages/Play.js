import {
    IonBackButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar, useIonViewDidEnter
} from '@ionic/react';
import React from 'react';
import * as THREE from 'three';
import color from "../util/color";

const Play = () => {
    useIonViewDidEnter(() => {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer();

        renderer.setSize( window.innerWidth, window.innerHeight );
        document.getElementById("webGLView").appendChild( renderer.domElement );

        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshNormalMaterial();
        const cube = new THREE.Mesh(geometry, material);
        scene.add( cube );

        camera.position.z = 5;

        const ambientLight = new THREE.AmbientLight(color.gray);
        scene.add( ambientLight );

        const directionalLight = new THREE.DirectionalLight(color.white, 0.5);
        scene.add( directionalLight );

        const animate = function () {
            requestAnimationFrame(animate);
            cube.rotation.x += 0.02;
            cube.rotation.y += 0.01;
            renderer.render(scene, camera);
        };
        animate();
    });

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/home" />
                    </IonButtons>
                    <IonTitle>Play</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent id="webGLView"></IonContent>
        </IonPage>
    );
};
export default Play;

