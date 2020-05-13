/*
 * Copyright 2017 The boardgame.io Authors.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 */

import React from 'react';
import PropTypes from 'prop-types';
import './board.css';
import * as THREE from "three";
import color from "../util/color";

class Board extends React.Component {
    constructor(props) {
        super(props);
        this.spheres = [];
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2(Number.MAX_VALUE, Number.MAX_VALUE);
        this.intersectedObject = null;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.gameover = false;
        this.state = { width: 0.5*window.innerWidth, height: 0.5*window.innerWidth };
    }

    static propTypes = {
        G: PropTypes.any.isRequired,
        ctx: PropTypes.any.isRequired,
        moves: PropTypes.any.isRequired,
        playerID: PropTypes.string,
        isActive: PropTypes.bool,
        isMultiplayer: PropTypes.bool,
    };

    componentDidMount() {
        this.addResizeListener();
        this.addOnClickListeners();

        this.addScene();
        this.addCamera();
        this.addRenderer();

        this.addGrid();
        this.addSpheres();

        this.addLights();

        const animate = () => {
            requestAnimationFrame(animate);

            this.selectIntersected();
            this.drawSpheres();

            this.computeWinner();

            this.renderer.render(this.scene, this.camera);
        }
        animate();
    };

    addScene() {
        this.scene = new THREE.Scene();
    }

    addCamera() {
        this.camera = new THREE.PerspectiveCamera(50, this.state.width / this.state.height, 0.1, 1000);
        this.camera.position.z = 5;
    }

    addRenderer() {
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(this.state.width, this.state.height);
        document.getElementById("webGLView" + this.props.playerID).appendChild(this.renderer.domElement);
    }

    addGrid() {
        const gridHelper = new THREE.GridHelper(3, 3);
        gridHelper.geometry.rotateX(0.5 * Math.PI);
        this.scene.add(gridHelper);
    }

    addSpheres() {
        let sphereId = 0;
        for (let y = 1; y > -2; y--) {
            for (let x = -1; x < 2; x++) {
                const sphere = this.createSphere(sphereId++, x, y, color.gray);
                this.spheres.push(sphere);
                this.scene.add(sphere);
            }
        }
    }

    createSphere(id, x, y, color) {
        const geometry = new THREE.SphereBufferGeometry(0.4, 32, 32);
        const material = new THREE.MeshLambertMaterial({color: color});
        const sphere = new THREE.Mesh(geometry, material);
        sphere.translateX(x);
        sphere.translateY(y);
        sphere.visible = false;
        sphere.sphereId = id;
        return sphere;
    }

    addLights() {
        const ambientLight = new THREE.AmbientLight(color.gray);
        this.scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(color.white, 0.5);
        this.scene.add(directionalLight);
    }

    isSphere(object) {
        return this.spheres.find(s => s === object);
    }

    drawSpheres() {
        for(let i=0; i<this.spheres.length; i++) {
            switch (this.props.G.cells[i]) {
                case '0':
                    this.spheres[i].visible = true;
                    this.spheres[i].material.color.setHex(color.red);
                    break;
                case '1':
                    this.spheres[i].visible = true;
                    this.spheres[i].material.color.setHex(color.blue);
                    break;
                default: this.spheres[i].visible = false;
            }
        }
    }

    addWinnerText(text, color) {
        const canvas = document.createElement('canvas'), ctx = canvas.getContext('2d');
        canvas.width = 2000;
        canvas.height = 2000;
        ctx.fillStyle = color;
        ctx.font = "200px Arial";
        this.wrapText(ctx, text, 0, 0.1 * canvas.height, canvas.width, 250);
        const texture = new THREE.CanvasTexture(canvas);
        const mesh = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.MeshBasicMaterial({
                map: texture
            }));
        this.scene.add(mesh);
    }

    wrapText(context, text, x, y, maxWidth, lineHeight) {
        const words = text.split(' ');
        let line = '';

        for(let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const metrics = context.measureText(testLine);
            const testWidth = metrics.width;
            if (testWidth > maxWidth && n > 0) {
                context.fillText(line, x, y);
                line = words[n] + ' ';
                y += lineHeight;
            }
            else {
                line = testLine;
            }
        }
        context.fillText(line, x, y);
    }
    
    selectIntersected() {
        this.raycaster.setFromCamera( this.mouse, this.camera );
        const intersects = this.raycaster.intersectObjects( this.scene.children );
        if ( intersects.length > 0 ) {
            if ( this.intersectedObject !== intersects[ 0 ].object ) {
                this.resetPreviousIntersected(this.intersectedObject);
                this.intersectedObject = intersects[ 0 ].object;
                if(this.isSphere(this.intersectedObject)) {
                    if (this.props.isActive && this.props.G.cells[this.intersectedObject.sphereId] === null) {
                        this.props.moves.clickCell(this.intersectedObject.sphereId);
                    }
                }
                this.intersectedObject.currentHex = this.intersectedObject.material.color.getHex();
            }
        } else {
            this.resetPreviousIntersected(this.intersectedObject);
            this.intersectedObject = null;
        }
    }

    resetPreviousIntersected(intersectedObject) {
        if (intersectedObject) {
            intersectedObject.material.color.setHex(intersectedObject.currentHex);
            if (this.isSphere(intersectedObject)) {
                intersectedObject.visible = false;
            }
        }
    }

    computeWinner() {
        if (!this.gameover && this.props.ctx.gameover) {
            this.gameover = true;
            const winner = this.props.ctx.gameover.winner;
            if (winner) {
                this.addWinnerText("Congratulations! Player " + winner + " wins the game!", winner === '0' ? 'red' : 'blue');
            } else {
                this.addWinnerText("Draw", 'green');
            }
        }
    }

    addResizeListener() {
        const updateDimensions = () => {
            const width = 0.5 * window.innerWidth;
            const height = 0.5 * window.innerWidth;
            this.renderer.setSize(width, height);
            this.setState({width: width, height: height});
        };
        window.addEventListener('resize', updateDimensions);
    }

    addOnClickListeners() {
        const onClick = (event) => {
            event.preventDefault();
            if (event.clientX < this.state.width && event.clientY < this.state.height && this.props.playerID === '0') {
                this.mouse.x = (event.clientX / this.state.width) * 2 - 1;
                this.mouse.y = -(event.clientY / this.state.height) * 2 + 1;
            } else if (event.clientX >= this.state.width && event.clientY < this.state.height && this.props.playerID === '1') {
                this.mouse.x = ((event.clientX - this.state.width) / this.state.width) * 2 - 1;
                this.mouse.y = -(event.clientY / this.state.height) * 2 + 1;
            } else {
                this.mouse.x = Number.MAX_VALUE;
                this.mouse.y = Number.MAX_VALUE;
            }
        };
        document.addEventListener('mousedown', onClick, false);
        document.addEventListener('touchstart', onClick, false);
    }

    render() {
        return (
            <div id={"webGLView" + this.props.playerID} style={{width: '100%',}}/>
        );
    }
}

export default Board;