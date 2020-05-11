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
        this.divRef = React.createRef();
        this.spheres = [];
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.renderer = null;
        this.camera = null;
        this.state = { width: window.innerWidth, height: 0.5*window.innerHeight };
    }

    static propTypes = {
        G: PropTypes.any.isRequired,
        ctx: PropTypes.any.isRequired,
        moves: PropTypes.any.isRequired,
        playerID: PropTypes.string,
        isActive: PropTypes.bool,
        isMultiplayer: PropTypes.bool,
    };



    onClick = id => {
        if (this.isActive(id)) {
            this.props.moves.clickCell(id);
        }
    };

    isActive(id) {
        if (!this.props.isActive) return false;
        if (this.props.G.cells[id] !== null) return false;
        return true;
    }

    componentDidMount() {
        this.renderer = new THREE.WebGLRenderer();

        /*const updateDimensions = () => {
            const divElement = document.getElementById("webGLView"+this.props.playerID);
            const width = divElement.offsetWidth;
            const height = divElement.offsetHeight;
            this.renderer.setSize(width, height);
            this.setState({ width: width, height: height });
        };
        window.addEventListener('resize', updateDimensions);*/

        //this.setState({ width: 0.4*window.innerWidth, height: 0.4*window.innerHeight });
        //console.log('width='+this.state.width);

        const scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(50, this.state.width/this.state.height, 0.1, 1000);
        this.camera.position.z = 5;

        this.renderer.setSize(this.state.width, this.state.height);
        document.getElementById("webGLView"+this.props.playerID).appendChild(this.renderer.domElement);

        const gridHelper = new THREE.GridHelper(3, 3);
        gridHelper.geometry.rotateX(0.5*Math.PI);
        scene.add( gridHelper );

        for(let y=-1; y<2; y++) {
            for(let x=-1; x<2; x++) {
                const sphere = this.createSphere(x, y, color.gray);
                this.spheres.push(sphere);
                scene.add(sphere);
            }
        }
        this.spheres[0].material.color.setHex(color.red);

        const ambientLight = new THREE.AmbientLight(color.gray);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(color.white, 0.5);
        scene.add(directionalLight);

        const onClick = ( event ) => {
            event.preventDefault();
            this.mouse.x = ( event.clientX / this.state.width ) * 2 - 1;
            this.mouse.y = - ( event.clientY / this.state.height ) * 2 + 1;
        };
        document.addEventListener( 'mousedown', onClick, false );
        document.addEventListener( 'touchstart', onClick, false );

        let INTERSECTED = null;

        const animate = () => {
            requestAnimationFrame(animate);

            this.raycaster.setFromCamera( this.mouse, this.camera );
            const intersects = this.raycaster.intersectObjects( scene.children );
            if ( intersects.length > 0 ) {
                if ( INTERSECTED !== intersects[ 0 ].object ) {
                    this.resetPreviousIntersected(INTERSECTED);
                    INTERSECTED = intersects[ 0 ].object;
                    if(this.spheres.find(s => s === INTERSECTED)) {
                        INTERSECTED.visible = true;
                    }
                    INTERSECTED.currentHex = INTERSECTED.material.color.getHex();
                }
            } else {
                this.resetPreviousIntersected(INTERSECTED);
                INTERSECTED = null;
            }

            for(let i=0; i<this.spheres.length; i++) {
                switch (this.props.G.cells[i]) {
                    case 0:
                        this.spheres[i].material.color.setHex(color.red);
                        break;
                    case 1:
                        this.spheres[i].material.color.setHex(color.blue);
                        break;
                    default: this.spheres[i].material.color.setHex(color.gray);
                }
            }

            this.renderer.render(scene, this.camera);
        }
        animate();
    };

    resetPreviousIntersected(INTERSECTED) {
        if (INTERSECTED) {
            INTERSECTED.material.color.setHex(INTERSECTED.currentHex);
            if (this.spheres.find(s => s === INTERSECTED)) {
                INTERSECTED.visible = false;
            }
        }
    }

    /*componentDidUpdate(prevProps, prevState, snapshot) {
            const divElement = document.getElementById("webGLView"+this.props.playerID);
            const width = divElement.offsetWidth;
            console.log('width='+width);
            const height = divElement.offsetHeight;
            if(width !== prevState.width || height !== prevState.height) {
                console.log('state changed: '+width);
                this.renderer.setSize(width, height);
                this.camera.aspect = width/height;
                this.setState({ width: width, height: height });
            }
        }*/

    createSphere(x, y, color) {
        const geometry = new THREE.SphereBufferGeometry(0.4, 32, 32);
        const material = new THREE.MeshLambertMaterial({color: color});
        const sphere = new THREE.Mesh(geometry, material);
        sphere.translateX(x);
        sphere.translateY(y);
        //sphere.translateZ(0.001);
        sphere.visible = false;
        return sphere;
    }

    render() {
        /*let winner = null;
        if (this.props.ctx.gameover) {
            winner =
                this.props.ctx.gameover.winner !== undefined ? (
                    <div id="winner">Winner: {this.props.ctx.gameover.winner}</div>
                ) : (
                    <div id="winner">Draw!</div>
                );
        }*/

        //const { width } = this.props.size;
        //console.log('size at render: '+width);

        return (
            <div id={"webGLView" + this.props.playerID} ref={this.divRef} style={{width: '100%',}}/>
        );
    }
}

export default Board;