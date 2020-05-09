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
        const size = 0.4*window.innerWidth;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer();

        renderer.setSize(size, size);
        document.getElementById("webGLView"+this.props.playerID).appendChild(renderer.domElement);

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

        camera.position.z = 5;

        const ambientLight = new THREE.AmbientLight(color.gray);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(color.white, 0.5);
        scene.add(directionalLight);

        const animate = () => {
            requestAnimationFrame(animate);
            for(let i=0; i<this.spheres.length; i++) {
                switch (this.props.G.cells[i]) {
                    case '0':
                        this.spheres[i].material.color.setHex(color.red);
                        break;
                    case '1':
                        this.spheres[i].material.color.setHex(color.blue);
                        break;
                    default: this.spheres[i].material.color.setHex(color.gray);
                }
            }
            renderer.render(scene, camera);
        }
        animate();
    };

    createSphere(x, y, color) {
        const geometry = new THREE.SphereBufferGeometry(0.4, 32, 32);
        const material = new THREE.MeshBasicMaterial({color: color});
        const sphere = new THREE.Mesh(geometry, material);
        sphere.translateX(x);
        sphere.translateY(y);
        return sphere;
    }

    render() {
        /*let tbody = [];
        for (let i = 0; i < 3; i++) {
            let cells = [];
            for (let j = 0; j < 3; j++) {
                const id = 3 * i + j;
                cells.push(
                    <td
                        key={id}
                        className={this.isActive(id) ? 'active' : ''}
                        onClick={() => this.onClick(id)}
                    >
                        {this.props.G.cells[id]}
                    </td>
                );
            }
            tbody.push(<tr key={i}>{cells}</tr>);
        }*/

        let winner = null;
        if (this.props.ctx.gameover) {
            winner =
                this.props.ctx.gameover.winner !== undefined ? (
                    <div id="winner">Winner: {this.props.ctx.gameover.winner}</div>
                ) : (
                    <div id="winner">Draw!</div>
                );
        }

        return (
            <div id={"webGLView"+this.props.playerID}/>
        );
    }
}

export default Board;